"use client";

import React, { useState } from "react";
import { WeddingWishesConfig } from "@/types/website";
import { MessageCircle, Copy, Check, Heart, Sparkles } from "lucide-react";

interface DestinationClosingSectionProps {
  config?: WeddingWishesConfig;
  projectSlug?: string;
  coupleNames?: string;
}

export const DestinationClosingSection: React.FC<DestinationClosingSectionProps> = ({
  config,
  projectSlug = "wedding",
  coupleNames = "Kabir & Natasha",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    if (typeof window !== "undefined") {
      const defaultText = `You are cordially invited to celebrate the destination wedding of ${coupleNames}. View our invitation & boarding pass here: ${window.location.href}`;
      const text = encodeURIComponent(config?.whatsappShareText || defaultText);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const closingMessage =
    config?.closingNote ||
    "We eagerly await the joy of welcoming you with warm hugs, tropical breezes, and unforgettable celebrations under the stars.";

  return (
    <section id="sec-destination-closing" className="py-12 sm:py-20 px-3 sm:px-6 max-w-3xl mx-auto text-center" aria-label="Family Blessings and Closing Section">
      {/* Gratitude Badge */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/50 bg-[#F4EFE6] flex items-center justify-center text-[#8B6514] shadow-xs mb-2">
          <Heart size={18} className="text-[#8B6514]" />
        </div>
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8B6514] font-semibold">
          WITH SINCERE GRATITUDE
        </span>
      </div>

      {/* Main Headline */}
      <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 text-[#0F2336]">
        {config?.headline || "With Love & Family Blessings 🤍"}
      </h2>

      {/* Heartfelt Farewell Message */}
      <p className="text-xs sm:text-base max-w-xl mx-auto font-serif italic mb-6 leading-relaxed text-[#1E3A56] px-2">
        “{closingMessage}”
      </p>

      {/* Couple Names & Family Signoff */}
      <div className="mb-6 sm:mb-8">
        <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#8B6514] tracking-wide">
          {coupleNames}
        </h3>
        {config?.familySignoff && (
          <p className="mt-1.5 text-xs sm:text-sm font-serif text-[#2C4860] font-semibold">
            {config.familySignoff}
          </p>
        )}
      </div>

      {/* Share / WhatsApp CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="w-full sm:w-auto px-5 py-3 rounded-full text-xs sm:text-sm font-serif font-semibold bg-[#25D366] text-white hover:bg-[#20ba5a] transition flex items-center justify-center gap-2 shadow-md cursor-pointer min-h-[44px]"
        >
          <MessageCircle size={17} />
          <span>Share Invitation on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto px-5 py-3 rounded-full text-xs sm:text-sm font-serif font-semibold bg-white border border-stone-300 text-[#0F2336] hover:bg-stone-50 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px]"
        >
          {copied ? (
            <>
              <Check size={16} className="text-emerald-600" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} className="text-[#8B6514]" />
              <span>Copy Invitation Link</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
