"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Eye, Sparkles, Music, Flame } from "lucide-react";
import { CatalogueTemplate } from "@/config/catalog";

function getCeremonialDetails(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("royal") || s.includes("rajwada")) {
    return {
      reveal: "Palace Doors Reveal",
      music: "Royal Shehnai",
      symbol: "Jharokha Arch",
    };
  }
  if (s.includes("hindu") || s.includes("traditional")) {
    return {
      reveal: "Sacred Diya Lamp",
      music: "Vedic Nadaswaram",
      symbol: "Kalash & Shlokas",
    };
  }
  if (s.includes("punjabi")) {
    return {
      reveal: "Phulkari Unfold",
      music: "Joyful Dhol",
      symbol: "Embroidered Phulkari",
    };
  }
  if (s.includes("sikh") || s.includes("anand")) {
    return {
      reveal: "Golden Gurdwara Canopy",
      music: "Anand Karaj Shabad",
      symbol: "ੴ Ik Onkar",
    };
  }
  if (s.includes("muslim") || s.includes("nikah")) {
    return {
      reveal: "Mughal Jaali Pavilion",
      music: "Sufi Instrumental",
      symbol: "Nikahnama Farman",
    };
  }
  if (s.includes("christian")) {
    return {
      reveal: "Ribbon Vellum Arch",
      music: "Cathedral Strings",
      symbol: "Holy Matrimony",
    };
  }
  if (s.includes("minimal")) {
    return {
      reveal: "Editorial Tri-Fold",
      music: "Contemporary Piano",
      symbol: "Architectural Linen",
    };
  }
  if (s.includes("floral")) {
    return {
      reveal: "Botanical Cascade",
      music: "Floral Romance",
      symbol: "Blush Blossoms",
    };
  }
  if (s.includes("destination")) {
    return {
      reveal: "Passport Boarding Pass",
      music: "Coastal Romance",
      symbol: "Compass & Horizon",
    };
  }
  return {
    reveal: "Black-Tie Wax Seal",
    music: "Nocturne Strings",
    symbol: "Velvet Portfolio",
  };
}

interface Props {
  template: CatalogueTemplate;
}

// Cultural emblem rendering for each stationery suite
function CulturalEmblem({ type, color }: { type?: string; color: string }) {
  switch (type) {
    case "jharokha":
      return (
        <div className="w-12 h-16 rounded-t-full border-2 border-dashed flex flex-col items-center justify-center p-1" style={{ borderColor: color }}>
          <div className="w-8 h-10 rounded-t-full border flex items-center justify-center" style={{ borderColor: color }}>
            <span className="font-serif text-xs font-bold" style={{ color }}>A&amp;R</span>
          </div>
        </div>
      );
    case "kalash":
      return (
        <div className="w-14 h-14 rounded-full border border-dashed flex flex-col items-center justify-center p-1" style={{ borderColor: color }}>
          <span className="text-[10px] font-serif font-bold tracking-widest" style={{ color }}>P &amp; V</span>
          <span className="text-[8px] uppercase tracking-wider opacity-80" style={{ color }}>शुभ विवाह</span>
        </div>
      );
    case "dhol":
      return (
        <div className="w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center rotate-3" style={{ borderColor: color }}>
          <span className="font-serif text-xs font-bold" style={{ color }}>S &amp; H</span>
          <span className="text-[8px] uppercase tracking-widest font-mono" style={{ color }}>SHAHI</span>
        </div>
      );
    case "lotus":
      return (
        <div className="w-14 h-14 rounded-full border border-dashed flex flex-col items-center justify-center" style={{ borderColor: color }}>
          <span className="font-serif text-xs font-bold" style={{ color }}>G &amp; M</span>
          <span className="text-[8px] uppercase tracking-widest" style={{ color }}>ANAND</span>
        </div>
      );
    case "arch":
      return (
        <div className="w-12 h-16 rounded-t-full border-2 flex flex-col items-center justify-center p-1" style={{ borderColor: color }}>
          <span className="text-[10px] font-serif font-bold" style={{ color }}>A &amp; Z</span>
          <span className="text-[7px] uppercase tracking-widest font-sans" style={{ color }}>NIKAH</span>
        </div>
      );
    case "cathedral":
      return (
        <div className="w-12 h-16 rounded-t-full border border-dashed flex flex-col items-center justify-center p-1" style={{ borderColor: color }}>
          <span className="font-serif text-xs font-bold" style={{ color }}>S &amp; D</span>
          <span className="text-[7px] uppercase tracking-widest font-serif" style={{ color }}>GRACE</span>
        </div>
      );
    case "gatefold":
      return (
        <div className="w-14 h-14 border flex flex-col items-center justify-center" style={{ borderColor: color }}>
          <span className="font-mono text-xs font-bold tracking-widest" style={{ color }}>M+J</span>
          <span className="text-[7px] uppercase tracking-widest font-mono" style={{ color }}>2026</span>
        </div>
      );
    case "floral":
      return (
        <div className="w-14 h-14 rounded-full border-2 border-dotted flex flex-col items-center justify-center" style={{ borderColor: color }}>
          <span className="font-serif text-xs font-bold italic" style={{ color }}>C &amp; L</span>
          <span className="text-[8px] uppercase tracking-widest" style={{ color }}>BLOOM</span>
        </div>
      );
    case "compass":
      return (
        <div className="w-14 h-14 rounded-full border flex flex-col items-center justify-center" style={{ borderColor: color }}>
          <span className="font-serif text-xs font-bold" style={{ color }}>N &amp; K</span>
          <span className="text-[7px] uppercase tracking-widest font-mono" style={{ color }}>PASSPORT</span>
        </div>
      );
    case "velvet":
    default:
      return (
        <div className="w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center shadow-inner" style={{ borderColor: color }}>
          <span className="font-serif text-xs font-bold" style={{ color }}>T &amp; S</span>
          <span className="text-[7px] uppercase tracking-widest font-mono" style={{ color }}>SOIRÉE</span>
        </div>
      );
  }
}

