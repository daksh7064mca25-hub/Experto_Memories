"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { Clock, Heart, Sparkles, Calendar, Infinity } from "lucide-react";
import { LoveCounterConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

const emptySubscribe = () => () => {};

interface Props {
  config: LoveCounterConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
}

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export function LoveCounterSection({
  config,
  recipientName,
  senderName,
  theme,
}: Props) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [elapsed, setElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  const startDateStr = config.startDate || "2023-08-14";

  // Format date for human readability
  const formattedStartDate = (() => {
    try {
      const d = new Date(startDateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      }
    } catch {}
    return startDateStr;
  })();

  const metricsList = (config.customMetrics && config.customMetrics.length > 0)
    ? config.customMetrics
    : [
        config.metric1Label && { label: config.metric1Label, value: config.metric1Value || "340+" },
        config.metric2Label && { label: config.metric2Label, value: config.metric2Value || "520+ hrs" },
        config.metric3Label && { label: config.metric3Label, value: config.metric3Value || "Infinite" },
      ].filter(Boolean) as { label: string; value: string }[];

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDateStr).getTime();
      const now = Date.now();
      const diff = Math.max(0, now - start);

      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      // Calculate approximate years, months, days
      const startDate = new Date(startDateStr);
      const currentDate = new Date();

      let years = currentDate.getFullYear() - startDate.getFullYear();
      let months = currentDate.getMonth() - startDate.getMonth();
      let days = currentDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setElapsed({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours,
        minutes,
        seconds,
        totalDays,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDateStr]);

  const units = [
    { label: "Years", value: elapsed.years },
    { label: "Months", value: elapsed.months },
    { label: "Days", value: elapsed.days },
    { label: "Hours", value: elapsed.hours },
    { label: "Minutes", value: elapsed.minutes },
    { label: "Seconds", value: elapsed.seconds, isSeconds: true },
  ];

  return (
    <section id="sec-love-counter" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Clock size={11} className="text-amber-300" />
            <span>Relationship Heartbeat Counter</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "How Long I Have Loved You"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext ||
              "Every second by your side is a gift. From our first chapter until right now, here is our time together."}
          </p>
        </div>

        {/* Milestone Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-serif font-bold mb-8 shadow-xs">
          <Sparkles size={13} className="text-amber-400" />
          <span>{config.milestoneBadgeText || `Over ${elapsed.totalDays} Days of Pure Magic Together`}</span>
          <Sparkles size={13} className="text-amber-400" />
        </div>

        {/* 6 Unit Live Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="bg-[#2a070e]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-400/35 shadow-lg shadow-rose-950/60 flex flex-col items-center justify-center relative overflow-hidden group hover:border-amber-400/60 transition-colors"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
              <span className="font-serif text-3xl sm:text-4xl font-bold text-rose-50 tracking-tight group-hover:text-amber-200 transition-colors">
                {mounted ? String(unit.value).padStart(2, "0") : "--"}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider mt-1 ${
                  unit.isSeconds ? "text-amber-300 font-bold" : "text-rose-300/80"
                }`}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Supporting Emotional Metrics */}
        {metricsList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 border-t border-amber-400/20">
            {metricsList.map((m: { label: string; value: string }, idx: number) => (
              <div key={idx} className="bg-[#24060c]/70 p-4 rounded-2xl border border-rose-900/40 text-center">
                <span className="font-serif text-xl font-bold text-amber-300 block mb-0.5">
                  {m.value}
                </span>
                <span className="text-[11px] font-serif text-rose-200/80">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-[11px] font-mono text-rose-400/70">
          Counting since <span className="text-amber-300 font-semibold">{formattedStartDate}</span> &bull; To infinity and beyond
        </div>
      </div>
    </section>
  );
}
