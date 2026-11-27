import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { MediaAsset } from "@/models/MediaAsset";
import { getAdminSession } from "@/lib/auth";
import { deleteR2Object, getR2BucketName, isR2Configured } from "@/lib/r2";
import mongoose from "mongoose";

const RecordMediaSchema = z.object({
  key: z.string().min(1, "Object key is required"),
  url: z.string().url("Valid public URL required"),
  mediaType: z.enum(["image", "video", "audio"]).default("image"),
  caption: z.string().max(300).optional(),
  bytes: z.number().nonnegative().optional(),
  format: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }
    const body = await req.json();
    const validated = RecordMediaSchema.parse(body);

    const authHeader = req.headers.get("authorization") || req.headers.get("x-access-token") || "";
    const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
    const token = body.token || headerToken;

    await connectToDatabase();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify token ownership or admin session
    const adminSession = await getAdminSession(req);
    const isAdmin = adminSession && adminSession.role === "admin";

    if (!isAdmin) {
      if (!token) {
        return NextResponse.json({ error: "Order access token required" }, { status: 401 });
      }

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const isTokenValid =
        order.accessTokenHash === tokenHash || order.accessToken === token;

      if (!isTokenValid) {
        return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
      }
    }

    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Media upload is available only for paid orders." },
        { status: 403 }
      );
    }

    // Security: Validate that the object key belongs to this order's namespace
    const expectedPrefix = `uploads/orders/${order._id.toString()}/`;
    if (!isAdmin && !validated.key.startsWith(expectedPrefix)) {
      return NextResponse.json(
        { error: "Security violation: Upload key does not match this order's isolated path." },
        { status: 403 }
      );
    }

    // Idempotency: Check if asset is already recorded
    let asset = await MediaAsset.findOne({ key: validated.key });
    if (!asset) {
      asset = await MediaAsset.create({
        storageProvider: "r2",
        key: validated.key,
        bucket: getR2BucketName(),
        secureUrl: validated.url,
        mediaType: validated.mediaType,
        format: validated.format || (validated.mediaType === "audio" ? "mp3" : "jpg"),
        bytes: validated.bytes || 0,
        orderId: order._id,
        projectId: order.projectId,
        caption: validated.caption || "",
      });
    }

    // Also update order's personalization media list
    const currentMedia = order.personalization?.mediaItems || [];
    const existsInOrder = currentMedia.some((m: any) => m.key === validated.key || m.url === validated.url);
    if (!existsInOrder) {
      order.personalization = {
        ...(order.personalization || {}),
        mediaItems: [
          ...currentMedia,
          {
            url: validated.url,
            key: validated.key,
            caption: validated.caption || "",
            type: validated.mediaType,
            bytes: validated.bytes,
          },
        ],
      };
      await order.save();
    }

    return NextResponse.json({
      success: true,
      asset: {
        id: asset._id.toString(),
        key: asset.key,
        url: asset.secureUrl,
        mediaType: asset.mediaType,
        caption: asset.caption,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || "Invalid media record input" },
        { status: 400 }
      );
    }
    console.error("Media record POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to record media" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }
    const body = await req.json();
    const { key, assetId, token: bodyToken } = body;

    const authHeader = req.headers.get("authorization") || req.headers.get("x-access-token") || "";
    const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
    const token = bodyToken || headerToken;

    if (!key && !assetId) {
      return NextResponse.json({ error: "key or assetId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify token ownership or admin session
    const adminSession = await getAdminSession(req);
    const isAdmin = adminSession && adminSession.role === "admin";

    if (!isAdmin) {
      if (!token) {
        return NextResponse.json({ error: "Order access token required" }, { status: 401 });
      }

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const isTokenValid =
        order.accessTokenHash === tokenHash || order.accessToken === token;

      if (!isTokenValid) {
        return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
      }
    }

    // Find the asset and verify it belongs to THIS order
    const query: any = { orderId: order._id };
    if (assetId) query._id = assetId;
    if (key) query.key = key;

    const asset = await MediaAsset.findOne(query);
    if (!asset) {
      // Asset might belong to another order or already deleted
      const anyAssetWithKey = key ? await MediaAsset.findOne({ key }) : null;
      if (anyAssetWithKey && anyAssetWithKey.orderId?.toString() !== order._id.toString() && !isAdmin) {
        return NextResponse.json(
          { error: "Forbidden. You cannot delete media belonging to another order." },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, message: "Asset already removed" });
    }

    // 1. Delete from Cloudflare R2 if configured
    if (asset.key && isR2Configured()) {
      try {
        await deleteR2Object(asset.key);
      } catch (r2Err) {
        console.warn("R2 delete warning:", r2Err);
      }
    }

    // 2. Delete from MediaAsset collection
    await MediaAsset.deleteOne({ _id: asset._id });

    // 3. Remove from order.personalization.mediaItems
    if (order.personalization?.mediaItems) {
      order.personalization.mediaItems = order.personalization.mediaItems.filter(
        (m: any) => m.key !== asset.key && m.url !== asset.secureUrl
      );
      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: "Media asset deleted successfully",
    });
  } catch (error: any) {
    console.error("Media DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete media" }, { status: 500 });
  }
}
