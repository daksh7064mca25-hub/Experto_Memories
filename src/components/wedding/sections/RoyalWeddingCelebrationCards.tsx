"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  X,
  ArrowRight,
  Sun,
  Palette,
  Music,
  Flame,
  Wine,
  Compass,
} from "lucide-react";

export interface WeddingEventItem {
  id?: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  address?: string;
  googleMapsUrl?: string;
  dressCode?: string;
  description: string;
}

interface Props {
  events: WeddingEventItem[];
  coupleNames?: string;
}

interface ThemeConfig {
  key: "haldi" | "mehendi" | "sangeet" | "wedding" | "reception";
  badgeName: string;
  ceremonyTag: string;
  subtitle: string;
  glowColor: string;
  accentColor: string;
  featureTags: string[];
  features: string[];
  dressSuggestion: string;
}

const THEME_MAP: Record<string, ThemeConfig> = {
  haldi: {
    key: "haldi",
    badgeName: "Shubh Aarambh",
    ceremonyTag: "Sunshine Celebration",
    subtitle: "Auspicious Turmeric, Floral Holi & High-Energy Dhol Beats",
    glowColor: "rgba(245, 158, 11, 0.22)",
    accentColor: "#D97706",
    featureTags: ["Phoolon Ki Holi", "Turmeric Blessing", "Dhol Beats"],
    features: [
      "Auspicious organic turmeric paste & fragrant chandan application",
      "Vibrant Phoolon Ki Holi with golden marigold & yellow rose petals",
      "High-energy Punjabi dhol beats, festive folk dance & royal thandai",
    ],
    dressSuggestion: "Sunshine Yellow, Mustard, Marigold & Floral Pastels",
  },
  mehendi: {
    key: "mehendi",
    badgeName: "Shringaar & Henna",
    ceremonyTag: "Garden of Henna",
    subtitle: "Rajasthani Henna Artistry, Botanical Jasmine & Folk Melodies",
    glowColor: "rgba(16, 185, 129, 0.20)",
    accentColor: "#059669",
    featureTags: ["Bridal Henna", "Folk Sitar & Geet", "High Tea"],
    features: [
      "Intricate Rajasthani & Arabic bridal henna by master mehndi artists",
      "Traditional folk geet, sitar harmonies & charming bangle stalls",
      "Afternoon royal high tea with Rajasthani savouries & sweets",
    ],
    dressSuggestion: "Emerald Green, Mint, Sage, Olive or Botanical Florals",
  },
  sangeet: {
    key: "sangeet",
    badgeName: "Raas & Dholak",
    ceremonyTag: "The Musical Evening",
    subtitle: "Choreographed Family Performances, Cocktail Soiree & DJ Night",
    glowColor: "rgba(124, 58, 237, 0.20)",
    accentColor: "#7C3AED",
    featureTags: ["Family Dances", "Cocktail Bar", "DJ Night"],
    features: [
      "Dazzling choreographed performances by both families & couple",
      "Live acoustic fusion band, celebrity DJ & midnight dance floor",
      "Signature royal cocktails, artisanal spirits & gourmet street food",
    ],
    dressSuggestion: "Indo-Western Tuxedo, Royal Violet Lehenga or Velvet Sherwani",
  },
  wedding: {
    key: "wedding",
    badgeName: "Shubh Vivah",
    ceremonyTag: "The Sacred Union",
    subtitle: "Royal Procession, Sacred Vedic Agni Vows & Seven Pheras",
    glowColor: "rgba(225, 29, 72, 0.20)",
    accentColor: "#E11D48",
    featureTags: ["Royal Baraat", "Seven Pheras", "Vedic Vows"],
    features: [
      "Grand royal Baraat procession with vintage carriage & brass band",
      "Sacred Vedic hymns chanted by traditional palace priests",
      "Seven sacred pheras around the holy agni under starlit Jaipur skies",
    ],
    dressSuggestion: "Regal Indian Traditional — Royal Crimson, Ivory or Heavy Zari Silk",
  },
  reception: {
    key: "reception",
    badgeName: "Jashn-e-Bahar",
    ceremonyTag: "The Grand Soiree",
    subtitle: "Palatial Gala Dinner, Acoustic Sitar Recital & Midnight Toasts",
    glowColor: "rgba(212, 175, 55, 0.25)",
    accentColor: "#D4AF37",
    featureTags: ["Gala Dinner", "Live Sitar Recital", "Royal Toasts"],
    features: [
      "Red-carpet welcome & official couple portrait session",
      "Multi-course royal gala feast with live culinary specialty counters",
      "Acoustic sitar melodies, celebratory champagne toasts & dance finale",
    ],
    dressSuggestion: "Black-Tie Western Formal, Royal Evening Gown or Embroidered Bandhgala",
  },
};

