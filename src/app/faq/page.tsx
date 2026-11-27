import { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { PublicHeader } from "@/components/navigation/PublicHeader";
import {
  Heart,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  ArrowRight,
  Gift,
} from "lucide-react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Frequently Asked Questions | ExpertoMemories Digital Gifting Studio",
  description:
    "Everything you need to know about creating, customizing, previewing, and publishing personalized interactive gift websites on ExpertoMemories.",
  openGraph: {
    title: "Frequently Asked Questions — ExpertoMemories",
    description:
      "Clear, transparent answers about our visual studio editor, pricing, hosting, WhatsApp sharing, and privacy.",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211715] flex flex-col font-sans selection:bg-[#541D2B]/15 selection:text-[#541D2B]">
      {/* UNIVERSAL NAVBAR */}
      <PublicHeader showAnnouncement={true} />

      <main className="flex-1">
        {/* 3. EDITORIAL HERO SECTION */}
        <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 px-6 sm:px-10 overflow-hidden border-b border-[#EAE3D9] bg-gradient-to-b from-[#FAF7F2] via-[#FFF5F6]/40 to-[#FAF7F2]">
          {/* Subtle Decorative Ambient Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#541D2B]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-[#C5A36A]/10 blur-2xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
            {/* Elegant Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#EAE3D9] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.22em] uppercase text-[#541D2B]">
                Here To Help
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A] animate-pulse" />
            </div>

            {/* Main Editorial Heading */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#211715] leading-[1.15]">
              Everything You&apos;d Love to Know
            </h1>

            {/* Short Supporting Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#57534E] font-normal leading-relaxed max-w-2xl mx-auto pt-1">
              Clear, transparent answers about creating, personalizing, previewing, and publishing your private digital gift website.
            </p>
          </div>
        </section>

        {/* 4. BALANCED TWO-COLUMN FAQ SECTION */}
        <section className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT COLUMN: Sticky Intro & Highlights Panel (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#EAE3D9] shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#C5A36A] font-semibold mb-2">
                    <Sparkles size={12} className="text-[#C5A36A]" />
                    <span>Thoughtful &amp; Transparent</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] leading-snug">
                    A little clarity before the magic begins
                  </h2>
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mt-3">
                    From your first draft to the moment your recipient breaks the wax seal, we&apos;ve designed every step to be effortless, transparent, and completely in your control.
                  </p>
                </div>

                {/* Quick Reassurance Pillars */}
                <div className="pt-4 border-t border-[#F2EDE5] space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#211715]">
                        100% Free Live Preview
                      </h4>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        Customize letters, photos, and music without any upfront payment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#C5A36A]/15 text-[#8C6D3B] flex items-center justify-center shrink-0 mt-0.5">
                      <Gift size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#211715]">
                        Transparent One-Time Publishing Fee
                      </h4>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        One single fee with zero recurring subscriptions or hidden costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#D94B70]/10 text-[#D94B70] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#211715]">
                        12 Months Cloud Hosting
                      </h4>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        Secure high-speed delivery with optional dashboard renewal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center shrink-0 mt-0.5">
                      <Lock size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#211715]">
                        Bcrypt Password Gate
                      </h4>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        Keep intimate words strictly confidential with secret hints.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct CTA */}
                <div className="pt-2">
                  <Link
                    href="/dashboard/create"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold bg-[#541D2B] hover:bg-[#682435] text-white shadow-md shadow-[#541D2B]/15 transition-all hover:scale-[1.01]"
                  >
                    <span>Start Creating Your Gift</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: The Interactive FAQ Accordion List (7 cols) */}
            <div className="lg:col-span-7">
              <FaqAccordion initialOpenIndex={0} showCategoryFilter={true} />
            </div>
          </div>
        </section>

        {/* 5. PREMIUM SUPPORT SECTION */}
        <section className="py-20 sm:py-24 bg-white border-t border-[#EAE3D9] px-6 sm:px-10">
          <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#FAF7F2] via-[#FFF5F6]/60 to-[#FAF7F2] border border-[#EAE3D9] shadow-sm text-center relative overflow-hidden">
            {/* Decorative gold accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A36A]/60 to-transparent" />

            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-[#541D2B] text-[#FAF7F2] flex items-center justify-center shadow-md mb-6">
              <Mail size={22} className="text-[#C5A36A]" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#211715] mb-3">
              Still have something on your mind?
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-xl mx-auto mb-8">
              Our team is happy to help you create something unforgettable. Reach out to our dedicated concierge anytime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@expertomemories.shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold bg-[#541D2B] hover:bg-[#682435] text-white shadow-md transition-all hover:scale-105"
              >
                <Mail size={14} />
                <span>Email Studio Concierge: support@expertomemories.shop</span>
              </a>

              <Link
                href="/dashboard/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-semibold bg-white text-[#211715] border border-[#EAE3D9] hover:border-[#C5A36A] shadow-xs transition-all"
              >
                <span>Explore Gift Templates</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 6. REFINED EDITORIAL FOOTER */}
      <footer className="bg-[#211715] text-[#FAF7F2] pt-16 sm:pt-20 pb-12 border-t border-[#3A2D2A] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Intro */}
            <div className="lg:col-span-5 space-y-4">
              <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group" aria-label="ExpertoMemories Home">
                <div className="relative h-8 sm:h-9 w-auto shrink-0 flex items-center">
                  <Image
                    src="/branding/expertomemories-monogram.png"
                    alt="ExpertoMemories EM Monogram"
                    width={505}
                    height={321}
                    loading="eager"
                    className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#FAF7F2] block leading-none">
                  ExpertoMemories
                </span>
              </Link>
              <p className="text-xs text-[#A8A29E] leading-relaxed max-w-sm">
                A luxury digital gifting studio combining bespoke interactive storytelling, cinematic typography, and permanent cloud-hosted keepsakes for the people who matter most.
              </p>
              <div className="pt-2 text-[11px] text-[#78716C] font-mono">
                Bespoke Keepsakes • Secure Cloud Infrastructure
              </div>
            </div>

            {/* Quick Links: Experiences */}
            <div className="lg:col-span-3 space-y-3">
              <p className="text-[11px] font-sans font-bold tracking-widest text-[#FAF7F2] uppercase">
                Experiences
              </p>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li>
                  <Link href="/gifts/anniversary" className="hover:text-white transition-colors">
                    Anniversary — Our Love Story
                  </Link>
                </li>
                <li>
                  <Link href="/gifts/birthday" className="hover:text-white transition-colors">
                    Birthday — The Wonderland
                  </Link>
                </li>
                <li>
                  <Link href="/gifts/love" className="hover:text-white transition-colors">
                    Love &amp; Romance — The Secret World
                  </Link>
                </li>
                <li>
                  <Link href="/gifts/apology" className="hover:text-white transition-colors">
                    Apology — A Little Sorry
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links: Studio */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-[11px] font-sans font-bold tracking-widest text-[#FAF7F2] uppercase">
                Studio
              </p>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li>
                  <Link href="/#experiences" className="hover:text-white transition-colors">
                    Explore Gifts
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#story" className="hover:text-white transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-[#C5A36A] font-semibold">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@expertomemories.shop" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Workspace Links */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-[11px] font-sans font-bold tracking-widest text-[#FAF7F2] uppercase">
                Customer Studio
              </p>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li>
                  <Link href="/customer/login" className="hover:text-white transition-colors">
                    Customer Login
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    My Gift Websites
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/create" className="hover:text-white transition-colors">
                    Create New Gift
                  </Link>
                </li>
              </ul>
              <div className="pt-2">
                <p className="text-[10px] text-[#78716C] leading-relaxed">
                  Support concierge:{" "}
                  <a href="mailto:support@expertomemories.shop" className="text-[#C5A36A] hover:underline">
                    support@expertomemories.shop
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#3A2D2A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716C]">
            <p>&copy; {new Date().getFullYear()} ExpertoMemories Studio. All rights reserved.</p>
            <p className="font-serif italic text-xs text-[#A8A29E]">
              &ldquo;Some moments deserve more than a message.&rdquo;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
