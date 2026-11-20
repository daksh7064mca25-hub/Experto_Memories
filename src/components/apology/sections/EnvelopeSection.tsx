"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, MailOpen, ArrowDown } from "lucide-react";
import { EnvelopeSectionConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: EnvelopeSectionConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeId;
  onOpen?: () => void;
}

export function EnvelopeSection({ config, recipientName, senderName, theme, onOpen }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  const handleOpenEnvelope = () => {
    if (isOpen) {
      scrollToNext();
      return;
    }

    setIsOpen(true);

    // Fire cute pastel confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#f43f5e", "#fda4af", "#e879f9", "#fbcfe8", "#fb7185"],
    });

    if (onOpen) onOpen();

    // After unfolding, gently scroll to the letter or next section after 1.4s
    setTimeout(() => {
      scrollToNext();
    }, 1200);
  };

  const scrollToNext = () => {
    const nextElem = document.getElementById("sec-ready-check") || document.getElementById("sec-letter");
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="sec-envelope"
      className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-12 select-none overflow-hidden"
    >
      {/* Top Banner Tag */}
      <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-white/70 border border-pink-200/60 shadow-sm text-pink-700 animate-bounce">
        <Sparkles size={14} className="text-pink-500" />
        <span>{config.stampText || "SPECIAL DELIVERY"}</span>
        <Sparkles size={14} className="text-pink-500" />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight mb-2 text-rose-950 dark:text-pink-100">
        For My Beloved <span className="underline decoration-pink-300 decoration-wavy">{recipientName}</span>
      </h1>

      <p className="font-sans text-sm sm:text-base text-rose-800/80 dark:text-pink-200/80 text-center max-w-md mb-8">
        {config.teaserText || "Someone has something special to tell you..."}
      </p>

      {/* 3D Envelope Container */}
      <div
        onClick={handleOpenEnvelope}
        className="relative cursor-pointer group transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] w-full max-w-[340px] sm:max-w-[400px] aspect-[4/3] flex items-center justify-center"
      >
        {/* Envelope Body */}
        <div className="relative w-full h-full bg-[#fce7f3] dark:bg-pink-950/70 rounded-2xl shadow-2xl border-2 border-pink-200/80 dark:border-pink-800/60 overflow-hidden flex flex-col justify-end">
          
          {/* Inner Letter that slides up when opened */}
          <div
            className={`absolute inset-x-4 bottom-2 h-[82%] bg-[#fffcf9] dark:bg-stone-900 rounded-t-xl p-5 shadow-lg border border-pink-200/60 transition-all duration-700 ease-out z-10 flex flex-col justify-between ${
              isOpen ? "-translate-y-24 sm:-translate-y-32 rotate-[-1deg]" : "translate-y-0"
            }`}
          >
            <div className="border-b border-pink-100 pb-2">
              <span className="font-serif italic text-xs text-pink-500">Dearest {recipientName},</span>
              <p className="font-serif text-sm font-semibold text-rose-950 dark:text-rose-100 line-clamp-2 mt-1">
                From the very bottom of my heart, please read this...
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] text-pink-400 font-sans">
              <span>With Love, {senderName}</span>
              <Heart size={12} className="fill-pink-400 text-pink-400" />
            </div>
          </div>

          {/* Envelope Pocket Front (Triangular V-Fold) */}
          <div className="absolute inset-x-0 bottom-0 h-full z-20 pointer-events-none">
            {/* Left triangle */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-pink-300/40 via-rose-200/30 to-transparent [clip-path:polygon(0_0,0_100%,100%_100%)]" />
            {/* Right triangle */}
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-pink-300/40 via-rose-200/30 to-transparent [clip-path:polygon(100%_0,0_100%,100%_100%)]" />
            {/* Bottom pocket */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[#fbcfe8]/95 dark:bg-pink-900/90 [clip-path:polygon(0_100%,100%_100%,50%_0)] border-t border-pink-300/50" />
          </div>

          {/* Envelope Flap */}
          <div
            className={`absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[#f472b6] to-[#ec4899] dark:from-pink-800 dark:to-pink-900 [clip-path:polygon(0_0,100%_0,50%_100%)] origin-top transition-transform duration-700 z-30 shadow-md ${
              isOpen ? "rotate-x-180 -translate-y-1 opacity-0 pointer-events-none" : ""
            }`}
          />

          {/* Heart Wax Seal (Center) */}
          {!isOpen && (
            <div className="absolute z-40 top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95"
                style={{
                  background:
                    config.waxSealColor ||
                    "radial-gradient(circle, #f43f5e 40%, #be123c 100%)",
                  boxShadow: "0 4px 14px rgba(225, 29, 72, 0.45)",
                }}
              >
                <div className="w-11 h-11 rounded-full border-2 border-dashed border-rose-200/60 flex items-center justify-center">
                  <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Button CTA */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleOpenEnvelope}
          className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full font-serif text-base sm:text-lg font-semibold tracking-wide transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
            isOpen
              ? "bg-rose-100 text-rose-800 border border-rose-300"
              : themeConfig.primaryButtonClass
          }`}
        >
          {isOpen ? (
            <>
              <ArrowDown size={18} className="animate-bounce" />
              <span>Scroll to Read Letter</span>
            </>
          ) : (
            <>
              <MailOpen size={20} />
              <span>{config.buttonText || "Open My Letter"}</span>
            </>
          )}
        </button>

        <span className="text-xs text-rose-700/70 dark:text-pink-300/70 italic">
          (Tap envelope or button to open)
        </span>
      </div>
    </section>
  );
}

