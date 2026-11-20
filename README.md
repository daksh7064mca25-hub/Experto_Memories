# ExpertoMemories — Complete Digital Gifting SaaS Platform

**ExpertoMemories** is a full-stack, digital gifting SaaS platform for creating, customizing, previewing, and publishing bespoke interactive gift websites across multiple occasions (Apology, Anniversary, Birthday, Love).

Built with Next.js 16 (App Router & Turbopack), TypeScript, MongoDB Atlas, Razorpay Payment Gateway, Cloudflare R2 Object Storage, and Tailwind CSS.

---

## 🌟 Platform Highlights

- **Four Occasion Experiences**:
  - **Apology**: *"A Little Sorry, A Lot of Love"* — Heartfelt letter with typewriter animation, interactive Forgiveness Garden, perforated coupon vouchers, wax-sealed promises, and Catch-My-Love mini-game.
  - **Anniversary**: *"Our Forever Story"* — Love milestones timeline, interactive vinyl music soundtrack, constellation star maps, and bucket lists.
  - **Birthday**: *"Magical Birthday Celebration"* — Candle blowout interaction, milestone photo memories, personalized wishes, and celebratory confetti engine.
  - **Love**: *"Just Because I Love You"* — Romantic love notes, reasons why I love you flip cards, secret scratch cards, and glowing secret whispers.
- **Customer Studio & Self-Service Visual Editor (`/dashboard` & `/editor/[id]`)**:
  - Free to create, edit, and preview on Mobile, Tablet, and Desktop frames.
  - Real-time debounced autosave with manual instant-save trigger.
  - Password gate protection with bcrypt hashing and signed HTTP-only cookies.
  - Custom domain submission and CNAME mapping workflow.
- **Business Operations & Admin Studio (`/studio`)**:
  - Real-time MongoDB business metrics: Gross collections, manual refund records, and net revenue separation.
  - Order verification pipeline for both automated Razorpay and Manual UPI transactions.
  - Customer account management with zero-lag session revocation upon suspension.
  - Immutable audit trail recording administrative actions.
- **Enterprise-Grade Payment Security**:
  - Strict server-side pricing calculation (client prices are completely ignored).
  - Razorpay order ID association, HMAC-SHA256 signature verification, and direct status fetch.
  - Idempotent order verification and webhook replay protection.
  - Distinct separation of administrative manual refund records from automated gateway refunds.

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v20+ recommended
- **MongoDB**: MongoDB Atlas cluster or local MongoDB instance
- **Razorpay**: Razorpay account (Test mode keys `rzp_test_*`)
- **Cloudflare R2**: Cloudflare account with R2 bucket configured

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd "Apology website"

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

Key environment variables:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-secure-random-jwt-secret-min-32-chars
PASSWORD_GATE_SECRET=your-secure-password-gate-cookie-secret-key
ADMIN_EMAIL=admin@expertomemories.in
ADMIN_PASSWORD=your-secure-admin-password
MONGODB_URI=mongodb+srv://...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=expertomemories-media
R2_PUBLIC_DOMAIN=https://media.expertomemories.in
```

### 4. Running the Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

### 5. Building for Production
```bash
npm run build
npm run start
```

---

## 🧪 Comprehensive Test Suites

ExpertoMemories includes automated integration and end-to-end browser test suites:

| Suite Script | Description | Tests Passed |
|---|---|---|
| `test-customer-journey-browser.mjs` | Full real-browser end-to-end customer journey using Playwright Chromium | **11 / 11 (100%)** |
| `test-phase6-e2e-suite.mjs` | Complete Phase 6 E2E audit, security assertions, and revenue calculations | **13 / 13 (100%)** |
| `test-phase5-admin-suite.mjs` | Admin Studio KPIs, customer suspension, and business operations | **11 / 11 (100%)** |
| `test-phase4-customer-studio-suite.mjs` | Customer visual editor, photo uploads, and device previews | **11 / 11 (100%)** |
| `test-phase3-storefront-suite.mjs` | Public storefront branding, 4 occasion pages, and demo routing | **11 / 11 (100%)** |
| `test-phase2-deep-security.mjs` | 40 Admin API authorization checks and forged cookie rejections | **40 / 40 (100%)** |
| `test-razorpay-http-suite.mjs` | Razorpay payment flow, webhook HMAC verification, and idempotency | **12 / 12 (100%)** |
| `test-customer-publishing-suite.mjs` | End-to-end customer publishing, locks, and manual UPI verification | **71 / 71 (100%)** |

To execute the browser customer journey test:
```bash
node test-customer-journey-browser.mjs
```

To execute the complete backend audit:
```bash
node test-phase6-e2e-suite.mjs
```

---

## 📂 Project Structure

```
├── docs/
│   ├── CUSTOMER_JOURNEY.md           # Step-by-step customer experience guide
│   ├── ADMIN_OPERATIONS.md           # Business owner operations & refund manual
│   ├── PAYMENT_AND_REFUND_WORKFLOW.md# Razorpay & UPI verification architecture
│   ├── R2_MEDIA_SETUP.md             # Cloudflare R2 bucket & CORS configuration
│   └── DEPLOYMENT_AND_CHECKLIST.md   # Production launch & disaster recovery runbook
├── src/
│   ├── app/
│   │   ├── (public)/                 # Public storefront, occasion pages, & demos
│   │   ├── api/                      # Authenticated APIs (Admin, Customer, Checkout, Media)
│   │   ├── customer/                 # Customer login & registration portal
│   │   ├── dashboard/                # Customer workspace & project creation
│   │   ├── editor/[id]/              # Customer 3-panel Visual Studio Editor
│   │   ├── gift/[slug]/              # Recipient live website renderer & password gate
│   │   └── studio/                   # Admin Studio operations & analytics
│   ├── components/                   # UI components, renderers, modals, & audio player
│   ├── config/                       # Products, themes, pricing, & occasions
│   ├── lib/                          # MongoDB, auth, Razorpay, UPI, R2, and crypto helpers
│   ├── models/                       # Mongoose schemas (Order, WebsiteProject, Customer, AuditLog)
│   └── services/                     # Business logic services (Project, Analytics, Media)
└── tests/                            # Automated test runners
```

---

## 🔒 Security Architecture

1. **Strict Session & Privilege Separation**:
   - Customer accounts (`em_customer_token`) can NEVER access administrative APIs (`/api/admin/*`) or Admin Studio (`/studio`).
   - Every administrative API endpoint enforces independent `getAdminSession` validation.
2. **Immediate Token Revocation**:
   - Suspended customers lose access immediately on their next request, even if holding a valid 30-day token.
3. **Password Protection Security**:
   - Website passwords are encrypted using `bcrypt` and never stored or returned in plaintext.
   - Unlock authorization uses cryptographically signed, tamper-resistant HTTP-only cookies (`em_unlocked_[slug]`).
4. **Media Storage Hardening**:
   - Server-side MIME type whitelisting and file size caps (25MB audio/photos, 150MB videos) block executable scripts.
5. **Tamper-Resistant Audit Trail**:
   - All critical actions (refunds, domain verifications, manual UPI approvals, account suspensions) are permanently logged.

---

## 📄 License
Private commercial software. All rights reserved by ExpertoMemories.
