import { Metadata } from "next";
import Link from "next/link";
import { CATALOGUE_TEMPLATES } from "@/config/catalog";
import { WeddingStationeryCard } from "@/components/wedding/WeddingStationeryCard";
import {
  Sparkles,
  ArrowRight,
  Heart,
  Calendar,
  MapPin,
  Mail,
  ShieldCheck,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The Wedding Atelier & Collections | ExpertoMemories",
  description:
    "Explore 10 bespoke cultural wedding invitation collections with animated opening ceremonies, multi-event itineraries, Google Maps navigation, and guest RSVP tracking.",
  openGraph: {
    title: "The Wedding Atelier — Bespoke Digital Invitations | ExpertoMemories",
    description: "An invitation experience guests will cherish forever. Cultural opening reveals, venue maps & guest RSVP.",
    type: "website",
  },
};

export default function WeddingsDiscoveryPage() {
  const weddingTemplates = CATALOGUE_TEMPLATES.filter(
    (t) => t.occasionType === "wedding" && t.isActive
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B1B17] selection:bg-[#541D2B] selection:text-white font-sans">
      {/* 1. ATELIER EDITORIAL HEADER */}
      <header className="border-b border-[#EAE3D9] bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#541D2B] group-hover:opacity-90 transition-opacity">
              ExpertoMemories
            </span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#C5A36A]/15 text-[#541D2B] border border-[#C5A36A]/30">
              Wedding Atelier
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-serif font-semibold text-stone-700">
            <Link href="/" className="hover:text-[#541D2B] transition-colors">
              All Celebrations
            </Link>
            <Link href="/gifts" className="hover:text-[#541D2B] transition-colors">
              Digital Gifts
            </Link>
            <Link href="/weddings" className="text-[#541D2B] border-b-2 border-[#541D2B] pb-1">
              Wedding Invitations
            </Link>
            <Link href="/birthdays" className="hover:text-[#541D2B] transition-colors">
              Birthdays
            </Link>
            <Link href="/faq" className="hover:text-[#541D2B] transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/demo/wedding/royal"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-semibold text-stone-700 hover:text-[#541D2B] transition"
            >
              <Sparkles size={13} className="text-[#C5A36A]" />
              <span>Live Sample</span>
            </Link>
            <Link
              href="/dashboard/create?occasion=wedding"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#3E131E] transition shadow-xs hover:shadow-md"
            >
              <span>Create Invitation</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. ATELIER HERO */}
      <section className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-widest mb-6 bg-[#C5A36A]/15 text-[#541D2B] border border-[#C5A36A]/30">
          <Sparkles size={13} className="text-[#C5A36A]" />
          <span>The Wedding Atelier &bull; 10 Cultural Traditions</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#541D2B] max-w-4xl mx-auto leading-[1.1] mb-6">
          An Invitation Crafted for Life&rsquo;s Most Sacred Union.
        </h1>

        <p className="text-base sm:text-xl text-stone-600 font-serif italic max-w-2xl mx-auto leading-relaxed mb-10">
          Move beyond flat static cards and forgotten PDFs. Invite your loved ones through a bespoke digital experience featuring cultural opening reveals, multi-event agendas with Google Maps, and real-time RSVP attendance tracking.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            href="/dashboard/create?occasion=wedding"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-serif font-bold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#3E131E] transition shadow-xl shadow-[#541D2B]/15 hover:scale-102 flex items-center justify-center gap-2"
          >
            <span>Design Your Wedding Invitation</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/demo/wedding/royal"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-serif font-bold bg-white border border-[#EAE3D9] text-stone-800 hover:border-[#541D2B] hover:text-[#541D2B] transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles size={15} className="text-[#C5A36A]" />
            <span>Experience Live Royal Demo</span>
          </Link>
        </div>

        {/* Minimal Feature Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left pt-6 border-t border-[#EAE3D9]">
          {[
            {
              icon: <Sparkles size={16} className="text-[#C5A36A]" />,
              title: "Cultural Opening Ceremonies",
              desc: "Royal palace doors, sacred kalash, dhol beats & silk scrolls.",
            },
            {
              icon: <Calendar size={16} className="text-[#C5A36A]" />,
              title: "Multi-Event Agendas",
              desc: "Haldi, Sangeet, Pheras, Nikah & Reception schedules.",
            },
            {
              icon: <MapPin size={16} className="text-[#C5A36A]" />,
              title: "One-Tap Venue Maps",
              desc: "Direct GPS navigation coordinates for out-of-town guests.",
            },
            {
              icon: <Mail size={16} className="text-[#C5A36A]" />,
              title: "Guest RSVP Intelligence",
              desc: "Track headcount, dietary needs, and family blessings easily.",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/60 border border-[#EAE3D9]">
              <div className="mb-2">{item.icon}</div>
              <h4 className="font-serif font-bold text-xs text-stone-900 mb-0.5">{item.title}</h4>
              <p className="text-[11px] text-stone-500 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE 10 BESPOKE COLLECTIONS (Stationery Atelier Grid) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="collections">
        <div className="text-center mb-14">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#8C7A6B] block mb-2">
            THE ATELIER ARCHIVE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#541D2B] mb-3">
            10 Bespoke Wedding Collections
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-serif italic max-w-xl mx-auto">
            Each collection is thoughtfully designed to honor cultural customs, Vedic rituals, architectural minimalism, and grand celebrations.
          </p>
        </div>

        {/* Clean Luxury Stationery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {weddingTemplates.map((template) => (
            <WeddingStationeryCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* 4. ATELIER PHILOSOPHY */}
      <section className="py-20 bg-[#F4EDE2] border-t border-[#EAE3D9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-[#541D2B] bg-[#541D2B]/10 border border-[#541D2B]/20 mb-3">
            <Heart size={12} className="text-[#541D2B]" />
            <span>The ExpertoMemories Difference</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#541D2B] mb-3">
            Artisanal Heritage Meets Digital Elegance.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-serif italic max-w-xl mx-auto mb-14">
            We believe wedding invitations should carry the emotional gravity and visual splendor of royal stationery, while delivering effortless hospitality for your guests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-3xl bg-white border border-[#EAE3D9] shadow-xs">
              <span className="font-mono text-xs font-bold text-[#C5A36A] uppercase tracking-widest block mb-2">
                01 &bull; Cultural Authenticity
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Respectful Traditions
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Whether celebrating a Vedic vivah with sacred shlokas, an Anand Karaj with serene hymns, or a Nikah with Mughal arches, every detail is authentic and customer-controlled.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EAE3D9] shadow-xs">
              <span className="font-mono text-xs font-bold text-[#C5A36A] uppercase tracking-widest block mb-2">
                02 &bull; Modern Hospitality
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                Real-Time RSVP Intelligence
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Receive instant guest confirmations, attendee counts per event, dietary preferences, and warm family blessings organized cleanly in your customer dashboard.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EAE3D9] shadow-xs">
              <span className="font-mono text-xs font-bold text-[#C5A36A] uppercase tracking-widest block mb-2">
                03 &bull; Effortless Sharing
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                One-Click WhatsApp Invite
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Share a breathtaking private link or QR card on WhatsApp with custom preview cards. Zero paper waste, zero courier delays, and unlimited guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ATELIER FOOTER BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#541D2B] mb-4">
          Ready to Create Your Wedding Story?
        </h2>
        <p className="text-sm sm:text-base text-stone-600 font-serif italic max-w-xl mx-auto mb-8">
          Preview, customize, and edit every word, photo, and event for free. Pay only when you are delighted and ready to publish.
        </p>
        <Link
          href="/dashboard/create?occasion=wedding"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-serif font-bold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#3E131E] transition shadow-xl hover:scale-102"
        >
          <span>Begin Your Invitation Suite</span>
          <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
