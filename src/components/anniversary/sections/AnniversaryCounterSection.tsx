"use client";

import React, { useState, useEffect } from "react";
import { Clock, Heart, Sparkles, Calendar } from "lucide-react";
import { AnniversaryCounterConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryCounterConfig;
  relationshipStartDate?: string;
  anniversaryDate?: string;
  yearsTogether?: number;
  partner1Name?: string;
  partner2Name?: string;
  theme?: ThemeId;
}

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  isValid: boolean;
}

export function AnniversaryCounterSection({
  config,
  relationshipStartDate,
  anniversaryDate,
  yearsTogether,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme,
}: Props) {
  const themeConfig = getThemeConfig(theme || "pink-paradise", "anniversary");

  const effectiveDateStr =
    config.relationshipStartDate || relationshipStartDate || anniversaryDate;

  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>(() => {
    return calculateTime(effectiveDateStr, yearsTogether);
  });

  function calculateTime(dateStr?: string, fallbackYears?: number): TimeElapsed {
    if (!dateStr) {
      const yrs = fallbackYears || 1;
      return {
        years: yrs,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalDays: Math.round(yrs * 365.25),
        isValid: false,
      };
    }

    const start = new Date(dateStr);
    if (isNaN(start.getTime())) {
      const yrs = fallbackYears || 1;
      return {
        years: yrs,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalDays: Math.round(yrs * 365.25),
        isValid: false,
      };
    }

    const now = new Date();
    // If date is in future, handle gracefully
    const diffMs = Math.max(0, now.getTime() - start.getTime());
    const totalSecs = Math.floor(diffMs / 1000);
    const totalDays = Math.floor(totalSecs / 86400);

    // Approximate breakdown
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      hours,
      minutes,
      seconds,
      totalDays,
      isValid: true,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(calculateTime(effectiveDateStr, yearsTogether));
    }, 1000);
    return () => clearInterval(timer);
  }, [effectiveDateStr, yearsTogether]);

  return (
    <section
      id="anniv-sec-counter"
      className="relative py-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-rose-100 text-rose-900 border border-rose-200 mb-3 shadow-xs">
        <Clock size={13} className="text-rose-600" />
        <span>Every Second With You</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-2">
        {config.headline || "Our Time Together ❤️"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8">
        {config.subtext ||
          `From the moment our paths crossed to right now — counting every heartbeat shared between ${partner1Name} & ${partner2Name}.`}
      </p>

      {/* Live Counter Cards */}
      <div className="w-full max-w-2xl grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 mb-6">
        <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-md">
          <span className="block font-serif font-bold text-2xl sm:text-3xl text-rose-950">
            {timeElapsed.years}
          </span>
          <span className="block text-[10px] font-mono uppercase text-stone-500 font-semibold mt-0.5">
            Years
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-md">
          <span className="block font-serif font-bold text-2xl sm:text-3xl text-rose-950">
            {timeElapsed.months}
          </span>
          <span className="block text-[10px] font-mono uppercase text-stone-500 font-semibold mt-0.5">
            Months
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-md">
          <span className="block font-serif font-bold text-2xl sm:text-3xl text-rose-950">
            {timeElapsed.days}
          </span>
          <span className="block text-[10px] font-mono uppercase text-stone-500 font-semibold mt-0.5">
            Days
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-md">
          <span className="block font-serif font-bold text-2xl sm:text-3xl text-rose-950">
            {timeElapsed.hours}
          </span>
          <span className="block text-[10px] font-mono uppercase text-stone-500 font-semibold mt-0.5">
            Hours
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-md">
          <span className="block font-serif font-bold text-2xl sm:text-3xl text-rose-950">
            {timeElapsed.minutes}
          </span>
          <span className="block text-[10px] font-mono uppercase text-stone-500 font-semibold mt-0.5">
            Mins
          </span>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-md">
          <span className="block font-serif font-bold text-2xl sm:text-3xl text-rose-600 animate-pulse">
            {timeElapsed.seconds}
          </span>
          <span className="block text-[10px] font-mono uppercase text-stone-500 font-semibold mt-0.5">
            Secs
          </span>
        </div>
      </div>

      {/* Total Days summary pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-serif font-semibold bg-white/80 border border-stone-200 shadow-xs text-stone-700">
        <Heart size={12} className="text-rose-500 fill-rose-500" />
        <span>Over {timeElapsed.totalDays.toLocaleString()} unforgettable days of loving you</span>
      </div>
    </section>
  );
}
