"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Cake, Heart, ArrowDown } from "lucide-react";
import { BirthdayWelcomeConfig, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayWelcomeConfig;
  recipientName: string;
  senderName: string;
  birthdayDate?: string;
  age?: number;
  theme?: ThemeId;
}

export function BirthdayWelcomeSection({
  config,
  recipientName = "Birthday Star",
  senderName = "Someone Special",
  birthdayDate,
  age,
  theme,
}: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const effectiveDate = config.birthdayDate || birthdayDate || "Today";
  const effectiveAge = config.age || age;

  // Celebration / Countdown State
  const [timeStatus, setTimeStatus] = useState<{
    isTodayOrPast: boolean;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    isTodayOrPast: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      if (!effectiveDate || effectiveDate.toLowerCase() === "today") {
        setTimeStatus({ isTodayOrPast: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Try parsing date
      const targetDate = new Date(effectiveDate);
      if (isNaN(targetDate.getTime())) {
        setTimeStatus({ isTodayOrPast: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        // Birthday is today or has arrived
        setTimeStatus({ isTodayOrPast: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        // Upcoming birthday
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeStatus({ isTodayOrPast: false, days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [effectiveDate]);

  const handleScrollNext = () => {
    const nextSection = document.getElementById("bday-sec-balloons");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="bday-sec-welcome"
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 text-center select-none"
    >
      {/* Age / Milestone Badge */}
      {effectiveAge && (
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200/90 shadow-sm">
          <Cake size={13} className="text-amber-600" />
          <span>Celebrating {effectiveAge} Wonderful Years</span>
        </div>
      )}

      {/* Main Headline */}
      <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 mb-4 max-w-2xl leading-tight">
        {config.headline || `Happy Birthday, ${recipientName}! 🎂✨`}
      </h2>

      {/* Date badge */}
      <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-sans font-medium text-stone-600 mb-6">
        <Calendar size={14} className="text-amber-600" />
        <span>{effectiveDate}</span>
      </div>

      {/* Personalized Welcome Card */}
      <div className="relative w-full max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-xl shadow-amber-900/5 mb-8">
        <p className="font-sans text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed mb-6">
          {config.subheadline ||
            `Another trip around the sun for someone who makes every day brighter. Today is dedicated entirely to you, your smile, and all the joy you bring into the lives of everyone around you.`}
        </p>

        {/* Countdown / Celebration Banner */}
        {config.showCountdown !== false && (
          <div className="pt-4 border-t border-amber-100">
            {timeStatus.isTodayOrPast ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/70 text-amber-950 font-serif">
                <span className="block font-bold text-sm sm:text-base flex items-center justify-center gap-1.5">
                  <Sparkles size={15} className="text-amber-500" />
                  <span>The Celebration Has Begun! 🎉</span>
                </span>
                <span className="block text-[11px] font-sans text-stone-600 mt-1">
                  Today is all about celebrating the wonderful person you are.
                </span>
              </div>
            ) : (
              <div>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-800 mb-2">
                  Birthday Countdown
                </p>
                <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto">
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="block font-serif font-bold text-base sm:text-lg text-amber-950">
                      {timeStatus.days}
                    </span>
                    <span className="block text-[9px] font-mono text-stone-500 uppercase">Days</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="block font-serif font-bold text-base sm:text-lg text-amber-950">
                      {timeStatus.hours}
                    </span>
                    <span className="block text-[9px] font-mono text-stone-500 uppercase">Hours</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="block font-serif font-bold text-base sm:text-lg text-amber-950">
                      {timeStatus.minutes}
                    </span>
                    <span className="block text-[9px] font-mono text-stone-500 uppercase">Mins</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="block font-serif font-bold text-base sm:text-lg text-amber-950">
                      {timeStatus.seconds}
                    </span>
                    <span className="block text-[9px] font-mono text-stone-500 uppercase">Secs</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA to Discover Surprise */}
      <button
        type="button"
        onClick={handleScrollNext}
        className={`px-8 py-3.5 rounded-full font-serif font-bold text-sm tracking-wide transition-all shadow-xl flex items-center gap-2 ${themeConfig.primaryButtonClass}`}
      >
        <span>{config.buttonText || "Discover Your Surprise 🎈"}</span>
        <ArrowDown size={14} className="animate-bounce" />
      </button>
    </section>
  );
}
