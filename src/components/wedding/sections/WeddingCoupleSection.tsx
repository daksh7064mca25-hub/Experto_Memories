"use client";

import React from "react";
import { WeddingCoupleConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Heart, Sparkles } from "lucide-react";

interface Props {
  config: WeddingCoupleConfig;
  theme: WeddingThemeStyles;
}

export const WeddingCoupleSection: React.FC<Props> = ({ config, theme }) => {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <Heart size={13} className="fill-current" />
          <span>The Blessed Union</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {config.headline || "The Bride & Groom"}
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {config.subtext}
        </p>
      </div>

      {/* Couple Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* GROOM CARD */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col items-center text-center transition duration-300 hover:scale-[1.01] ${theme.cardBg} ${theme.cardBorder}`}>
          {/* Portrait Arch Frame */}
          <div className="relative mb-6">
            <div className="w-44 h-56 sm:w-52 sm:h-64 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-lg relative bg-stone-900">
              {config.groomPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={config.groomPhotoUrl}
                  alt={config.groomName}
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2E0B14] to-[#1F070E] text-[#D4AF37]">
                  <Sparkles size={36} className="mb-2 opacity-60" />
                  <span className="font-serif text-sm">The Groom</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-serif uppercase tracking-widest bg-gradient-to-r from-[#C5A36A] to-[#D4AF37] text-[#2E0B14] font-bold shadow-md">
              Groom
            </div>
          </div>

          <h3 className={`font-serif text-2xl sm:text-3xl font-bold mb-1 ${theme.textPrimary}`}>
            {config.groomName}
          </h3>
          {config.groomTitle && (
            <p className="text-xs sm:text-sm text-[#D4AF37] font-medium tracking-wide mb-3">
              {config.groomTitle}
            </p>
          )}
          {config.groomBio && (
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm mt-auto ${theme.textSecondary}`}>
              {config.groomBio}
            </p>
          )}
        </div>

        {/* BRIDE CARD */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col items-center text-center transition duration-300 hover:scale-[1.01] ${theme.cardBg} ${theme.cardBorder}`}>
          {/* Portrait Arch Frame */}
          <div className="relative mb-6">
            <div className="w-44 h-56 sm:w-52 sm:h-64 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-lg relative bg-stone-900">
              {config.bridePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={config.bridePhotoUrl}
                  alt={config.brideName}
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2E0B14] to-[#1F070E] text-[#D4AF37]">
                  <Sparkles size={36} className="mb-2 opacity-60" />
                  <span className="font-serif text-sm">The Bride</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-serif uppercase tracking-widest bg-gradient-to-r from-[#C5A36A] to-[#D4AF37] text-[#2E0B14] font-bold shadow-md">
              Bride
            </div>
          </div>

          <h3 className={`font-serif text-2xl sm:text-3xl font-bold mb-1 ${theme.textPrimary}`}>
            {config.brideName}
          </h3>
          {config.brideTitle && (
            <p className="text-xs sm:text-sm text-[#D4AF37] font-medium tracking-wide mb-3">
              {config.brideTitle}
            </p>
          )}
          {config.brideBio && (
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm mt-auto ${theme.textSecondary}`}>
              {config.brideBio}
            </p>
          )}
        </div>
      </div>

      {/* Parents Blessing Note */}
      {config.parentsBlessing && (
        <div className={`mt-12 max-w-2xl mx-auto rounded-2xl p-6 border text-center ${theme.cardBg} ${theme.cardBorder}`}>
          <p className="text-xs sm:text-sm font-serif italic leading-relaxed text-[#E6D9C8]">
            {config.parentsBlessing}
          </p>
        </div>
      )}
    </section>
  );
};
