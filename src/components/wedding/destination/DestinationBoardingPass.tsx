"use client";

import React, { useState } from "react";
import { Plane, Compass, Sparkles, User, Calendar, MapPin, Share2, Check, Download, Bookmark } from "lucide-react";

interface DestinationBoardingPassProps {
  groomName: string;
  brideName: string;
  weddingDateText: string;
  venueName?: string;
  venueCity?: string;
  guestNameDefault?: string;
}

export const DestinationBoardingPass: React.FC<DestinationBoardingPassProps> = ({
  groomName,
  brideName,
  weddingDateText,
  venueName,
  venueCity,
  guestNameDefault = "Honored Guest",
}) => {
  const [guestName, setGuestName] = useState(guestNameDefault);
  const [isEditingName, setIsEditingName] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const finalGroom = groomName || "Kabir";
  const finalBride = brideName || "Natasha";
  const finalVenue = venueName || "The Oceanfront Lawns, The Leela Goa";
  const finalCity = venueCity || "South Goa, India";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <section
      id="sec-boarding-pass"
      className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16"
      aria-label="Personalized Destination Wedding Boarding Pass"
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#0E2437]/80 text-[#E5C378] text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-2 sm:mb-3 shadow-xs">
          <Bookmark size={12} className="text-[#F5D061]" />
          <span>BESPOKE KEEPSAKE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#0F2336] tracking-wide">
          Your Personalized Boarding Pass
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-serif italic text-stone-600 max-w-md mx-auto px-2">
          Personalize your digital souvenir and save it as your personal pass to our wedding celebration.
        </p>
      </div>

      {/* The Boarding Pass Card Container */}
      <div className="relative w-full bg-white rounded-2xl sm:rounded-3xl shadow-[0_15px_45px_rgba(15,35,54,0.12)] border border-[#D4AF37]/40 overflow-hidden flex flex-col md:flex-row">
        {/* Left / Top Main Ticket Body */}
        <div className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-[#FAF8F5] via-[#FFFDFB] to-[#F5EFE6] relative">
          {/* Header Strip */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3 sm:pb-4 mb-4 sm:mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0F2336] text-[#E5C378] flex items-center justify-center shadow-xs shrink-0">
                <Plane size={13} className="rotate-45" />
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-stone-500 block">
                  EXPERTO DESTINATIONS
                </span>
                <span className="text-[11px] sm:text-xs font-serif font-bold text-[#0F2336] block">
                  PASSENGER INVITATION PASS
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-[#A47E3B] font-semibold bg-[#F5E8C7] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-[#D4AF37]/30">
                FIRST CLASS VIP
              </span>
            </div>
          </div>

          {/* Passenger Name Section (Editable for Personalization) */}
          <div className="mb-4 sm:mb-6 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400 block mb-0.5">
                GUEST OF HONOR / PASSENGER
              </span>
              {isEditingName ? (
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                  className="w-full text-sm sm:text-lg font-serif font-semibold text-[#0F2336] border-b border-[#D4AF37] focus:outline-none bg-transparent"
                  placeholder="Enter your name..."
                />
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="text-sm sm:text-lg font-serif font-semibold text-[#0F2336] cursor-pointer hover:text-[#C5A36A] flex items-center gap-1.5 truncate group"
                  title="Click to personalize name"
                >
                  <span className="truncate">{guestName}</span>
                  <span className="text-[9px] font-mono text-[#C5A36A] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    (Edit)
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsEditingName(!isEditingName)}
              className="text-[10px] sm:text-[11px] font-mono text-[#0F2336] bg-stone-100 hover:bg-[#F5EFE6] px-2.5 py-1 rounded-lg border border-stone-300 cursor-pointer shrink-0 min-h-[30px]"
            >
              {isEditingName ? "Save" : "Edit"}
            </button>
          </div>

          {/* Flight Path Nodes */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 items-center text-center my-3 sm:my-4 py-2.5 sm:py-3 border-y border-[#D4AF37]/20">
            <div className="text-left min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400 block">ORIGIN</span>
              <span className="text-base sm:text-2xl font-serif font-bold text-[#0F2336] truncate block">HOME</span>
              <span className="text-[9px] sm:text-[10px] text-stone-500 block truncate">Anywhere In The World</span>
            </div>

            <div className="flex flex-col items-center px-1">
              <div className="flex items-center gap-1 text-[#C5A36A] w-full justify-center">
                <span className="w-4 sm:w-12 h-[1px] bg-[#C5A36A]/50" />
                <Plane size={13} className="rotate-90 text-[#996515] shrink-0" />
                <span className="w-4 sm:w-12 h-[1px] bg-[#C5A36A]/50" />
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono text-[#A47E3B] tracking-wider mt-0.5">DIRECT</span>
            </div>

            <div className="text-right min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400 block">DESTINATION</span>
              <span className="text-base sm:text-2xl font-serif font-bold text-[#0F2336] truncate block">GOA</span>
              <span className="text-[9px] sm:text-[10px] text-stone-500 block truncate">{finalCity}</span>
            </div>
          </div>

          {/* Key Ticket Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-3 sm:my-4">
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400 block">COUPLE</span>
              <span className="text-xs sm:text-sm font-serif font-semibold text-stone-800 truncate block">
                {finalBride} &amp; {finalGroom}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400 block">DATE</span>
              <span className="text-xs sm:text-sm font-serif font-semibold text-stone-800 truncate block">
                {weddingDateText.split("•")[0]}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400 block">VENUE</span>
              <span className="text-xs sm:text-sm font-serif font-semibold text-stone-800 truncate block">
                {finalVenue}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-stone-400 block">GATE</span>
              <span className="text-xs sm:text-sm font-serif font-semibold text-emerald-700 font-mono block">
                FOREVER-01
              </span>
            </div>
          </div>

          {/* Decorative Barcode / Serial Line */}
          <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-3 border-t border-dashed border-stone-300 flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-1 font-mono tracking-widest text-[8px] sm:text-[9px] text-stone-400 truncate">
              <span className="truncate">||||||| | ||||| |||| | |||||||| || |</span>
              <span className="hidden sm:inline font-mono">EM-DEST-2026</span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-mono text-[#A47E3B] uppercase tracking-wider shrink-0">
              OFFICIALLY ISSUED
            </span>
          </div>
        </div>

        {/* Perforation Divider with Authentic Notches */}
        <div className="relative flex md:flex-col items-center justify-between bg-stone-100 h-4 md:h-auto md:w-6 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-stone-300 shrink-0">
          {/* Mobile Horizontal Notches (Left and Right edges of the card) */}
          <div className="md:hidden absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF8F5] border border-stone-200 pointer-events-none" />
          <div className="md:hidden absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF8F5] border border-stone-200 pointer-events-none" />

          {/* Desktop Vertical Notches (Top and Bottom edges of the card) */}
          <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FAF8F5] border border-stone-200 pointer-events-none" />
          <div className="hidden md:block absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FAF8F5] border border-stone-200 pointer-events-none" />
        </div>

        {/* Right / Bottom Tear-off Stub */}
        <div className="w-full md:w-64 p-4 sm:p-7 bg-[#0F2336] text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Subtle Watermark Compass */}
          <Compass size={80} className="md:hidden absolute -bottom-4 -right-4 text-white/5 pointer-events-none" />
          <Compass size={140} className="hidden md:block absolute -bottom-8 -right-8 text-white/5 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#E5C378]">BOARDING STUB</span>
              <span className="text-[9px] font-mono text-emerald-400">CONFIRMED</span>
            </div>

            <div className="mb-2.5">
              <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest block">PASSENGER</span>
              <span className="text-xs sm:text-sm font-serif font-bold text-white truncate block">{guestName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <div>
                <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest block">DESTINATION</span>
                <span className="text-xs font-serif text-[#F5D061]">GOA (GOI)</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest block">CLASS</span>
                <span className="text-xs font-mono text-white">FIRST</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white/10 border border-white/15 text-center my-2">
              <span className="text-[9px] font-serif italic text-stone-200">
                “Pack your sunglasses &amp; dancing shoes!”
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/20 relative z-10">
            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#0A1A28] font-mono text-[11px] font-semibold tracking-wider uppercase hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md min-h-[36px]"
            >
              {copiedLink ? <Check size={13} /> : <Share2 size={13} />}
              <span>{copiedLink ? "Link Copied!" : "Share Pass"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
