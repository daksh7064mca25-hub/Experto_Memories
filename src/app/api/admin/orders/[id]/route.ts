import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectToDatabase();

    const order = await Order.findById(id).populate("projectId").lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...(order as any),
        _id: (order as any)._id.toString(),
      },
    });
  } catch (error: any) {
    console.error("Admin order fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { orderStatus, paymentStatus, note, refundReason, suspendWebsite } = body;

    await connectToDatabase();
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.auditTrail = order.auditTrail || [];

    // Idempotency: Prevent duplicate refund actions from creating duplicate/inconsistent records
    if (paymentStatus === "refunded" && order.paymentStatus === "refunded") {
      return NextResponse.json({
        success: true,
        message: "Order payment is already marked as refunded.",
        order,
      });
    }

    let modified = false;

    if (orderStatus && orderStatus !== order.orderStatus) {
      const prevStatus = order.orderStatus;
      order.orderStatus = orderStatus;
      order.auditTrail.push({
        action: `ADMIN_ORDER_STATUS_CHANGED`,
        timestamp: new Date(),
        actor: session.email,
        details: { from: prevStatus, to: orderStatus, note: note || undefined },
      });
      await logAdminAction({
        actor: session.email,
        action: "UPDATE_ORDER_STATUS",
        targetType: "order",
        targetId: order._id.toString(),
        targetIdentifier: order.orderNumber,
        details: { from: prevStatus, to: orderStatus, note: note || undefined },
        notes: note,
      });
      modified = true;
    }

    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      const prevPayment = order.paymentStatus;
      order.paymentStatus = paymentStatus;

      // Preserve all original payment details (razorpayDetails, manualUpiDetails) for audit/tax records
      if (paymentStatus === "refunded") {
        const reason = refundReason || "Administrative refund processed";
        order.auditTrail.push({
          action: "ADMIN_ORDER_REFUNDED",
          timestamp: new Date(),
          actor: session.email,
          details: {
            fromPaymentStatus: prevPayment,
            amountRefunded: order.totalAmount,
            currency: order.currency,
            refundReason: reason,
            refundType: "administrative_manual_record",
            gatewayRefundIssued: false,
            disclaimer: "Administrative accounting record only. No automated payment gateway refund was initiated.",
            paymentMethod: order.paymentMethod,
            transactionRef:
              order.paymentMethod === "razorpay"
                ? order.razorpayDetails?.razorpayPaymentId
                : order.manualUpiDetails?.utrNumber,
            note: note || undefined,
          },
        });

        await logAdminAction({
          actor: session.email,
          action: "REFUND_ORDER",
          targetType: "order",
          targetId: order._id.toString(),
          targetIdentifier: order.orderNumber,
          details: {
            amountRefunded: order.totalAmount,
            currency: order.currency,
            refundReason: reason,
            refundType: "administrative_manual_record",
            gatewayRefundIssued: false,
            paymentMethod: order.paymentMethod,
            websiteSuspended: Boolean(suspendWebsite),
          },
          notes: `[Manual Admin Record] ${reason}`,
        });

        // Update linked WebsiteProject paymentStatus to "refunded" (independent of suspension)
        if (order.projectId) {
          const { WebsiteProject } = await import("@/models/WebsiteProject");
          const updateFields: any = { paymentStatus: "refunded" };
          // Website suspension is handled independently if explicitly requested
          if (suspendWebsite === true) {
            updateFields.status = "suspended";
          }
          await WebsiteProject.findByIdAndUpdate(order.projectId, updateFields);
        }
      } else {
        order.auditTrail.push({
          action: `ADMIN_PAYMENT_STATUS_CHANGED`,
          timestamp: new Date(),
          actor: session.email,
          details: {
            from: prevPayment,
            to: paymentStatus,
            note: note || undefined,
          },
        });
        await logAdminAction({
          actor: session.email,
          action: "UPDATE_PAYMENT_STATUS",
          targetType: "order",
          targetId: order._id.toString(),
          targetIdentifier: order.orderNumber,
          details: {
            from: prevPayment,
            to: paymentStatus,
            note: note || undefined,
          },
          notes: note,
        });
      }
      modified = true;
    }

    if (note && !modified) {
      order.auditTrail.push({
        action: `ADMIN_SUPPORT_NOTE_ADDED`,
        timestamp: new Date(),
        actor: session.email,
        details: { note },
      });
      await logAdminAction({
        actor: session.email,
        action: "ADD_SUPPORT_NOTE",
        targetType: "order",
        targetId: order._id.toString(),
        targetIdentifier: order.orderNumber,
        details: { note },
        notes: note,
      });
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectToDatabase();
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await logAdminAction({
      actor: session.email,
      action: "DELETE_ORDER",
      targetType: "order",
      targetId: id,
      targetIdentifier: deleted.orderNumber,
      details: { amount: deleted.totalAmount, customer: deleted.customer?.email },
    });

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error: any) {
    console.error("Admin order delete error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
