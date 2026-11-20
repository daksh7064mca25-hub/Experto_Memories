import Razorpay from "razorpay";
import crypto from "crypto";

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/**
 * Returns true only when payment simulation is explicitly enabled via environment variable
 * and strictly disabled in production deployments.
 */
export function isPaymentSimulationAllowed(): boolean {
  // Simulation is strictly disabled by default
  if (process.env.ALLOW_PAYMENT_SIMULATION !== "true") {
    return false;
  }

  // Never enabled in production deployments
  if (
    process.env.APP_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.LIVE_PRODUCTION === "true"
  ) {
    return false;
  }

  return true;
}

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}

export interface CreateOrderParams {
  amountInINR: number;
  orderNumber: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
}

/**
 * Creates a server-authoritative Razorpay order.
 * Amount is converted to paise (1 INR = 100 paise).
 */
export async function createRazorpayOrder({
  amountInINR,
  orderNumber,
  notes = {},
}: CreateOrderParams): Promise<RazorpayOrderResult> {
  const client = getRazorpayClient();
  const amountInPaise = Math.round(amountInINR * 100);

  const order = await client.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: orderNumber,
    notes,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: String(order.receipt || orderNumber),
  };
}

/**
 * Verifies Razorpay payment signature server-side using HMAC-SHA256.
 * Formula: HMAC_SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyRazorpayPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  secretOverride,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  secretOverride?: string;
}): boolean {
  const secret = secretOverride || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Razorpay secret is required for payment verification.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  const generatedBuffer = Buffer.from(generatedSignature);
  const receivedBuffer = Buffer.from(razorpaySignature);

  if (generatedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, receivedBuffer);
}

type PaymentFetcher = (paymentId: string) => Promise<any>;
let customPaymentFetcher: PaymentFetcher | null = null;

export function setCustomPaymentFetcher(fn: PaymentFetcher | null) {
  customPaymentFetcher = fn;
}

/**
 * Fetches payment details directly from Razorpay to verify server-side status.
 */
export async function fetchRazorpayPayment(paymentId: string): Promise<any> {
  if (customPaymentFetcher) {
    return customPaymentFetcher(paymentId);
  }

  // Safe simulation strictly for automated test suites when explicitly enabled and never in production
  if (isPaymentSimulationAllowed() && paymentId.startsWith("pay_sim_")) {
    if (paymentId.includes("_gateway_error")) {
      throw new Error("Razorpay payment gateway unavailable (simulated timeout)");
    }
    if (paymentId.includes("_authorized_only")) {
      return {
        id: paymentId,
        order_id: "MATCH_STORED_ORDER",
        status: "authorized",
        amount: "MATCH_ORDER_AMOUNT",
        currency: "INR",
      };
    }
    if (paymentId.includes("_wrong_amount")) {
      return {
        id: paymentId,
        order_id: "MATCH_STORED_ORDER",
        status: "captured",
        amount: 50000, // 500 INR instead of order amount
        currency: "INR",
      };
    }
    if (paymentId.includes("_wrong_currency")) {
      return {
        id: paymentId,
        order_id: "MATCH_STORED_ORDER",
        status: "captured",
        amount: "MATCH_ORDER_AMOUNT",
        currency: "USD",
      };
    }
    if (paymentId.includes("_valid_captured")) {
      return {
        id: paymentId,
        order_id: "MATCH_STORED_ORDER",
        status: "captured",
        amount: "MATCH_ORDER_AMOUNT",
        currency: "INR",
      };
    }
  }

  const client = getRazorpayClient();
  return client.payments.fetch(paymentId);
}

/**
 * Verifies Razorpay webhook signature server-side using HMAC-SHA256 with timing-safe comparison.
 * Requires RAZORPAY_WEBHOOK_SECRET. Does NOT fall back to RAZORPAY_KEY_SECRET.
 */
export function verifyRazorpayWebhookSignature({
  rawBody,
  webhookSignature,
  secretOverride,
}: {
  rawBody: string;
  webhookSignature: string;
  secretOverride?: string;
}): boolean {
  const secret = secretOverride || process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Razorpay webhook secret is required for verification. RAZORPAY_WEBHOOK_SECRET is not configured.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature);
  const receivedBuffer = Buffer.from(webhookSignature);

  if (generatedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, receivedBuffer);
}
