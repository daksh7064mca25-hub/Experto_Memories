# ExpertoMemories — Payment & Refund Architecture Documentation

This document outlines the end-to-end payment processing, security verification, idempotency controls, and refund accounting rules implemented in **ExpertoMemories**.

---

## 1. Supported Payment Gateways & Methods

| Method | Provider | Settlement Speed | Verification Mode |
|---|---|---|---|
| **Razorpay** | Razorpay Payment Gateway | Instant | HMAC-SHA256 Signature + API Status Fetch |
| **Manual UPI** | Direct UPI QR / Intent | Manual Verification | Admin UTR verification & reconciliation |

---

## 2. Razorpay Integration Workflow

### Step 1: Server-Side Order Creation (`/api/checkout/create-order`)
1. Client submits cart payload:
   ```json
   {
     "customer": { "name": "Elena Rostova", "email": "elena@example.com", "phone": "+919876543210" },
     "items": [{ "productSlug": "anniversary", "selectedTheme": "pink-paradise", "quantity": 1 }],
     "projectId": "65f0a1b2c3d4e5f6a7b8c9d0",
     "paymentMethod": "razorpay"
   }
   ```
2. **Strict Pricing Rule**: Client-submitted price is ignored. Pricing is derived solely from the server-side product catalog (default: ₹999 / ₹2,199).
3. The server calls Razorpay API `orders.create` with amount in paise (`99900`).
4. An internal `Order` document is created in MongoDB with `paymentStatus: "pending"` and `razorpayDetails.razorpayOrderId`.

### Step 2: Client Checkout
1. Razorpay Checkout modal loads using the official SDK (`https://checkout.razorpay.com/v1/checkout.js`).
2. Opens using the server-generated `razorpayOrderId`.
3. Customer completes UPI/Card/NetBanking payment.

### Step 3: Payment Verification (`/api/checkout/verify-payment`)
1. Frontend posts payment payload:
   - `orderId` (Internal Mongo ID)
   - `razorpayOrderId`
   - `razorpayPaymentId`
   - `razorpaySignature`
2. **Server-Side Security Verification Checks**:
   - Fetches internal order first. Rejects if order does not exist (404).
   - Validates that `order.razorpayDetails.razorpayOrderId` exists and matches the submitted ID (400 if mismatch).
   - Computes HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and the stored internal order ID. Rejects forged signatures (400).
   - Calls Razorpay API `payments.fetch(paymentId)`:
     - Confirms `payment.order_id === order.razorpayDetails.razorpayOrderId`.
     - Confirms `payment.amount === order.totalAmount * 100`.
     - Confirms `payment.currency === "INR"`.
     - Confirms `payment.status === "captured"` (merely authorized payments are rejected).
3. **Idempotency**: If the order is already marked `paid`, the API returns HTTP 200 with the existing project ID without double-processing.

### Step 4: Webhook Handler (`/api/checkout/webhook`)
- Receives asynchronous event notifications (e.g. `payment.captured`, `order.paid`).
- Validates `x-razorpay-signature` header using `RAZORPAY_WEBHOOK_SECRET`.
- Processes event idempotently.
- Handles edge cases:
  - If a delayed `payment.failed` webhook arrives after an order is already marked `paid`, the failure is ignored to preserve paid customer status.

---

## 3. Manual UPI Workflow

1. Customer chooses Manual UPI at checkout.
2. An order is created with `paymentMethod: "manual_upi"` and `paymentStatus: "pending"`.
3. Customer is presented with the official UPI QR code and UPI Intent link:
   - Dynamic payee string: `upi://pay?pa=expertomemories@upi&pn=ExpertoMemories&am=999&tr=EM-123456`
4. Customer submits their UTR / Transaction ID via `/api/checkout/submit-upi`.
5. Administrator reviews the UTR in `/studio/orders` and clicks **Verify UPI**:
   - Order transitions to `paid`.
   - Associated `WebsiteProject` transitions to `paid` and publishing is unlocked.

---

## 4. Refund Architecture & Distinctions

ExpertoMemories maintains strict separation between automated gateway refunds and administrative manual refund records:

- **Refund Records (`refundType: "administrative_manual_record"`)**:
  - Used when issuing manual refunds through bank transfers, UPI reversals, or customer support agreements.
  - Distinctly flagged with `gatewayRefundIssued: false` to ensure clear distinction from automated gateway API refunds.
  - Gross collections remain intact for accounting reconciliation, while net revenue reflects deductions:
    $$\text{Net Revenue} = \text{Gross Collections} - \text{Total Refunds}$$
- **Linked Project Protection**:
  - Issuing a refund immediately transitions the linked `WebsiteProject` status to `suspended`.
  - Public visitors see a friendly private notice rather than an error, preventing unpaid consumption.
