import { NextResponse } from "next/server";
import {
  isR2Configured,
  uploadBufferToR2,
  getR2BucketName,
  createR2PresignedDownloadUrl,
  deleteR2Object,
} from "@/lib/r2";
import { getAdminSession, getCustomerSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { MediaAsset } from "@/models/MediaAsset";
import { Order } from "@/models/Order";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/aac",
  "audio/ogg",
  "audio/m4a",
  // Video
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150 MB

export async function POST(req: Request) {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data. File is required." }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    const projectSlug = (formData.get("projectSlug") as string | null) || (formData.get("projectId") as string | null);
    const projectIdParam = formData.get("projectId") as string | null;
    const orderId = formData.get("orderId") as string | null;
    const accessToken = formData.get("accessToken") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Strict MIME type validation
    const cleanMime = (file.type || "image/jpeg").toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.has(cleanMime)) {
      return NextResponse.json(
        { error: `Unsupported media format: ${cleanMime}. Allowed formats: JPEG, PNG, WebP, GIF, MP3, WAV, MP4, WebM.` },
        { status: 400 }
      );
    }

    // Strict file size limits
    const isVideo = cleanMime.startsWith("video/");
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File exceeds maximum allowed upload size of ${isVideo ? 150 : 25}MB.` },
        { status: 400 }
      );
    }

    // 1. Authorization check: Admin session OR valid customer session OR valid customer order token
    let isAuthorized = false;
    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    if (adminSession && adminSession.role === "admin") {
      isAuthorized = true;
    } else if (customerSession && customerSession.role === "customer") {
      isAuthorized = true;
    } else if (orderId && accessToken) {
      await connectToDatabase();
      const tokenHash = crypto.createHash("sha256").update(String(accessToken).trim()).digest("hex");
      const order = await Order.findOne({
        _id: orderId,
        $or: [{ accessTokenHash: tokenHash }, { accessToken: String(accessToken).trim() }],
      }).lean();

      if (order && order.paymentStatus === "paid") {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication or valid paid order token required." },
        { status: 401 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type || "image/jpeg";
    const mediaType = mime.startsWith("video/")
      ? "video"
      : mime.startsWith("audio/")
      ? "audio"
      : "image";

    // 2. Cloudflare R2 Storage
    if (isR2Configured()) {
      let uploadFolder = "general";
      let ownedProjectDoc: any = null;
      if (adminSession && adminSession.role === "admin") {
        uploadFolder = projectSlug ? projectSlug.replace(/[^a-z0-9_-]/gi, "") : "general";
      } else if (customerSession && customerSession.role === "customer") {
        if (projectSlug && projectSlug !== "general") {
          await connectToDatabase();
          const { WebsiteProject } = await import("@/models/WebsiteProject");
          const mongoose = await import("mongoose");

          const orConditions: any[] = [
            { customerId: customerSession.userId },
            { customerEmail: customerSession.email.toLowerCase() },
          ];
          if (mongoose.default?.Types?.ObjectId?.isValid(customerSession.userId)) {
            orConditions.push({ customerId: new mongoose.default.Types.ObjectId(customerSession.userId) });
          }

          const projectFilter: any[] = [{ slug: projectSlug }];
          if (mongoose.default?.Types?.ObjectId?.isValid(projectSlug)) {
            projectFilter.push({ _id: new mongoose.default.Types.ObjectId(projectSlug) });
          }

          ownedProjectDoc = await WebsiteProject.findOne({
            $and: [
              { $or: projectFilter },
              { $or: orConditions },
            ],
          }).lean();

          if (!ownedProjectDoc) {
            return NextResponse.json(
              { error: "Unauthorized. You do not own this project." },
              { status: 401 }
            );
          }
          uploadFolder = ownedProjectDoc.slug || projectSlug.replace(/[^a-z0-9_-]/gi, "");
        } else {
          uploadFolder = `customers/${customerSession.userId}`;
        }
      } else if (orderId) {
        uploadFolder = `orders/${orderId.replace(/[^a-z0-9_-]/gi, "")}`;
      }

      const sanitizedName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "-")
        .substring(0, 80);
      const randomSuffix = crypto.randomBytes(6).toString("hex");
      const key = `uploads/${uploadFolder}/${Date.now()}-${randomSuffix}-${sanitizedName}`;

      const uploadResult = await uploadBufferToR2(key, buffer, mime);

      // Determine display URL: public domain if configured, or authenticated view route
      const displayUrl = uploadResult.publicUrl || `/api/media/view?key=${encodeURIComponent(uploadResult.key)}`;

      // Record in MongoDB if available
      try {
        await connectToDatabase();
        await MediaAsset.create({
          storageProvider: "r2",
          key: uploadResult.key,
          originalName: file.name,
          mimeType: mime,
          bucket: getR2BucketName(),
          secureUrl: displayUrl,
          mediaType,
          bytes: uploadResult.bytes,
          format: mime.split("/")[1] || "jpeg",
          associatedProject: ownedProjectDoc?.slug || projectSlug || undefined,
          projectId: ownedProjectDoc?._id || undefined,
          customerId: customerSession ? customerSession.userId : undefined,
        });
      } catch (dbErr) {
        console.warn("MediaAsset record creation skipped/failed:", dbErr);
      }

      return NextResponse.json({
        success: true,
        url: displayUrl,
        key: uploadResult.key,
        asset: {
          key: uploadResult.key,
          secureUrl: displayUrl,
          publicUrl: displayUrl,
          format: mime.split("/")[1] || "jpeg",
          bytes: uploadResult.bytes,
          mediaType,
        },
      });
    }

    // 3. Reject unconfigured media storage in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Media storage is not configured. Cloudflare R2 credentials are required in production." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Cloudflare R2 is unconfigured. Please configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY." },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to process upload" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession || adminSession.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const assets = await MediaAsset.find().sort({ createdAt: -1 }).limit(100).lean();

    const media = await Promise.all(
      assets.map(async (asset: any) => {
        let url = asset.secureUrl;
        if (!process.env.R2_PUBLIC_DOMAIN && isR2Configured() && asset.key) {
          try {
            url = await createR2PresignedDownloadUrl(asset.key, 86400);
          } catch {
            url = `/api/media/view?key=${encodeURIComponent(asset.key)}`;
          }
        }
        return {
          id: asset._id.toString(),
          url,
          key: asset.key,
          type: asset.mediaType || "image",
          name: asset.key ? asset.key.split("/").pop() : "media-asset",
          size: asset.bytes ? `${Math.round(asset.bytes / 1024)} KB` : "Unknown",
          date: asset.createdAt ? new Date(asset.createdAt).toLocaleDateString() : "Recently",
        };
      })
    );

    return NextResponse.json({ success: true, media });
  } catch (error: any) {
    console.error("GET media error:", error);
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession || adminSession.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, key } = body;

    if (!id && !key) {
      return NextResponse.json({ error: "id or key is required" }, { status: 400 });
    }

    await connectToDatabase();
    const mongoose = await import("mongoose");
    let asset = null;
    if (id) {
      if (!mongoose.default.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid asset ID" }, { status: 400 });
      }
      asset = await MediaAsset.findById(id);
    } else if (key) {
      asset = await MediaAsset.findOne({ key });
    }

    if (asset) {
      if (asset.key && isR2Configured()) {
        try {
          await deleteR2Object(asset.key);
        } catch (r2Err) {
          console.warn("R2 delete warning:", r2Err);
        }
      }
      await MediaAsset.deleteOne({ _id: asset._id });
    } else if (key && isR2Configured()) {
      try {
        await deleteR2Object(key);
      } catch (r2Err) {
        console.warn("R2 delete warning:", r2Err);
      }
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error: any) {
    console.error("DELETE media error:", error);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
