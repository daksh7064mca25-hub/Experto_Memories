# ExpertoMemories — Complete Customer Journey Documentation

This document describes the customer journey on **ExpertoMemories**, from initial storefront discovery to published, interactive digital gift delivery.

---

## 1. Storefront Discovery (`/`)

1. **Homepage Experience**:
   - The customer lands on a luxury digital gifting storefront presenting the value proposition: *"Create bespoke interactive gift websites for your loved ones. Customize and preview for free — pay only when you are ready to publish."*
   - Transparent pricing model highlighted upfront (₹999 standard / ₹2,199 with custom domain).
   - Zero administrative links, login buttons, or internal controls appear in public navigation or footers.

2. **Occasion Product Catalog (`/gifts/[slug]`)**:
   - **Apology**: *"A Little Sorry, A Lot of Love"* — Heartfelt letters, forgiveness garden, coupon vouchers, catch-my-love minigame.
   - **Anniversary**: *"Our Forever Story"* — Love timeline, acoustic soundtrack, constellation star maps, bucket lists.
   - **Birthday**: *"Magical Birthday Celebration"* — Candle blowout, milestone memories, personalized wishes, celebratory confetti.
   - **Love**: *"Just Because I Love You"* — Romantic notes, reasons why I love you, secret scratch cards, glowing hearts.

3. **Interactive Occasion Demos (`/demo/[slug]`)**:
   - Customers can explore functional, simulated websites with an interactive top banner (*"Live Interactive Demo — Ready to create yours? Customize Free"*).

---

## 2. Customer Authentication (`/customer/login`)

- **Registration & Sign In**: Dedicated customer portal with tabbed interface (*Sign In* / *Create Free Account*).
- **Session Security**:
  - Issues cryptographically signed `em_customer_token` HTTP-only cookie.
  - Zero admin privileges; customer tokens are rejected by all `/api/admin/*` endpoints with HTTP 401.
  - Immediate session revocation: if an administrator suspends an account, active customer sessions are immediately revoked on their next request.

---

## 3. Customer Dashboard Workspace (`/dashboard`)

- **Workspace Navigation**:
  - **My Websites**: Grid of customer's active projects with occasion badges, preview thumbnails, last edited timestamps, and live statuses (*Draft*, *Unpaid*, *Paid*, *Published*, *Suspended*).
  - **Orders & Payments**: Transparent transaction history displaying order IDs, item breakdowns, amounts, payment methods, and receipt statuses.
  - **Account Settings**: Self-service profile updates (name, phone) and secure password change enforcing current password validation.
  - **Help & Support**: Step-by-step FAQ on editing, payment options, and delivery tips.

- **Creating a New Website (`/dashboard/create`)**:
  - Step 1: Select gift experience (Apology, Anniversary, Birthday, Love).
  - Step 2: Enter recipient's name, sender's name, and title.
  - Direct redirect into the Visual Studio Editor.

---

## 4. Visual Studio Editor (`/editor/[id]`)

- **3-Panel / Split Layout**:
  - **Left Panel (Workspace Controls)**:
    - *Sections Tab*: Toggle visibility, reorder sections, customize text and memories.
    - *Names & Details Tab*: Personalization and recipient names.
    - *Theme Tab*: Switch color palettes (e.g., Cotton Candy, Lavender Dreams, Peachy Love, Midnight Hearts, Pink Paradise).
    - *Music Tab*: Upload background acoustic music or select pre-cleared audio tracks.
    - *Privacy Tab*: Toggle password protection, set secret passphrase and hint.
  - **Center Panel (Interactive Canvas)**:
    - Live live-updating iframe preview of the recipient experience.
    - Device Viewport Switcher: **Mobile (375px)**, **Tablet (768px)**, and **Desktop (Full Width)**.
  - **Top Navigation Bar**:
    - Project title and autosave status indicator (*Saved ✓*, *Saving...*, *Unsaved*).
    - Manual *Save Now* button.
    - *Publish & Pay (₹999)* or *Publish Live* action button.

- **Backend Publishing Lock**:
  - Unpaid projects cannot be published directly (HTTP 402 Payment Required).
  - Visitors attempting to access an unpublished URL are presented with a private security splash screen.

---

## 5. Checkout & Payment Flow

- **Transparent Pricing Modal**:
  - Standard Gift Website: ₹999 (Includes lifetime hosting, photo & audio storage).
  - Optional Custom Domain Add-on: +₹1,200 (e.g. `www.elenaandmarcus.love`).
- **Payment Methods Supported**:
  - **Razorpay**: UPI (Google Pay, PhonePe, Paytm), Net Banking, Cards.
  - **Manual UPI**: Direct UPI QR code with UTR transaction verification.
- **Post-Payment Transition**:
  - Upon webhook or verification callback, project `paymentStatus` transitions to `paid`.
  - Customer can toggle *Publish Live* at will.

---

## 6. Live Website Delivery & Recipient Experience (`/gift/[slug]`)

- **Password Gate Security**:
  - If password protection is enabled, visitors are prompted for the secret passphrase.
  - Verifying the correct passphrase issues a signed `em_unlocked_[slug]` token.
  - Passwords are never stored or compared in plaintext; bcrypt hashing is enforced.
- **Sharing Tools**:
  - One-click *Copy Website Link*.
  - Direct *Share on WhatsApp* with personalized greeting.
  - Downloadable High-Res QR Code for greeting cards or gift boxes.
