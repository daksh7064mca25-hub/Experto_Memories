"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Check, BookmarkCheck } from "lucide-react";
import { AnniversaryPromisesConfig, AnniversaryPromiseCardItem, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryPromisesConfig;
  theme: ThemeId;
}

const DEFAULT_PROMISES: AnniversaryPromiseCardItem[] = [
  {
    id: "p-1",
    title: "Always Choose Kindness",
    promise: "I promise to speak to you gently, even in the middle of tough days, and never go to bed holding anger.",
    icon: "🕊️",
  },
  {
    id: "p-2",
    title: "Support Your Wildest Dreams",
    promise: "I promise to be your loudest cheerleader in every ambition and celebrate every small win with you.",
    icon: "🌟",
  },
  {
    id: "p-3",
    title: "Never Stop Dating You",
    promise: "I promise to keep planning spontaneous dates, buying flowers for no reason, and flirting with you forever.",
    icon: "💐",
  },
  {
    id: "p-4",
    title: "Be Your Safe Place",
    promise: "No matter how exhausting the world feels, I promise our home will always be your softest landing place.",
    icon: "🏡",
  },
];

export function AnniversaryPromiseCardsSection({ config, theme }: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");
  const promises = config.promises && config.promises.length > 0 ? config.promises : DEFAULT_PROMISES;

  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const isAlready = prev.includes(id);
      const updated = isAlready ? prev.filter((item) => item !== id) : [...prev, id];

      if (!isAlready && updated.length === promises.length) {
        confetti({
          particleCount: 60,
          spread: 75,
          origin: { y: 0.65 },
          colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0"],
        });
      }
      return updated;
    });
  };

  return (
    <section id="anniv-sec-promises" className="py-14 sm:py-20 px-4 max-w-4xl mx-auto select-none">
      <div className="text-center mb-10 sm:mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-white/90 text-[#6B2D38] border border-[#E8B4B8]/60 shadow-sm mb-3">
          <BookmarkCheck size={13} className="text-[#C46879]" />
          <span>My Sacred Vows</span>
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3D262A] mb-2">
          {config.headline || "Promises To My Forever Person"}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-md mx-auto leading-relaxed">
          {config.subtext || "Tap each card to unfold a promise I make to you for all our years ahead."}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
        {promises.map((item, idx) => {
          const isRevealed = revealedIds.includes(item.id);

          return (
            <div
              key={item.id || idx}
              onClick={() => toggleReveal(item.id)}
              className={`p-5 sm:p-6 rounded-3xl cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                isRevealed
                  ? "bg-white/95 backdrop-blur-md border-[#E8B4B8] shadow-xl shadow-[#6B2D38]/8 scale-[1.01]"
                  : "bg-white/80 hover:bg-white/95 backdrop-blur-sm border-[#E8B4B8]/50 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon || "💍"}</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B2D38]/70">
                    Vow #{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-[#3D262A] mb-2 leading-snug">
                  {item.title}
                </h3>

                {isRevealed ? (
                  <p className="font-sans text-xs sm:text-sm text-[#3D262A]/90 leading-relaxed animate-in fade-in duration-300">
                    {item.promise}
                  </p>
                ) : (
                  <p className="font-serif italic text-xs text-[#6B2D38]/70">
                    Tap to reveal my promise to you...
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8B4B8]/30 flex items-center justify-between text-[11px] font-serif">
                <span className={isRevealed ? "text-[#C46879] font-semibold" : "text-[#6B2D38]/60"}>
                  {isRevealed ? "Etched in my heart" : "Tap to open"}
                </span>
                <Heart
                  size={12}
                  className={isRevealed ? "text-[#C46879] fill-[#C46879]" : "text-[#E8B4B8]"}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
