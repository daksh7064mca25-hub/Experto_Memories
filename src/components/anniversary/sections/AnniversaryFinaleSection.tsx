"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, MessageCircle, PartyPopper, Calendar } from "lucide-react";
import { AnniversaryFinaleConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryFinaleConfig;
  partner1Name?: string;
  partner2Name?: string;
  theme: ThemeId;
  onReplay?: () => void;
}

export function AnniversaryFinaleSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme,
  onReplay,
}: Props) {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const themeConfig = getThemeConfig(theme, "anniversary");

  const handleReplayClick = () => {
    if (onReplay) {
      onReplay();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCelebrate = () => {
    setHasCelebrated(true);
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#ec4899", "#a855f7", "#fbbf24", "#fda4af"],
    });
  };

  return (
    <section id="anniv-sec-finale" className="py-20 px-4 max-w-xl mx-auto text-center select-none">
      <div className={`${themeConfig.cardBgClass} rounded-3xl p-8 sm:p-10 shadow-2xl border relative overflow-hidden`}>
        {/* Decorative corner stars */}
        <div className="absolute top-4 left-4 text-amber-300">✦</div>
        <div className="absolute top-4 right-4 text-amber-300">✦</div>

        {/* Heart Emblem */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
          <Heart size={32} className="fill-current animate-pulse" />
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100 mb-2">
          {config.headline || "Another Year, A Lifetime More"}
        </h2>

        {config.anniversaryDate && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-serif italic text-amber-700 dark:text-purple-300 mb-4">
            <Calendar size={13} />
            <span>{config.anniversaryDate}</span>
          </div>
        )}

        <p className="font-sans text-xs sm:text-sm opacity-85 leading-relaxed mb-8 max-w-md mx-auto">
          {config.finalMessage ||
            "Every single day with you proves that true love isn't just found — it is created, treasured, and chosen every morning."}
        </p>

        {!hasCelebrated ? (
          /* Question & CTA */
          <div className="space-y-4">
            <p className="font-serif font-bold text-lg text-amber-900 dark:text-purple-100">
              {config.questionText || "Ready for another beautiful chapter with me?"}
            </p>

            <button
              type="button"
              onClick={handleCelebrate}
              className={`w-full sm:w-auto min-h-[48px] px-8 py-4 rounded-full font-serif font-bold text-base transition-transform active:scale-95 shadow-xl ${themeConfig.primaryButtonClass}`}
            >
              {config.acceptButtonText || "Yes, Forever & Always 💍"}
            </button>
          </div>
        ) : (
          /* Celebration Response Screen */
          <div className="p-6 rounded-2xl bg-amber-50/90 dark:bg-purple-950/50 border border-amber-200 dark:border-purple-800 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-200/80 dark:bg-purple-900 flex items-center justify-center text-amber-700 dark:text-purple-200">
              <PartyPopper size={24} className="animate-bounce" />
            </div>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-purple-100 mb-2">
              {config.celebrationTitle || "To Us, Today and Always! 🥂"}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-purple-200 leading-relaxed mb-5 max-w-sm mx-auto">
              {config.celebrationMessage ||
                "Thank you for making our story the most magical adventure of my life. I love you more than words could ever tell."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I walked through our story, ${partner2Name}. Happy Anniversary, my forever love! ❤️`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-serif font-semibold text-xs sm:text-sm min-h-[44px] ${themeConfig.primaryButtonClass}`}
              >
                <MessageCircle size={16} />
                <span>Text {partner2Name} on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleReplayClick}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-serif font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
              >
                <span>Replay Our Story ↺</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Brand Footer */}
      <div className="mt-12 text-center text-xs opacity-70">
        <p className="font-serif">Made with love via ExpertoMemories</p>
        <p className="font-sans text-[10px] mt-0.5">&ldquo;Our Forever Story&rdquo; 💍</p>
      </div>
    </section>
  );
}

