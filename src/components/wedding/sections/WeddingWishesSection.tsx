"use client";

import React, { useState } from "react";
import { WeddingWishesConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Share2, Check, Copy, Heart, Sparkles, MessageCircle } from "lucide-react";

interface Props {
  config: WeddingWishesConfig;
  theme: WeddingThemeStyles;
  projectSlug: string;
}

export const WeddingWishesSection: React.FC<Props> = ({ config, theme, projectSlug }) => {
  const [copied, setCopied] = useState(false);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/gift/${projectSlug}`
    : `https://expertomemories.shop/gift/${projectSlug}`;

  const shareText =
    config.whatsappShareText ||
    `We are delighted to invite you to celebrate our wedding! Tap to view the digital invitation & RSVP: ${publicUrl}`;

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
    <section className="py-24 px-4 sm:px-6 max-w-3xl mx-auto text-center">
      {/* Decorative Icon */}
      <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto mb-6 shadow-xl">
        <Heart size={28} className="fill-[#D4AF37]/30" />
      </div>

      {/* Headline */}
      <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 ${theme.textPrimary}`}>
        {config.headline || "Blessings & Gratitude"}
      </h2>

      {/* Subtext */}
      <p className={`text-base sm:text-lg max-w-xl mx-auto font-serif italic mb-6 leading-relaxed ${theme.textSecondary}`}>
        {config.subtext}
      </p>

      {/* Closing Note */}
      {config.closingNote && (
        <div className={`rounded-2xl p-6 sm:p-8 border mb-8 max-w-xl mx-auto shadow-lg ${theme.cardBg} ${theme.cardBorder}`}>
          <p className="font-serif text-sm sm:text-base italic leading-relaxed text-[#FAF7F2]">
            “{config.closingNote}”
          </p>
          {config.familySignoff && (
            <p className="mt-4 text-xs sm:text-sm font-sans uppercase tracking-widest text-[#D4AF37] font-semibold">
              — {config.familySignoff}
            </p>
          )}
        </div>
      )}

      {/* Share / WhatsApp CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
        <button
          onClick={handleWhatsApp}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-serif font-semibold bg-[#25D366] text-white hover:bg-[#20ba5a] transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <MessageCircle size={18} />
          <span>Share Invitation on WhatsApp</span>
        </button>

        <button
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

      {/* Brand Watermark / Footer */}
      <div className="mt-16 pt-8 border-t border-white/10 text-center">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-sans">
          Created with ExpertoMemories Royal Wedding Studio
        </p>
      </div>
    </section>
  );
};
