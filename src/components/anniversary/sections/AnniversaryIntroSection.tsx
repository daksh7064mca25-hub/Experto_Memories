"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart, ArrowDown, Calendar, Infinity as InfinityIcon, Mail } from "lucide-react";
import { AnniversaryIntroConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryIntroConfig;
  partner1Name?: string;
  partner2Name?: string;
  anniversaryDate?: string;
  yearsTogether?: number;
  theme: ThemeId;
}

export function AnniversaryIntroSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  anniversaryDate,
  yearsTogether,
  theme,
}: Props) {
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);
  const themeConfig = getThemeConfig(theme, "anniversary");

  const coupleNamesDisplay =
    config.coupleNames || `${partner1Name} & ${partner2Name}`;
  const dateDisplay = config.anniversaryDate || anniversaryDate || "Today & Forever";
  const yearsDisplay =
    config.yearsTogetherText ||
    (yearsTogether ? `${yearsTogether} Beautiful Years` : "A Lifetime of Love");

  const handleStart = () => {
    setIsInvitationOpened(true);

    // Trigger celebratory stardust confetti
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#f59e0b", "#ec4899", "#a855f7", "#fbbf24", "#fda4af"],
    });

    const nextSection =
      document.getElementById("anniv-sec-counter") ||
      document.getElementById("anniv-sec-first-met") ||
      document.getElementById("anniv-sec-timeline");

    if (nextSection) {
      setTimeout(() => {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  return (
    <section
      id="anniv-sec-intro"
      className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-12 select-none overflow-hidden text-center"
    >
      {/* Top Tagline Pill */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-semibold backdrop-blur-md bg-white/80 dark:bg-stone-900/80 border border-amber-200/80 dark:border-purple-800 shadow-sm text-stone-800 dark:text-purple-200 animate-bounce">
        <Sparkles size={14} className="text-amber-500" />
        <span>{yearsDisplay}</span>
        <Sparkles size={14} className="text-amber-500" />
      </div>

      {/* Couple Headline */}
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 text-stone-900 dark:text-purple-50 leading-tight">
        {coupleNamesDisplay}
      </h1>

      {/* Date badge */}
      <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-sans font-medium text-stone-600 dark:text-purple-200/80 mb-6">
        <Calendar size={14} className="text-amber-600 dark:text-purple-400" />
        <span>{dateDisplay}</span>
      </div>

      {/* Secret Invitation Envelope / Emblem */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto mb-8 p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-stone-900/80 backdrop-blur-md border border-amber-200/60 dark:border-purple-800 shadow-2xl shadow-rose-900/5">
        <div
          onClick={handleStart}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleStart();
            }
          }}
          className="cursor-pointer group flex flex-col items-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <InfinityIcon size={32} className="animate-pulse" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2 text-stone-900 dark:text-purple-100">
            {config.headline || "Hey love... ready to relive our little story?"}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-purple-200/90 leading-relaxed max-w-xs mx-auto mb-3">
            {config.subheadline ||
              "Every moment, every memory, every reason to choose you again."}
          </p>

          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-500 font-semibold group-hover:underline">
            <Mail size={12} /> {isInvitationOpened ? "Invitation Unsealed ✨" : "Tap to Open Secret Invitation"}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleStart}
          className={`flex items-center gap-2.5 px-8 py-4 rounded-full font-serif text-base sm:text-lg font-bold tracking-wide transition-all transform hover:scale-105 active:scale-95 shadow-xl min-h-[44px] ${themeConfig.primaryButtonClass}`}
        >
          <span>{config.buttonText || "Take Me Back To Us ❤️"}</span>
          <ArrowDown size={18} className="animate-bounce" />
        </button>

        <span className="text-xs text-stone-500 dark:text-purple-300 italic">
          (Scroll or tap to begin our forever story)
        </span>
      </div>
    </section>
  );
}
