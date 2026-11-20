import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { WebsiteProject } from "@/models/WebsiteProject";
import {
  verifyRazorpayPaymentSignature,
  isRazorpayConfigured,
  isPaymentSimulationAllowed,
  fetchRazorpayPayment,
} from "@/lib/razorpay";
import { projectService } from "@/services/project.service";

const VerifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  razorpayOrderId: z.string().min(1, "Razorpay Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay Payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay Signature is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = VerifyPaymentSchema.parse(body);

    await connectToDatabase();

    // 1. Fetch internal order first
    const order = await Order.findById(validated.orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // 2. Duplicate payment & replay protection (Idempotency)
    if (order.paymentStatus === "paid") {
      let existingProjectId = order.projectId ? order.projectId.toString() : undefined;
      if (!existingProjectId) {
        const existingProject = await WebsiteProject.findOne({ orderId: order._id } as any).lean();
        if (existingProject) existingProjectId = (existingProject as any)._id.toString();
      }

      return NextResponse.json({
        success: true,
        message: "Order already verified and marked as paid.",
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        projectId: existingProjectId,
        paymentStatus: "paid",
      });
    }

    // 3. Confirm that order.razorpayDetails.razorpayOrderId exists and exactly matches the submitted Razorpay order ID
    const storedRazorpayOrderId = order.razorpayDetails?.razorpayOrderId;
    if (!storedRazorpayOrderId) {
      return NextResponse.json(
        { error: "No Razorpay order ID associated with this internal order." },
        { status: 400 }
      );
    }

    if (storedRazorpayOrderId !== validated.razorpayOrderId) {
      return NextResponse.json(
        {
          error: "Razorpay order ID mismatch. Submitted order ID does not match internal record.",
        },
        { status: 400 }
      );
    }

    // 4. Verify signature using the Razorpay order ID stored in MongoDB, NOT untrusted client value
    const isValidSignature = verifyRazorpayPaymentSignature({
      razorpayOrderId: storedRazorpayOrderId,
      razorpayPaymentId: validated.razorpayPaymentId,
      razorpaySignature: validated.razorpaySignature,
    });

    if (!isValidSignature) {
      // Record failed verification attempt in audit trail
      order.auditTrail = order.auditTrail || [];
      order.auditTrail.push({
        action: "PAYMENT_SIGNATURE_VERIFICATION_FAILED",
        timestamp: new Date(),
        actor: "system:razorpay_verification",
        details: {
          razorpayPaymentId: validated.razorpayPaymentId,
          submittedOrderId: validated.razorpayOrderId,
          storedOrderId: storedRazorpayOrderId,
        },
      });
      await order.save();

      return NextResponse.json(
        { error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // 5. Payment Status Verification directly with Razorpay API
    // When Razorpay is configured:
    // - Fetch payment details from Razorpay
    // - Do not mark an order paid if Razorpay API request fails
    // - Verify payment.order_id matches internal order's stored Razorpay order ID
    // - Verify payment.amount equals internal order total * 100
    // - Verify payment.currency is INR
    // - Only mark the order paid when status is captured
    // - Reject authorized but not captured payments
    if (isRazorpayConfigured()) {
      let paymentData: any;
      try {
        paymentData = await fetchRazorpayPayment(validated.razorpayPaymentId);
      } catch (err: any) {
        console.error("Razorpay API payment fetch failed:", err);
        return NextResponse.json(
          {
            error:
              "Payment verification service unavailable. Could not verify payment status with gateway.",
          },
          { status: 502 }
        );
      }

      if (!paymentData) {
        return NextResponse.json(
          { error: "Payment verification failed. No payment record returned by Razorpay." },
          { status: 502 }
        );
      }

      const expectedAmountInPaise = Math.round(order.totalAmount * 100);

      // Resolve simulation placeholders if simulation is explicitly enabled (strictly non-production, test orders only)
      let resolvedOrderId = paymentData.order_id;
      let resolvedAmount = paymentData.amount;
      if (
        isPaymentSimulationAllowed() &&
        validated.razorpayPaymentId.startsWith("pay_sim_")
      ) {
        if (resolvedOrderId === "MATCH_STORED_ORDER") resolvedOrderId = storedRazorpayOrderId;
        if (resolvedAmount === "MATCH_ORDER_AMOUNT") resolvedAmount = expectedAmountInPaise;
      }

      // Verify payment.order_id matches stored Razorpay order ID
      if (resolvedOrderId !== storedRazorpayOrderId) {
        return NextResponse.json(
          {
            error: `Payment order ID mismatch. Payment belongs to '${resolvedOrderId}', expected '${storedRazorpayOrderId}'.`,
          },
          { status: 400 }
        );
      }

      // Verify payment.amount equals internal order total * 100
      if (Number(resolvedAmount) !== expectedAmountInPaise) {
        return NextResponse.json(
          {
            error: `Payment amount mismatch. Expected ${expectedAmountInPaise} paise, but received ${resolvedAmount} paise.`,
          },
          { status: 400 }
        );
      }

      // Verify payment.currency is INR
      if (paymentData.currency !== "INR") {
        return NextResponse.json(
          {
            error: `Payment currency mismatch. Expected 'INR', but received '${paymentData.currency}'.`,
          },
          { status: 400 }
        );
      }

      // Only mark paid when payment status is captured
      if (paymentData.status !== "captured") {
        return NextResponse.json(
          {
            error: `Payment is not captured. Current payment status is '${paymentData.status}'. Authorized payments are not accepted as completed.`,
          },
          { status: 400 }
        );
      }
    }

    // 6. Update order payment status
    order.paymentStatus = "paid";
    order.paymentMethod = "razorpay";
    order.razorpayDetails = {
      razorpayOrderId: storedRazorpayOrderId,
      razorpayPaymentId: validated.razorpayPaymentId,
      razorpaySignature: validated.razorpaySignature,
      paidAt: new Date(),
    };

    // 7. Provision or reuse authoritative draft WebsiteProject record idempotently
    let project: any = null;
    if (order.projectId) {
      project = await WebsiteProject.findById(order.projectId).lean();
    }
    if (!project) {
      project = await WebsiteProject.findOne({ orderId: order._id } as any).lean();
    }

    if (!project) {
      const primaryItem = order.items[0];
      const initialSlug = `${primaryItem.occasionType}-${order.orderNumber.toLowerCase()}`;

      const existingSlugProject = await WebsiteProject.findOne({ slug: initialSlug }).lean();
      if (existingSlugProject) {
        project = existingSlugProject;
      } else {
        project = await projectService.create({
          slug: initialSlug,
          title: `${primaryItem.title} for ${order.customer.name}'s Gift`,
          occasionType: primaryItem.occasionType as any,
          recipientName: order.personalization?.recipientName || "Loved One",
          senderName: order.customer.name,
          theme: primaryItem.selectedTheme as any,
          status: "draft",
          orderId: order._id.toString(),
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone,
        });
      }
    }

    order.projectId = project._id as any;

    // Update project paymentStatus to 'paid' and advance customDomain if purchased
    if (project && project._id) {
      const projectUpdates: any = {
        paymentStatus: "paid",
        paidAt: new Date(),
        paymentMethod: "razorpay",
      };
      if ((order as any).packageDetails?.isCustomDomain) {
        projectUpdates["customDomain.status"] = "awaiting_customer_registration";
      }
      await WebsiteProject.findByIdAndUpdate(project._id, { $set: projectUpdates });
    }

    order.auditTrail = order.auditTrail || [];
    order.auditTrail.push({
      action: "RAZORPAY_PAYMENT_VERIFIED",
      timestamp: new Date(),
      actor: "system:razorpay",
      details: {
        razorpayPaymentId: validated.razorpayPaymentId,
        razorpayOrderId: storedRazorpayOrderId,
        projectId: project._id,
        projectSlug: project.slug,
      },
    });

    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      projectId: project._id,
      projectSlug: project.slug,
      paymentStatus: "paid",
    });
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || "Invalid verification input" },
        { status: 400 }
      );
    }
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
