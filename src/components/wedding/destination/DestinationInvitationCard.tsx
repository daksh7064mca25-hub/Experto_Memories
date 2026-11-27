"use client";

import React from "react";
import { Compass, Calendar, MapPin, Sparkles } from "lucide-react";

interface DestinationInvitationCardProps {
  groomName: string;
  brideName: string;
  groomTitle?: string;
  brideTitle?: string;
  parentsBlessing?: string;
  weddingDateText: string;
  venueName?: string;
  venueCity?: string;
  headline?: string;
  onNavigateToSection?: (sectionId: string) => void;
}

export const DestinationInvitationCard: React.FC<DestinationInvitationCardProps> = ({
  groomName,
  brideName,
  groomTitle,
  brideTitle,
  parentsBlessing,
  weddingDateText,
  venueName,
  venueCity,
  headline,
  onNavigateToSection,
}) => {
  const finalGroom = groomName || "Kabir";
  const finalBride = brideName || "Natasha";
  const finalVenue = venueName || "The Oceanfront Lawns, The Leela Goa";
  const finalCity = venueCity || "South Goa, India";

  const brideInitial = finalBride.charAt(0).toUpperCase();
  const groomInitial = finalGroom.charAt(0).toUpperCase();

  return (
    <section
      id="destination-invitation-card"
      className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16 md:py-20 flex flex-col items-center"
      aria-label="Official Destination Wedding Stationery Card"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-80 sm:h-96 bg-gradient-to-r from-[#D4AF37]/15 via-[#38BDF8]/10 to-[#E8A87C]/15 blur-3xl pointer-events-none -z-10" />

      {/* Main Luxury Stationery Folio Card */}
      <div className="relative w-full bg-[#FAF8F5] text-[#1E293B] rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-16 shadow-[0_15px_50px_rgba(10,25,40,0.12)] sm:shadow-[0_25px_70px_rgba(10,25,40,0.18)] border border-[#E2D5C3] overflow-hidden">
        {/* Paper Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#C5A36A_1px,transparent_1px)] [background-size:16px_16px] sm:[background-size:20px_20px]" />

        {/* Outer Ornamental Border */}
        <div className="absolute inset-2 sm:inset-4 border border-[#D4AF37]/40 rounded-xl sm:rounded-2xl pointer-events-none" />
        {/* Inner Filigree Border */}
        <div className="absolute inset-3 sm:inset-6 border border-[#D4AF37]/20 rounded-lg sm:rounded-xl pointer-events-none" />

        {/* Corner Flourishes */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 text-[#C5A36A] text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</div>
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 text-[#C5A36A] text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</div>
        <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 text-[#C5A36A] text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</div>
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 text-[#C5A36A] text-[10px] sm:text-xs font-serif pointer-events-none select-none">✦</div>

        {/* Top Header Motif: Compass & Monogram */}
        <div className="relative z-10 flex flex-col items-center text-center mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/60 bg-[#F4EFE6] flex items-center justify-center text-[#996515] shadow-xs mb-2 sm:mb-3">
            <Compass size={18} className="text-[#A47E3B]" />
          </div>

          <span className="text-[9px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#A47E3B] font-semibold">
            Bespoke Destination Wedding
          </span>

          <p className="mt-1.5 text-xs sm:text-sm font-serif italic text-stone-600 max-w-md px-2">
            “Together with their families, they invite you to celebrate love, adventure, and the beginning of forever.”
          </p>
        </div>

        {/* Family Introductions */}
        {(brideTitle || groomTitle) && (
          <div className="relative z-10 my-3 text-center max-w-lg mx-auto space-y-0.5 px-2">
            {brideTitle && (
              <p className="text-[11px] sm:text-xs font-serif text-stone-600 tracking-wide">
                {brideTitle}
              </p>
            )}
            <span className="text-[10px] font-serif text-[#C5A36A] italic">and</span>
            {groomTitle && (
              <p className="text-[11px] sm:text-xs font-serif text-stone-600 tracking-wide">
                {groomTitle}
              </p>
            )}
          </div>
        )}

        {/* Central Couple Name Statement */}
        <div className="relative z-10 my-4 sm:my-8 py-3 sm:py-6 text-center border-y border-[#D4AF37]/30">
          <span className="text-[11px] sm:text-xs font-serif italic text-stone-500 uppercase tracking-widest block mb-1">
            The Marriage of
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-6xl font-serif font-normal text-[#1E2E3E] tracking-tight leading-tight break-words">
            <span className="text-[#102437]">{finalBride}</span>
            <span className="mx-1.5 sm:mx-3 font-serif italic font-light text-[#C5A36A] text-xl sm:text-3xl">&</span>
            <span className="text-[#102437]">{finalGroom}</span>
          </h2>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="w-6 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C5A36A]" />
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#102437] text-[#FAF8F5] flex items-center justify-center text-[9px] sm:text-[10px] font-serif font-bold tracking-wider shadow-xs">
              {brideInitial}{groomInitial}
            </div>
            <span className="w-6 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C5A36A]" />
          </div>
        </div>

        {/* Date, Venue & City Details */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto my-4 sm:my-6 text-left">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F5EFE6]/70 border border-[#E8DEC8] flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#996515] shrink-0 shadow-xs">
              <Calendar size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono tracking-widest uppercase text-stone-500 block">
                CELEBRATION DATES
              </span>
              <span className="text-xs sm:text-sm font-serif font-semibold text-stone-800 block truncate">
                {weddingDateText}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F5EFE6]/70 border border-[#E8DEC8] flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#D4AF37]/30 flex items-center justify-center text-[#996515] shrink-0 shadow-xs">
              <MapPin size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono tracking-widest uppercase text-stone-500 block">
                VENUE &amp; DESTINATION
              </span>
              <span className="text-xs sm:text-sm font-serif font-semibold text-stone-800 block truncate">
                {finalVenue}
              </span>
              <span className="text-[11px] text-stone-500 block truncate">{finalCity}</span>
            </div>
          </div>
        </div>

        {/* Parents' Blessing */}
        {parentsBlessing && (
          <div className="relative z-10 max-w-lg mx-auto text-center my-4 p-3 sm:p-4 rounded-xl bg-stone-50/70 border border-stone-200">
            <p className="text-xs sm:text-sm font-serif italic text-stone-700 leading-relaxed">
              {parentsBlessing}
            </p>
          </div>
        )}

        {/* Quick Jump Action Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-[#D4AF37]/25 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {onNavigateToSection && (
            <>
              <button
                type="button"
                onClick={() => onNavigateToSection("sec-boarding-pass")}
                className="px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-wider bg-[#102437] text-white hover:bg-[#1A3854] transition-all shadow-xs cursor-pointer min-h-[36px]"
              >
                <span>Boarding Pass</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToSection("sec-destination-itinerary")}
                className="px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-wider bg-white border border-stone-300 text-stone-700 hover:border-[#D4AF37] hover:text-[#A47E3B] transition-all shadow-xs cursor-pointer min-h-[36px]"
              >
                <span>Itinerary</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToSection("sec-destination-rsvp")}
                className="px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-white hover:brightness-105 transition-all shadow-xs cursor-pointer min-h-[36px]"
              >
                <span>RSVP 💌</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
