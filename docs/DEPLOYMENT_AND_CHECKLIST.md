# ExpertoMemories — Production Deployment, DNS & Disaster Recovery Runbook

This guide covers production launch procedures, DNS setup, environment checklists, and disaster recovery procedures for **ExpertoMemories**.

---

## 1. Production Launch Checklist

Before flipping traffic to production or switching Razorpay to live mode:

- [ ] **MongoDB Atlas**:
  - [ ] Whitelist production host IP addresses (or AWS/Vercel NAT IPs).
  - [ ] Confirm connection string uses `+srv` with `retryWrites=true&w=majority`.
  - [ ] Verify database indexes (`db.websiteprojects.createIndex({ slug: 1 }, { unique: true })`, `db.orders.createIndex({ orderNumber: 1 }, { unique: true })`).
- [ ] **Razorpay Payment Gateway**:
  - [ ] Switch `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` from `rzp_test_*` to live production keys `rzp_live_*`.
  - [ ] In the Razorpay Dashboard, configure webhook endpoint: `https://expertomemories.in/api/checkout/webhook`.
  - [ ] Select events: `order.paid`, `payment.captured`, `payment.failed`.
  - [ ] Copy the configured secret into `RAZORPAY_WEBHOOK_SECRET`.
- [ ] **Cloudflare R2**:
  - [ ] Confirm public bucket custom domain is bound (`https://media.expertomemories.in`).
  - [ ] Verify CORS rules permit `https://expertomemories.in` for direct PUT requests.
- [ ] **Secrets & Encryption Keys**:
  - [ ] Generate high-entropy 256-bit secrets for `JWT_SECRET`, `ADMIN_JWT_SECRET`, and `PASSWORD_GATE_SECRET`.
  - [ ] Set `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD`.
  - [ ] Ensure `NODE_ENV=production`.
- [ ] **Custom Domain Wildcard / CNAME**:
  - [ ] Point root domain `expertomemories.in` and `www` to production host.
  - [ ] Configure `cname.expertomemories.in` as CNAME target for customer custom domains.

---

## 2. DNS & Custom Domain Architecture

ExpertoMemories supports customer custom domain mapping (e.g. `marcusandelena.com` -> customer's anniversary gift).

### DNS Record Setup
```
Type: CNAME
Host: @ (or subdomain such as 'gift')
Value: cname.expertomemories.in
TTL: Auto / 300
Proxy status: DNS only (Cloudflare Grey Cloud) during initial verification
```

### Server Resolution (`src/middleware.ts` / Next.js Proxy)
When a request arrives at the server:
1. If host matches `expertomemories.in` or `localhost`, normal routing executes.
2. If host is an external domain (e.g. `gift.marcusandelena.com`):
   - Looks up the active `WebsiteProject` by `customDomain.domainName`.
   - If verified and connected, rewrites request internally to `/gift/${project.slug}`.

---

## 3. Backup & Disaster Recovery Procedures

### Automated MongoDB Atlas Snapshots
1. Enable Continuous Cloud Backups in MongoDB Atlas.
2. Configure 7-day point-in-time recovery (PITR) with daily snapshot retention for 30 days.

### Manual Database Backup Script
To create an offline dump:
```bash
mongodump --uri="mongodb+srv://<user>:<password>@cluster.mongodb.net/expertomemories" --out="./backup-$(date +%Y%m%d)"
```

### Database Restore Procedure
In the event of accidental data corruption or incident response:
```bash
mongorestore --uri="mongodb+srv://<user>:<password>@cluster.mongodb.net/expertomemories" --drop ./backup-20261115/expertomemories
```

---

## 4. Rollback Plan

If an issue arises immediately post-deployment:
1. Revert to previous Git release tag / commit.
2. Run `npm run build` and restart process manager (`pm2 restart expertomemories` or Vercel instant rollback).
3. Database migrations maintain backward compatibility: all newly introduced fields (`customDomain`, `refundType`, `packageDetails`) are optional and non-breaking.
