import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const reason = body.reason || "Payment could not be confirmed in bank account.";

    await connectToDatabase();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.paymentStatus = "failed";
    order.manualUpiDetails = {
      ...order.manualUpiDetails,
      rejectionReason: reason,
      rejectedAt: new Date(),
      rejectedBy: session.email,
    };

    order.auditTrail = order.auditTrail || [];
    order.auditTrail.push({
      action: "ADMIN_MANUAL_UPI_REJECTED",
      timestamp: new Date(),
      actor: session.email,
      details: {
        reason,
        utrNumber: order.manualUpiDetails?.utrNumber,
      },
    });

    await logAdminAction({
      actor: session.email,
      action: "REJECT_UPI_PAYMENT",
      targetType: "order",
      targetId: order._id.toString(),
      targetIdentifier: order.orderNumber,
      details: {
        reason,
        utrNumber: order.manualUpiDetails?.utrNumber,
      },
      notes: reason,
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Payment claim rejected.",
      orderNumber: order.orderNumber,
      paymentStatus: "failed",
      rejectionReason: reason,
    });
  } catch (error: any) {
    console.error("UPI rejection error:", error);
    return NextResponse.json({ error: "Failed to reject UPI payment" }, { status: 500 });
  }
}