function resolveEventTheme(evt: WeddingEventItem, index: number): ThemeConfig {
  const text = `${evt.id || ""} ${evt.title || ""} ${evt.description || ""}`.toLowerCase();
  if (text.includes("haldi") || text.includes("phool") || text.includes("turmeric") || text.includes("sunshine")) {
    return THEME_MAP.haldi;
  }
  if (text.includes("mehendi") || text.includes("mehndi") || text.includes("henna")) {
    return THEME_MAP.mehendi;
  }
  if (text.includes("sangeet") || text.includes("dance") || text.includes("music") || text.includes("cocktail")) {
    return THEME_MAP.sangeet;
  }
  if (text.includes("wedding") || text.includes("vivah") || text.includes("phera") || text.includes("ceremony") || text.includes("shaadi")) {
    return THEME_MAP.wedding;
  }
  if (text.includes("reception") || text.includes("dinner") || text.includes("gala") || text.includes("feast")) {
    return THEME_MAP.reception;
  }
  const keys: (keyof typeof THEME_MAP)[] = ["haldi", "mehendi", "sangeet", "wedding", "reception"];
  return THEME_MAP[keys[index % keys.length]];
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  // Strip day of week if present, e.g. "Sunday, December 14, 2026" -> "Dec 14, 2026"
  const withoutDay = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*/i, "");
  // Replace long month names with short month names
  return withoutDay
    .replace(/January/i, "Jan")
    .replace(/February/i, "Feb")
    .replace(/March/i, "Mar")
    .replace(/April/i, "Apr")
    .replace(/August/i, "Aug")
    .replace(/September/i, "Sep")
    .replace(/October/i, "Oct")
    .replace(/November/i, "Nov")
    .replace(/December/i, "Dec");
}

function formatShortTime(timeStr: string): string {
  if (!timeStr) return "";
  // Strip trailing notes after bullet or dash
  const primaryTime = timeStr.split(/[•–-]/)[0].trim();
  return primaryTime;
}

