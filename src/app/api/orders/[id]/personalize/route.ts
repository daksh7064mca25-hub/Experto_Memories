import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { MediaAsset } from "@/models/MediaAsset";
import {
  PersonalizationDraftSchema,
  getSubmissionSchemaForOccasion,
} from "@/lib/validations/personalization.schema";
import { syncPersonalizationToProject } from "@/services/personalization-sync.service";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const token =
      searchParams.get("token") ||
      req.headers.get("x-access-token") ||
      req.headers.get("authorization")?.replace("Bearer ", "")?.trim();

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
        { error: "Personalization is available only for paid orders. Please complete payment first." },
        { status: 403 }
      );
    }

    // Fetch media assets uploaded for this order
    const mediaAssets = await MediaAsset.find({ orderId: order._id }).sort({ createdAt: -1 }).lean();

    const primaryItem = order.items?.[0] || {};
    const occasionType = primaryItem.occasionType || "apology";

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        occasionType,
        productTitle: primaryItem.title || "Custom Website Gift",
        selectedTheme: primaryItem.selectedTheme || "cotton-candy",
        customer: {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
        },
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        projectId: order.projectId?.toString(),
        personalization: order.personalization || {},
        mediaAssets: (mediaAssets || []).map((m: any) => ({
          id: m._id.toString(),
          key: m.key,
          url: m.secureUrl,
          mediaType: m.mediaType,
          caption: m.caption,
          bytes: m.bytes,
        })),
        updatedAt: order.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Personalization GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load personalization" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action = "draft", personalization, token: bodyToken, clientUpdatedAt } = body;

    const authHeader = req.headers.get("authorization") || req.headers.get("x-access-token") || "";
    const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
    const token = bodyToken || headerToken;

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
        { error: "Personalization is available only for paid orders. Please complete payment first." },
        { status: 403 }
      );
    }

    // Optimistic concurrency check if client supplied a timestamp
    if (clientUpdatedAt && order.updatedAt) {
      const serverTime = new Date(order.updatedAt).getTime();
      const clientTime = new Date(clientUpdatedAt).getTime();
      // If server document was updated more than 10 seconds after client snapshot, warn/conflict
      if (serverTime - clientTime > 10000) {
        // We log but proceed with merge to avoid data loss
        console.warn(`Concurrent edit detected on order ${order.orderNumber}`);
      }
    }

    const occasionType = order.items?.[0]?.occasionType || "apology";

    if (action === "submit") {
      // Validate with occasion-specific schema
      const submissionSchema = getSubmissionSchemaForOccasion(occasionType);
      const validatedData = submissionSchema.parse(personalization);

      // Merge into order personalization
      order.personalization = {
        ...(order.personalization || {}),
        ...validatedData,
        submittedAt: new Date(),
      };

      order.orderStatus = "in_review";

      order.auditTrail = order.auditTrail || [];
      order.auditTrail.push({
        action: "CUSTOMER_PERSONALIZATION_SUBMITTED",
        timestamp: new Date(),
        actor: isAdmin ? `admin:${adminSession?.email}` : `customer:${order.customer.email}`,
        details: {
          occasionType,
          mediaCount: validatedData.mediaItems?.length || 0,
        },
      });

      await order.save();

      // Automatically sync into WebsiteProject
      const syncResult = await syncPersonalizationToProject(order);

      return NextResponse.json({
        success: true,
        message: "Personalization submitted successfully! Our studio team is preparing your gift.",
        orderStatus: order.orderStatus,
        personalization: order.personalization,
        projectSync: syncResult,
      });
    } else {
      // Draft autosave
      const validatedDraft = PersonalizationDraftSchema.parse(personalization || {});

      order.personalization = {
        ...(order.personalization || {}),
        ...validatedDraft,
        lastSavedAt: new Date(),
      };

      if (order.orderStatus === "placed") {
        order.orderStatus = "personalizing";
      }

      await order.save();

      // Optionally sync draft into WebsiteProject so studio can see real-time updates
      let syncResult = null;
      if (order.projectId) {
        syncResult = await syncPersonalizationToProject(order);
      }

      return NextResponse.json({
        success: true,
        message: "Draft saved successfully",
        orderStatus: order.orderStatus,
        personalization: order.personalization,
        updatedAt: order.updatedAt,
        projectSync: syncResult,
      });
    }
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Personalization POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save personalization" },
      { status: 500 }
    );
  }
}
