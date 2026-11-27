import { PublicHeader } from "@/components/navigation/PublicHeader";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | ExpertoMemories Studio",
  description:
    "Review the Terms of Service for ExpertoMemories. Covers customer content ownership, cloud hosting duration, custom domain add-ons, and acceptable use policies.",
};

export default function TermsAndConditionsPage() {
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
            <FileText size={13} />
            <span>Customer Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#211715]">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] font-mono">
            Last Updated: {lastUpdated} &bull; Effective Immediately
          </p>
        </div>

        {/* Business Entity Notice */}
        <div className="p-4 rounded-2xl bg-[#C5A36A]/10 border border-[#C5A36A]/30 text-xs text-[#57534E] leading-relaxed">
          <p>
            These Terms &amp; Conditions govern your use of the ExpertoMemories website and gifting platform operated by{" "}
            <span className="font-semibold text-[#211715]">[Business Entity: ExpertoMemories Studio &bull; Pending Commercial Registration]</span>.
            By creating, previewing, or publishing a website on ExpertoMemories, you agree to be bound by these terms.
          </p>
        </div>

        {/* Section 1: Services Offered */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            1. Description of Services
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            ExpertoMemories provides a bespoke digital gifting and event invitation platform enabling customers to design, customize, preview, and publish interactive, mobile-optimized websites for personal celebrations including romantic milestones, anniversaries, apologies, birthdays, and weddings.
          </p>
        </section>

        {/* Section 2: Free Preview & Publishing Fees */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            2. Free Preview &amp; One-Time Publishing Fees
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <li><strong>Free Unlimited Previews:</strong> You may customize text, upload photos, change themes, and preview your interactive website across mobile and desktop devices without charge.</li>
            <li><strong>One-Time Publishing Fee:</strong> When you choose to publish your website live to a permanent public link, a one-time fee applies as set forth at checkout.</li>
            <li><strong>No Hidden Subscriptions:</strong> ExpertoMemories does not charge automatic recurring monthly subscriptions. Each website includes 12 months of cloud hosting.</li>
          </ul>
        </section>

        {/* Section 3: Hosting Duration & Renewal Policy */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            3. 12-Month Hosting &amp; Renewal Policy
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Every published website includes 12 full months of high-speed cloud hosting on global edge infrastructure. ExpertoMemories is transparent about real infrastructure costs and does not promise unrealistic &ldquo;lifetime&rdquo; hosting. Customers may optionally renew their hosting duration annually through the customer dashboard prior to expiration. If not renewed, projects may be archived safely.
          </p>
        </section>

        {/* Section 4: Custom Domain Names */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            4. Custom Domain Add-Ons
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            If you purchase the optional custom domain add-on (e.g., <code>riyaandrahul.com</code>), the first year of domain configuration and SSL mapping to our CNAME (<code>cname.expertomemories.shop</code>) is included. Subsequent domain renewal after Year 1 is managed directly by you with your domain registrar or renewed through our studio.
          </p>
        </section>

        {/* Section 5: Content Ownership & Acceptable Use */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            5. User Content &amp; Prohibited Conduct
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            You retain 100% intellectual property ownership of all personal photographs, text, and media you upload to ExpertoMemories. You grant us a limited, worldwide license solely to store, process, and display your content to fulfill your website.
          </p>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            You agree not to upload content that is unlawful, defamatory, non-consensually explicit, harassing, infringing upon third-party copyrights, or violating the privacy rights of others. ExpertoMemories reserves the right to immediately unpublish any website found in violation of these standards.
          </p>
        </section>

        {/* Section 6: Limitation of Liability & Governing Law */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            6. Limitation of Liability &amp; Governing Law
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            ExpertoMemories is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While we maintain 99.9% uptime across modern Cloudflare and Netlify networks, we cannot be held liable for temporary interruptions caused by third-party telecoms, natural disasters, or internet outages. To the maximum extent permitted by applicable law, our aggregate liability shall not exceed the amount actually paid by you for the specific website project.
          </p>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            These terms are governed by the laws of India. For dispute resolution or legal notices, contact{" "}
            <a href="mailto:support@expertomemories.shop" className="text-[#541D2B] font-semibold underline">
              support@expertomemories.shop
            </a>.
          </p>
        </section>
      </main>
    </div>
  );
}
