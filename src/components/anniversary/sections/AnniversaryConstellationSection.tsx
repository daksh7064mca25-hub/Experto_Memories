"use client";

import React, { useState } from "react";
import { Sparkles, Star, X, Calendar, Eye } from "lucide-react";
import { AnniversaryConstellationConfig, ConstellationStar, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryConstellationConfig;
  theme: ThemeId;
}

export function AnniversaryConstellationSection({ config, theme }: Props) {
  const [activeStar, setActiveStar] = useState<ConstellationStar | null>(null);
  const themeConfig = getThemeConfig(theme, "anniversary");
  const stars = config.stars || [];

  return (
    <section id="anniv-sec-constellation" className="py-16 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 mb-2 border border-purple-200 dark:border-purple-800">
          Celestial Galaxy 🌌
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100">
          {config.headline || "Our Little Universe"}
        </h2>
        <p className="text-sm opacity-80 mt-2 max-w-md mx-auto font-sans leading-relaxed">
          {config.subtext ||
            "Tap the glowing stars in our personal galaxy to reveal sacred memories."}
        </p>
      </div>

      {/* Celestial Starfield Interactive Canvas Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[320px] rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500/30 bg-gradient-to-b from-[#0c051a] via-[#170a2c] to-[#080214] select-none touch-none">
        {/* Subtle Constellation Connecting Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          {stars.map((star, idx) => {
            if (idx === stars.length - 1) return null;
            const nextStar = stars[idx + 1];
            return (
              <line
                key={`line-${idx}`}
                x1={`${star.xPercent}%`}
                y1={`${star.yPercent}%`}
                x2={`${nextStar.xPercent}%`}
                y2={`${nextStar.yPercent}%`}
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Floating Stars */}
        {stars.map((star, idx) => {
          const isSelected = activeStar?.id === star.id;

          return (
            <div
              key={star.id || idx}
              style={{
                left: `${star.xPercent}%`,
                top: `${star.yPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              {/* Touch Target Area (min 44x44px for smartphone accessibility) */}
              <button
                type="button"
                onClick={() => setActiveStar(star)}
                aria-label={`Open memory star: ${star.label}`}
                className="relative w-12 h-12 flex items-center justify-center group focus:outline-none"
              >
                {/* Glow ring halo */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isSelected
                      ? "bg-purple-400/40 animate-ping"
                      : "bg-purple-300/10 group-hover:bg-purple-400/30"
                  }`}
                />

                {/* Glowing Core Star */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                    isSelected
                      ? "bg-amber-300 text-stone-900 scale-125 shadow-lg shadow-amber-300/80"
                      : "bg-purple-100 text-purple-900 group-hover:scale-110 shadow-md shadow-purple-500/50"
                  }`}
                >
                  <Star size={13} className="fill-current animate-pulse" />
                </div>

                {/* Star Label Tag */}
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono tracking-wider font-semibold text-purple-200/90 pointer-events-none drop-shadow">
                  {star.label}
                </span>
              </button>
            </div>
          );
        })}

        {/* Active Memory Overlay Modal inside galaxy */}
        {activeStar && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
            <div className="relative max-w-sm w-full bg-[#1e1338] border border-purple-500/60 rounded-2xl p-5 shadow-2xl text-purple-100">
              <button
                type="button"
                onClick={() => setActiveStar(null)}
                aria-label="Close star memory"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-900/60 text-purple-200 hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 mb-1">
                <Star size={12} className="fill-current" />
                <span>{activeStar.label}</span>
                {activeStar.memoryDate && (
                  <span className="text-purple-300 font-sans font-normal ml-1">
                    • {activeStar.memoryDate}
                  </span>
                )}
              </div>

              <h4 className="font-serif font-bold text-lg text-white mb-2">
                {activeStar.memoryTitle}
              </h4>

              <p className="font-sans text-xs sm:text-sm text-purple-200/90 leading-relaxed mb-4">
                {activeStar.memoryText}
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStar(null)}
                  className="px-4 py-1.5 rounded-full text-xs font-serif font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-sm min-h-[36px]"
                >
                  Close Star ✨
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-stone-500 dark:text-purple-300 italic">
        (Tap any glowing star node to explore the memory locked within)
      </div>
    </section>
  );
}

