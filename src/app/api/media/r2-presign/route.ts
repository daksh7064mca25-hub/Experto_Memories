import { NextResponse } from "next/server";
import { getAdminSession, getCustomerSession } from "@/lib/auth";
import { isR2Configured, createR2PresignedUploadUrl, getR2PublicUrl } from "@/lib/r2";
import { Order } from "@/models/Order";
import { connectToDatabase } from "@/lib/mongodb";
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
    const body = await req.json();
    const {
      filename,
      contentType,
      fileSize: bodyFileSize,
      size,
      folder = "general",
      orderId,
      accessToken,
      projectId,
      projectSlug,
    } = body;
    const effectiveSize = bodyFileSize !== undefined ? bodyFileSize : size;

    // 1. Validate required fields
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    const cleanMime = String(contentType).toLowerCase().trim();

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(cleanMime)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${cleanMime}. Allowed formats: JPEG, PNG, WebP, GIF, MP4, WebM, MP3, WAV.`,
        },
        { status: 400 }
      );
    }

    // 3. Validate file size constraints if provided
    if (effectiveSize !== undefined && effectiveSize !== null) {
      const isVideo = cleanMime.startsWith("video/");
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      if (Number(effectiveSize) > maxSize) {
        const limitMB = isVideo ? 150 : 25;
        return NextResponse.json(
          { error: `File exceeds maximum allowed size of ${limitMB}MB.` },
          { status: 400 }
        );
      }
    }

    // 4. Authorization: Request must either come from an Admin session, valid customer session, OR valid customer Order token
    let isAuthorized = false;
    let authorizedFolder = String(folder).replace(/[^a-z0-9_-]/gi, "");

    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    if (adminSession && adminSession.role === "admin") {
      isAuthorized = true;
    } else if (customerSession && customerSession.role === "customer") {
      const targetProject = projectId || projectSlug;
      if (targetProject && targetProject !== "general") {
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

        const projectFilter: any[] = [{ slug: targetProject }];
        if (mongoose.default?.Types?.ObjectId?.isValid(targetProject)) {
          projectFilter.push({ _id: new mongoose.default.Types.ObjectId(targetProject) });
        }

        const owned = await WebsiteProject.findOne({
          $and: [
            { $or: projectFilter },
            { $or: orConditions },
          ],
        }).lean();

        if (!owned) {
          return NextResponse.json(
            { error: "Unauthorized. You do not own this project." },
            { status: 401 }
          );
        }
        authorizedFolder = owned.slug || `customers/${customerSession.userId}`;
      } else {
        authorizedFolder = `customers/${customerSession.userId}`;
      }
      isAuthorized = true;
    } else if (orderId && accessToken) {
      await connectToDatabase();
      const tokenHash = crypto.createHash("sha256").update(String(accessToken).trim()).digest("hex");
      const order = await Order.findOne({
        _id: orderId,
        $or: [{ accessTokenHash: tokenHash }, { accessToken: String(accessToken).trim() }],
      }).lean();

      if (!order) {
        return NextResponse.json(
          { error: "Unauthorized. Invalid order ID or access token." },
          { status: 401 }
        );
      }

      if (order.paymentStatus !== "paid") {
        return NextResponse.json(
          { error: "Media upload is available only for paid orders. Please complete payment first." },
          { status: 403 }
        );
      }

      isAuthorized = true;
      // Isolate customer uploads into their own order folder to prevent cross-customer object collisions
      authorizedFolder = `orders/${order._id.toString()}`;
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Valid session or customer order access token required." },
        { status: 401 }
      );
    }

    // 5. Check Cloudflare R2 configuration
    if (!isR2Configured()) {
      return NextResponse.json(
        {
          error:
            "Cloudflare R2 storage is currently unconfigured. Please configure R2 credentials in .env.local.",
        },
        { status: 503 }
      );
    }

    // 6. Generate secure sanitized key
    const sanitizedName = String(filename)
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .substring(0, 80);
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const key = `uploads/${authorizedFolder}/${Date.now()}-${randomSuffix}-${sanitizedName}`;

    // 7. Generate presigned URL (15 minutes validity)
    const { uploadUrl, publicUrl } = await createR2PresignedUploadUrl(key, cleanMime, 900);

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
      contentType: cleanMime,
      expiresIn: 900,
    });
  } catch (error: any) {
    console.error("R2 presign error:", error);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "Failed to generate presigned upload URL." : error.message || "Presign error" },
      { status: 500 }
    );
  }
}
