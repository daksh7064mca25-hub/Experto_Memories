"use client";

import React from "react";
import { MapPin, Calendar, Heart, Sparkles, Volume2 } from "lucide-react";
import { AnniversaryFirstMetConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryFirstMetConfig;
  partner1Name?: string;
  partner2Name?: string;
  theme?: ThemeId;
}

export function AnniversaryFirstMetSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme,
}: Props) {
  const themeConfig = getThemeConfig(theme || "pink-paradise", "anniversary");

  return (
    <section
      id="anniv-sec-first-met"
      className="relative py-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-3 shadow-xs">
        <Sparkles size={13} className="text-amber-600" />
        <span>Chapter 1</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-2">
        {config.headline || "Where It All Began ✨"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8">
        {config.subtext || "The day two completely different worlds collided and nothing was ever ordinary again."}
      </p>

      {/* Editorial Card */}
      <div className="w-full max-w-2xl rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200 shadow-xl overflow-hidden text-left p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-stone-100 text-xs font-mono font-medium text-stone-600">
          {config.dateText && (
            <div className="flex items-center gap-1 text-rose-900 font-semibold">
              <Calendar size={13} className="text-rose-500" />
              <span>{config.dateText}</span>
            </div>
          )}
          {config.location && (
            <div className="flex items-center gap-1 text-stone-700">
              <MapPin size={13} className="text-amber-500" />
              <span>{config.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Optional Photo */}
          {config.photoUrl ? (
            <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden shrink-0 border border-stone-200 shadow-md">
              <img
                src={config.photoUrl}
                alt="First meeting memory"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shrink-0">
              <Heart size={28} className="fill-current" />
            </div>
          )}

          {/* Story Body */}
          <div className="flex-1">
            <p className="font-serif text-sm sm:text-base text-stone-700 leading-relaxed italic">
              &ldquo;
              {config.storyText ||
                `I still remember the very first second I saw you. In a crowded room, everything else simply faded into background noise. We started talking, and within five minutes I knew you were going to change my life forever.`}
              &rdquo;
            </p>
            <p className="font-mono text-[11px] font-semibold text-rose-800 mt-4">
              — {partner2Name} to {partner1Name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
