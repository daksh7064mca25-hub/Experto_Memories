"use client";

import React, { useState, useEffect } from "react";
import { Clock, Heart, Sparkles, Calendar, Hourglass, Award } from "lucide-react";
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

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  nextMilestoneTitle: string;
}

export function AnniversaryCounterSection({
  config,
  relationshipStartDate,
  anniversaryDate,
  yearsTogether,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme = "pink-paradise",
}: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");

  const effectiveStartDateStr =
    config.relationshipStartDate || relationshipStartDate || anniversaryDate || "October 14, 2021";

  const [isMounted, setIsMounted] = useState(false);

  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>(() =>
    calculateTimeElapsed(effectiveStartDateStr, yearsTogether)
  );

  const [annivCountdown, setAnnivCountdown] = useState<Countdown>(() =>
    calculateNextMilestone(effectiveStartDateStr, config.nextAnniversaryDate || anniversaryDate)
  );

  function calculateTimeElapsed(dateStr?: string, fallbackYears?: number): TimeElapsed {
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
    const diffMs = Math.max(0, now.getTime() - start.getTime());
    const totalSecs = Math.floor(diffMs / 1000);
    const totalDays = Math.floor(totalSecs / 86400);

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

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      totalDays,
      isValid: true,
    };
  }

  function calculateNextMilestone(startStr?: string, targetStr?: string): Countdown {
    const now = new Date();
    let targetMonth = 9; // Oct default
    let targetDay = 14;

    if (targetStr) {
      const parsed = new Date(targetStr);
      if (!isNaN(parsed.getTime())) {
        targetMonth = parsed.getMonth();
        targetDay = parsed.getDate();
      }
    } else if (startStr) {
      const parsed = new Date(startStr);
      if (!isNaN(parsed.getTime())) {
        targetMonth = parsed.getMonth();
        targetDay = parsed.getDate();
      }
    }

    let next = new Date(now.getFullYear(), targetMonth, targetDay, 0, 0, 0);
    if (next.getTime() < now.getTime() - 86400000) {
      next = new Date(now.getFullYear() + 1, targetMonth, targetDay, 0, 0, 0);
    }

    const diff = next.getTime() - now.getTime();
    if (diff <= 0 && diff > -86400000) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isToday: true,
        nextMilestoneTitle: "Our Anniversary Celebration",
      };
    }

    const positiveDiff = Math.max(0, diff);
    const days = Math.floor(positiveDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((positiveDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((positiveDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((positiveDiff / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      isToday: false,
      nextMilestoneTitle: "Next Anniversary Milestone",
    };
  }

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    requestAnimationFrame(() => {
      setIsMounted(true);
      const updateTimes = () => {
        setTimeElapsed(calculateTimeElapsed(effectiveStartDateStr, yearsTogether));
        setAnnivCountdown(
          calculateNextMilestone(effectiveStartDateStr, config.nextAnniversaryDate || anniversaryDate)
        );
      };
      updateTimes();
      timer = setInterval(updateTimes, 1000);
    });
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [effectiveStartDateStr, yearsTogether, config.nextAnniversaryDate, anniversaryDate]);

  // Compute next 500-day or 1000-day round milestone
  const currentTotalDays = timeElapsed.totalDays;
  const nextRoundMilestone = Math.ceil((currentTotalDays + 1) / 500) * 500;
  const daysToRoundMilestone = Math.max(1, nextRoundMilestone - currentTotalDays);

  // Structured countdown units: 2x3 on mobile, 3x2 on tablet, 6x1 on desktop
  const counterUnits = [
    { value: timeElapsed.years, label: "Years", isPulse: false },
    { value: timeElapsed.months, label: "Months", isPulse: false },
    { value: timeElapsed.days, label: "Days", isPulse: false },
    { value: timeElapsed.hours, label: "Hours", isPulse: false },
    { value: timeElapsed.minutes, label: "Minutes", isPulse: false },
    { value: timeElapsed.seconds, label: "Seconds", isPulse: true },
  ];

  return (
    <section
      id="anniv-sec-counter"
      suppressHydrationWarning
      className="relative py-12 sm:py-16 md:py-20 px-3.5 sm:px-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Decorative Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-serif font-medium bg-white/95 text-[#6B2D38] border border-[#E8B4B8]/70 shadow-xs mb-2.5 sm:mb-3">
        <Clock size={12} className="text-[#C46879] shrink-0" />
        <span>Every Second With You</span>
      </div>

      <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3D262A] mb-2 sm:mb-2.5">
        {config.headline || "Time Together"}
      </h2>

      <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
        {config.subtext ||
          `From the moment our paths crossed to right now — counting every heartbeat shared between ${partner1Name} & ${partner2Name}.`}
      </p>

      {/* Main Warm Ivory Board Container */}
      <div className="w-full max-w-2xl bg-[#FFFDF9]/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-[#E8B4B8] sm:border-2 shadow-xl sm:shadow-2xl shadow-[#6B2D38]/10 mb-4 sm:mb-6">
        {/* Board Header Note: Together Since */}
        <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8B4B8]/60 mx-auto mb-4 sm:mb-6 shadow-2xs">
          <Calendar size={13} className="text-[#C46879] shrink-0" />
          <span className="font-serif text-xs sm:text-sm text-[#6B2D38] font-medium tracking-wide">
            Together Since <strong className="font-semibold text-[#3D262A]">{effectiveStartDateStr}</strong>
          </span>
        </div>

        {/* 6 Statistic Counters: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop */}
        <div
          suppressHydrationWarning
          className="anniv-counter-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-3.5 mb-4 sm:mb-6"
        >
          {counterUnits.map((u) => (
            <div
              key={u.label}
              className="anniv-counter-unit flex flex-col items-center justify-center py-3 px-2 sm:py-3.5 sm:px-2.5 md:py-4 md:px-2 rounded-xl sm:rounded-2xl bg-white border border-[#E8B4B8]/80 shadow-xs transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span
                suppressHydrationWarning
                className={`block font-serif font-bold text-2xl sm:text-2xl md:text-3xl leading-none tracking-tight mb-1 ${
                  u.isPulse ? "text-[#C46879] animate-pulse" : "text-[#6B2D38]"
                }`}
              >
                {u.value}
              </span>
              <span className="anniv-counter-label block text-[10px] sm:text-[10.5px] md:text-[11px] font-mono uppercase tracking-wider text-[#8C3A49] font-semibold whitespace-nowrap select-none">
                {u.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2 Milestone Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-3.5 sm:pt-4 border-t border-[#E8B4B8]/40">
          {/* Milestone Badge 1: Total Days Together */}
          <div
            suppressHydrationWarning
            className="flex items-center justify-center gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8]/70 text-xs sm:text-[13px] font-serif text-[#3D262A] shadow-2xs"
          >
            <Heart size={14} className="text-[#C46879] fill-[#C46879] shrink-0" />
            <span suppressHydrationWarning className="font-semibold whitespace-nowrap">
              {timeElapsed.totalDays.toLocaleString()} Days Together
            </span>
          </div>

          {/* Milestone Badge 2: Next Milestone Countdown */}
          <div
            suppressHydrationWarning
            className="flex items-center justify-center gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#FAF6F0] border border-[#E8B4B8]/70 text-xs sm:text-[13px] font-serif text-[#3D262A] shadow-2xs"
          >
            <Award size={14} className="text-[#C46879] shrink-0" />
            <span suppressHydrationWarning className="font-semibold whitespace-nowrap">
              {annivCountdown.isToday
                ? "Happy Anniversary Today! 🥂"
                : `${annivCountdown.days} Days to Next Anniversary`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
