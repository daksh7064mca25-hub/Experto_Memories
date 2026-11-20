"use client";

import React, { useState } from "react";
import { Heart, Sparkles, Check } from "lucide-react";
import { AnniversaryReasonsConfig, ReasonHeart, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryReasonsConfig;
  theme?: ThemeId;
}

const DEFAULT_REASONS: ReasonHeart[] = [
  {
    id: "r-1",
    title: "Your Infectious Laughter",
    description: "The way you laugh from your whole chest at my silliness makes any terrible day instantly disappear.",
    emoji: "💫",
  },
  {
    id: "r-2",
    title: "How Safe You Make Me Feel",
    description: "In a chaotic and unpredictable world, being in your arms is the only place that feels like absolute home.",
    emoji: "🏡",
  },
  {
    id: "r-3",
    title: "Your Relentless Kindness",
    description: "Watching how gently you treat animals, strangers, and the people you love inspires me to be a better person.",
    emoji: "🌸",
  },
  {
    id: "r-4",
    title: "The Quiet Moments",
    description: "Drinking coffee in silence on Sunday mornings, holding hands in traffic, or just watching you sleep peacefully.",
    emoji: "☕",
  },
  {
    id: "r-5",
    title: "You Are My Best Friend",
    description: "Before romance, before everything else, you are the first person I want to tell every piece of good or bad news.",
    emoji: "💍",
  },
];

export function AnniversaryReasonsSection({ config, theme }: Props) {
  const themeConfig = getThemeConfig(theme || "pink-paradise", "anniversary");
  const reasons = config.reasons && config.reasons.length > 0 ? config.reasons : DEFAULT_REASONS;

  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealedCount = Object.values(flippedMap).filter(Boolean).length;

  return (
    <section
      id="anniv-sec-reasons"
      className="relative py-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-rose-100 text-rose-900 border border-rose-200 mb-3 shadow-xs">
        <Heart size={13} className="text-rose-600 fill-current" />
        <span>From My Heart</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-2">
        {config.headline || "Reasons I Choose You 💖"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8">
        {config.subtext || "Tap each card to reveal one of the countless reasons why my heart will always belong to you."}
      </p>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
        {reasons.map((item, idx) => {
          const isFlipped = Boolean(flippedMap[item.id]);
          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(item.id)}
              className="w-full max-w-xs min-h-[170px] p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-200/90 shadow-lg cursor-pointer transition-all duration-300 hover:scale-103 hover:shadow-rose-300/30 active:scale-98 flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-sm shadow-inner">
                    {item.emoji || "❤️"}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-stone-400">
                    Reason #{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-rose-950 mb-1.5">
                  {item.title}
                </h3>

                <p className="font-sans text-xs text-stone-700 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-rose-50 flex items-center justify-between text-[10px] font-mono text-rose-500">
                <span>{isFlipped ? "Treasured ✨" : "Tap to acknowledge"}</span>
                {isFlipped && <Check size={12} className="text-rose-600" />}
              </div>
            </div>
          );
        })}

        {/* Final Grand Card */}
        <div className="w-full max-w-xs min-h-[170px] p-5 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white shadow-xl flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-sm">
                ♾️
              </span>
              <span className="text-[10px] font-mono font-bold text-white/80">
                Infinity
              </span>
            </div>

            <h3 className="font-serif font-bold text-base text-white mb-1.5">
              And A Million More...
            </h3>

            <p className="font-sans text-xs text-white/90 leading-relaxed">
              Every day I discover a brand new reason to fall in love with you all over again.
            </p>
          </div>

          <div className="pt-3 border-t border-white/20 text-[10px] font-mono text-white/80">
            Forever &amp; Always
          </div>
        </div>
      </div>
    </section>
  );
}
