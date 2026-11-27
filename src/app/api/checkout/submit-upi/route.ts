import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { WebsiteProject } from "@/models/WebsiteProject";
import { getPlatformSettings } from "@/models/PlatformSettings";

const SubmitUpiSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  accessToken: z.string().optional(),
  utrNumber: z
    .string()
    .min(6, "UPI reference / UTR number must be at least 6 characters")
    .max(40, "UPI reference number too long")
    .trim(),
  screenshotUrl: z.string().url("Screenshot must be a valid URL").optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || req.headers.get("x-access-token") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();

    const body = await req.json();
    const validated = SubmitUpiSchema.parse(body);

    const effectiveToken = validated.accessToken || bearerToken;
    if (!effectiveToken) {
      return NextResponse.json(
        { error: "Unauthorized. Order access token is required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // 0. Server-Side Payment Method Enforcement
    const settings = await getPlatformSettings();
    if (settings.paymentMethodsAllowed === "razorpay_only") {
      return NextResponse.json(
        { error: "Direct UPI submission is currently disabled. Please use Online Payment Gateway (Razorpay)." },
        { status: 400 }
      );
    }

    // 1. Fetch order
    const order = await Order.findById(validated.orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // 2. Cryptographic Access Token Ownership Verification
    const providedHash = crypto.createHash("sha256").update(effectiveToken).digest("hex");
    const isTokenValid =
      order.accessTokenHash === providedHash || order.accessToken === effectiveToken;

    if (!isTokenValid) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid order access token." },
        { status: 401 }
      );
    }

    // 3. Check if already paid
    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        message: "Order has already been verified and paid.",
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        currency: order.currency || "INR",
        paymentStatus: "paid",
        utrNumber: order.manualUpiDetails?.utrNumber || validated.utrNumber,
        submittedAt: order.manualUpiDetails?.submittedAt || new Date().toISOString(),
      });
    }

    // 4. UTR Normalization & Format Validation
    const rawUtr = validated.utrNumber.trim();
    const normalizedUtr = rawUtr.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (normalizedUtr.length < 6 || normalizedUtr.length > 35) {
      return NextResponse.json(
        {
          error:
            "Invalid UPI reference number (UTR). Please provide a valid 6 to 35 character alphanumeric reference from your payment confirmation.",
        },
        { status: 400 }
      );
    }

    if (/^([A-Z0-9])\1{5,}$/.test(normalizedUtr)) {
      return NextResponse.json(
        {
          error:
            "The provided UPI reference (UTR) appears invalid. Please check your bank transaction receipt and re-enter.",
        },
        { status: 400 }
      );
    }

    // 5. Idempotency Check: if identical UTR already submitted for this order, return existing status safely
    if (
      order.paymentStatus === "payment_pending_verification" &&
      (order.manualUpiDetails?.normalizedUtr === normalizedUtr ||
        order.manualUpiDetails?.utrNumber === rawUtr ||
        order.manualUpiDetails?.utrNumber === normalizedUtr)
    ) {
      return NextResponse.json({
        success: true,
        message: "UPI reference has already been received and is awaiting verification.",
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        currency: order.currency || "INR",
        paymentStatus: "payment_pending_verification",
        utrNumber: rawUtr,
        submittedAt: order.manualUpiDetails?.submittedAt || new Date().toISOString(),
      });
    }

    // 6. Cross-Order Permanent UTR Reservation
    // A submitted UTR remains reserved across different orders, regardless of whether
    // the original order is pending, paid, rejected, failed, cancelled, or refunded.
    const conflictingOrder = await Order.findOne({
      _id: { $ne: order._id },
      $or: [
        { "manualUpiDetails.normalizedUtr": normalizedUtr },
        { "manualUpiDetails.utrNumber": normalizedUtr },
        { "manualUpiDetails.utrNumber": rawUtr },
      ],
    }).lean();

    if (conflictingOrder) {
      order.auditTrail = order.auditTrail || [];
      order.auditTrail.push({
        action: "DUPLICATE_UTR_REJECTED",
        timestamp: new Date(),
        actor: `customer:${order.customer.email}`,
        details: {
          attemptedUtr: normalizedUtr,
          rawUtr,
          conflictingOrderId: conflictingOrder._id.toString(),
          conflictingOrderNumber: conflictingOrder.orderNumber,
          conflictingPaymentStatus: conflictingOrder.paymentStatus,
        },
      });
      await order.save();

      return NextResponse.json(
        {
          error:
            "This UPI transaction reference (UTR) has already been submitted for another order. If you believe this is an error, please verify your transaction receipt or contact support.",
        },
        { status: 400 }
      );
    }

    // 7. Save UTR submission & transition to PAYMENT_PENDING_VERIFICATION
    // Controlled Resubmission: Track whether this is an initial submission or an in-order correction
    const submissionTime = new Date();
    const previousUtr = order.manualUpiDetails?.normalizedUtr;
    const isCorrection = Boolean(previousUtr && previousUtr !== normalizedUtr);

    order.paymentStatus = "payment_pending_verification";
    order.paymentMethod = "manual_upi";
    order.manualUpiDetails = {
      ...order.manualUpiDetails,
      utrNumber: rawUtr,
      normalizedUtr,
      screenshotUrl: validated.screenshotUrl || undefined,
      submittedAt: submissionTime,
      rejectionReason: undefined,
      rejectedAt: undefined,
      rejectedBy: undefined,
    };

    order.auditTrail = order.auditTrail || [];
    if (isCorrection) {
      order.auditTrail.push({
        action: "MANUAL_UPI_UTR_CORRECTED",
        timestamp: submissionTime,
        actor: `customer:${order.customer.email}`,
        details: {
          previousUtr,
          newUtr: normalizedUtr,
          rawUtr,
          previousPaymentStatus: order.paymentStatus,
        },
      });
    } else {
      order.auditTrail.push({
        action: "MANUAL_UPI_SUBMITTED",
        timestamp: submissionTime,
        actor: `customer:${order.customer.email}`,
        details: {
          utrNumber: rawUtr,
          normalizedUtr,
          hasScreenshot: Boolean(validated.screenshotUrl),
        },
      });
    }

    try {
      await order.save();
    } catch (saveErr: any) {
      // Safe handling of concurrent submissions and duplicate-key errors (Mongo E11000)
      if (saveErr.code === 11000 || saveErr.message?.includes("E11000")) {
        try {
          await Order.findByIdAndUpdate(order._id, {
            $push: {
              auditTrail: {
                action: "DUPLICATE_UTR_CONCURRENT_REJECTED",
                timestamp: new Date(),
                actor: `customer:${order.customer?.email || "unknown"}`,
                details: { attemptedUtr: normalizedUtr },
              },
            },
          });
        } catch (_) {}
        return NextResponse.json(
          {
            error:
              "This UPI transaction reference (UTR) has already been submitted for another order. If you believe this is an error, please verify your transaction receipt or contact support.",
          },
          { status: 400 }
        );
      }
      throw saveErr;
    }

    // 8. Synchronize associated WebsiteProject paymentStatus to "pending_verification"
    // CRITICAL: Project remains draft and is NEVER marked as published or paid here!
    if (order.projectId) {
      try {
        await WebsiteProject.findByIdAndUpdate(order.projectId, {
          paymentStatus: "pending_verification",
          paymentMethod: "manual_upi",
        });
      } catch (projErr) {
        console.error("Warning: Failed to sync project paymentStatus to pending_verification:", projErr);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "UPI payment details submitted successfully. Our team will verify bank credit before fulfilling your order.",
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      currency: order.currency || "INR",
      paymentStatus: "payment_pending_verification",
      utrNumber: validated.utrNumber,
      submittedAt: submissionTime.toISOString(),
    });
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json({ error: error.issues?.[0]?.message || "Invalid submission input" }, { status: 400 });
    }
    console.error("UPI submission failed:", error);
    return NextResponse.json({ error: error.message || "Failed to submit UPI details" }, { status: 500 });
  }
}
