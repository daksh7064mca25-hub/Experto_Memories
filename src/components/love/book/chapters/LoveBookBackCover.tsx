"use client";

import React from "react";
import { Heart, Sparkles, RotateCcw, BookOpen } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface Props {
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
  onReplay: () => void;
}

export function LoveBookBackCover({
  recipientName,
  senderName,
  theme,
  onReplay,
}: Props) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3.5 sm:p-7 md:p-9 text-amber-50 select-none text-center bg-gradient-to-br from-[#4a0d18] via-[#2e060f] to-[#190207] border-4 border-[#C5A36A]/50 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* 4 ORNATE METALLIC GOLD CORNER PROTECTORS */}
      <div className="absolute top-1 left-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldBackGrad)" stroke="#FFE599" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="absolute top-1 right-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20 transform scale-x-[-1]">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldBackGrad)" stroke="#FFE599" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="absolute bottom-1 left-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20 transform scale-y-[-1]">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldBackGrad)" stroke="#FFE599" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="absolute bottom-1 right-1 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none z-20 transform scale-[-1]">
        <svg viewBox="0 0 50 50" className="w-full h-full text-[#BF953F] drop-shadow-md">
          <path d="M 2 2 L 48 2 C 36 6 24 14 16 26 C 10 36 6 44 2 48 Z" fill="url(#goldBackGrad)" stroke="#FFE599" strokeWidth="0.8" />
        </svg>
      </div>

      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient id="goldBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BF953F" />
            <stop offset="25%" stopColor="#FCF6BA" />
            <stop offset="50%" stopColor="#B38728" />
            <stop offset="75%" stopColor="#FBF5B7" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>
        </defs>
      </svg>

      {/* Decorative filigree frame */}
      <div className="absolute inset-2 sm:inset-4 border border-[#D4AF37]/35 rounded-lg pointer-events-none" />
      <div className="absolute inset-3 sm:inset-5 border border-dashed border-[#D4AF37]/20 rounded-md pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 pt-1 sm:pt-2">
        <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest text-[#E5C158] font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/40 border border-[#E5C158]/30">
          THE END OF VOLUME I
        </span>
      </div>

      {/* Center Medallion & Dedication */}
      <div className="relative z-10 my-auto py-1 sm:py-2 max-w-xs px-2">
        <div className="w-13 h-13 sm:w-18 sm:h-18 mx-auto mb-2 sm:mb-3 rounded-full p-0.5 shadow-[0_0_25px_rgba(229,193,88,0.35)] flex items-center justify-center bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#AA771C]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#3b0811] to-[#1a0307] border-2 border-[#E5C158]/80 flex flex-col items-center justify-center text-[#E5C158]">
            <Heart size={16} className="fill-[#E5C158] animate-pulse" />
            <span className="font-mono text-[7px] sm:text-[8px] font-bold tracking-widest mt-0.5">FOREVER</span>
          </div>
        </div>

        <h3 className="font-serif text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#FFF4D4] via-[#E5C158] to-[#FFF4D4] bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">
          Our Story Continues
        </h3>

        <p className="font-serif text-[11px] sm:text-xs text-rose-100/85 italic leading-relaxed px-1">
          &ldquo;This book may end here, but our sweetest chapters are yet to be written.&rdquo;
        </p>

        <div className="w-16 sm:w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[#E5C158] to-transparent my-2 sm:my-3" />

        <p className="font-serif text-[10px] sm:text-[11px] text-[#E5C158]/90">
          With all my heart, {senderName}
        </p>
      </div>

      {/* Replay Button */}
      <div className="relative z-10 pb-1">
        <button
          type="button"
          onClick={onReplay}
          className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FFE599] to-[#AA771C] text-stone-950 font-serif font-bold text-xs tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <RotateCcw size={13} className="text-stone-900 group-hover:-rotate-90 transition-transform duration-300" />
          <span>Read From Beginning</span>
        </button>
      </div>
    </div>
  );
}
