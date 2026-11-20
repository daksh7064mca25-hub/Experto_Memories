"use client";

import React from "react";
import { WeddingEventsConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Calendar, Clock, MapPin, Sparkles, Navigation, Music, Shirt } from "lucide-react";

interface Props {
  config: WeddingEventsConfig;
  theme: WeddingThemeStyles;
}

export const WeddingEventsSection: React.FC<Props> = ({ config, theme }) => {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <Sparkles size={13} className="text-[#D4AF37]" />
          <span>Auspicious Celebrations</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {config.headline || "Celebration Agenda & Itinerary"}
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {config.subtext}
        </p>
      </div>

      {/* Events Timeline / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {(config.events || []).map((evt, idx) => (
          <div
            key={evt.id || idx}
            className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${theme.cardBg} ${theme.cardBorder}`}
          >
            <div>
              {/* Event Header with Number Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30">
                  Event 0{idx + 1}
                </span>
                {evt.icon && (
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <Sparkles size={16} />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className={`font-serif text-2xl font-bold mb-3 ${theme.textPrimary}`}>
                {evt.title}
              </h3>

              {/* Date & Time */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D4AF37] font-medium">
                  <Calendar size={14} className="shrink-0" />
                  <span>{evt.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#E6D9C8]/90">
                  <Clock size={14} className="shrink-0 text-[#D4AF37]" />
                  <span>{evt.time}</span>
                </div>
              </div>

              {/* Venue & Address */}
              <div className="flex items-start gap-2 text-xs sm:text-sm text-[#E6D9C8]/80 mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
                <MapPin size={16} className="shrink-0 text-[#D4AF37] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#FAF7F2]">{evt.venueName}</p>
                  <p className="text-xs text-[#E6D9C8]/70 leading-relaxed mt-0.5">{evt.address}</p>
                </div>
              </div>

              {/* Description */}
              {evt.description && (
                <p className={`text-xs sm:text-sm leading-relaxed mb-4 italic ${theme.textSecondary}`}>
                  {evt.description}
                </p>
              )}

              {/* Dress Code */}
              {evt.dressCode && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-[#F5DEB3] mb-4">
                  <Shirt size={13} className="text-[#D4AF37]" />
                  <span><strong>Dress Code:</strong> {evt.dressCode}</span>
                </div>
              )}
            </div>

            {/* Google Maps Link CTA */}
            {evt.googleMapsUrl && (
              <a
                href={evt.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-serif font-medium transition ${theme.buttonSecondary}`}
              >
                <Navigation size={14} className="text-[#D4AF37]" />
                <span>Get Venue Directions on Google Maps</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
