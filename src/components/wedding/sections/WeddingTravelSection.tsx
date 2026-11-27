"use client";

import React from "react";
import { WeddingTravelConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { MapPin, Navigation, Plane, Train, Hotel, Bus, Phone, Compass, ExternalLink } from "lucide-react";

interface Props {
  config: WeddingTravelConfig;
  theme: WeddingThemeStyles;
}

export const WeddingTravelSection: React.FC<Props> = ({ config, theme }) => {
  const headline = config.headline || "Venue, Location & Hospitality";
  const subtext =
    config.subtext ||
    "Everything you need to arrive comfortably and celebrate with us.";

  const hasVenueDetails = Boolean(config.venueName || config.venueAddress);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto" id="venue-section">
      {/* Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <MapPin size={13} className="text-[#D4AF37]" />
          <span>Venue &amp; Location</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {headline}
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {subtext}
        </p>
      </div>

      {/* PRIMARY VENUE CARD (Section 5 highlight) */}
      {hasVenueDetails && (
        <div className={`mb-10 rounded-3xl p-6 sm:p-8 border shadow-xl ${theme.cardBg} ${theme.cardBorder}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#F59E0B]/10 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 text-[#D4AF37] shadow-md">
                <MapPin size={28} />
              </div>
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#D4AF37] font-bold">
                  Primary Celebration Venue
                </span>
                <h3 className={`font-serif text-xl sm:text-2xl font-bold ${theme.textPrimary} mt-0.5`}>
                  {config.venueName || "The Royal Mandap & Palace Grounds"}
                </h3>
                {config.venueAddress && (
                  <p className="text-xs sm:text-sm text-[#E6D9C8]/90 leading-relaxed mt-1">
                    {config.venueAddress}
                  </p>
                )}
              </div>
            </div>

            {config.googleMapsUrl && (
              <a
                href={config.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full md:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-serif font-semibold transition flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer ${theme.buttonPrimary}`}
              >
                <Navigation size={15} />
                <span>Get Directions &bull; Google Maps</span>
                <ExternalLink size={13} className="opacity-70" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Travel Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AIRPORT */}
        {config.nearestAirport && (
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 transition hover:scale-[1.01] ${theme.cardBg} ${theme.cardBorder}`}>
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
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 transition hover:scale-[1.01] ${theme.cardBg} ${theme.cardBorder}`}>
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
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 transition hover:scale-[1.01] ${theme.cardBg} ${theme.cardBorder}`}>
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
          <div className={`rounded-2xl p-6 border shadow-lg flex items-start gap-4 transition hover:scale-[1.01] ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 text-[#D4AF37]">
              <Bus size={24} />
            </div>
            <div>
              <h4 className={`font-serif text-lg font-bold mb-1 ${theme.textPrimary}`}>
                Transfers &amp; Shuttles
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
              Hospitality Desk &amp; Concierge
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
