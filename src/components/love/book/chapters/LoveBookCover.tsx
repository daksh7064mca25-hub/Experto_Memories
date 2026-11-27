"use client";

import React from "react";
import { Sparkles, Heart, BookOpen } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    introMessage?: string;
    badgeText?: string;
    coverColor?: string;
    sealText?: string;
  };
  theme: ThemeConfig;
  onOpenBook: () => void;
  isOpening?: boolean;
}

export function LoveBookCover({
  recipientName,
  senderName,
  config,
  theme,
  onOpenBook,
  isOpening = false,
}: Props) {
  const title = config.headline || "Our Little Love Story";
  const subtitle =
    config.subtext ||
    config.introMessage ||
    "A private handwritten collection of all our sweetest moments, silly memories, and endless love.";
  const dedication = `Crafted exclusively for ${recipientName} • With all my love, ${senderName}`;

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-7 md:p-9 text-amber-50 select-none overflow-hidden rounded-r-xl border-t border-r border-b border-[#D4AF37]/45"
      style={{
        background: "radial-gradient(circle at 40% 30%, #4a0d18 0%, #2e060f 55%, #190207 100%)",
        boxShadow: "inset 4px 0 16px rgba(0,0,0,0.85), inset 0 0 50px rgba(0,0,0,0.6)",
      }}
    >
      {/* Subtle Leather Texture Grain Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />

      {/* 4 ORNATE METALLIC GOLD CORNER PROTECTORS */}
      {/* Top Left */}
      <div className="absolute top-1 left-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldGradCover)" stroke="#FFE599" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="2" fill="#784B12" />
        </svg>
      </div>
      {/* Top Right */}
      <div className="absolute top-1 right-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20 transform scale-x-[-1]">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldGradCover)" stroke="#FFE599" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="2" fill="#784B12" />
        </svg>
      </div>
      {/* Bottom Left */}
      <div className="absolute bottom-1 left-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20 transform scale-y-[-1]">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldGradCover)" stroke="#FFE599" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="2" fill="#784B12" />
        </svg>
      </div>
      {/* Bottom Right */}
      <div className="absolute bottom-1 right-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20 transform scale-[-1]">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldGradCover)" stroke="#FFE599" strokeWidth="0.8" />
          <circle cx="10" cy="10" r="2" fill="#784B12" />
        </svg>
      </div>

      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient id="goldGradCover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BF953F" />
            <stop offset="25%" stopColor="#FCF6BA" />
            <stop offset="50%" stopColor="#B38728" />
            <stop offset="75%" stopColor="#FBF5B7" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
        </defs>
      </svg>

      {/* EMBOSSED GOLD FILIGREE BORDER FRAMES */}
      <div className="absolute inset-2 sm:inset-3.5 border border-[#D4AF37]/35 rounded-lg pointer-events-none" />
      <div className="absolute inset-3 sm:inset-4.5 border border-dashed border-[#D4AF37]/25 rounded-md pointer-events-none" />

      {/* LEFT SPINAL RIDGE SHADOW (Simulating curved hinge) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 sm:w-4 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(30,5,10,0.4) 60%, transparent 100%)",
        }}
      />

      {/* TOP MONOGRAM / BADGE */}
      <div className="relative z-10 text-center pt-0.5 sm:pt-2 px-4 sm:px-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 rounded-full bg-black/40 border border-[#E5C158]/40 shadow-inner max-w-full">
          <Sparkles size={10} className="text-[#E5C158] shrink-0" />
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest text-[#E5C158] font-bold truncate">
            {config.badgeText || "STRICTLY FOR YOUR EYES ONLY"}
          </span>
          <Sparkles size={10} className="text-[#E5C158] shrink-0" />
        </div>
      </div>

      {/* CENTRAL EMBOSSED MEDALLION & TITLE */}
      <div className="relative z-10 text-center my-auto py-1 sm:py-2 px-1 sm:px-2">
        <div className="w-13 h-13 sm:w-18 sm:h-18 mx-auto mb-2 sm:mb-3 rounded-full p-0.5 shadow-[0_0_25px_rgba(229,193,88,0.35)] flex items-center justify-center bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#AA771C]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#3b0811] to-[#1a0307] border-2 border-[#E5C158]/80 flex flex-col items-center justify-center text-[#E5C158]">
            <Heart size={16} className="fill-[#E5C158] animate-pulse" />
            <span className="font-mono text-[7px] sm:text-[8px] font-bold tracking-widest mt-0.5">VOL. I</span>
          </div>
        </div>

        <h1 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wide mb-1 sm:mb-2 bg-gradient-to-r from-[#FFF4D4] via-[#E5C158] to-[#FFF4D4] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] break-words leading-tight px-1">
          {title}
        </h1>

        <div className="w-16 sm:w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#E5C158] to-transparent my-1 sm:my-2.5" />

        <p className="text-[10px] sm:text-xs text-rose-100/85 font-serif italic max-w-[260px] sm:max-w-xs mx-auto leading-relaxed px-1">
          {subtitle}
        </p>
      </div>

      {/* BOTTOM DEDICATION & INTERACTIVE OPEN BUTTON */}
      <div className="relative z-10 text-center pb-1 px-1 sm:px-2">
        <p className="font-serif text-[9px] sm:text-[11px] text-[#E5C158]/80 tracking-wide mb-2 sm:mb-3 truncate">
          {dedication}
        </p>

        <button
          type="button"
          data-testid="open-love-book-btn"
          aria-label="Open Our Story"
          onClick={onOpenBook}
          disabled={isOpening}
          className="group relative inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FFE599] to-[#AA771C] text-stone-950 font-serif font-bold text-xs sm:text-sm tracking-wide shadow-[0_6px_20px_rgba(229,193,88,0.45)] hover:shadow-[0_8px_25px_rgba(229,193,88,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 max-w-full"
        >
          <BookOpen size={14} className="text-stone-900 group-hover:rotate-12 transition-transform shrink-0" />
          <span className="truncate">{config.sealText || "Open Our Story"}</span>
          <span className="text-xs">✨</span>
        </button>
      </div>
    </div>
  );
}
