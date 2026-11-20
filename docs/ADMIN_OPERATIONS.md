# ExpertoMemories — Business Operations & Admin Manual

This manual provides instructions for administrators and business owners operating **ExpertoMemories** via the private Admin Studio (`/studio`).

---

## 1. Administrative Authentication (`/admin/login`)

- **Security Requirements**:
  - Requires dedicated administrator credentials (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).
  - Issues an HTTP-only, secure cookie named `em_admin_token`.
  - Independent server-side validation (`getAdminSession`) is enforced on every single `/api/admin/*` endpoint. Frontend middleware is not solely trusted.
  - Public navigation and footers contain zero admin links to prevent credential harvesting.

---

## 2. Admin Overview Dashboard (`/studio`)

The overview dashboard provides real-time business metrics aggregated directly from MongoDB Atlas:

- **Financial KPIs**:
  - **Gross Collections**: Total revenue received across all paid and refunded transactions.
  - **Total Refunds**: Administrative manual refund records issued to customers.
  - **Net Revenue**: Authoritative net earnings (`Gross Collections - Total Refunds`).
- **Operational KPIs**:
  - **Total Orders**: All placed orders with breakdown of *Paid*, *Pending*, and *Refunded*.
  - **Total Registered Customers**: Active customer base.
  - **Total Customer Websites**: Total projects created across all 4 occasions.
  - **Published Websites**: Live websites accessible to recipients.
  - **Suspended Websites**: Inactive or policy-suspended websites.
  - **Pending UPI Verifications**: Immediate alert count for manual UPI payments requiring UTR approval.

---

## 3. Order & Payment Management (`/studio/orders`)

### Manual UPI Verification Workflow
1. When a customer pays via manual UPI, the order is flagged as `pending` with `paymentMethod: "manual_upi"`.
2. Admin inspects bank account / UPI business app for the customer's UTR / Reference number.
3. Admin clicks **Verify Payment**:
   - `order.paymentStatus` updates to `paid`.
   - Linked `WebsiteProject.paymentStatus` updates to `paid`.
   - `ADMIN_MANUAL_UPI_VERIFIED` entry is logged to the order's audit trail.
4. Alternatively, click **Reject Payment** if no funds were received; this leaves the order marked as rejected and website locked.

### Administrative Refund Management
1. To record a refund, open the order detail page (`/studio/orders/[id]`).
2. Click **Record Refund** and supply the refund reason (e.g. *Customer requested cancellation*, *Accidental double payment*).
3. System actions executed:
   - `order.paymentStatus` set to `refunded`.
   - `refundType` flagged as `"administrative_manual_record"`.
   - `gatewayRefundIssued: false` (clarifying this is an internal accounting record and not an automated gateway call).
   - Associated customer website is automatically transitioned to `suspended` to prevent unpaid public access.
   - Irrevocable audit event `ADMIN_ORDER_REFUNDED` logged to the audit trail.

---

## 4. Customer Account Management (`/studio/customers`)

- **Customer Search & Inspection**:
  - Search by customer name, email, or telephone.
  - View registered date, project count, total orders, and lifetime spend.
- **Account Suspension & Reactivation**:
  - When an account is suspended via `/api/admin/customers/[id]`, access is instantly blocked.
  - **Zero Lag Token Revocation**: Even if the customer holds a valid pre-existing 30-day session token, their subsequent requests are rejected immediately with HTTP 401.
  - Admin can click **Reactivate Customer** to restore account privileges at any time.

---

## 5. Website Project Governance (`/studio/websites`)

- **Live Site Oversight**: View all customer projects across all occasions.
- **Content Moderation & Suspension**:
  - Admin can suspend any offensive or disputed website by clicking **Suspend Website**.
  - Suspended websites instantly render a private notice to public visitors and block editing.
- **Hosting Extension**:
  - Click **Extend Hosting (+1 Year)** to increment project expiration date without requiring customer payment.

---

## 6. Custom Domain Provisioning (`/studio/settings`)

- When a customer purchases a custom domain add-on (₹1,200), they submit their domain (e.g., `gift.marcusandelena.com`).
- The customer configures a CNAME record pointing to `cname.expertomemories.in`.
- Admin inspects DNS propagation and clicks **Verify Domain**:
  - Domain status updates to `connected`.
  - Routing middleware directs traffic matching the hostname to the customer's project.

---

## 7. Audit Trail & Compliance (`/studio/audit`)

- Every administrative action is automatically recorded in the immutable `AuditLog` collection:
  - Timestamp, Actor email, Action code, Target identifier, and Request metadata.
  - Tamper resistance: normal admin APIs do not permit `PUT` or `DELETE` on audit trail documents (HTTP 405 Method Not Allowed).
