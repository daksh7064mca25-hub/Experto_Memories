import { NextResponse } from "next/server";
import { getAdminSession, getCustomerSession } from "@/lib/auth";
import { isR2Configured, createR2PresignedDownloadUrl } from "@/lib/r2";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { WebsiteProject } from "@/models/WebsiteProject";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    const orderId = url.searchParams.get("orderId");
    const token = url.searchParams.get("token");

    if (!key) {
      return NextResponse.json({ error: "Object key is required" }, { status: 400 });
    }

    if (!isR2Configured()) {
      return NextResponse.json({ error: "R2 storage not configured" }, { status: 503 });
    }

    // 1. Check authorization
    let isAuthorized = false;
    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    if (adminSession && adminSession.role === "admin") {
      isAuthorized = true;
    } else if (customerSession && customerSession.role === "customer") {
      // Customer owns this media if it is in their customer folder
      if (key.startsWith(`uploads/customers/${customerSession.userId}/`)) {
        isAuthorized = true;
      } else {
        // Or if it is in a project owned by this customer
        await connectToDatabase();
        const keyParts = key.split("/");
        const folderSlug = keyParts.length > 1 ? keyParts[1] : "";
        if (folderSlug && folderSlug !== "orders" && folderSlug !== "customers") {
          await connectToDatabase();
          const mongoose = await import("mongoose");
          const orConditions: any[] = [
            { customerId: customerSession.userId },
            { customerEmail: customerSession.email.toLowerCase() },
          ];
          if (mongoose.default?.Types?.ObjectId?.isValid(customerSession.userId)) {
            orConditions.push({ customerId: new mongoose.default.Types.ObjectId(customerSession.userId) });
          }

          const project = await WebsiteProject.findOne({
            slug: folderSlug,
            $or: orConditions,
          }).lean();
          if (project) {
            isAuthorized = true;
          }
        }
      }
    } else if (orderId && token) {
      // Validate customer access to order folder
      await connectToDatabase();
      const tokenHash = crypto.createHash("sha256").update(String(token).trim()).digest("hex");
      const order = await Order.findOne({
        _id: orderId,
        $or: [{ accessTokenHash: tokenHash }, { accessToken: String(token).trim() }],
      }).lean();

      if (order && key.startsWith(`uploads/orders/${order._id.toString()}/`)) {
        isAuthorized = true;
      }
    } else if (key.startsWith("uploads/general/") || key.startsWith("uploads/public/")) {
      // General demo/public assets allowed
      isAuthorized = true;
    }

    if (!isAuthorized) {
      await connectToDatabase();
      const { MediaAsset } = await import("@/models/MediaAsset");
      const asset = await MediaAsset.findOne({ key }).lean();

      if (asset) {
        // Customer session check
        if (customerSession && customerSession.role === "customer") {
          if (asset.customerId && asset.customerId.toString() === customerSession.userId) {
            isAuthorized = true;
          }
        }

        // If not yet authorized, check if the linked project is published
        if (!isAuthorized && asset.projectId) {
          const project = await WebsiteProject.findById(asset.projectId).lean();
          if (project && project.status === "published") {
            if (project.isPasswordProtected) {
              const cookieHeader = req.headers.get("cookie") || "";
              const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)em_unlock_${project.slug}=([^;]*)`));
              if (match && match[1]) {
                const { verifyWebsiteUnlockToken } = await import("@/lib/auth");
                const valid = await verifyWebsiteUnlockToken(decodeURIComponent(match[1].trim()), project.slug);
                if (valid) {
                  isAuthorized = true;
                }
              }
            } else {
              isAuthorized = true;
            }
          }
        }
      }

      // Allow viewing if the media belongs to an active published website by folder slug
      const keyParts = key.split("/");
      const folderSlug = keyParts.length > 1 ? keyParts[1] : "";
      if (!isAuthorized && folderSlug && folderSlug !== "orders" && folderSlug !== "customers") {
        const project = await WebsiteProject.findOne({ slug: folderSlug }).lean();
        if (project && project.status === "published") {
          if (project.isPasswordProtected) {
            const cookieHeader = req.headers.get("cookie") || "";
            const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)em_unlock_${project.slug}=([^;]*)`));
            if (match && match[1]) {
              const { verifyWebsiteUnlockToken } = await import("@/lib/auth");
              const valid = await verifyWebsiteUnlockToken(decodeURIComponent(match[1].trim()), project.slug);
              if (valid) {
                isAuthorized = true;
              }
            }
          } else {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication or order ownership required to view this media." },
        { status: 401 }
      );
    }

    // 2. Generate presigned download URL valid for 1 hour
    const presignedUrl = await createR2PresignedDownloadUrl(key, 3600);

    // 3. Redirect to the presigned URL
    return NextResponse.redirect(presignedUrl, 307);
  } catch (error: any) {
    console.error("Media view error:", error);
    return NextResponse.json({ error: "Failed to resolve media asset" }, { status: 500 });
  }
}
