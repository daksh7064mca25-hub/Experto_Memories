import { PublicHeader } from "@/components/navigation/PublicHeader";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | ExpertoMemories Studio",
  description:
    "Learn how ExpertoMemories collects, protects, and handles your photographs, personal letters, wedding RSVPs, and account data with privacy-first standards.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 22, 2026";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211715] font-sans selection:bg-[#541D2B] selection:text-[#FAF7F2]">
      {/* UNIVERSAL NAVBAR */}
      <PublicHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-12">
        {/* Title Header */}
        <div className="space-y-4 border-b border-[#EAE3D9] pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#541D2B]/8 text-[#541D2B] border border-[#541D2B]/15 text-[11px] font-mono font-bold uppercase tracking-wider">
            <ShieldCheck size={13} />
            <span>Privacy-First Architecture</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#211715]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] font-mono">
            Last Updated: {lastUpdated} &bull; Effective Immediately
          </p>
        </div>

        {/* Notice on Business Details */}
        <div className="p-4 rounded-2xl bg-[#C5A36A]/10 border border-[#C5A36A]/30 text-xs text-[#57534E] leading-relaxed">
          <p>
            <strong>Note to Visitors &amp; Customers:</strong> ExpertoMemories is operated by{" "}
            <span className="font-semibold text-[#211715]">[Business Entity: ExpertoMemories Studio &bull; Legal Name Pending Commercial Registration]</span>.
            For all privacy-related questions, data requests, or consent withdrawals, our dedicated privacy team can be reached at{" "}
            <a href="mailto:support@expertomemories.shop" className="text-[#541D2B] font-semibold underline">
              support@expertomemories.shop
            </a>.
          </p>
        </div>

        {/* Section 1: Overview & Philosophy */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            1. Our Commitment to Intimate Privacy
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            At ExpertoMemories, we understand that our customers entrust us with their most vulnerable, heartfelt, and sacred moments: intimate love letters, private anniversary photographs, apology confessions, and wedding guest details. We do not sell your personal data, we do not monetize customer photographs, and we do not serve third-party advertising on your personalized gift websites.
          </p>
        </section>

        {/* Section 2: Data We Collect */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            2. Information We Collect
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <p>
              <strong>A. Customer &amp; Account Information:</strong> When you register or purchase a website, we collect your name, email address, WhatsApp/phone number, and account credentials (passwords are stored as salted bcrypt hashes; we never store plain-text passwords).
            </p>
            <p>
              <strong>B. User-Uploaded Memories &amp; Media:</strong> Photographs, voice notes, audio soundtracks, and letters you provide for your website. Media assets are uploaded directly to our private Cloudflare R2 object storage through signed, time-limited presigned URLs.
            </p>
            <p>
              <strong>C. Wedding Guest &amp; RSVP Information:</strong> When guests RSVP to your wedding invitation, we collect their name, attendance status, attendee count, meal preferences, and heartfelt wishes. This data is accessible only by the creator through their customer dashboard.
            </p>
            <p>
              <strong>D. Billing &amp; Transaction Details:</strong> For online payments, transaction IDs and payment statuses are securely handled by Razorpay (PCI-DSS Level 1 compliant). For direct UPI payments, we record the customer-submitted 12-digit UTR reference number. We do not collect or store full credit card numbers or CVVs on our servers.
            </p>
          </div>
        </section>

        {/* Section 3: How We Use Data */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <li>To render, publish, and host your private interactive celebration website at your designated slug.</li>
            <li>To send order confirmation receipts, access tokens, and link delivery notifications via email/WhatsApp.</li>
            <li>To verify manual UPI bank payments against customer-provided UTR numbers.</li>
            <li>To authenticate customer dashboard sessions and enforce authorized editing rights.</li>
            <li>To provide customer support and troubleshoot technical delivery issues.</li>
          </ul>
        </section>

        {/* Section 4: Privacy & Password Protection */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            4. Password Protection for Published Websites
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            You may optionally configure a password for any published gift experience. When enabled, visitors must enter the correct password to unlock the content. Passwords are cryptographically validated server-side using secure bcrypt hashing. ExpertoMemories administrators cannot read your plain-text password.
          </p>
        </section>

        {/* Section 5: Third-Party Infrastructure */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            5. Third-Party Service Providers
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            We partner exclusively with trusted, industry-leading infrastructure providers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <li><strong>MongoDB Atlas:</strong> Encrypted managed database storage for project configurations and RSVP records.</li>
            <li><strong>Cloudflare R2:</strong> High-performance, globally distributed cloud object storage for customer photographs.</li>
            <li><strong>Razorpay:</strong> Secure payment processing partner.</li>
            <li><strong>Netlify:</strong> Edge delivery network and serverless runtime hosting.</li>
          </ul>
        </section>

        {/* Section 6: Data Retention & Deletion */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            6. Data Retention &amp; Customer Rights
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Each published website includes 12 full months of active cloud hosting. You may renew your hosting duration through your dashboard. You retain the right to delete your project, delete uploaded photographs, or request complete account eradication at any time by contacting{" "}
            <a href="mailto:support@expertomemories.shop" className="text-[#541D2B] font-semibold underline">
              support@expertomemories.shop
            </a>. Upon receiving a verified deletion request, your website is permanently unpublished and media assets are purged from cloud storage.
          </p>
        </section>
      </main>
    </div>
  );
}
