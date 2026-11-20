"use client";

import React, { useState } from "react";
import { Heart, Sparkles, Check } from "lucide-react";
import { ReasonsSectionConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: ReasonsSectionConfig;
  theme: ThemeId;
}

export function ReasonsSection({ config, theme }: Props) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];
  const reasons = config.reasons || [];

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="sec-reasons" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-rose-100 text-rose-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2">
          Little Treasures 💖
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
          {config.headline || "Things I Never Want You To Forget"}
        </h2>
        <p className="text-sm sm:text-base opacity-80 mt-2 max-w-md mx-auto font-sans">
          {config.subtext || "Tap each heart to reveal a reason why you mean everything to me."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-2">
        {reasons.map((item, idx) => {
          const isRevealed = revealedIds.has(item.id);
          return (
            <div
              key={item.id || idx}
              onClick={() => toggleReveal(item.id)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 transform active:scale-95 border ${
                isRevealed
                  ? `${themeConfig.cardBgClass} shadow-xl scale-[1.01] border-rose-300/80`
                  : "bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border-dashed border-rose-200 dark:border-pink-900/60 hover:bg-white/80"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Heart Button Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    isRevealed
                      ? "bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-300/50"
                      : "bg-pink-100 dark:bg-pink-950 text-pink-500"
                  }`}
                >
                  {isRevealed ? (
                    <span className="text-xl">{item.emoji || "💖"}</span>
                  ) : (
                    <Heart size={22} className="fill-current animate-pulse" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-rose-950 dark:text-pink-100">
                      {item.title}
                    </h3>
                    <span className="text-xs text-rose-400 dark:text-pink-400">
                      {isRevealed ? "Tapped" : "Tap to open"}
                    </span>
                  </div>

                  {isRevealed ? (
                    <p className="font-sans text-sm text-stone-700 dark:text-rose-100 leading-relaxed mt-2 animate-in fade-in duration-300">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-xs text-stone-400 italic mt-1">
                      Secret message locked inside...
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

