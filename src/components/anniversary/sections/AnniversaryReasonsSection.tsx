"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, CheckCircle2, RotateCw } from "lucide-react";
import { AnniversaryReasonsConfig, ReasonHeart, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryReasonsConfig;
  theme?: ThemeId;
}

const DEFAULT_REASONS: ReasonHeart[] = [
  {
    id: "r-1",
    title: "Your Infectious Smile",
    description:
      "The way your entire face lights up when you smile makes every ordinary day feel extraordinary.",
    emoji: "✨",
  },
  {
    id: "r-2",
    title: "How Safe You Make Me Feel",
    description:
      "In a chaotic and noisy world, being in your arms is the only place that feels like absolute peace.",
    emoji: "🏡",
  },
  {
    id: "r-3",
    title: "Your Gentle Kindness",
    description:
      "Watching how thoughtfully you treat people, animals, and everything you touch inspires me every day.",
    emoji: "🌸",
  },
  {
    id: "r-4",
    title: "The Quiet Moments",
    description:
      "Sunday mornings with coffee, holding hands on long drives, or simply watching you sleep peacefully.",
    emoji: "☕",
  },
  {
    id: "r-5",
    title: "You Are My Best Friend",
    description:
      "Before romance, before everything else, you are the first person I want to tell every piece of news.",
    emoji: "💍",
  },
  {
    id: "r-6",
    title: "How We Laugh Together",
    description:
      "Those uncontrollable belly laughs over private jokes that nobody else in the universe would ever understand.",
    emoji: "💫",
  },
];

export function AnniversaryReasonsSection({ config, theme = "pink-paradise" }: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");
  const reasons = config.reasons && config.reasons.length > 0 ? config.reasons : DEFAULT_REASONS;

  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    const nextFlipped = !flippedMap[id];
    setFlippedMap((prev) => {
      const updated = { ...prev, [id]: nextFlipped };
      // Trigger confetti if all cards are flipped
      if (nextFlipped && Object.values(updated).filter(Boolean).length === reasons.length) {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.65 },
          colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0", "#f43f5e"],
        });
      }
      return updated;
    });
  };

  const revealedCount = Object.values(flippedMap).filter(Boolean).length;

  return (
    <section
      id="anniv-sec-reasons"
      className="relative py-14 sm:py-20 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-white/90 text-[#6B2D38] border border-[#E8B4B8]/60 shadow-sm mb-3">
        <Heart size={13} className="text-[#C46879] fill-[#C46879]" />
        <span>From My Heart</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3D262A] mb-2 sm:mb-3">
        {config.headline || "Things I Love About You"}
      </h2>

      <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-md mx-auto mb-6 leading-relaxed">
        {config.subtext || "Tap each card to flip and reveal why my heart will always belong to you."}
      </p>

      {/* Progress pill */}
      <div className="mb-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8B4B8]/60 text-xs font-mono text-[#6B2D38] shadow-2xs">
        <Sparkles size={12} className="text-[#C46879]" />
        <span>
          {revealedCount} of {reasons.length} Reasons Unlocked
        </span>
        {revealedCount === reasons.length && <CheckCircle2 size={13} className="text-emerald-600" />}
      </div>

      {/* 3D Flip Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 justify-items-center">
        {reasons.map((item, idx) => {
          const isFlipped = Boolean(flippedMap[item.id]);

          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(item.id)}
              className="w-full max-w-xs h-60 cursor-pointer group [perspective:1000px]"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 rounded-3xl shadow-lg [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : "group-hover:scale-[1.02]"
                }`}
              >
                {/* FRONT FACE (Before Flip) */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-white/90 backdrop-blur-md border border-[#E8B4B8]/80 shadow-md flex flex-col justify-between text-left [backface-visibility:hidden]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-9 h-9 rounded-full bg-[#FFF5F6] border border-[#E8B4B8] flex items-center justify-center text-base shadow-xs">
                        {item.emoji || "🌸"}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#8C3A49] uppercase tracking-wider">
                        Reason #{idx + 1}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#3D262A] mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="font-serif italic text-xs text-[#6B2D38]/70 line-clamp-2">
                      Tap card to uncover this reason...
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8B4B8]/40 flex items-center justify-between text-[11px] font-serif text-[#6B2D38]">
                    <span>Tap to flip</span>
                    <RotateCw size={12} className="text-[#C46879] group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                </div>

                {/* BACK FACE (After Flip) */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-gradient-to-br from-[#FFF5F6] via-[#FAF6F0] to-[#FCE8EB] border-2 border-[#E8B4B8] shadow-xl flex flex-col justify-between text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-[#C46879] uppercase tracking-wider flex items-center gap-1">
                        <Heart size={11} className="fill-[#C46879]" />
                        Reason #{idx + 1}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-white/80 border border-[#E8B4B8] flex items-center justify-center text-xs">
                        {item.emoji || "✨"}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#3D262A] mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="font-sans text-xs sm:text-sm text-[#3D262A]/90 leading-relaxed overflow-y-auto max-h-24 pr-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8B4B8]/40 flex items-center justify-between text-[10px] font-mono text-[#8C3A49]">
                    <span>Revealed with love</span>
                    <Heart size={12} className="text-[#C46879] fill-[#C46879]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
