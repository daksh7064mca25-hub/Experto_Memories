import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAdminSession, getCustomerSession } from "@/lib/auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    const url = new URL(req.url);
    const authHeader = req.headers.get("authorization") || "";
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
    const token =
      url.searchParams.get("token") ||
      req.headers.get("x-access-token") ||
      req.headers.get("x-order-token") ||
      bearer;

    await connectToDatabase();

    const order = await Order.findById(id).populate("projectId", "slug status title").lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // 1. Authorization: Admin session, verified customer owner, OR matching cryptographic token
    let isAuthorized = false;
    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    if (adminSession && adminSession.role === "admin") {
      isAuthorized = true;
    } else if (
      customerSession &&
      order.customer?.email?.toLowerCase() === customerSession.email.toLowerCase()
    ) {
      isAuthorized = true;
    } else if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      if (order.accessTokenHash === tokenHash || order.accessToken === token) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Valid order access token or account ownership required." },
        { status: 401 }
      );
    }

    // 2. Sanitize payload: strip internal sensitive fields
    const sanitizedOrder = {
      id: (order as any)._id.toString(),
      orderNumber: order.orderNumber,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
      },
      items: order.items,
      totalAmount: order.totalAmount,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      manualUpiDetails: order.manualUpiDetails
        ? {
            utrNumber: order.manualUpiDetails.utrNumber,
            submittedAt: order.manualUpiDetails.submittedAt,
            verifiedAt: order.manualUpiDetails.verifiedAt,
            hasScreenshot: Boolean(order.manualUpiDetails.screenshotUrl),
            screenshotUrl: order.manualUpiDetails.screenshotUrl,
          }
        : undefined,
      orderStatus: order.orderStatus,
      project: order.projectId
        ? {
            id: (order.projectId as any)._id?.toString() || order.projectId.toString(),
            slug: (order.projectId as any).slug,
            status: (order.projectId as any).status,
            title: (order.projectId as any).title,
          }
        : null,
      personalization: order.personalization,
      createdAt: order.createdAt,
    };

    return NextResponse.json({
      success: true,
      order: sanitizedOrder,
    });
  } catch (error: any) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 });
  }
}
