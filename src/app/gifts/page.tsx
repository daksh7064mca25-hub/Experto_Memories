import { Metadata } from "next";
import Link from "next/link";
import { CATALOGUE_TEMPLATES } from "@/config/catalog";
import {
  Sparkles,
  ArrowRight,
  Heart,
  CheckCircle2,
  Calendar,
  Disc,
  Mail,
  Ticket,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Personalized Digital Gifts | ExpertoMemories Studio",
  description:
    "Explore interactive digital gift websites for Love & Romance, Anniversaries, and Apologies. Personalized with your photos, music, secret letters, and memories.",
  openGraph: {
    title: "Personalized Digital Gifts | ExpertoMemories",
    description: "Heartfelt apology letters, cinematic love stories, and romantic anniversary museums.",
    type: "website",
  },
};

export default function GiftsDiscoveryPage() {
  const giftTemplates = CATALOGUE_TEMPLATES.filter(
    (t) => t.categoryId === "digital-gifts" && t.isActive
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 selection:bg-[#541D2B] selection:text-white font-sans">
      {/* HEADER */}
      <header className="border-b border-stone-200/80 bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#541D2B] group-hover:opacity-90 transition-opacity">
              ExpertoMemories
            </span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#541D2B]/10 text-[#541D2B] border border-[#541D2B]/20">
              Gifts
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-serif font-semibold text-stone-700">
            <Link href="/" className="hover:text-[#541D2B] transition-colors">
              All Celebrations
            </Link>
            <Link href="/gifts" className="text-[#541D2B] border-b-2 border-[#541D2B] pb-1">
              Digital Gifts
            </Link>
            <Link href="/weddings" className="hover:text-[#541D2B] transition-colors">
              Wedding Invitations
            </Link>
            <Link href="/faq" className="hover:text-[#541D2B] transition-colors">
              FAQ
            </Link>
          </nav>

          <Link
            href="/dashboard/create?occasion=love"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#3E131E] transition shadow-md"
          >
            <span>Create Gift</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest mb-6 bg-[#541D2B]/10 text-[#541D2B] border border-[#541D2B]/20">
          <Heart size={13} className="fill-[#541D2B]" />
          <span>Emotion That Lasts Forever</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#541D2B] max-w-4xl mx-auto leading-tight mb-6">
          Gifts That Speak What Words Alone Cannot.
        </h1>

        <p className="text-base sm:text-xl text-stone-700 font-serif italic max-w-2xl mx-auto leading-relaxed mb-10">
          Personalized interactive gift websites crafted to mend hearts, celebrate deep love, and commemorate anniversaries with emotional depth.
        </p>
      </section>

      {/* GIFTS GRID */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {giftTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
            >
              <div className="p-6 pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#541D2B]/10 text-[#541D2B] border border-[#541D2B]/20 inline-block mb-3">
                  {template.badge || "Personalized Experience"}
                </span>

                <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#541D2B] transition-colors leading-snug mb-1">
                  {template.title}
                </h3>
                <p className="text-xs font-serif italic text-rose-700 font-semibold mb-3">
                  {template.designName}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Themes */}
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
                    <CheckCircle2 size={13} className="text-[#541D2B] shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Price & Action Row */}
              <div className="p-6 pt-4 flex items-center justify-between gap-3 bg-white">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-xl font-bold text-stone-900">
                      ₹{template.price}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      ₹{template.originalPrice}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    1 Year Free Hosting Included
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={template.demoUrl}
                    className="p-2.5 rounded-xl border border-stone-300 text-stone-700 hover:border-[#541D2B] hover:text-[#541D2B] transition"
                    title="Preview Live Demo"
                  >
                    <Sparkles size={16} />
                  </Link>
                  <Link
                    href={`/dashboard/create?occasion=${template.occasionType}`}
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
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 py-10 text-center text-xs text-stone-500">
        <p>© 2026 ExpertoMemories Studio. All rights reserved.</p>
        <p className="mt-1">
          Bespoke Digital Gifting, Wedding Invitations &amp; Celebration Experiences.
        </p>
      </footer>
    </div>
  );
}
