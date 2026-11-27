import { NextResponse } from "next/server";
import { getAdminSession, getCustomerSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { MediaAsset } from "@/models/MediaAsset";
import { WebsiteProject } from "@/models/WebsiteProject";
import { Order } from "@/models/Order";
import { getR2BucketName, getR2PublicUrl } from "@/lib/r2";
import crypto from "crypto";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      key,
      projectSlug,
      projectId,
      filename,
      orderId,
      accessToken,
      contentType = "image/jpeg",
      fileSize = 0,
      size,
    } = body;
    const effectiveSize = size !== undefined ? size : fileSize;
    const targetProject = projectId || projectSlug;

    if (!key || typeof key !== "string" || !key.startsWith("uploads/") || key.includes("..")) {
      return NextResponse.json({ error: "Valid media key is required" }, { status: 400 });
    }

    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    let isAuthorized = false;
    let projectDoc: any = null;
    let orderDoc: any = null;

    if (adminSession && adminSession.role === "admin") {
      isAuthorized = true;
    } else if (customerSession && customerSession.role === "customer") {
      const allowedPrefixes = [`uploads/customers/${customerSession.userId}/`];

      if (targetProject && targetProject !== "general") {
        await connectToDatabase();
        const orConditions: any[] = [
          { customerId: customerSession.userId },
          { customerEmail: customerSession.email.toLowerCase() },
        ];
        if (mongoose.Types.ObjectId.isValid(customerSession.userId)) {
          orConditions.push({ customerId: new mongoose.Types.ObjectId(customerSession.userId) });
        }

        const projectFilter: any[] = [{ slug: targetProject }];
        if (mongoose.Types.ObjectId.isValid(targetProject)) {
          projectFilter.push({ _id: new mongoose.Types.ObjectId(targetProject) });
        }

        projectDoc = await WebsiteProject.findOne({
          $and: [
            { $or: projectFilter },
            { $or: orConditions },
          ],
        }).lean();

        if (!projectDoc) {
          return NextResponse.json(
            { error: "Unauthorized. You do not own this project." },
            { status: 401 }
          );
        }
        if (projectDoc.slug) {
          allowedPrefixes.push(`uploads/${projectDoc.slug}/`);
        }
      }

      if (!allowedPrefixes.some((prefix) => key.startsWith(prefix))) {
        return NextResponse.json(
          { error: "Forbidden. Media key does not match your authorized folder." },
          { status: 403 }
        );
      }
      isAuthorized = true;
    } else if (orderId && accessToken) {
      if (!mongoose.Types.ObjectId.isValid(String(orderId))) {
        return NextResponse.json({ error: "Invalid orderId format" }, { status: 400 });
      }
      await connectToDatabase();
      const tokenHash = crypto.createHash("sha256").update(String(accessToken).trim()).digest("hex");
      orderDoc = await Order.findOne({
        _id: orderId,
        $or: [{ accessTokenHash: tokenHash }, { accessToken: String(accessToken).trim() }],
      }).lean();

      if (orderDoc && orderDoc.paymentStatus === "paid") {
        const expectedPrefix = `uploads/orders/${orderDoc._id.toString()}/`;
        if (!key.startsWith(expectedPrefix)) {
          return NextResponse.json(
            { error: "Forbidden. Media key does not belong to this order." },
            { status: 403 }
          );
        }
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Valid customer session or order access token required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const mediaType = contentType.startsWith("video/")
      ? "video"
      : contentType.startsWith("audio/")
      ? "audio"
      : "image";

    const secureUrl = getR2PublicUrl(key);

    const asset = await MediaAsset.create({
      storageProvider: "r2",
      key,
      originalName: filename || (key.split("/").pop() || "media"),
      mimeType: contentType,
      bucket: getR2BucketName(),
      secureUrl,
      mediaType,
      bytes: Number(effectiveSize) || 0,
      format: contentType.split("/")[1] || "jpeg",
      associatedProject: projectDoc?.slug || projectSlug || undefined,
      projectId: projectDoc?._id || undefined,
      orderId: orderDoc?._id || undefined,
      customerId: customerSession ? customerSession.userId : undefined,
    });

    return NextResponse.json({
      success: true,
      assetId: asset._id.toString(),
      asset: {
        id: asset._id.toString(),
        key,
        secureUrl,
        publicUrl: secureUrl,
        mediaType,
        bytes: Number(effectiveSize) || 0,
      },
    });
  } catch (error: any) {
    console.error("Media confirmation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm media upload" },
      { status: 500 }
    );
  }
}
