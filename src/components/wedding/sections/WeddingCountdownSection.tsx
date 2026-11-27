"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { WeddingCountdownConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Calendar, MapPin, Sparkles, Heart } from "lucide-react";

const emptySubscribe = () => () => {};

interface Props {
  config: WeddingCountdownConfig;
  theme: WeddingThemeStyles;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const WeddingCountdownSection: React.FC<Props> = ({ config, theme }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    const target = new Date(config.targetDate || "2026-11-28T18:00:00+05:30").getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [config.targetDate]);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center" id="countdown-section">
      {/* City Badge */}
      {config.venueCity && (
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-4 ${theme.accentBadge}`}>
          <MapPin size={13} className="text-[#D4AF37]" />
          <span>{config.venueCity}</span>
        </div>
      )}

      <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
        {timeLeft.isPast
          ? "The Sacred Celebrations Have Begun! ✨"
          : config.headline || "Counting The Moments To Forever"}
      </h2>
      <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic mb-10 ${theme.textSecondary}`}>
        {timeLeft.isPast
          ? "Surrounded by holy chants, sacred fire, and beloved family, the couple is united in love."
          : config.subtext}
      </p>

      {/* Countdown Digits OR Post-Wedding Auspicious Banner */}
      {mounted && (
        timeLeft.isPast ? (
          <div className={`p-8 rounded-3xl border shadow-xl max-w-md mx-auto mb-10 text-center ${theme.cardBg} ${theme.cardBorder}`}>
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
              <Sparkles size={28} className="animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#FAF7F2] mb-1">
              Happily Ever After
            </h3>
            <p className="text-xs sm:text-sm font-serif italic text-[#D4AF37]">
              Thank you for blessing this sacred bond with your warm wishes and love.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto mb-10">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-3 sm:p-5 border shadow-xl flex flex-col items-center justify-center transition hover:scale-[1.02] ${theme.cardBg} ${theme.cardBorder}`}
              >
                <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#D4AF37] tracking-tight">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-sans mt-1 ${theme.textMuted}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Calendar Export CTA (When wedding is upcoming) */}
      {!timeLeft.isPast && config.calendarAddToGoogleUrl && (
        <a
          href={config.calendarAddToGoogleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-serif font-medium transition transform hover:scale-105 ${theme.buttonSecondary}`}
        >
          <Calendar size={15} className="text-[#D4AF37]" />
          <span>Save Date to Google Calendar</span>
        </a>
      )}
    </section>
  );
};
