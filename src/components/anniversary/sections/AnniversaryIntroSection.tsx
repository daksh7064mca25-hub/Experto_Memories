"use client";

import React from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, ArrowDown, Calendar } from "lucide-react";
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
  partner1Name = "Alex",
  partner2Name = "Sarah",
  anniversaryDate,
  yearsTogether,
  theme,
}: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");

  const p1 = partner1Name || "Alex";
  const p2 = partner2Name || "Sarah";
  const coupleNamesDisplay = config.coupleNames || `${p1} ❤️ ${p2}`;
  const dateDisplay = config.anniversaryDate || anniversaryDate || "Today & Forever";
  const yearsDisplay =
    config.yearsTogetherText ||
    (yearsTogether ? `${yearsTogether} Beautiful Years` : "A Lifetime of Love");
  const headline = config.headline || "Happy Anniversary, My Love!";
  const subheadline =
    config.subheadline ||
    "Every moment with you becomes a memory I wish I could live again.";
  const personalMessage = config.personalMessage;
  const couplePhoto =
    config.couplePhotoUrl ||
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80";

  const handleScrollToNext = () => {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0"],
    });

    const nextSection =
      document.getElementById("anniv-sec-scratch") ||
      document.getElementById("anniv-sec-future-letter");

    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="anniv-sec-intro"
      className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 py-14 sm:py-20 text-center overflow-hidden"
    >
      {/* Delicate floating background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-[#E8B4B8]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-medium bg-white/90 backdrop-blur-md border border-[#E8B4B8]/70 shadow-sm text-[#6B2D38]"
      >
        <Sparkles size={13} className="text-[#C46879]" />
        <span>{yearsDisplay}</span>
        <Sparkles size={13} className="text-[#C46879]" />
      </motion.div>

      {/* Both Names Prominently */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-3 text-[#3D262A] leading-tight max-w-3xl"
      >
        {coupleNamesDisplay}
      </motion.h1>

      {/* Main Romantic Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-[#6B2D38] mb-3"
      >
        {headline}
      </motion.h2>

      {/* Anniversary Date Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-sans font-medium text-[#6B2D38]/80 mb-6 sm:mb-8"
      >
        <Calendar size={14} className="text-[#C46879]" />
        <span>{dateDisplay}</span>
      </motion.div>

      {/* Prominent Couple Photograph Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative w-full max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8"
      >
        <div className="relative p-2.5 sm:p-3 bg-white rounded-3xl border border-[#E8B4B8]/80 shadow-2xl shadow-[#6B2D38]/12 transform transition-transform duration-500 hover:scale-[1.01]">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF6F0]">
            <img
              src={couplePhoto}
              alt={coupleNamesDisplay}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

            {/* Heart Motif Badge */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E8B4B8]/60 shadow-md flex items-center gap-1.5 text-[11px] font-serif font-bold text-[#6B2D38]">
              <Heart size={12} className="text-[#C46879] fill-[#C46879] animate-pulse" />
              <span>Forever & Always</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Supporting Romantic Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="max-w-xl mx-auto space-y-3 mb-8 px-2"
      >
        <p className="text-xs sm:text-sm md:text-base font-serif italic text-[#6B2D38]/90 leading-relaxed">
          &ldquo;{subheadline}&rdquo;
        </p>
        {personalMessage && (
          <p className="text-xs sm:text-sm font-sans text-[#3D262A]/90 bg-white/70 backdrop-blur-sm p-3.5 rounded-2xl border border-[#E8B4B8]/50 max-w-md mx-auto">
            {personalMessage}
          </p>
        )}
      </motion.div>

      {/* Begin Our Story CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleScrollToNext}
        className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-serif font-semibold bg-gradient-to-r from-[#C46879] via-[#B35768] to-[#6B2D38] text-white shadow-xl shadow-[#C46879]/30 transition-all duration-300"
      >
        <span>{config.buttonText || "Begin Our Story"}</span>
        <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
      </motion.button>
    </section>
  );
}
