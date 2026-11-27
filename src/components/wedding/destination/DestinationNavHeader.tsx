"use client";

import React, { useState } from "react";
import { Plane, Compass, Menu, X, Calendar, MapPin, Sparkles, Heart, Camera, Clock, Bookmark, Mail } from "lucide-react";

interface DestinationNavHeaderProps {
  monogram: string;
  coupleNames: string;
  venueCity: string;
  onNavigate: (sectionId: string) => void;
}

export const DestinationNavHeader: React.FC<DestinationNavHeaderProps> = ({
  monogram,
  coupleNames,
  venueCity,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const navItems = [
    { id: "destination-invitation-card", label: "Invitation", icon: <Plane size={15} className="rotate-45" /> },
    { id: "sec-boarding-pass", label: "Boarding Pass", icon: <Bookmark size={15} /> },
    { id: "sec-destination-countdown", label: "Countdown", icon: <Clock size={15} /> },
    { id: "sec-destination-itinerary", label: "Itinerary", icon: <Calendar size={15} /> },
    { id: "sec-destination-map", label: "Map & Travel", icon: <MapPin size={15} /> },
    { id: "sec-couple-story", label: "Our Story", icon: <Heart size={15} /> },
    { id: "sec-destination-gallery", label: "Gallery", icon: <Camera size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#D4AF37]/35 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Corner: Brand Typography & Destination Flight Mark */}
        <div
          onClick={() => handleNavClick("destination-invitation-card")}
          className="flex flex-col cursor-pointer group text-left min-w-0 pr-2 select-none"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#0F2336] whitespace-nowrap truncate tracking-wide leading-tight group-hover:text-[#A47E3B] transition-colors">
              {coupleNames}
            </span>
            <Plane size={11} className="-rotate-45 text-[#A47E3B] shrink-0 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#A47E3B] uppercase whitespace-nowrap truncate">
            {venueCity || "Destination Wedding"}
          </span>
        </div>

        {/* Desktop Navigation Links (md and up) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-stone-600 hover:text-[#0F2336] hover:bg-stone-100/60 rounded-lg transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNavClick("sec-destination-rsvp")}
            className="ml-1 px-3.5 py-1.5 rounded-full bg-[#0F2336] text-white hover:bg-[#1A3854] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            RSVP
          </button>
        </nav>

        {/* Mobile Navigation Controls (< md) */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick("sec-destination-rsvp")}
            className="px-3 py-1 rounded-full bg-[#0F2336] text-white text-[11px] font-mono uppercase tracking-wider shadow-xs cursor-pointer min-h-[32px] flex items-center gap-1"
          >
            <Mail size={12} className="text-[#E5C378]" />
            <span>RSVP</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#0F2336] flex items-center justify-center transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#D4AF37]/35 shadow-2xl px-4 py-3 animate-[fadeIn_0.2s_ease-out]">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-mono tracking-wider text-[#0F2336] hover:bg-stone-100 transition-colors min-h-[44px]"
              >
                <span className="text-[#A47E3B] shrink-0">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleNavClick("sec-destination-rsvp")}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#0A1826] font-mono text-xs font-bold uppercase tracking-wider shadow-sm min-h-[44px]"
            >
              <Mail size={15} />
              <span>Confirm Attendance (RSVP) 💌</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
