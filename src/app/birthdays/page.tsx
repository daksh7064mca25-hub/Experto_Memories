import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CATALOGUE_TEMPLATES } from "@/config/catalog";
import { getEffectivePricing } from "@/lib/pricing";
import { PublicHeader } from "@/components/navigation/PublicHeader";
import { CrossCategoryDiscovery } from "@/components/navigation/CrossCategoryDiscovery";
import {
  Sparkles,
  ArrowRight,
  Cake,
  Flame,
  CheckCircle2,
  Heart,
  Smile,
  Gift,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Birthday Wonderlands & Celebrations | ExpertoMemories Studio",
  description:
    "Explore magical personalized birthday celebration websites with interactive 3D cakes, candle blowing, balloon wishes, scrapbook memories, and celebratory games.",
  openGraph: {
    title: "Birthday Wonderlands | ExpertoMemories",
    description: "Celebrate their special day with interactive 3D cake, candle blowing, wishes & music.",
    type: "website",
  },
};

export default async function BirthdaysDiscoveryPage() {
  const birthdayTemplates = CATALOGUE_TEMPLATES.filter(
    (t) => t.categoryId === "birthday-celebrations" && t.isActive
  );

  let occasionPrices: Record<string, number> = {};
  let productsPricing: any[] = [];
  try {
    const { effectivePricing } = await getEffectivePricing();
    occasionPrices = effectivePricing.occasionPrices || {};
    productsPricing = effectivePricing.products || [];
  } catch (err) {
    console.error("Error loading effective pricing for birthdays page:", err);
  }

  const isBirthdayActive =
    productsPricing.length > 0
      ? productsPricing.find(
          (p) =>
            p.slug.toLowerCase() === "birthday" ||
            p.occasionType.toLowerCase() === "birthday"
        )?.isActive !== false
      : true;

  const visibleTemplates = isBirthdayActive ? birthdayTemplates : [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 selection:bg-[#541D2B] selection:text-white font-sans overflow-x-hidden">
      {/* UNIVERSAL NAVBAR */}
      <PublicHeader />

      {/* HERO */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest mb-6 bg-purple-100 text-purple-900 border border-purple-200">
          <Cake size={13} className="text-purple-700" />
          <span>Joyful &amp; Immersive Celebration</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#541D2B] max-w-4xl mx-auto leading-tight mb-6">
          Celebrate Their Special Day Like Never Before.
        </h1>

        <p className="text-base sm:text-xl text-stone-700 font-serif italic max-w-2xl mx-auto leading-relaxed mb-10">
          Light the digital candles, blow them out with joyful confetti, pop memory balloons, and take them on an emotional journey through cherished years.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            href="/dashboard/create?occasion=birthday"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-serif font-bold bg-[#541D2B] text-white hover:bg-[#3E131E] transition shadow-xl hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>Design Birthday Website</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/demo/birthday"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-serif font-bold bg-white border border-stone-300 text-stone-800 hover:border-[#541D2B] hover:text-[#541D2B] transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles size={16} className="text-[#C5A36A]" />
            <span>View Live Birthday Demo</span>
          </Link>
        </div>
      </section>

      {/* BIRTHDAYS GRID */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {visibleTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
            >
              <div className="p-6 pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 inline-block mb-3">
                  {template.badge || "Birthday Wonderland"}
                </span>

                <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#541D2B] transition-colors leading-snug mb-1">
                  {template.title}
                </h3>
                <p className="text-xs font-serif italic text-purple-700 font-semibold mb-3">
                  {template.designName}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Colorways */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">Colorways:</span>
                  <div className="flex items-center gap-1.5">
                    {template.themes.map((th) => (
                      <div
                        key={th.id}
                        className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs"
                        style={{ backgroundColor: th.previewColor }}
                        title={th.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="px-6 py-4 bg-stone-50/70 border-t border-b border-stone-100 space-y-1.5 text-xs text-stone-700">
                {template.features.slice(0, 4).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-purple-600 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Price & Action Row */}
              <div className="p-6 pt-4 flex items-center justify-between gap-3 bg-white">
                {(() => {
                  const pricingInfo = productsPricing.find(
                    (p) => p.slug === template.slug || p.occasionType === template.occasionType
                  );
                  const displayPrice = pricingInfo?.price ?? occasionPrices[template.occasionType] ?? template.price;
                  const originalPrice = pricingInfo?.originalPrice ?? template.originalPrice;
                  return (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-xl font-bold text-stone-900">
                          ₹{displayPrice}
                        </span>
                        {originalPrice && originalPrice > displayPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        1 Year Free Hosting Included
                      </span>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-2">
                  <Link
                    href={template.demoUrl}
                    className="p-2.5 rounded-xl border border-stone-300 text-stone-700 hover:border-[#541D2B] hover:text-[#541D2B] transition"
                    title="Preview Live Demo"
                  >
                    <Sparkles size={16} />
                  </Link>
                  <Link
                    href={`/dashboard/create?occasion=birthday`}
                    className="px-4 py-2.5 rounded-xl text-xs font-serif font-bold bg-[#541D2B] text-white hover:bg-[#3E131E] transition shadow-md flex items-center gap-1.5"
                  >
                    <span>Create</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto">
            <Cake size={36} className="mx-auto text-stone-400 mb-3" />
            <h4 className="font-serif text-lg font-bold text-stone-800 mb-1">
              Birthday Celebrations Currently Unavailable
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              Our birthday wonderland collections are currently undergoing seasonal updates. Please explore our other celebration experiences.
            </p>
            <Link
              href="/gifts"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#541D2B] text-white text-xs font-serif font-bold rounded-xl shadow-sm hover:bg-[#3E131E] transition"
            >
              <span>Explore Other Gifts</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </section>

      {/* CROSS-CATEGORY DISCOVERY */}
      <CrossCategoryDiscovery currentCategory="birthday" />

      {/* FOOTER */}
      <footer className="border-t border-stone-200 py-10 text-center text-xs text-stone-500">
        <div className="flex items-center justify-center mb-3">
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
            <span className="font-serif font-bold text-base text-stone-800">
              ExpertoMemories
            </span>
          </Link>
        </div>
        <p>© 2026 ExpertoMemories Studio. All rights reserved.</p>
        <p className="mt-1">
          Bespoke Digital Gifting, Wedding Invitations &amp; Celebration Experiences.
        </p>
      </footer>
    </div>
  );
}
