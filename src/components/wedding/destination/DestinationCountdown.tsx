"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Sparkles } from "lucide-react";

interface DestinationCountdownProps {
  targetDate?: string;
  headline?: string;
  subtext?: string;
  venueCity?: string;
  calendarUrl?: string;
}

export const DestinationCountdown: React.FC<DestinationCountdownProps> = ({
  targetDate = "2026-11-07T17:00:00+05:30",
  headline = "Counting The Moments To Paradise ⏳",
  subtext = "Until the auspicious hour when Kabir and Natasha unite their lives by the Arabian Sea.",
  venueCity = "South Goa, India",
  calendarUrl,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <section
      id="sec-destination-countdown"
      className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16 text-center"
      aria-label="Destination Wedding Countdown"
    >
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#0E2437]/80 text-[#E5C378] text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-2 sm:mb-3 shadow-xs">
        <Clock size={12} className="text-[#F5D061]" />
        <span>COUNTDOWN TO VOWS</span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-serif text-[#0F2336] tracking-wide mb-2">
        {headline}
      </h2>

      <p className="text-xs sm:text-sm font-serif italic text-stone-600 max-w-md mx-auto mb-6 sm:mb-8 px-2">
        {subtext}
      </p>

      {/* 4-Unit Responsive Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto mb-6 sm:mb-8">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#D4AF37]/40 shadow-xs flex flex-col items-center justify-center min-w-0"
          >
            <span className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#102437] tabular-nums tracking-tight">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[11px] font-mono tracking-wider text-[#A47E3B] font-semibold mt-1 whitespace-nowrap">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {calendarUrl && (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2336] text-[#FAF8F5] hover:bg-[#1A3854] text-xs font-mono uppercase tracking-wider transition-all shadow-xs min-h-[40px]"
        >
          <Calendar size={13} className="text-[#D4AF37]" />
          <span>Add to Calendar</span>
        </a>
      )}
    </section>
  );
};
