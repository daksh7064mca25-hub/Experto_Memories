import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getEffectivePricing } from "@/lib/pricing";
import { PublicHeader } from "@/components/navigation/PublicHeader";
import { getEnrichedRelationshipTemplates } from "@/config/gift-presentation";
import { GiftCatalogGrid } from "@/components/gifts/GiftCatalogGrid";
import { CrossCategoryDiscovery } from "@/components/navigation/CrossCategoryDiscovery";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Smartphone,
  Send,
  Wand2,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Love & Relationship Gifts | ExpertoMemories Studio",
  description:
    "Explore bespoke interactive digital gift websites for Love & Romance, Anniversaries, and Apologies. Personalized with your photos, music, secret letters, and memories.",
  openGraph: {
    title: "Love & Relationship Gifts | ExpertoMemories",
    description:
      "Heartfelt apology letters, cinematic love stories, and romantic anniversary museums.",
    type: "website",
  },
};

export default async function GiftsDiscoveryPage() {
  // Strictly loads only Love & Romance, Anniversary, and Apology gifts
  const templates = getEnrichedRelationshipTemplates();

  let occasionPrices: Record<string, number> = {};
  let productsPricing: any[] = [];
  try {
    const { effectivePricing } = await getEffectivePricing();
    occasionPrices = effectivePricing.occasionPrices || {};
    productsPricing = effectivePricing.products || [];
  } catch (err) {
    console.error("Error loading effective pricing for gifts page:", err);
  }

  // Filter out any templates whose occasion/product has been hidden by admin
  const visibleTemplates = templates.filter((t) => {
    const match = productsPricing.find(
      (p) =>
        p.slug.toLowerCase() === t.occasionType.toLowerCase() ||
        p.occasionType.toLowerCase() === t.occasionType.toLowerCase() ||
        (t.id && p.id && p.id.toLowerCase() === t.id.toLowerCase())
    );
    return match ? match.isActive !== false : true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 selection:bg-[#541D2B] selection:text-white font-sans overflow-x-hidden">
      {/* UNIVERSAL NAVBAR */}
      <PublicHeader />

      {/* HERO SECTION */}
      <section className="pt-14 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest mb-6 bg-[#541D2B]/10 text-[#541D2B] border border-[#541D2B]/20 shadow-2xs">
          <Heart size={13} className="text-[#541D2B] fill-current" />
          <span>Love &amp; Relationship Gifts</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#541D2B] max-w-4xl mx-auto leading-tight mb-5">
          Gifts That Speak What Words Alone Cannot.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-stone-700 font-serif italic max-w-2xl mx-auto leading-relaxed mb-8">
          Personalized interactive gift websites crafted to celebrate love milestones, mend hearts, and commemorate anniversaries with unforgettable digital elegance.
        </p>

        {/* Trust & Guarantee Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-medium text-stone-600">
          <div className="flex items-center gap-1.5 bg-white/80 border border-stone-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>1 Year Free Hosting Included</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 border border-stone-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <Smartphone size={14} className="text-stone-700" />
            <span>Mobile &amp; Desktop Optimized</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 border border-stone-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <Lock size={14} className="text-amber-600" />
            <span>Private Password &amp; Secret Link</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 border border-stone-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <Send size={14} className="text-[#541D2B]" />
            <span>Instant Share via WhatsApp</span>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION WITH INTERACTIVE CATEGORY FILTERING */}
      <section className="pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <GiftCatalogGrid
          templates={visibleTemplates}
          occasionPrices={occasionPrices}
          productsPricing={productsPricing}
        />
      </section>

      {/* HOW IT WORKS: 3 SIMPLE STEPS TO GIFTING */}
      <section className="py-16 bg-white border-t border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest mb-3 bg-[#541D2B]/10 text-[#541D2B]">
            <Wand2 size={12} />
            <span>Simple 3-Step Journey</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#541D2B] mb-3">
            How An ExpertoMemories Gift Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif italic max-w-xl mx-auto mb-12">
            No technical skills needed. In just five minutes, you create an intimate digital surprise your recipient will treasure forever.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 shadow-2xs relative">
              <span className="text-xs font-mono font-bold text-[#541D2B] bg-[#541D2B]/10 px-2.5 py-1 rounded-full inline-block mb-4">
                Step 01
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Choose Your Experience
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Select from Anniversary milestones, deep Love &amp; Romance universes, or gentle Apology reconciliations crafted for your partner.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 shadow-2xs relative">
              <span className="text-xs font-mono font-bold text-[#541D2B] bg-[#541D2B]/10 px-2.5 py-1 rounded-full inline-block mb-4">
                Step 02
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Personalize Every Detail
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Add your favorite couple photos, background song, love letters, relationship dates, and custom surprise games in our intuitive studio.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-stone-200/80 shadow-2xs relative">
              <span className="text-xs font-mono font-bold text-[#541D2B] bg-[#541D2B]/10 px-2.5 py-1 rounded-full inline-block mb-4">
                Step 03
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Deliver Magic Instantly
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Get a private, personalized link (and optional QR code) to send over WhatsApp, email, or a surprise card on the special day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-CATEGORY DISCOVERY */}
      <CrossCategoryDiscovery currentCategory="relationship" />

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-[#FAF7F2] py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="ExpertoMemories Home">
              <div className="relative h-7 w-auto shrink-0 flex items-center">
                <Image
                  src="/branding/expertomemories-monogram.png"
                  alt="ExpertoMemories EM Monogram"
                  width={505}
                  height={321}
                  className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="font-serif font-bold text-base text-[#211715]">
                ExpertoMemories
              </span>
            </Link>
          </div>

          {/* Subtle ExpertoMemories Brand Attribution */}
          <div className="text-xs sm:text-sm text-stone-600 font-serif">
            <span>Made with love by </span>
            <a
              href="https://expertomemories.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#541D2B] hover:underline underline-offset-4 transition-colors focus:outline-none focus:ring-1 focus:ring-[#541D2B] rounded"
            >
              ExpertoMemories
            </a>
          </div>

          <p className="text-[11px] text-stone-400 font-sans">
            © 2026 ExpertoMemories Studio. All rights reserved. Bespoke Love &amp; Relationship Gifting Experiences.
          </p>
        </div>
      </footer>
    </div>
  );
}
