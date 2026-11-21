"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

export function KeepsakeAtelierSection() {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );
  }, []);

  const togglePanel = (index: number) => {
    setActivePanel((prev) => (prev === index ? null : index));
  };

  return (
    <div
      id="atelier"
      aria-label="Keepsake Atelier Collections"
      className="mb-20 sm:mb-24 w-full scroll-mt-20"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#C5A36A]" />
          <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
            ExpertoMemories Keepsake Atelier
          </span>
          <span className="w-4 h-[1px] bg-[#C5A36A]" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
          Made for the Moments That Matter.
        </h2>
        <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
          Every celebration has a story. Give yours an unforgettable digital home.
        </p>
      </div>

      {/* THREE SYMMETRICAL KEEPSAKE PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* =========================================================================
            PANEL 1: DIGITAL GIFTS — WAX-SEALED CREAM ENVELOPE & SLIDING LETTER
        ========================================================================= */}
        <div
          className={`group relative rounded-3xl bg-[#FCFAF7] border transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer select-none min-h-[440px] sm:min-h-[460px] ${
            activePanel === 1
              ? "border-[#541D2B]/40 shadow-[0_20px_45px_-15px_rgba(84,29,43,0.14)] -translate-y-1.5"
              : "border-[#EAE3D9] hover:border-[#541D2B]/35 shadow-[0_4px_20px_rgba(33,23,21,0.03)] hover:shadow-[0_20px_45px_-15px_rgba(84,29,43,0.12)] hover:-translate-y-1"
          }`}
          onMouseEnter={() => !isTouch && setActivePanel(1)}
          onMouseLeave={() => !isTouch && setActivePanel(null)}
          onClick={() => togglePanel(1)}
        >
          {/* Subtle Atelier Lighting & Hairline Inset */}
          <div className="absolute inset-0 bg-radial from-rose-50/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-2.5 rounded-[1.3rem] border border-[#541D2B]/5 pointer-events-none" />

          {/* Top Panel Meta Header */}
          <div className="p-6 sm:p-7 pb-0 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#8C7E75]">
              Atelier &bull; 01
            </span>
            <span
              className={`text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
                activePanel === 1
                  ? "bg-[#541D2B] text-[#FAF7F2] border-[#541D2B]"
                  : "bg-white/80 text-[#8C7E75] border-[#EAE3D9] group-hover:border-[#541D2B]/20 group-hover:text-[#541D2B]"
              }`}
            >
              {activePanel === 1
                ? "Letter Revealed"
                : isTouch
                ? "Tap to Open"
                : "Hover to Open"}
            </span>
          </div>

          {/* Centered Object Showcase Stage */}
          <div className="py-6 sm:py-8 px-6 flex items-center justify-center relative z-10 min-h-[220px]">
            {/* Ambient Stage Pedestal Glow */}
            <div className="absolute w-44 h-44 rounded-full bg-gradient-to-b from-[#FAF4EB] to-[#F2EAE0]/50 blur-xl pointer-events-none" />

            {/* THE WAX-SEALED ENVELOPE OBJECT */}
            <div
              className="relative w-[190px] h-[130px] transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ perspective: "1000px" }}
            >
              {/* Back Shell of Envelope */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#EFE8DD] to-[#E5DCCE] border border-[#D8CDBD] shadow-md" />

              {/* Inner Sliding Handwritten Letter */}
              <div
                className={`absolute left-2.5 right-2.5 h-[125px] rounded-xl bg-[#FFFDF9] border border-[#EAE3D9] p-3 shadow-md transition-all duration-700 ease-out flex flex-col justify-between ${
                  activePanel === 1
                    ? "-translate-y-16 sm:-translate-y-18 shadow-xl scale-[1.02] z-20"
                    : "translate-y-1 z-0 opacity-80"
                }`}
              >
                {/* Letter Header with Delicate Gold Foil Crest */}
                <div className="flex items-center justify-between border-b border-[#F2EDE5] pb-1.5">
                  <div className="flex items-center gap-1.5 text-[9.5px] font-serif italic text-[#541D2B] font-semibold">
                    <Heart size={9} className="fill-[#541D2B] text-[#541D2B]" />
                    <span>My Dearest Love</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A]" />
                </div>

                {/* Faux Calligraphy Script Lines */}
                <div className="space-y-1.5 py-1">
                  <div className="h-1 bg-gradient-to-r from-[#541D2B]/35 via-[#541D2B]/20 to-transparent rounded-full w-full" />
                  <div className="h-1 bg-gradient-to-r from-[#541D2B]/30 via-[#541D2B]/15 to-transparent rounded-full w-4/5" />
                  <div className="h-1 bg-gradient-to-r from-[#541D2B]/25 via-[#541D2B]/10 to-transparent rounded-full w-3/4" />
                </div>

                {/* Handwritten Sentiment Sign-off */}
                <div className="pt-1 flex items-center justify-between text-[8px] font-serif italic text-[#8C7E75]">
                  <span>Yours forever &amp; always</span>
                  <span className="font-mono text-[7px] text-[#C5A36A] font-bold">
                    ✦ EM
                  </span>
                </div>
              </div>

              {/* Front Lower Pocket of Envelope (triangular cutout) */}
              <div
                className="absolute inset-x-0 bottom-0 h-[85px] rounded-b-2xl bg-gradient-to-t from-[#F8F3EA] via-[#FAF6F0] to-[#F1E9DE] border-t border-l border-r border-[#E0D5C5] shadow-xs z-10 overflow-hidden"
                style={{
                  clipPath: "polygon(0 0, 50% 35%, 100% 0, 100% 100%, 0 100%)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-[1px] bg-[#C5A36A]/20" />
              </div>

              {/* Left & Right Triangular Side Folds */}
              <div
                className="absolute inset-x-0 bottom-0 h-[85px] pointer-events-none z-10"
                style={{
                  clipPath: "polygon(0 0, 35% 50%, 0 100%)",
                  backgroundColor: "rgba(224, 213, 197, 0.45)",
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[85px] pointer-events-none z-10"
                style={{
                  clipPath: "polygon(100% 0, 65% 50%, 100% 100%)",
                  backgroundColor: "rgba(224, 213, 197, 0.45)",
                }}
              />

              {/* Top Triangular Flap with 3D Flip Open */}
              <div
                className="absolute inset-x-0 top-0 h-[68px] z-30 transition-transform duration-700 ease-out origin-top"
                style={{
                  transformStyle: "preserve-3d",
                  transform:
                    activePanel === 1 ? "rotateX(175deg)" : "rotateX(0deg)",
                }}
              >
                {/* Outer Flap Face */}
                <div
                  className="w-full h-full bg-gradient-to-b from-[#F5EFE4] to-[#ECE3D4] border-b border-[#DDD2C0] shadow-sm flex items-center justify-center relative"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </div>

                {/* Burgundy Wax Heart Seal Affixed to the Flap Point */}
                <div
                  className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#732439] via-[#541D2B] to-[#360F1A] border border-[#3E131E] shadow-md flex items-center justify-center transition-all duration-500 ${
                    activePanel === 1
                      ? "scale-90 opacity-40 shadow-none"
                      : "scale-100 opacity-100 shadow-[0_4px_10px_rgba(84,29,43,0.35)]"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-5 h-5 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-black/15">
                    <Heart
                      size={10}
                      className="fill-[#D4AF37] text-[#D4AF37] drop-shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel Editorial & Link Strip */}
          <div className="p-6 sm:p-7 pt-0 relative z-10 space-y-3">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors leading-snug">
                Personalized Digital Gifts
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed mt-1">
                Wax-sealed letters, photo scrapbooks, constellation maps &amp; private romantic keepsakes.
              </p>
            </div>

            <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between">
              <Link
                href="/gifts"
                className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#541D2B] group-hover:text-[#3B111D] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Explore Digital Gifts</span>
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <span className="text-[10px] font-mono text-[#A8A29E]">
                4 Experiences
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 2: WEDDING INVITATIONS — UNFOLDING IVORY & GOLD FOLIO
        ========================================================================= */}
        <div
          className={`group relative rounded-3xl bg-[#FCFAF7] border transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer select-none min-h-[440px] sm:min-h-[460px] ${
            activePanel === 2
              ? "border-[#D4AF37]/60 shadow-[0_20px_45px_-15px_rgba(212,175,55,0.18)] -translate-y-1.5"
              : "border-[#EAE3D9] hover:border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(33,23,21,0.03)] hover:shadow-[0_20px_45px_-15px_rgba(212,175,55,0.14)] hover:-translate-y-1"
          }`}
          onMouseEnter={() => !isTouch && setActivePanel(2)}
          onMouseLeave={() => !isTouch && setActivePanel(null)}
          onClick={() => togglePanel(2)}
        >
          {/* Subtle Atelier Lighting & Hairline Inset */}
          <div className="absolute inset-0 bg-radial from-amber-50/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-2.5 rounded-[1.3rem] border border-[#D4AF37]/10 pointer-events-none" />

          {/* Top Panel Meta Header */}
          <div className="p-6 sm:p-7 pb-0 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#8C7E75]">
              Atelier &bull; 02
            </span>
            <span
              className={`text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
                activePanel === 2
                  ? "bg-[#D4AF37] text-stone-900 border-[#D4AF37] font-semibold"
                  : "bg-white/80 text-[#8C7E75] border-[#EAE3D9] group-hover:border-[#D4AF37]/40 group-hover:text-[#8E641D]"
              }`}
            >
              {activePanel === 2
                ? "Folio Unfolded"
                : isTouch
                ? "Tap to Unfold"
                : "Hover to Unfold"}
            </span>
          </div>

          {/* Centered Object Showcase Stage */}
          <div className="py-6 sm:py-8 px-6 flex items-center justify-center relative z-10 min-h-[220px]">
            {/* Ambient Stage Pedestal Glow */}
            <div
              className={`absolute w-44 h-44 rounded-full blur-xl transition-all duration-500 pointer-events-none ${
                activePanel === 2
                  ? "bg-[#D4AF37]/25 scale-110"
                  : "bg-[#F3EDE2]/60 scale-100"
              }`}
            />

            {/* THE WEDDING GATEFOLD FOLIO OBJECT */}
            <div
              className="relative w-[184px] h-[134px] rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ perspective: "1000px" }}
            >
              {/* INNER INVITATION CARD (Revealed when flaps open) */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF6ED] border-2 border-[#D4AF37]/40 p-3 flex flex-col items-center justify-between text-center overflow-hidden z-0 shadow-inner">
                {/* Decorative Royal Gold Arch & Jharokha Motif */}
                <div className="w-full flex items-center justify-center gap-1.5 pt-0.5">
                  <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <Sparkles size={11} className="text-[#D4AF37]" />
                  <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>

                <div className="space-y-0.5">
                  <p className="text-[7.5px] font-serif uppercase tracking-[0.25em] text-[#8E641D]">
                    Together With Their Families
                  </p>
                  <p className="font-serif text-sm font-bold text-[#211715] tracking-tight">
                    Aanya &amp; Kabir
                  </p>
                  <p className="text-[7px] font-serif italic text-[#C5A36A]">
                    Request the honor of your presence
                  </p>
                </div>

                {/* Inner Ceremony Date & Vedic Motif */}
                <div className="border-t border-[#D4AF37]/25 pt-1 w-full flex items-center justify-between text-[7px] font-mono text-[#8C7E75] px-1">
                  <span>Royal Vivah</span>
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Grand Palace</span>
                </div>
              </div>

              {/* LEFT GATEFOLD FLAP (3D Fold with Front & Back Sides) */}
              <div
                className="absolute inset-y-0 left-0 w-[92px] rounded-l-xl z-20 origin-left transition-transform duration-700 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform:
                    activePanel === 2 ? "rotateY(-130deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front of Left Flap */}
                <div
                  className="absolute inset-0 rounded-l-xl bg-gradient-to-r from-[#FAF6EE] to-[#F4EDE0] border-t border-b border-l border-[#D4AF37]/45 p-2 flex flex-col justify-between items-end overflow-hidden shadow-sm"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="absolute inset-0 bg-radial from-white/30 to-transparent pointer-events-none" />
                  <div className="text-[8px] font-serif text-[#D4AF37]/50 pt-1">
                    ✦
                  </div>
                  {/* Left Half of Royal Gold Crest Medallion */}
                  <div className="w-5 h-10 rounded-l-full bg-gradient-to-l from-[#C5A36A] to-[#D4AF37] border-t border-b border-l border-[#B89635] flex items-center justify-end pr-0.5 shadow-sm">
                    <span className="text-[9px] font-serif font-bold text-white leading-none">
                      A
                    </span>
                  </div>
                  <div className="text-[8px] font-serif text-[#D4AF37]/50 pb-1">
                    ✦
                  </div>
                </div>

                {/* Back of Left Flap (Champagne Silk Inner Lining) */}
                <div
                  className="absolute inset-0 rounded-l-xl bg-gradient-to-r from-[#F7F2E8] to-[#EFE5D3] border-t border-b border-r border-[#D4AF37]/30 p-2 flex flex-col justify-between items-start overflow-hidden shadow-inner"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-[8px] text-[#C5A36A]">✦</span>
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="w-6 h-[1px] bg-[#D4AF37]/30" />
                  </div>
                  <span className="text-[8px] text-[#C5A36A]">✦</span>
                </div>
              </div>

              {/* RIGHT GATEFOLD FLAP (3D Fold with Front & Back Sides) */}
              <div
                className="absolute inset-y-0 right-0 w-[92px] rounded-r-xl z-20 origin-right transition-transform duration-700 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform:
                    activePanel === 2 ? "rotateY(130deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front of Right Flap */}
                <div
                  className="absolute inset-0 rounded-r-xl bg-gradient-to-l from-[#FAF6EE] to-[#F4EDE0] border-t border-b border-r border-[#D4AF37]/45 p-2 flex flex-col justify-between items-start overflow-hidden shadow-sm"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="absolute inset-0 bg-radial from-white/30 to-transparent pointer-events-none" />
                  <div className="text-[8px] font-serif text-[#D4AF37]/50 pt-1">
                    ✦
                  </div>
                  {/* Right Half of Royal Gold Crest Medallion */}
                  <div className="w-5 h-10 rounded-r-full bg-gradient-to-r from-[#C5A36A] to-[#D4AF37] border-t border-b border-r border-[#B89635] flex items-center justify-start pl-0.5 shadow-sm">
                    <span className="text-[9px] font-serif font-bold text-white leading-none">
                      K
                    </span>
                  </div>
                  <div className="text-[8px] font-serif text-[#D4AF37]/50 pb-1">
                    ✦
                  </div>
                </div>

                {/* Back of Right Flap (Champagne Silk Inner Lining) */}
                <div
                  className="absolute inset-0 rounded-r-xl bg-gradient-to-l from-[#F7F2E8] to-[#EFE5D3] border-t border-b border-l border-[#D4AF37]/30 p-2 flex flex-col justify-between items-end overflow-hidden shadow-inner"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-[8px] text-[#C5A36A]">✦</span>
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="w-6 h-[1px] bg-[#D4AF37]/30" />
                  </div>
                  <span className="text-[8px] text-[#C5A36A]">✦</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel Editorial & Link Strip */}
          <div className="p-6 sm:p-7 pt-0 relative z-10 space-y-3">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#211715] group-hover:text-[#8E641D] transition-colors leading-snug">
                Digital Wedding Invitations
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed mt-1">
                10 bespoke cultural collections with animated ceremonial reveals, agendas &amp; RSVP tracking.
              </p>
            </div>

            <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between">
              <Link
                href="/weddings"
                className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#8E641D] group-hover:text-[#5A3F10] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Explore Wedding Atelier</span>
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <span className="text-[10px] font-mono text-[#A8A29E]">
                10 Collections
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 3: BIRTHDAY WONDERLANDS — ATELIER CAKE & IGNITED CANDLE
        ========================================================================= */}
        <div
          className={`group relative rounded-3xl bg-[#FCFAF7] border transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer select-none min-h-[440px] sm:min-h-[460px] ${
            activePanel === 3
              ? "border-[#D97706]/50 shadow-[0_20px_45px_-15px_rgba(217,119,6,0.15)] -translate-y-1.5"
              : "border-[#EAE3D9] hover:border-[#D97706]/40 shadow-[0_4px_20px_rgba(33,23,21,0.03)] hover:shadow-[0_20px_45px_-15px_rgba(217,119,6,0.12)] hover:-translate-y-1"
          }`}
          onMouseEnter={() => !isTouch && setActivePanel(3)}
          onMouseLeave={() => !isTouch && setActivePanel(null)}
          onClick={() => togglePanel(3)}
        >
          {/* Subtle Atelier Lighting & Hairline Inset */}
          <div className="absolute inset-0 bg-radial from-amber-50/25 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-2.5 rounded-[1.3rem] border border-[#D97706]/10 pointer-events-none" />

          {/* Top Panel Meta Header */}
          <div className="p-6 sm:p-7 pb-0 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#8C7E75]">
              Atelier &bull; 03
            </span>
            <span
              className={`text-[10px] font-mono tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
                activePanel === 3
                  ? "bg-[#D97706] text-white border-[#D97706] font-semibold"
                  : "bg-white/80 text-[#8C7E75] border-[#EAE3D9] group-hover:border-[#D97706]/30 group-hover:text-[#D97706]"
              }`}
            >
              {activePanel === 3
                ? "Candle Ignited"
                : isTouch
                ? "Tap to Light"
                : "Hover to Light"}
            </span>
          </div>

          {/* Centered Object Showcase Stage */}
          <div className="py-6 sm:py-8 px-6 flex items-center justify-center relative z-10 min-h-[220px]">
            {/* Ambient Warm Candlelight Halo */}
            <div
              className={`absolute w-44 h-44 rounded-full blur-xl transition-all duration-700 pointer-events-none ${
                activePanel === 3
                  ? "bg-amber-300/35 scale-125"
                  : "bg-amber-100/30 scale-90"
              }`}
            />

            {/* FLOATING CELEBRATORY PARTICLES (Active on Hover/Tap) */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 overflow-hidden ${
                activePanel === 3 ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="absolute top-8 left-16 text-amber-400 text-xs animate-bounce">
                ✦
              </span>
              <span
                className="absolute top-6 right-16 text-rose-400 text-[10px] animate-pulse"
                style={{ animationDelay: "200ms" }}
              >
                ✧
              </span>
              <span
                className="absolute top-12 left-1/3 text-amber-500 text-[9px] animate-ping"
                style={{ animationDuration: "2s" }}
              >
                ★
              </span>
              <span
                className="absolute top-10 right-1/3 text-yellow-500 text-[11px] animate-bounce"
                style={{ animationDelay: "400ms" }}
              >
                ✦
              </span>
            </div>

            {/* THE MINIATURE ATELIER CELEBRATION CAKE */}
            <div className="relative flex flex-col items-center transition-transform duration-500 ease-out group-hover:scale-105">
              {/* CANDLE & ANIMATED FLAME */}
              <div className="relative flex flex-col items-center -mb-0.5 z-20">
                {/* Teardrop Ignited Flame with Lifelike Warm Glow */}
                <div
                  className={`transition-all duration-500 ease-out origin-bottom ${
                    activePanel === 3
                      ? "scale-100 opacity-100 translate-y-0"
                      : "scale-0 opacity-0 translate-y-2"
                  }`}
                >
                  <div className="relative w-3.5 h-6">
                    {/* Outer Coral Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 blur-[2px] animate-pulse" />
                    {/* Inner Teardrop Flame */}
                    <div
                      className="absolute inset-0.5 rounded-full bg-gradient-to-t from-red-500 via-amber-300 to-white shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      style={{
                        clipPath: "ellipse(50% 60% at 50% 60%)",
                      }}
                    />
                  </div>
                </div>

                {/* Candle Wick */}
                <div className="w-[1.5px] h-2 bg-stone-700 -my-0.5" />

                {/* Slender Celebration Candle Stick */}
                <div className="w-2.5 h-7 rounded-t-sm bg-gradient-to-r from-[#FAF5EB] via-[#F3E7D3] to-[#E2D2B8] border border-[#D5C2A4] relative overflow-hidden shadow-xs">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(84,29,43,0.3)_3px,rgba(84,29,43,0.3)_5px)]" />
                </div>
              </div>

              {/* TIER 1 (TOP TIER): Miniature Frosted Layer */}
              <div className="relative w-[76px] h-[30px] rounded-t-xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#EFE7D8] border border-[#E2D5C3] shadow-xs flex items-center justify-center z-10">
                {/* Frosting Piping Pearls */}
                <div className="absolute -bottom-1 inset-x-0 flex justify-between px-1">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#541D2B]/80 shadow-2xs border border-[#7A293E]/50"
                    />
                  ))}
                </div>
              </div>

              {/* TIER 2 (BASE TIER): Main Velvet Cake Layer */}
              <div className="relative w-[116px] h-[40px] rounded-t-xl bg-gradient-to-b from-[#FAF5EB] via-[#F4ECE0] to-[#E5DAC8] border border-[#DACBB5] shadow-md z-0">
                {/* Delicate Gold Ribbon Accent */}
                <div className="absolute top-2 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
                {/* Bottom Frosting Beads */}
                <div className="absolute -bottom-1 inset-x-0 flex justify-between px-1.5">
                  {[...Array(8)].map((_, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#C5A36A] shadow-2xs border border-[#9A7D4C]"
                    />
                  ))}
                </div>
              </div>

              {/* SCALLOPED GOLD PEDESTAL STAND */}
              <div className="relative flex flex-col items-center -mt-0.5">
                <div className="w-[140px] h-[7px] rounded-full bg-gradient-to-r from-[#C5A36A] via-[#E2C98A] to-[#B89635] border border-[#A68326] shadow-md" />
                <div className="w-6 h-3 bg-gradient-to-b from-[#C5A36A] to-[#9A7D4C] shadow-inner" />
                <div className="w-16 h-[5px] rounded-full bg-gradient-to-r from-[#9A7D4C] via-[#C5A36A] to-[#8C6D3B] shadow-sm" />
              </div>
            </div>
          </div>

          {/* Bottom Panel Editorial & Link Strip */}
          <div className="p-6 sm:p-7 pt-0 relative z-10 space-y-3">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#211715] group-hover:text-[#D97706] transition-colors leading-snug">
                Birthday Wonderlands
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed mt-1">
                Interactive 3D cakes, candle blowing, floating balloons &amp; celebratory memory scrapbooks.
              </p>
            </div>

            <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between">
              <Link
                href="/birthdays"
                className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#D97706] group-hover:text-[#B45309] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Explore Birthday Wonderlands</span>
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <span className="text-[10px] font-mono text-[#A8A29E]">
                8 Subcollections
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
