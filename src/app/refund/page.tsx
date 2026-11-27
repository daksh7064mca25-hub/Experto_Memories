import { PublicHeader } from "@/components/navigation/PublicHeader";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | ExpertoMemories Studio",
  description:
    "Understand the transparent refund, cancellation, and customer resolution policy for ExpertoMemories digital gifting and wedding websites.",
};

export default function RefundPolicyPage() {
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
            <RefreshCw size={13} />
            <span>Transparent Guarantee</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#211715]">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] font-mono">
            Last Updated: {lastUpdated} &bull; Effective Immediately
          </p>
        </div>

        {/* Philosophy Callout */}
        <div className="p-4 rounded-2xl bg-[#C5A36A]/10 border border-[#C5A36A]/30 text-xs text-[#57534E] leading-relaxed">
          <p>
            <strong>Our Commitment to Fairness:</strong> ExpertoMemories operates on complete transparency. Because you can design, personalize, and preview 100% of your website before paying a single rupee, you always know exactly what your published experience looks like.
          </p>
        </div>

        {/* Section 1: Pre-Payment Guarantee */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            1. Free Unlimited Editing &amp; Live Previews
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Every customer enjoys unlimited, free draft creation. You can upload memories, change color themes, test interactive letter unfolds, and view real-time mobile responsive previews without entering any payment information. Payment is requested solely when you choose to publish the finalized project live to the internet.
          </p>
        </section>

        {/* Section 2: Eligible Refund Scenarios */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            2. When Refunds Are Issued
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            We happily issue full or partial refunds in the following verified circumstances:
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-[#57534E]">
            <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] space-y-1.5">
              <h3 className="font-serif font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Duplicate Accidental Payments</span>
              </h3>
              <p className="leading-relaxed">
                If your card, bank account, or UPI app was charged multiple times for the same order due to network latency, duplicate charges are refunded 100% upon confirmation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] space-y-1.5">
              <h3 className="font-serif font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Technical Server Fulfillment Failures</span>
              </h3>
              <p className="leading-relaxed">
                If our cloud systems fail to generate your published website link or the project remains inaccessible for more than 48 hours after successful payment verification and our engineering team cannot resolve it, you are entitled to a full refund.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE3D9] space-y-1.5">
              <h3 className="font-serif font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Unauthorized Fraudulent Transactions</span>
              </h3>
              <p className="leading-relaxed">
                Verified cases of unauthorized account access or payment fraud reported by banking partners prior to link sharing.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Non-Refundable Situations */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            3. Non-Refundable Situations
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Because published websites are bespoke digital goods instantly provisioned with global cloud bandwidth, SSL certificates, and database resources, refunds cannot be issued for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <li>Change of mind after your live link has been generated and accessed by recipients.</li>
            <li>Typos, incorrect dates, or mistakes in customer-submitted text (you can edit text at any time from your customer dashboard).</li>
            <li>Third-party domain registrar registration fees once a custom domain name has already been purchased and registered.</li>
          </ul>
        </section>

        {/* Section 4: Refund Submission Procedure */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            4. How to Request a Refund
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            To submit a refund request, send an email to{" "}
            <a href="mailto:support@expertomemories.shop" className="text-[#541D2B] font-semibold underline">
              support@expertomemories.shop
            </a>{" "}
            with the following details:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <li>Your Order Number (e.g. <code>EM-123456-ABCD</code>)</li>
            <li>Customer email and phone number used during checkout</li>
            <li>Razorpay Payment ID or 12-digit UPI UTR reference number</li>
            <li>A brief explanation of the issue encountered</li>
          </ul>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed pt-2">
            Our support concierge reviews all requests within <strong>2 to 3 business days</strong>. Approved refunds are credited back to the original source account (UPI, card, or net banking) within <strong>5 to 7 banking business days</strong> in accordance with standard RBI banking guidelines.
          </p>
        </section>
      </main>
    </div>
  );
}
