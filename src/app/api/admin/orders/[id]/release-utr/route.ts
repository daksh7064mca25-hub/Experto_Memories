import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

interface Context {
  params: Promise<{ id: string }> | { id: string };
}

export async function POST(req: Request, context: Context) {
  try {
    const session = await getAdminSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const reason = (body.reason || "").trim();

    if (!reason || reason.length < 10) {
      return NextResponse.json(
        {
          error:
            "A detailed administrative reason (minimum 10 characters) is required to perform an exceptional UTR release.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 1. Paid orders: Strictly blocked. Paid orders reflect verified bank credits and cannot release transaction references.
    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        {
          error:
            "Cannot release UTR for an order with status 'paid'. Genuine bank credit was verified. Active paid orders cannot release transaction references under any circumstances.",
        },
        { status: 400 }
      );
    }

    // 2. Refunded orders: A refunded order must NOT have its UTR released merely because its status is 'refunded'.
    // Transaction references for refunded orders remain permanently reserved to prevent double-spending.
    // Exceptional release is permitted only if explicit reconciliation authorization and a detailed justification (>= 25 chars) are supplied.
    const isRefunded = order.paymentStatus === "refunded";
    const confirmRefundReconciliation = Boolean(body.confirmRefundReconciliation);

    if (isRefunded) {
      if (!confirmRefundReconciliation) {
        return NextResponse.json(
          {
            error:
              "Cannot release UTR for a refunded order without explicit payment reconciliation authorization. A refunded order must not release its reference merely because its status is 'refunded'. Pass 'confirmRefundReconciliation: true' with a detailed explanation (minimum 25 characters) to authorize exceptional release.",
          },
          { status: 400 }
        );
      }

      if (reason.length < 25) {
        return NextResponse.json(
          {
            error:
              "Reconciliation authorization for a refunded order requires a detailed justification (minimum 25 characters) documenting payment and refund reconciliation.",
          },
          { status: 400 }
        );
      }
    }

    const currentNormalizedUtr = order.manualUpiDetails?.normalizedUtr;
    const currentRawUtr = order.manualUpiDetails?.utrNumber;
    const activeUtr = currentNormalizedUtr || currentRawUtr;

    if (!activeUtr) {
      return NextResponse.json(
        { error: "Order does not currently have an active UTR to release." },
        { status: 400 }
      );
    }

    const previousStatus = order.paymentStatus;
    const releaseTime = new Date();

    // 1. Record in immutable releasedUtrHistory array on the order
    order.manualUpiDetails = order.manualUpiDetails || {};
    order.manualUpiDetails.releasedUtrHistory = order.manualUpiDetails.releasedUtrHistory || [];
    order.manualUpiDetails.releasedUtrHistory.push({
      utrNumber: currentRawUtr || activeUtr,
      normalizedUtr: currentNormalizedUtr || activeUtr,
      releasedAt: releaseTime,
      releasedBy: session.email,
      reason,
    });

    // 2. Clear active UTR fields from the order
    order.manualUpiDetails.normalizedUtr = undefined;
    order.manualUpiDetails.utrNumber = undefined;

    // 3. Reset verification status to pending if it was awaiting verification
    if (order.paymentStatus === "payment_pending_verification") {
      order.paymentStatus = "pending";
    }

    // 4. Immutable order audit trail entry
    const auditAction = isRefunded
      ? "ADMIN_EXCEPTIONAL_REFUND_UTR_RELEASE"
      : "ADMIN_EXCEPTIONAL_UTR_RELEASE";

    order.auditTrail = order.auditTrail || [];
    order.auditTrail.push({
      action: auditAction,
      timestamp: releaseTime,
      actor: session.email,
      details: {
        releasedUtr: activeUtr,
        rawUtr: currentRawUtr,
        reason,
        previousPaymentStatus: previousStatus,
        isRefunded,
        confirmRefundReconciliation: isRefunded ? true : undefined,
      },
    });

    // Save order document atomically (updates releasedUtrHistory, clears active UTR, and appends auditTrail)
    await order.save();

    // 5. Immutable system-wide admin audit log (wrapped safely so secondary logging issues don't corrupt the order save)
    try {
      await logAdminAction({
        actor: session.email,
        action: "EXCEPTIONAL_UTR_RELEASE",
        targetType: "order",
        targetId: order._id.toString(),
        targetIdentifier: order.orderNumber,
        details: {
          releasedUtr: activeUtr,
          reason,
          orderNumber: order.orderNumber,
          isRefunded,
          confirmRefundReconciliation: isRefunded ? true : undefined,
        },
        notes: `Exceptional UTR release for order ${order.orderNumber} (status: ${previousStatus}): ${reason}`,
      });
    } catch (auditErr) {
      console.error("Warning: Failed to log system-wide admin action for UTR release:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `UTR ${activeUtr} has been exceptionally released and archived in audit history.`,
      orderNumber: order.orderNumber,
      releasedUtr: activeUtr,
      reason,
      releasedBy: session.email,
      releasedAt: releaseTime.toISOString(),
    });
  } catch (error: any) {
    console.error("Exceptional UTR release error:", error);
    return NextResponse.json({ error: "Failed to release UTR" }, { status: 500 });
  }
}
