"use client";

import React from "react";
import { WeddingTravelConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Plane, Train, Hotel, Bus, Phone, Compass } from "lucide-react";

interface Props {
  config: WeddingTravelConfig;
  theme: WeddingThemeStyles;
}

export const WeddingTravelSection: React.FC<Props> = ({ config, theme }) => {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <Compass size={13} className="text-[#D4AF37]" />
          <span>Guest Logistics</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {config.headline || "Travel & Guest Hospitality"}
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {config.subtext}
        </p>
      </div>

      {/* Travel Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AIRPORT */}
        {config.nearestAirport && (
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37]">
              <Plane size={24} />
            </div>
            <div>
              <h4 className={`font-serif text-lg font-bold mb-1 ${theme.textPrimary}`}>
                Nearest Airport
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.textSecondary}`}>
                {config.nearestAirport}
              </p>
            </div>
          </div>
        )}

        {/* RAILWAY */}
        {config.nearestRailway && (
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37]">
              <Train size={24} />
            </div>
            <div>
              <h4 className={`font-serif text-lg font-bold mb-1 ${theme.textPrimary}`}>
                Nearest Railway
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.textSecondary}`}>
                {config.nearestRailway}
              </p>
            </div>
          </div>
        )}

        {/* HOTEL ACCOMMODATIONS */}
        {config.hotelAccommodations && (
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37]">
              <Hotel size={24} />
            </div>
            <div>
              <h4 className={`font-serif text-lg font-bold mb-1 ${theme.textPrimary}`}>
                Accommodations
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.textSecondary}`}>
                {config.hotelAccommodations}
              </p>
            </div>
          </div>
        )}

        {/* SHUTTLE & TRANSFERS */}
        {config.shuttleNotes && (
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37]">
              <Bus size={24} />
            </div>
            <div>
              <h4 className={`font-serif text-lg font-bold mb-1 ${theme.textPrimary}`}>
                Transfers & Shuttles
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.textSecondary}`}>
                {config.shuttleNotes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* HOSPITALITY CONCIERGE CALLOUT */}
      {(config.conciergeName || config.conciergePhone) && (
        <div className={`mt-8 rounded-2xl p-6 border text-center flex flex-col sm:flex-row items-center justify-between gap-4 ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="text-left">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#D4AF37] font-semibold">
              Hospitality Desk & Concierge
            </span>
            <p className={`font-serif text-base font-bold ${theme.textPrimary}`}>
              {config.conciergeName || "Family Hospitality Desk"}
            </p>
          </div>
          {config.conciergePhone && (
            <a
              href={`tel:${config.conciergePhone}`}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-serif font-semibold transition ${theme.buttonPrimary}`}
            >
              <Phone size={14} />
              <span>Call Concierge: {config.conciergePhone}</span>
            </a>
          )}
        </div>
      )}
    </section>
  );
};
