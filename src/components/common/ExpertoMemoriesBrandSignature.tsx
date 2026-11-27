"use client";

import React from "react";

export interface ExpertoMemoriesBrandSignatureProps {
  occasionType?: "anniversary" | "wedding" | "birthday" | "love" | "apology" | string;
  theme?: string;
  variant?: "light" | "dark" | "luxury-gold" | "subtle" | "auto";
  className?: string;
  previewMode?: boolean;
}

const BRAND_URL = "https://expertomemories.shop?utm_source=gift&utm_medium=branded_footer&utm_campaign=gift_sharing";

export function ExpertoMemoriesBrandSignature({
  occasionType = "anniversary",
  theme = "",
  variant = "auto",
  className = "",
  previewMode = false,
}: ExpertoMemoriesBrandSignatureProps) {
  // Determine if this is a dark theme
  const isDark =
    variant === "dark" ||
    theme === "our-universe" ||
    theme === "midnight-love" ||
    theme?.includes("dark") ||
    theme?.includes("night");

  // Determine theme-specific color palette and typography
  const isApology = occasionType === "apology";
  const isWedding = occasionType === "wedding";
  const isBirthday = occasionType === "birthday";
  const isLove = occasionType === "love";

  let textColor = "text-[#6B2D38]/80";
  let linkColor = "text-[#6B2D38] hover:text-[#3D262A] focus-visible:ring-[#C46879]";
  let fontFamily = "font-serif";

  if (isDark) {
    textColor = "text-white/60";
    linkColor = "text-rose-200 hover:text-white focus-visible:ring-rose-400";
    fontFamily = "font-serif";
  } else if (isApology) {
    textColor = "text-stone-500";
    linkColor = "text-stone-800 hover:text-stone-950 focus-visible:ring-stone-400";
    fontFamily = "font-sans";
  } else if (isWedding) {
    textColor = "text-[#6B5A4E]/80";
    linkColor = "text-[#8C6D23] hover:text-[#5C4827] focus-visible:ring-[#D4AF37]";
    fontFamily = "font-serif";
  } else if (isBirthday) {
    textColor = "text-[#6B4E38]/80";
    linkColor = "text-[#A8641C] hover:text-[#7A4B1A] focus-visible:ring-amber-400";
    fontFamily = "font-serif";
  } else if (isLove) {
    textColor = "text-[#6B3245]/80";
    linkColor = "text-[#9E2A4B] hover:text-[#73273C] focus-visible:ring-rose-400";
    fontFamily = "font-serif";
  }

  return (
    <footer
      aria-label="ExpertoMemories Brand Signature"
      className={`relative z-20 w-full text-center pt-10 sm:pt-14 pb-24 sm:pb-28 px-4 select-none ${fontFamily} ${className}`}
    >
      <p className={`text-xs sm:text-sm font-normal tracking-wide ${textColor}`}>
        Made with love by{" "}
        <a
          href={BRAND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-bold transition-all duration-200 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 rounded px-0.5 ${linkColor}`}
        >
          ExpertoMemories
        </a>
      </p>
    </footer>
  );
}