export const RoyalWeddingCelebrationCards: React.FC<Props> = ({ events }) => {
  const [mounted, setMounted] = useState(false);
  const [activeModalEvent, setActiveModalEvent] = useState<{
    event: WeddingEventItem;
    theme: ThemeConfig;
    index: number;
  } | null>(null);

  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Close modal on Escape key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalEvent(null);
      }
    };
    if (activeModalEvent) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeModalEvent]);

  const copyAddress = async (address: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address).catch(() => {});
      }
    } catch {
      // Fallback: silently ignore writeText permission errors
    }
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2400);
  };

  return (
    <div className="w-full">
      {/* SECTION HEADER — Aligned with ExpertoMemories Keepsake Atelier Style */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#C5A36A]" />
          <span className="text-[11px] font-sans font-semibold tracking-[0.22em] uppercase text-[#541D2B]">
            ExpertoMemories Wedding Atelier
          </span>
          <span className="w-4 h-[1px] bg-[#C5A36A]" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
          Wedding Celebrations
        </h2>
        <p className="text-xs sm:text-sm text-[#57534E] font-normal leading-relaxed max-w-lg mx-auto">
          Every sacred ritual holds centuries of heritage and love. Explore each ceremony, timings, attire guide and location below.
        </p>
      </div>

      {/* SYMMETRICAL ATELIER GRID (3 Columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {events.map((evt, idx) => {
          const theme = resolveEventTheme(evt, idx);

          return (
            <div
              key={evt.id || idx}
              onClick={() => setActiveModalEvent({ event: evt, theme, index: idx })}
              className="group relative rounded-3xl bg-[#FCFAF7] border border-[#EAE3D9] hover:border-[#541D2B]/35 shadow-[0_4px_20px_rgba(33,23,21,0.03)] hover:shadow-[0_20px_45px_-15px_rgba(84,29,43,0.12)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer select-none min-h-[440px] sm:min-h-[460px] h-full"
            >
              {/* Subtle Atelier Lighting & Hairline Inset (Exact Homepage Category Match) */}
              <div className="absolute inset-0 bg-radial from-rose-50/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-2.5 rounded-[1.3rem] border border-[#541D2B]/5 pointer-events-none" />

              {/* TOP PANEL META HEADER */}
              <div className="p-6 sm:p-7 pb-0 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#8C7E75]">
                  ATELIER &bull; 0{idx + 1}
                </span>
                <span className="text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full border bg-white/80 text-[#8C7E75] border-[#EAE3D9] group-hover:border-[#541D2B]/20 group-hover:text-[#541D2B] transition-all">
                  {theme.badgeName}
                </span>
              </div>

              {/* CENTERED SUBTLE OBJECT SHOWCASE STAGE */}
              <div className="py-5 sm:py-6 px-6 flex items-center justify-center relative z-10 h-[175px]">
                {/* Ambient Stage Pedestal Glow */}
                <div
                  className="absolute w-36 h-36 rounded-full blur-xl pointer-events-none transition-transform duration-500 group-hover:scale-110 opacity-70"
                  style={{
                    background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
                  }}
                />

                {/* THEMATIC CRAFTED CEREMONIAL OBJECT (Subtle, Clean & Editorial) */}
                {theme.key === "haldi" && (
                  <div className="relative flex flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                    {/* Brass Urli with Floating Golden Petals & Sun Crest */}
                    <div className="relative w-32 h-24 flex items-center justify-center">
                      {/* Urli Outer Brass Bowl */}
                      <div className="w-24 h-16 rounded-full bg-gradient-to-b from-[#FFF5DE] via-[#FDE8B5] to-[#E9C775] border border-[#D4AF37]/60 shadow-md flex items-center justify-center relative overflow-hidden">
                        {/* Shimmer Water Reflection */}
                        <div className="absolute inset-x-2 top-2 h-7 rounded-full bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/30 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/90 border border-[#F59E0B]/40 flex items-center justify-center shadow-xs">
                            <Sun size={15} className="text-[#D97706]" />
                          </div>
                        </div>
                      </div>
                      {/* Delicate Floating Gold Marigold Accents */}
                      <div className="absolute -top-1 -left-2 w-3.5 h-3.5 rounded-full bg-[#F59E0B] border border-white shadow-xs opacity-90" />
                      <div className="absolute top-1 -right-2 w-3 h-3 rounded-full bg-[#D97706] border border-white shadow-xs opacity-85" />
                      <div className="absolute -bottom-1 right-2 w-2.5 h-2.5 rounded-full bg-[#FBBF24] border border-white shadow-xs opacity-80" />
                    </div>
                  </div>
                )}

                {theme.key === "mehendi" && (
                  <div className="relative flex flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                    {/* Ceramic Henna Bowl with Emerald Botanical Vine */}
                    <div className="relative w-32 h-24 flex items-center justify-center">
                      <div className="w-24 h-16 rounded-2xl bg-gradient-to-b from-[#F3F9F5] via-[#E1EFE7] to-[#CDE4D6] border border-[#A7F3D0] shadow-md flex items-center justify-center relative rotate-2">
                        <div className="w-10 h-10 rounded-xl bg-white/95 border border-[#059669]/30 flex items-center justify-center shadow-xs -rotate-2">
                          <Palette size={16} className="text-[#047857]" />
                        </div>
                      </div>
                      {/* Delicate Botanical Leaf Accents */}
                      <div className="absolute -top-1.5 -left-1 text-[11px] text-[#059669] font-mono select-none">
                        ✦
                      </div>
                      <div className="absolute -bottom-1 -right-1 text-[13px] text-[#10B981] font-mono select-none">
                        ✦
                      </div>
                      <div className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-[#059669]/20 border border-[#059669]/40" />
                    </div>
                  </div>
                )}

                {theme.key === "sangeet" && (
                  <div className="relative flex flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                    {/* Royal Musical Medallion with Gold String Accents */}
                    <div className="relative w-32 h-24 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE] border border-[#C4B5FD] shadow-md flex items-center justify-center relative">
                        <div className="w-10 h-10 rounded-full bg-white/95 border border-[#7C3AED]/30 flex items-center justify-center shadow-xs">
                          <Music size={16} className="text-[#6D28D9]" />
                        </div>
                      </div>
                      {/* Starlight Sparkle Accents */}
                      <div className="absolute top-0 -left-1 text-[11px] text-[#7C3AED] select-none">
                        ✦
                      </div>
                      <div className="absolute -top-1 right-1 text-[14px] text-[#8B5CF6] select-none">
                        ✦
                      </div>
                      <div className="absolute -bottom-1 right-2 w-2.5 h-2.5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40" />
                    </div>
                  </div>
                )}

                {theme.key === "wedding" && (
                  <div className="relative flex flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                    {/* Sacred Royal Agni Kund / Ceremonial Urn */}
                    <div className="relative w-32 h-24 flex items-center justify-center">
                      <div className="w-22 h-16 rounded-xl bg-gradient-to-b from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3] border border-[#FDA4AF] shadow-md flex items-center justify-center relative">
                        <div className="w-10 h-10 rounded-lg bg-white/95 border border-[#E11D48]/30 flex items-center justify-center shadow-xs">
                          <Flame size={17} className="text-[#E11D48]" />
                        </div>
                      </div>
                      {/* Sacred Zari & Agni Sparks */}
                      <div className="absolute -top-1.5 left-1 text-[13px] text-[#E11D48] select-none">
                        ✦
                      </div>
                      <div className="absolute top-1 -right-1 text-[11px] text-[#BE123C] select-none">
                        ✦
                      </div>
                      <div className="absolute -bottom-1 left-2 w-2.5 h-2.5 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/40" />
                    </div>
                  </div>
                )}

                {theme.key === "reception" && (
                  <div className="relative flex flex-col items-center justify-center transition-transform duration-500 ease-out group-hover:scale-105">
                    {/* Palatial Celebration Champagne & Crystal Glow */}
                    <div className="relative w-32 h-24 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#FFFDF0] via-[#FEF3C7] to-[#FDE68A] border border-[#FCD34D] shadow-md flex items-center justify-center relative">
                        <div className="w-10 h-10 rounded-full bg-white/95 border border-[#D4AF37]/40 flex items-center justify-center shadow-xs">
                          <Wine size={16} className="text-[#8E641D]" />
                        </div>
                      </div>
                      {/* Effervescent Bubble & Sparkle Accents */}
                      <div className="absolute -top-1 left-0 text-[14px] text-[#D4AF37] select-none">
                        ✦
                      </div>
                      <div className="absolute top-2 -right-1 text-[11px] text-[#B45309] select-none">
                        ✦
                      </div>
                      <div className="absolute -bottom-1 right-2 w-2.5 h-2.5 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37]/50" />
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM PANEL EDITORIAL & LINK STRIP */}
              <div className="p-6 sm:p-7 pt-0 relative z-10 flex-1 flex flex-col justify-between space-y-3.5">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors leading-tight line-clamp-2 min-h-[3.25rem] flex items-center">
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed mt-1 line-clamp-2 min-h-[2.5rem]">
                    {evt.description}
                  </p>
                </div>

                {/* FEATURE TAGS (Homepage Category Style Pills) */}
                <div className="flex flex-wrap items-center gap-1.5 min-h-[2.25rem]">
                  {theme.featureTags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10.5px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#FAF4EB] text-[#8B5E3C] border border-[#EAE3D9]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* SCHEDULE & TIMING METADATA STRIP */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C7E75] pt-0.5 truncate">
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar size={12} className="text-[#C5A36A]" />
                    <span>{formatShortDate(evt.date)}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock size={12} className="text-[#C5A36A]" />
                    <span>{formatShortTime(evt.time)}</span>
                  </span>
                </div>

                {/* ACTION LINK & DRESS CODE STRIP (Exact Reference 2 Style) */}
                <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors shrink-0">
                    <span>Explore Ceremony</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                  <span className="text-[11px] font-mono text-[#8C7E75] truncate max-w-[140px] text-right">
                    {evt.dressCode ? evt.dressCode.split(/[,&]/)[0].trim() : theme.ceremonyTag}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          INTERACTIVE EVENT DETAIL MODAL (Expanded Experience)
         ======================================================== */}
      {mounted &&
        activeModalEvent &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeModalEvent.event.title} Ceremony Details`}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
            onClick={() => setActiveModalEvent(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[88vh] my-auto flex flex-col rounded-3xl border border-[#D4AF37]/50 bg-[#FFFDF9] text-[#211715] shadow-2xl overflow-hidden transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL BANNER HEADER */}
              <div className="shrink-0 p-6 sm:p-8 pb-6 border-b border-[#EAE3D9] bg-gradient-to-b from-[#FFFDF0] via-[#FFFBEB] to-[#FEF3C7]/40 relative overflow-hidden">
                {/* Radial Backdrop Glow */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40"
                  style={{ backgroundColor: activeModalEvent.theme.accentColor }}
                />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveModalEvent(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full border border-[#EAE3D9] bg-white/95 text-[#57534E] hover:text-[#211715] hover:bg-white flex items-center justify-center transition-colors cursor-pointer z-30 shadow-xs"
                  aria-label="Close ceremony details"
                >
                  <X size={18} />
                </button>

                <div className="relative z-10 space-y-2 pr-12">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border bg-white/80 text-[#8C7E75] border-[#EAE3D9]">
                      CEREMONY 0{activeModalEvent.index + 1} &bull; {activeModalEvent.theme.badgeName}
                    </span>
                    <span className="text-xs font-serif text-[#C5A36A]">✦</span>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#8C7E75]">
                      {activeModalEvent.theme.ceremonyTag}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#3E141B]">
                    {activeModalEvent.event.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-sans font-medium text-[#8B5E3C]">
                    {activeModalEvent.theme.subtitle}
                  </p>
                </div>
              </div>

              {/* MODAL SCROLLABLE BODY */}
              <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
                {/* Full Description & Cultural Context */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C7E75] font-bold">
                    Ceremonial Narrative &amp; Significance
                  </h4>
                  <p className="text-sm leading-relaxed font-sans opacity-90 text-[#3E141B]">
                    {activeModalEvent.event.description}
                  </p>
                </div>

                {/* Ceremonial Highlights */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C7E75] font-bold">
                    Key Rituals &amp; Celebrations
                  </h4>
                  <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
                    {activeModalEvent.theme.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-3 rounded-xl border border-[#EAE3D9] bg-[#FAF7F2] flex items-start gap-3"
                      >
                        <Sparkles
                          size={15}
                          className="shrink-0 mt-0.5"
                          style={{ color: activeModalEvent.theme.accentColor }}
                        />
                        <span className="leading-snug text-[#2E0B14]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule, Muhurtham & Dress Code Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-[#EAE3D9] bg-white space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#8C7E75]">
                      <Clock size={14} style={{ color: activeModalEvent.theme.accentColor }} />
                      <span>Auspicious Timing</span>
                    </div>
                    <p className="font-serif text-base font-bold text-[#3E141B]">
                      {activeModalEvent.event.time}
                    </p>
                    <p className="text-xs text-[#8C7E75]">
                      {activeModalEvent.event.date}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#EAE3D9] bg-white space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#8C7E75]">
                      <Palette size={14} style={{ color: activeModalEvent.theme.accentColor }} />
                      <span>Attire &amp; Dress Code</span>
                    </div>
                    <p className="font-serif text-base font-bold text-[#3E141B]">
                      {activeModalEvent.event.dressCode || "Regal Indian Traditional"}
                    </p>
                    <p className="text-xs text-[#8C7E75]">
                      {activeModalEvent.theme.dressSuggestion}
                    </p>
                  </div>
                </div>

                {/* Venue & Location Details with Quick Copy */}
                <div className="p-5 rounded-2xl border border-[#E2D4BA] bg-[#FFFDF9] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#8C7E75]">
                      <Compass size={14} style={{ color: activeModalEvent.theme.accentColor }} />
                      <span>Venue &amp; Hospitality</span>
                    </div>
                    {activeModalEvent.event.address && (
                      <button
                        type="button"
                        onClick={() => copyAddress(activeModalEvent.event.address!)}
                        className={`inline-flex items-center gap-1.5 text-xs font-sans font-medium px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                          copiedAddress
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-white text-[#57534E] border-[#EAE3D9] hover:bg-stone-50"
                        }`}
                      >
                        {copiedAddress ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span>Copied Address</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Address</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div>
                    <h5 className="font-serif text-lg font-bold text-[#3E141B]">
                      {activeModalEvent.event.venueName}
                    </h5>
                    {activeModalEvent.event.address && (
                      <p className="text-xs leading-relaxed text-[#8C7E75] mt-1 flex items-start gap-1.5">
                        <MapPin size={13} className="shrink-0 mt-0.5" />
                        <span>{activeModalEvent.event.address}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER ACTIONS */}
              <div className="shrink-0 p-6 sm:p-8 pt-4 border-t border-[#EAE3D9] bg-[#FAF7F2] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalEvent(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-sans font-semibold border border-[#D8CDBD] text-[#57534E] hover:bg-[#EAE3D9] transition-colors cursor-pointer"
                >
                  Close Details
                </button>

                <div className="w-full sm:w-auto flex items-center gap-3">
                  {activeModalEvent.event.googleMapsUrl && (
                    <a
                      href={activeModalEvent.event.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-sans font-bold flex items-center justify-center gap-2 bg-[#541D2B] hover:bg-[#3D141E] text-white transition-all shadow-md cursor-pointer"
                    >
                      <ExternalLink size={14} />
                      <span>Get Directions on Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default RoyalWeddingCelebrationCards;
