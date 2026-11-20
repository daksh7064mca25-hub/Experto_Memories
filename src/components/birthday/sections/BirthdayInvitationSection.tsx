"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Gift, ArrowDown } from "lucide-react";
import { BirthdayInvitationConfig, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayInvitationConfig;
  recipientName: string;
  senderName: string;
  theme?: ThemeId;
}

export function BirthdayInvitationSection({
  config,
  recipientName = "Birthday Superstar",
  senderName = "Someone Special",
  theme,
}: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const themeConfig = getBirthdayThemeConfig(theme);

  const handleOpenGift = () => {
    setIsOpened(true);

    // Explosive celebratory confetti
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#fbbf24", "#fda4af"],
    });

    const nextSection = document.getElementById("bday-sec-welcome");
    if (nextSection) {
      setTimeout(() => {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <section
      id="bday-sec-invitation"
      className="relative min-h-[95vh] flex flex-col items-center justify-center px-4 py-12 select-none overflow-hidden text-center"
    >
      {/* Decorative Badge */}
      <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold tracking-wide backdrop-blur-md bg-white/80 border border-amber-200/80 shadow-sm text-amber-900 animate-bounce">
        <Sparkles size={13} className="text-amber-500" />
        <span>A Special Surprise For You</span>
        <Sparkles size={13} className="text-amber-500" />
      </div>

      {/* Recipient Title */}
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 mb-3 leading-tight">
        {recipientName}
      </h1>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-xs sm:max-w-md mx-auto mb-8 leading-relaxed">
        {config.teaserText ||
          `A hand-crafted digital celebration created with all the love in the world by ${senderName}.`}
      </p>

      {/* Interactive Gift Box Centerpiece */}
      <div className="relative my-4 flex flex-col items-center">
        <div
          onClick={handleOpenGift}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenGift();
            }
          }}
          className="group relative cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          {/* Pulsing Aura */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-400/30 via-rose-400/30 to-pink-400/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* Gift Box Container */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 p-1 shadow-2xl shadow-rose-500/30 flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Ribbon Horiz */}
            <div className="absolute inset-x-0 h-7 bg-amber-300/90 shadow-sm z-10 flex items-center justify-center">
              <span className="text-[10px] font-mono tracking-widest text-amber-950 font-bold uppercase">
                {isOpened ? "UNWRAPPED ✨" : "TAP TO OPEN"}
              </span>
            </div>
            {/* Ribbon Vert */}
            <div className="absolute inset-y-0 w-7 bg-amber-300/90 shadow-sm z-10" />

            {/* Gift Icon / Bow */}
            <div className="relative z-20 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner group-hover:rotate-6 transition-transform">
              <Gift size={40} className="text-white drop-shadow-md" />
            </div>

            {/* Tap instruction */}
            <div className="absolute bottom-3 z-20 text-[11px] font-serif font-semibold text-amber-100">
              {config.envelopePrompt || "Tap to Unbox Your Gift 🎁"}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOpenGift}
          className={`mt-8 px-8 py-3.5 rounded-full font-serif font-bold text-sm tracking-wide transition-all shadow-xl flex items-center gap-2 ${themeConfig.primaryButtonClass}`}
        >
          <span>{isOpened ? "Explore Your Surprise 🎂" : "Unwrap Birthday Surprise 🎁"}</span>
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
