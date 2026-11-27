"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Music, Heart, Sun, PartyPopper, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { WeddingEventData } from "@/types/website";

interface DestinationItineraryProps {
  events?: WeddingEventData[];
  headline?: string;
  subtext?: string;
}

export const DestinationItinerary: React.FC<DestinationItineraryProps> = ({
  events,
  headline = "The Wedding Celebration Itinerary 🎊",
  subtext = "A multi-day coastal celebration filled with sunshine, sacred vows, and starlit festivities.",
}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const displayEvents: WeddingEventData[] = events && events.length > 0 ? events : [
    {
      id: "evt-sundowner",
      title: "Sunset Beach Welcome & Coconut Bar",
      date: "Friday, November 06, 2026",
      time: "05:00 PM onwards",
      venueName: "The Beach Shack, The Leela Goa",
      address: "Mobor Beach, Cavelossim, Goa 403731",
      googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
      dressCode: "Tropical White & Linen Chic",
      description: "Barefoot beach welcome with fresh tender coconuts, tropical sundowners, live saxophone, and seaside bonfire under the palms.",
      icon: "sparkles",
    },
    {
      id: "evt-beach-mehendi",
      title: "Coastal Mehendi & Pool Party",
      date: "Saturday, November 07, 2026",
      time: "11:00 AM onwards",
      venueName: "The Lagoon Pavilion, The Leela Goa",
      address: "Mobor Beach, Cavelossim, Goa 403731",
      googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
      dressCode: "Aqua, Turquoise & Sunshine Yellow",
      description: "Mehendi artists, tropical fruit platters, poolside acoustic beats, and refreshing handcrafted cocktails by the infinity lagoon.",
      icon: "music",
    },
    {
      id: "evt-vows",
      title: "Oceanfront Sunset Vows & Pheras",
      date: "Saturday, November 07, 2026",
      time: "05:15 PM (At Sunset)",
      venueName: "The Ocean View Mandap, The Leela Goa",
      address: "Mobor Beach, Cavelossim, Goa 403731",
      googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
      dressCode: "Pastel Resort Formal",
      description: "Exchanging eternal vows on the white sands of Mobor beach as the sun dips into the Arabian Sea.",
      icon: "ring",
    },
    {
      id: "evt-gala",
      title: "The Coastal Gala Night & Fire Dancers",
      date: "Saturday, November 07, 2026",
      time: "08:30 PM onwards",
      venueName: "The Grand Coconut Grove, The Leela Goa",
      address: "Mobor Beach, Cavelossim, Goa 403731",
      googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
      dressCode: "Boho Luxe / Resort Glamour",
      description: "Gourmet coastal seafood feast, signature cocktails, international fire acrobatics, and dancing under the stars.",
      icon: "party",
    },
    {
      id: "evt-brunch",
      title: "Farewell Champagne & Sunshine Brunch",
      date: "Sunday, November 08, 2026",
      time: "10:30 AM onwards",
      venueName: "The Riverside Terrace, The Leela Goa",
      address: "Mobor Beach, Cavelossim, Goa 403731",
      googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
      dressCode: "Breezy Casual Resort Wear",
      description: "A lazy morning by the river Sal featuring fresh pastries, mimosas, heartfelt hugs, and safe travel wishes.",
      icon: "sun",
    },
  ];

  const getEventIcon = (iconName?: string) => {
    switch (iconName) {
      case "music":
        return <Music size={16} className="text-[#0284C7]" />;
      case "ring":
        return <Heart size={16} className="text-[#E11D48]" />;
      case "party":
        return <PartyPopper size={16} className="text-[#D97706]" />;
      case "sun":
        return <Sun size={16} className="text-[#CA8A04]" />;
      default:
        return <Sparkles size={16} className="text-[#C5A36A]" />;
    }
  };

  const toggleEvent = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <section
      id="sec-destination-itinerary"
      className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16"
      aria-label="Wedding Events Itinerary"
    >
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#0E2437]/80 text-[#E5C378] text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-2 sm:mb-3 shadow-xs">
          <Calendar size={12} className="text-[#F5D061]" />
          <span>CELEBRATION TIMELINE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#0F2336] tracking-wide">
          {headline}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-serif italic text-stone-600 max-w-md mx-auto px-2">
          {subtext}
        </p>
      </div>

      {/* Itinerary Cards Stack */}
      <div className="space-y-3 sm:space-y-4">
        {displayEvents.map((evt, idx) => {
          const isExpanded = expandedEventId === evt.id;

          return (
            <div
              key={evt.id || `event-${idx}`}
              className="bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 hover:border-[#D4AF37]/60 shadow-xs sm:shadow-sm transition-all duration-300 overflow-hidden"
            >
              {/* Event Card Summary Row */}
              <div
                onClick={() => toggleEvent(evt.id)}
                className="p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-[#FAF8F5]/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#F5EFE6] border border-[#E2D5C3] flex items-center justify-center shrink-0 shadow-xs">
                    {getEventIcon(evt.icon)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-[#A47E3B] font-semibold bg-[#F7F2E7] px-2 py-0.5 rounded-md">
                        {evt.date}
                      </span>
                      {evt.dressCode && (
                        <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-[#0369A1] bg-[#E0F2FE] px-2 py-0.5 rounded-md truncate max-w-[180px]">
                          👗 {evt.dressCode}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-xl font-serif font-semibold text-[#0F2336] break-words">
                      {evt.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-stone-500 font-serif mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#C5A36A]" />
                        <span>{evt.time}</span>
                      </span>
                      {evt.venueName && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={12} className="text-[#C5A36A] shrink-0" />
                          <span className="truncate">{evt.venueName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[11px] font-mono text-stone-400">
                    {isExpanded ? "Hide" : "Details"}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>
              </div>

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <div className="px-3.5 pb-5 pt-2 sm:px-6 sm:pb-6 border-t border-stone-100 bg-[#FAF8F5]/80 animate-[fadeIn_0.3s_ease-out]">
                  {evt.description && (
                    <p className="text-xs sm:text-sm font-serif text-stone-700 leading-relaxed mb-3">
                      {evt.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs font-serif text-stone-600 mb-3.5 p-3 rounded-xl bg-white border border-stone-200">
                    <div>
                      <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 block mb-0.5">
                        VENUE LOCATION
                      </span>
                      <span className="font-semibold text-stone-800 block">{evt.venueName}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">{evt.address}</p>
                    </div>

                    <div>
                      <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-400 block mb-0.5">
                        SUGGESTED ATTIRE
                      </span>
                      <span className="font-semibold text-stone-800 block">{evt.dressCode || "Resort Chic"}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Celebratory, comfortable, and photogenic.
                      </p>
                    </div>
                  </div>

                  {evt.googleMapsUrl && (
                    <div className="flex justify-end">
                      <a
                        href={evt.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F2336] text-white text-xs font-mono hover:bg-[#1E3A56] transition-colors min-h-[34px]"
                      >
                        <span>Directions to Venue</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
