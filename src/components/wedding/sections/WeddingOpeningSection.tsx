"use client";

import React, { useState } from "react";
import { WeddingOpeningConfig, WeddingRevealStyle } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Sparkles, Volume2, ArrowDown, Heart, Compass, Send, Flame, Feather, Music } from "lucide-react";
import { HinduMandirOpening } from "./HinduMandirOpening";

interface Props {
  config: WeddingOpeningConfig;
  theme: WeddingThemeStyles;
  onOpenInvitation: () => void;
  isOpen: boolean;
}

export const WeddingOpeningSection: React.FC<Props> = ({
  config,
  theme,
  onOpenInvitation,
  isOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [lampLit, setLampLit] = useState(false);

  const revealStyle: WeddingRevealStyle = config.revealStyle || "palace_doors";

  // Dedicated Hindu Mandir Opening Experience
  if (revealStyle === "mandap_garland" || revealStyle === "hindu_mandir") {
    return (
      <HinduMandirOpening
        config={config}
        theme={theme}
        onOpenInvitation={onOpenInvitation}
        isOpen={isOpen}
      />
    );
  }

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Audio chime cue
    try {
      if (typeof window !== "undefined" && (window as any).AudioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      }
    } catch {}

    setTimeout(() => {
      onOpenInvitation();
    }, 950);
  };

  const handleQuickSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenInvitation();
  };

  // Center Ceremonial Emblem based on cultural tradition
  const renderCeremonialEmblem = () => {
    // 1. South Indian & Vedic Sacred Lamp / Mandap
    if ((revealStyle as string) === "mandap_garland") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-orange-500/30 blur-lg group-hover:blur-xl transition-all" />
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#3D1505] via-[#5C230C] to-[#2B0E05] border-2 border-[#F59E0B] shadow-[0_0_40px_rgba(245,158,11,0.45)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
            {/* Sacred Brass Kuthu Vilakku / Diya Lamp */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-dashed border-[#F59E0B]/60 flex flex-col items-center justify-center p-2 text-[#FBBF24]">
              <div className="relative mb-1">
                <Flame size={26} className="text-amber-400 fill-amber-300 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-extrabold tracking-wider drop-shadow-md text-[#FAF7F2]">
                {config.monogram || "P & V"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-widest uppercase mt-0.5 text-[#F59E0B]">
                शुभ विवाह &bull; VEDIC VIVAH
              </span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Punjabi Shahi / Phulkari & Dhol
    if (revealStyle === "phulkari_dhol") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-rose-500/40 via-amber-500/30 to-fuchsia-500/30 blur-md group-hover:blur-lg transition-all" />
          <div className="relative w-32 h-30 sm:w-40 sm:h-36 rounded-2xl bg-gradient-to-br from-[#380410] via-[#590C1E] to-[#220108] border-2 border-[#F59E0B] shadow-[0_0_35px_rgba(236,72,153,0.4)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
            <div className="w-28 h-26 sm:w-36 sm:h-32 rounded-xl border border-dashed border-[#EC4899]/60 flex flex-col items-center justify-center p-2 text-[#F59E0B]">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#EC4899] flex items-center gap-1">
                🥁 DHOL &amp; PHULKARI
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight mt-0.5 text-[#FAF7F2]">
                {config.monogram || "S & H"}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans text-amber-300">SHAHI JASHN</span>
            </div>
          </div>
        </div>
      );
    }

    // 3. Sikh Anand Karaj
    if (revealStyle === "sunrise_lotus") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-400/40 to-yellow-500/30 blur-lg group-hover:blur-xl transition-all" />
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#2D180F] via-[#4A2818] to-[#1F0E07] border-2 border-[#D97706] shadow-[0_0_40px_rgba(217,119,6,0.45)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-dashed border-[#D97706]/60 flex flex-col items-center justify-center p-2 text-[#FDE68A]">
              <span className="text-xs tracking-[0.2em] font-serif uppercase text-[#FBBF24]">ੴ ANAND KARAJ</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wider my-0.5 text-white">
                {config.monogram || "G & M"}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans text-[#F59E0B]">GURDWARA SAHIB</span>
            </div>
          </div>
        </div>
      );
    }

    // 4. Muslim Noor-e-Nikah
    if (revealStyle === "silk_parchment") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-3 rounded-t-full bg-gradient-to-r from-emerald-500/30 to-amber-500/20 blur-md group-hover:blur-lg transition-all" />
          <div className="relative w-30 h-36 sm:w-38 sm:h-44 rounded-t-full rounded-b-xl bg-gradient-to-br from-[#062419] via-[#0D3828] to-[#041710] border-2 border-[#10B981] shadow-[0_0_35px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105 p-2">
            <div className="w-full h-full rounded-t-full rounded-b-lg border border-dashed border-[#D4AF37]/50 flex flex-col items-center justify-center p-2 text-[#D4AF37]">
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#34D399]">NIKAHNAMA</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wider my-1 text-[#FAF7F2]">
                {config.monogram || "A & Z"}
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans text-[#D4AF37]">MUGHAL FARMAN</span>
            </div>
          </div>
        </div>
      );
    }

    // 5. Christian Holy Matrimony & Ribbon Arch
    if (revealStyle === "ribbon_arch") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-3 rounded-t-full bg-gradient-to-r from-rose-400/30 to-stone-300/20 blur-md group-hover:blur-lg transition-all" />
          <div className="relative w-30 h-36 sm:w-38 sm:h-44 rounded-t-full rounded-b-xl bg-gradient-to-br from-[#2D1623] via-[#422033] to-[#1C0D15] border-2 border-[#F472B6]/60 shadow-[0_0_35px_rgba(244,114,182,0.3)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
            <div className="w-26 h-32 sm:w-34 sm:h-40 rounded-t-full rounded-b-lg border border-dashed border-[#F472B6]/40 flex flex-col items-center justify-center p-2 text-[#FAF7F2]">
              <span className="text-xs font-serif italic text-rose-300">Holy Matrimony</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wider my-1">
                {config.monogram || "S & D"}
              </span>
              <span className="text-[8px] uppercase tracking-widest font-sans text-stone-300">IN GOD&rsquo;S GRACE</span>
            </div>
          </div>
        </div>
      );
    }

    // 6. Modern Minimalist Luxury Gatefold
    if (revealStyle === "architectural_gatefold") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="relative w-30 h-30 sm:w-38 sm:h-38 bg-gradient-to-br from-[#1C2026] via-[#2A313A] to-[#14171C] border-2 border-stone-400/60 shadow-2xl flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105 p-3">
            <div className="w-full h-full border border-stone-500/40 flex flex-col items-center justify-center p-2 text-stone-200">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-stone-400">EDITORIAL ARCHIVE</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight my-1 text-white">
                {config.monogram || "M + J"}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-stone-400">2026</span>
            </div>
          </div>
        </div>
      );
    }

    // 7. Floral Botanical Petals
    if (revealStyle === "blooming_petals") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-lime-400/30 to-emerald-400/20 blur-md group-hover:blur-lg transition-all" />
          <div className="relative w-30 h-30 sm:w-38 sm:h-38 rounded-full bg-gradient-to-br from-[#1A2E1A] via-[#264426] to-[#111F11] border-2 border-[#84CC16]/60 shadow-[0_0_35px_rgba(132,204,22,0.3)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
            <div className="w-26 h-26 sm:w-34 sm:h-34 rounded-full border border-dotted border-[#84CC16]/60 flex flex-col items-center justify-center p-2 text-[#FAF7F2]">
              <span className="text-[10px] font-serif italic text-lime-300">Botanical Garden</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wider my-0.5">
                {config.monogram || "C & L"}
              </span>
              <span className="text-[8px] uppercase tracking-widest font-sans text-stone-300">AMONG BLOSSOMS</span>
            </div>
          </div>
        </div>
      );
    }

    // 8. Luxury Destination Passport
    if (revealStyle === "passport_boarding") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-sky-400/30 to-amber-400/20 blur-md group-hover:blur-lg transition-all" />
          <div className="relative w-34 h-28 sm:w-42 sm:h-34 rounded-2xl bg-gradient-to-br from-[#0A2035] via-[#123659] to-[#061524] border-2 border-[#38BDF8]/60 shadow-[0_0_35px_rgba(56,189,248,0.3)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
            <div className="w-30 h-24 sm:w-38 sm:h-30 rounded-xl border border-dashed border-[#38BDF8]/40 flex flex-col items-center justify-center p-2 text-white">
              <span className="text-[9px] font-mono tracking-widest uppercase text-sky-300 flex items-center gap-1">
                <Compass size={11} />
                <span>BOARDING PASS</span>
              </span>
              <span className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight my-0.5 text-white">
                {config.monogram || "N & K"}
              </span>
              <span className="text-[8px] font-mono tracking-widest text-amber-300">DESTINATION WEDDING</span>
            </div>
          </div>
        </div>
      );
    }

    // 9. Velvet Onyx Wax Seal
    if (revealStyle === "velvet_wax_seal") {
      return (
        <div className="relative mb-5 group cursor-pointer" onClick={handleOpen}>
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400/30 to-stone-500/20 blur-md group-hover:blur-lg transition-all" />
          <div className="relative w-30 h-30 sm:w-38 sm:h-38 rounded-full bg-gradient-to-br from-[#121214] via-[#1D1D22] to-[#0A0A0C] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
            <div className="w-26 h-26 sm:w-34 sm:h-34 rounded-full border border-dashed border-[#D4AF37]/60 flex flex-col items-center justify-center p-2 text-[#D4AF37]">
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5A36A]">BLACK-TIE SOIRÉE</span>
              <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-wider my-0.5 text-white">
                {config.monogram || "T & S"}
              </span>
              <span className="text-[8px] uppercase tracking-widest font-mono text-[#D4AF37]">WAX SEAL</span>
            </div>
          </div>
        </div>
      );
    }

    // Default: Royal Rajwada Palace Doors Monogram
    return (
      <div className="relative mb-6 group cursor-pointer" onClick={handleOpen}>
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#D4AF37]/40 to-[#C5A36A]/20 blur-md group-hover:blur-lg transition-all" />
        <div className="relative w-30 h-30 sm:w-38 sm:h-38 rounded-full bg-gradient-to-br from-[#2E0B14] via-[#48111E] to-[#1F070E] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center transform transition duration-300 group-hover:scale-105">
          <div className="w-26 h-26 sm:w-34 sm:h-34 rounded-full border border-dashed border-[#D4AF37]/60 flex flex-col items-center justify-center p-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-[#D4AF37] drop-shadow-md">
              {config.monogram || "A & R"}
            </span>
            <span className="text-[10px] sm:text-xs text-[#E6D9C8]/80 font-sans uppercase tracking-widest mt-0.5">
              Royal Seal
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full overflow-hidden transition-all duration-1000 ${
        isOpen
          ? "fixed inset-0 z-50 pointer-events-none opacity-0 transition-opacity duration-1000"
          : "fixed inset-0 z-50 flex items-center justify-center"
      }`}
      style={{ perspective: "1200px" }}
    >
      {/* QUICK SKIP TO INVITATION BUTTON (Always accessible in top corner) */}
      <button
        type="button"
        onClick={handleQuickSkip}
        className="absolute top-5 right-5 z-40 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-serif text-[#F5DEB3] hover:text-white transition-all cursor-pointer shadow-lg"
      >
        <span>Skip to Invitation &rarr;</span>
      </button>

      {/* LEFT DOOR / WING PANEL */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full z-20 ${theme.doorBgLeft} border-r border-[#D4AF37]/40 shadow-2xl transition-transform duration-1000 ease-in-out origin-left flex items-center justify-end pr-3 sm:pr-8`}
        style={{
          transform: isOpening || isOpen ? "rotateY(-110deg)" : "rotateY(0deg)",
          backgroundImage: theme.doorPattern,
        }}
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
        {/* Arch filigree */}
        <div className="w-16 h-32 sm:w-28 sm:h-56 rounded-l-full border-2 border-r-0 border-[#D4AF37]/50 flex items-center justify-center opacity-60">
          <div className="w-10 h-20 sm:w-20 sm:h-44 rounded-l-full border border-r-0 border-[#D4AF37]/40" />
        </div>
      </div>

      {/* RIGHT DOOR / WING PANEL */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full z-20 ${theme.doorBgRight} border-l border-[#D4AF37]/40 shadow-2xl transition-transform duration-1000 ease-in-out origin-right flex items-center justify-start pl-3 sm:pr-8`}
        style={{
          transform: isOpening || isOpen ? "rotateY(110deg)" : "rotateY(0deg)",
          backgroundImage: theme.doorPattern,
        }}
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />
        {/* Arch filigree */}
        <div className="w-16 h-32 sm:w-28 sm:h-56 rounded-r-full border-2 border-l-0 border-[#D4AF37]/50 flex items-center justify-center opacity-60">
          <div className="w-10 h-20 sm:w-20 sm:h-44 rounded-r-full border border-l-0 border-[#D4AF37]/40" />
        </div>
      </div>

      {/* CENTER SEAL / INVITATION ANNOUNCEMENT CALLOUT */}
      <div
        className={`relative z-30 flex flex-col items-center justify-center px-6 text-center max-w-xl transition-all duration-700 ${
          isOpening ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Sacred Blessings Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-widest uppercase mb-4 bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5DEB3] shadow-inner backdrop-blur-md">
          <Sparkles size={13} className="text-[#D4AF37] animate-pulse" />
          <span>{config.eyebrow || "With The Blessings of The Almighty"}</span>
          <Sparkles size={13} className="text-[#D4AF37] animate-pulse" />
        </div>

        {/* Sacred Religious Inscription */}
        {config.religiousBlessingText && (
          <p className="text-xs sm:text-sm font-serif italic text-[#D4AF37] max-w-md mx-auto mb-3 px-4 drop-shadow-sm">
            {config.religiousBlessingText}
          </p>
        )}

        {/* Ceremonial Cultural Emblem */}
        {renderCeremonialEmblem()}

        {/* Couple Headline */}
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7F2] mb-2 drop-shadow-lg break-words px-2 max-w-full">
          {config.coupleNames}
        </h2>

        {/* Headline message */}
        <p className="text-sm sm:text-base text-[#E6D9C8] font-serif italic max-w-md mb-2">
          {config.headline}
        </p>

        {/* Wedding Date & City */}
        <p className="text-xs sm:text-sm text-[#D4AF37] font-medium tracking-wide uppercase mb-6">
          {config.weddingDateText}
        </p>

        {/* Ceremonial Action Button */}
        <button
          onClick={handleOpen}
          className={`px-8 py-3.5 rounded-full text-base sm:text-lg font-serif font-semibold transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3 ${theme.buttonPrimary}`}
        >
          <span>{config.actionButtonText || "Open Royal Invitation"}</span>
          <ArrowDown size={18} className="animate-bounce" />
        </button>

        {/* Audio Notice & Prominent Skip Link */}
        <div className="mt-5 flex flex-col items-center gap-2">
          {config.audioNotice && (
            <div className="flex items-center gap-1.5 text-xs text-[#E6D9C8]/75">
              <Volume2 size={13} className="text-[#D4AF37]" />
              <span>{config.audioNotice}</span>
            </div>
          )}
          <button
            onClick={handleQuickSkip}
            className="text-xs text-[#D4AF37]/80 hover:text-[#D4AF37] underline transition-colors pt-1 cursor-pointer"
          >
            {config.skipButtonText || "Skip to Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
};
