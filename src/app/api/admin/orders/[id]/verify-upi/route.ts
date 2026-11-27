import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAdminSession } from "@/lib/auth";
import { projectService } from "@/services/project.service";
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

    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        message: "Order is already verified and marked as paid.",
        orderId: order._id.toString(),
        projectId: order.projectId?.toString() || null,
      });
    }

    // Check whether this order's UTR is already verified and paid in another order
    const utr = order.manualUpiDetails?.normalizedUtr || order.manualUpiDetails?.utrNumber;
    const normalizedUtr = utr
      ? utr.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
      : undefined;

    if (normalizedUtr) {
      const alreadyPaidConflict = await Order.findOne({
        _id: { $ne: order._id },
        paymentStatus: "paid",
        $or: [
          { "manualUpiDetails.normalizedUtr": normalizedUtr },
          { "manualUpiDetails.utrNumber": normalizedUtr },
          { "manualUpiDetails.utrNumber": utr },
        ],
      }).lean();

      if (alreadyPaidConflict) {
        return NextResponse.json(
          {
            error: `Cannot verify payment: UPI reference (UTR) ${utr} has already been verified and marked as paid under order ${alreadyPaidConflict.orderNumber}.`,
          },
          { status: 409 }
        );
      }
    }

    // 1. Update Payment Status to PAID with Admin Audit Info
    order.paymentStatus = "paid";
    order.manualUpiDetails = {
      ...order.manualUpiDetails,
      normalizedUtr: normalizedUtr || order.manualUpiDetails?.normalizedUtr,
      verifiedAt: new Date(),
      verifiedBy: session.email,
    };

    // 2. Provision draft WebsiteProject if not yet created, or update existing to paid
    let project = null;
    if (order.projectId) {
      project = await projectService.getById(order.projectId.toString());
    } else {
      const primaryItem = order.items[0];
      const initialSlug = `${primaryItem.occasionType}-${order.orderNumber.toLowerCase()}`;
      project = await projectService.create({
        slug: initialSlug,
        title: `${primaryItem.title} for ${order.customer.name}'s Gift`,
        occasionType: primaryItem.occasionType as any,
        recipientName: order.personalization?.recipientName || "Loved One",
        senderName: order.customer.name,
        theme: primaryItem.selectedTheme as any,
        status: "draft",
        orderId: order._id.toString(),
        customerId: order.customerId ? order.customerId.toString() : undefined,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
      });
      order.projectId = project._id as any;
    }

    if (project && project._id) {
      const projectUpdates: any = {
        paymentStatus: "paid",
        paidAt: new Date(),
        paymentMethod: "manual_upi",
      };
      if (order.customerId && !project.customerId) {
        projectUpdates.customerId = order.customerId;
      }
      if ((order as any).packageDetails?.isCustomDomain) {
        projectUpdates["customDomain.status"] = "awaiting_customer_registration";
      }
      await projectService.update(project._id, projectUpdates);
    }

    // 3. Record in audit trail
    order.auditTrail = order.auditTrail || [];
    order.auditTrail.push({
      action: "ADMIN_MANUAL_UPI_VERIFIED",
      timestamp: new Date(),
      actor: session.email,
      details: {
        utrNumber: order.manualUpiDetails?.utrNumber,
        projectId: project?._id,
      },
    });

    await logAdminAction({
      actor: session.email,
      action: "VERIFY_UPI_PAYMENT",
      targetType: "order",
      targetId: order._id.toString(),
      targetIdentifier: order.orderNumber,
      details: {
        utrNumber: order.manualUpiDetails?.utrNumber,
        amount: order.totalAmount,
        projectId: project?._id,
      },
      notes: `Verified UTR ${order.manualUpiDetails?.utrNumber}`,
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Manual UPI payment verified successfully. Project provisioned.",
      orderNumber: order.orderNumber,
      paymentStatus: "paid",
      projectId: project?._id,
      projectSlug: project?.slug,
    });
  } catch (error: any) {
    console.error("UPI verification error:", error);
    return NextResponse.json({ error: "Failed to verify UPI payment" }, { status: 500 });
  }
}
