"use client";

import React, { useState } from "react";
import { WeddingWishesConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Share2, Check, Copy, Heart, Sparkles, MessageCircle } from "lucide-react";

interface Props {
  config: WeddingWishesConfig;
  theme: WeddingThemeStyles;
  projectSlug: string;
  coupleNames?: string;
}

export const WeddingWishesSection: React.FC<Props> = ({
  config,
  theme,
  projectSlug,
  coupleNames,
}) => {
  const [copied, setCopied] = useState(false);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/gift/${projectSlug}`
    : `https://expertomemories.shop/gift/${projectSlug}`;

  const finalCoupleNames = coupleNames || config.coupleNames || "The Couple";

  const closingMessage =
    config.closingNote ||
    "Your presence will make our celebration even more special. We look forward to celebrating these beautiful moments with you.";

  const shareText =
    config.whatsappShareText ||
    `We are delighted to invite you to celebrate our wedding! Tap to view our digital wedding invitation & RSVP: ${publicUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-24 px-4 sm:px-6 max-w-3xl mx-auto text-center" id="wishes-section">
      {/* SUBTLE CLOSING ANIMATION: Glowing Sacred Lotus & Namaste Blessing */}
      <div className="relative mb-8 flex flex-col items-center justify-center">
        {/* Soft Golden Aura */}
        <div className="absolute w-28 h-28 rounded-full bg-[#D4AF37]/25 blur-2xl animate-pulse pointer-events-none" />

        {/* Sacred Traditional Medallion */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#3D0F19] via-[#541D2B] to-[#2B0A11] border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.45)] flex items-center justify-center text-[#D4AF37] transition duration-500 hover:scale-105">
          <svg width="42" height="42" viewBox="0 0 48 48" fill="none" className="drop-shadow-md">
            {/* Sacred Lotus Blossom SVG */}
            <path
              d="M24 10 C20 18, 16 28, 24 38 C32 28, 28 18, 24 10 Z"
              fill="#FBBF24"
              opacity="0.95"
            />
            <path
              d="M24 18 C14 22, 8 30, 16 38 C22 36, 24 28, 24 18 Z"
              fill="#F59E0B"
              opacity="0.85"
            />
            <path
              d="M24 18 C34 22, 40 30, 32 38 C26 36, 24 28, 24 18 Z"
              fill="#F59E0B"
              opacity="0.85"
            />
            <circle cx="24" cy="38" r="3" fill="#FEF08A" />
          </svg>
        </div>

        {/* Auspicious Inscription */}
        <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#D4AF37] mt-3 font-semibold">
          || धन्यवाद &bull; WITH SINCERE GRATITUDE ||
        </span>
      </div>

      {/* Headline */}
      <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 ${theme.textPrimary}`}>
        {config.headline || "We Look Forward to Seeing You"}
      </h2>

      {/* Suggested & Configured Heartfelt Farewell Message */}
      <p className="text-base sm:text-lg max-w-xl mx-auto font-serif italic mb-6 leading-relaxed text-[#FAF7F2] drop-shadow-sm">
        “{closingMessage}”
      </p>

      {/* Display Couple's Names */}
      <div className="mb-8">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37] tracking-wide">
          {finalCoupleNames}
        </h3>
        {config.familySignoff && (
          <p className="mt-2 text-xs sm:text-sm font-sans uppercase tracking-widest text-[#E6D9C8]/80 font-semibold">
            {config.familySignoff}
          </p>
        )}
      </div>

      {/* Share / WhatsApp CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-serif font-semibold bg-[#25D366] text-white hover:bg-[#20ba5a] transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <MessageCircle size={18} />
          <span>Share Invitation on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className={`w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-serif font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${theme.buttonSecondary}`}
        >
          {copied ? (
            <>
              <Check size={16} className="text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} className="text-[#D4AF37]" />
              <span>Copy Invitation Link</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
