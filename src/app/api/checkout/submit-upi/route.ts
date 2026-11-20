import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

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
        paymentStatus: "paid",
      });
    }

    // 4. Save UTR submission & transition to PAYMENT_PENDING_VERIFICATION
    // NEVER treat UTR or screenshot as automatic proof of payment!
    order.paymentStatus = "payment_pending_verification";
    order.paymentMethod = "manual_upi";
    order.manualUpiDetails = {
      utrNumber: validated.utrNumber,
      screenshotUrl: validated.screenshotUrl || undefined,
      submittedAt: new Date(),
    };

    order.auditTrail = order.auditTrail || [];
    order.auditTrail.push({
      action: "MANUAL_UPI_SUBMITTED",
      timestamp: new Date(),
      actor: `customer:${order.customer.email}`,
      details: {
        utrNumber: validated.utrNumber,
        hasScreenshot: Boolean(validated.screenshotUrl),
      },
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message:
        "UPI payment details submitted successfully. Our team will verify bank credit before fulfilling your order.",
      orderNumber: order.orderNumber,
      paymentStatus: "payment_pending_verification",
      utrNumber: validated.utrNumber,
    });
  } catch (error: any) {
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json({ error: error.issues?.[0]?.message || "Invalid submission input" }, { status: 400 });
    }
    console.error("UPI submission failed:", error);
    return NextResponse.json({ error: error.message || "Failed to submit UPI details" }, { status: 500 });
  }
}
