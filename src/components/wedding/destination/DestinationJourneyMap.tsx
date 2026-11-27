"use client";

import React from "react";
import { MapPin, Navigation, Compass, ExternalLink, Plane, Sun, Car, Luggage } from "lucide-react";

interface DestinationJourneyMapProps {
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  googleMapsUrl?: string;
  nearestAirport?: string;
  shuttleNotes?: string;
}

export const DestinationJourneyMap: React.FC<DestinationJourneyMapProps> = ({
  venueName = "The Leela Goa Resort & Palace",
  venueAddress = "Mobor Beach, Cavelossim, Goa 403731, India",
  venueCity = "South Goa, India",
  googleMapsUrl = "https://maps.google.com/?q=The+Leela+Goa",
  nearestAirport = "Goa International Airport (GOI / GOX)",
  shuttleNotes = "Complimentary private wedding shuttles will greet all flights at the arrivals terminal.",
}) => {
  return (
    <section
      id="sec-destination-map"
      className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16"
      aria-label="Destination Journey Map & Travel Logistics"
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#0E2437]/80 text-[#E5C378] text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-2 sm:mb-3 shadow-xs">
          <Navigation size={12} className="text-[#F5D061]" />
          <span>YOUR TRAVEL ROUTE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#0F2336] tracking-wide">
          The Journey to Our Paradise
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-serif italic text-stone-600 max-w-md mx-auto px-2">
          We’ve prepared every detail to make your arrival seamless, breezy, and filled with hospitality.
        </p>
      </div>

      {/* Illustrated Map & Route Card */}
      <div className="w-full bg-gradient-to-b from-[#FAF8F5] to-[#F3EDE2] rounded-2xl sm:rounded-3xl border border-[#D4AF37]/35 shadow-lg sm:shadow-xl p-4 sm:p-8 md:p-10 relative overflow-hidden">
        {/* Subtle Map Grid lines in background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0A1E2F_1px,transparent_1px)] [background-size:20px_20px] sm:[background-size:24px_24px]" />

        {/* Stylized Illustrated Route Map Viewport */}
        <div className="relative w-full h-44 sm:h-64 rounded-xl sm:rounded-2xl bg-[#091D2F] border border-[#234A6F] overflow-hidden p-3 sm:p-4 flex flex-col justify-between shadow-inner">
          {/* Subtle coastline contour path */}
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 500 200">
            <path
              d="M 50 180 Q 150 120 250 140 T 450 60"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <circle cx="420" cy="70" r="30" fill="#38BDF8" opacity="0.2" filter="blur(15px)" />
            <circle cx="80" cy="160" r="25" fill="#F5D061" opacity="0.2" filter="blur(15px)" />
          </svg>

          {/* Map Top Indicators */}
          <div className="relative z-10 flex items-center justify-between text-white text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-emerald-300">
                LIVE FLIGHT PATH
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[#F5D061] text-[10px] sm:text-xs">
              <Sun size={13} className="text-[#F5D061]" />
              <span>GOA • 29°C SUNNY</span>
            </div>
          </div>

          {/* Animated Airplane along the route */}
          <div className="relative z-10 flex items-center justify-between px-2 sm:px-12 my-auto w-full">
            {/* Departure Node */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#12314E] border border-sky-400/50 flex items-center justify-center text-sky-300 shadow-xs">
                <Compass size={16} />
              </div>
              <span className="text-[8px] sm:text-[10px] font-mono text-stone-300 mt-1 uppercase">YOUR AIRPORT</span>
            </div>

            {/* In-Flight Plane Icon with Flexible Connector Lines */}
            <div className="flex items-center justify-center flex-1 px-1 sm:px-4">
              <div className="flex items-center gap-1 text-[#D4AF37] w-full justify-center">
                <span className="flex-1 max-w-[36px] sm:max-w-[80px] h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <div className="p-1 sm:p-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] animate-pulse shrink-0">
                  <Plane size={15} className="rotate-90 text-[#F5D061]" />
                </div>
                <span className="flex-1 max-w-[36px] sm:max-w-[80px] h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
            </div>

            {/* Destination Pin Node */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C89B3C] text-[#091D2F] flex items-center justify-center shadow-xs animate-bounce">
                <MapPin size={18} />
              </div>
              <span className="text-[8px] sm:text-[10px] font-mono text-[#F5D061] mt-1 uppercase font-semibold">
                THE RESORT
              </span>
            </div>
          </div>

          {/* Map Bottom Status Bar */}
          <div className="relative z-10 flex flex-col xs:flex-row items-center justify-between text-stone-300 text-[8px] sm:text-[10px] font-mono gap-1 text-center xs:text-left">
            <span>COASTAL DESTINATION: 15.1583° N, 73.9482° E</span>
            <span className="text-[#F5D061]">ARABIAN SEA BREEZE</span>
          </div>
        </div>

        {/* Travel Logistics Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-1.5 text-[#0F2336]">
              <Plane size={15} className="text-[#C5A36A]" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Airport Info</span>
            </div>
            <p className="text-xs font-serif text-stone-700 leading-relaxed">
              {nearestAirport}
            </p>
            <span className="text-[9px] sm:text-[10px] text-stone-500 font-mono mt-1.5 block">
              Direct &amp; connecting flights daily.
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-1.5 text-[#0F2336]">
              <Car size={15} className="text-[#C5A36A]" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">Airport Shuttles</span>
            </div>
            <p className="text-xs font-serif text-stone-700 leading-relaxed">
              {shuttleNotes}
            </p>
            <span className="text-[9px] sm:text-[10px] text-stone-500 font-mono mt-1.5 block">
              Look for our welcome desk.
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/85 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-1.5 text-[#0F2336]">
              <Luggage size={15} className="text-[#C5A36A]" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">What to Pack</span>
            </div>
            <p className="text-xs font-serif text-stone-700 leading-relaxed">
              Resort chic linen, sunglasses, sunscreen, evening cocktail glamour, and beach sandals.
            </p>
            <span className="text-[9px] sm:text-[10px] text-stone-500 font-mono mt-1.5 block">
              Comfortable, breezy elegance.
            </span>
          </div>
        </div>

        {/* Venue Address & Directions Button */}
        <div className="mt-4 sm:mt-6 pt-4 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left min-w-0">
            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#0F2336] truncate">{venueName}</h4>
            <p className="text-[11px] sm:text-xs text-stone-600 font-serif truncate">{venueAddress}</p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0F2336] text-[#FAF8F5] hover:bg-[#1C3E5E] transition-all text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0 min-h-[40px]"
          >
            <span>Open in Google Maps</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </section>
  );
};