export const WeddingStationeryCard: React.FC<Props> = ({ template }) => {
  const shortSlug = template.shortSlug || template.slug.replace("-wedding", "");
  const demoUrl = `/demo/wedding/${shortSlug}`;
  const createUrl = `/dashboard/create?occasion=wedding&collection=${template.slug}`;
  const ceremonial = getCeremonialDetails(template.slug);
  const colorway = template.cardColorway || {
    cardBg: "from-[#2A0812] via-[#3D0C1A] to-[#1A040A]",
    cardBorder: "border-[#D4AF37]/40",
    badgeBg: "bg-[#D4AF37]/15",
    badgeText: "text-[#D4AF37]",
    accentGold: "#D4AF37",
    ornament: "jharokha",
  };

  return (
    <article className="group flex flex-col justify-between rounded-3xl bg-[#FAF7F2] border border-[#E8E1D5] shadow-xs hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1.5">
      {/* 1. LUXURY INVITATION STATIONERY ARTWORK PREVIEW */}
      <div className="relative p-6 sm:p-7 bg-gradient-to-b from-[#F2ECE1] to-[#EAE3D4] flex items-center justify-center overflow-hidden border-b border-[#E8E1D5]">
        {/* Ambient Subtle Lighting Glow */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.15),transparent_70%)]" />

        {/* Stationery Canvas Frame */}
        <div
          className={`relative w-full max-w-[320px] aspect-[4/5] rounded-2xl bg-gradient-to-br ${colorway.cardBg} border ${colorway.cardBorder} p-5 sm:p-6 flex flex-col justify-between items-center text-center shadow-xl transform transition-transform duration-500 group-hover:scale-[1.02]`}
        >
          {/* Deckle Edge Double Gold Foil Border */}
          <div
            className="absolute inset-2.5 rounded-xl border border-dashed pointer-events-none opacity-40"
            style={{ borderColor: colorway.accentGold }}
          />

          {/* Top Foil Tag */}
          <div className="relative z-10 pt-1">
            <span
              className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full border backdrop-blur-xs"
              style={{
                borderColor: `${colorway.accentGold}40`,
                backgroundColor: `${colorway.accentGold}15`,
                color: colorway.accentGold,
              }}
            >
              Wedding Invitation
            </span>
          </div>

          {/* Center Emblem & Calligraphy Monogram */}
          <div className="relative z-10 flex flex-col items-center my-auto py-2">
            <CulturalEmblem type={colorway.ornament} color={colorway.accentGold} />
            <h4
              className="font-serif text-lg sm:text-xl font-bold tracking-tight mt-3 mb-1"
              style={{ color: "#FAF7F2" }}
            >
              {template.title}
            </h4>
            <p
              className="text-[11px] font-serif italic tracking-wide"
              style={{ color: colorway.accentGold }}
            >
              {template.designName}
            </p>
          </div>

          {/* Bottom Card Footer */}
          <div className="relative z-10 w-full pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-stone-300/80">
            <span>JAIPUR &bull; 2026</span>
            <span className="flex items-center gap-1" style={{ color: colorway.accentGold }}>
              <Sparkles size={11} />
              <span>RSVP</span>
            </span>
          </div>

          {/* Subtle Hover Overlay with Direct Quick Preview Pill */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4 rounded-2xl z-20">
            <Link
              href={demoUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-bold bg-[#FAF7F2] text-stone-900 shadow-lg hover:bg-white transition transform hover:scale-105"
            >
              <Eye size={13} className="text-[#C5A36A]" />
              <span>Preview Live Demo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL METADATA & ACTIONS (Minimal, Clean, Luxury) */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
        <div>
          {/* Collection Eyebrow Badge */}
          <div className="mb-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#8C7A6B]">
              {template.collectionLabel || template.designName}
            </span>
          </div>

          {/* Collection Name */}
          <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#541D2B] transition-colors leading-snug">
            {template.title}
          </h3>

          {/* One Short Emotional Editorial Description */}
          <p className="text-xs sm:text-sm font-serif italic text-stone-600 mt-2 leading-relaxed">
            &ldquo;{template.editorialSubtitle || template.tagline || template.description}&rdquo;
          </p>

          {/* Cultural Ceremonial & Music Highlights */}
          <div className="mt-3.5 pt-3 border-t border-[#EAE3D9]/60 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5A36A]/10 text-[10px] font-serif font-bold text-[#541D2B] border border-[#C5A36A]/25">
              <Sparkles size={10} className="text-[#C5A36A]" />
              <span>{ceremonial.reveal}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-[10px] font-mono text-stone-600 border border-stone-200">
              <Music size={10} className="text-stone-500" />
              <span>{ceremonial.music}</span>
            </span>
          </div>
        </div>

        {/* 3. TASTEFUL ACTION STRIP */}
        <div className="mt-6 pt-5 border-t border-[#EAE3D9] flex items-center justify-between gap-3">
          <Link
            href={demoUrl}
            className="inline-flex items-center gap-1.5 text-xs font-serif font-semibold text-stone-700 hover:text-[#541D2B] transition"
          >
            <Eye size={14} className="text-[#C5A36A]" />
            <span>View Demo</span>
          </Link>

          <Link
            href={createUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#3E131E] transition shadow-xs hover:shadow-md hover:scale-102"
          >
            <span>Explore Design</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
};
