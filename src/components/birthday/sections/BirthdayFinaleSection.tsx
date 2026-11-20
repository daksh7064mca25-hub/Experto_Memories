"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, PartyPopper, RotateCcw, Heart, Share2, MessageCircle } from "lucide-react";
import { BirthdayFinaleConfig, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayFinaleConfig;
  recipientName: string;
  senderName: string;
  theme?: ThemeId;
  onReplay?: () => void;
}

export function BirthdayFinaleSection({
  config,
  recipientName = "Birthday Superstar",
  senderName = "Someone Special",
  theme,
  onReplay,
}: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const handleCelebrate = () => {
    setHasCelebrated(true);
    // Multi-stage fireworks confetti
    const end = Date.now() + 1.5 * 1000;
    const colors = ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#fbbf24"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleReplayClick = () => {
    if (onReplay) {
      onReplay();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hey ${senderName}! I just opened the magical birthday website you created for me. It made my day so special! Thank you so much! ❤️🎉`
  );

  return (
    <section
      id="bday-sec-finale"
      className="relative min-h-[90vh] py-20 px-4 max-w-xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      <div className="w-full rounded-3xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative corner stars */}
        <div className="absolute top-4 left-4 text-amber-300">✦</div>
        <div className="absolute top-4 right-4 text-amber-300">✦</div>

        {/* Party Popper Emblem */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
          <PartyPopper size={32} className="animate-bounce" />
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mb-3">
          {config.headline || `Happy Birthday, ${recipientName}! 🥂✨`}
        </h2>

        {/* Commemorative Photo (Optional) */}
        {config.celebrationPhotoUrl && (
          <div className="relative w-40 h-40 mx-auto my-4 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-md">
            <img
              src={config.celebrationPhotoUrl}
              alt="Celebration moment"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed max-w-md mx-auto mb-8">
          {config.finalMessage ||
            `Thank you for making this world a kinder, happier, and infinitely more wonderful place just by being you. Here is to health, unshakeable happiness, and a year full of magic!`}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCelebrate}
            className={`w-full sm:w-auto px-6 py-3 rounded-full font-serif font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 ${themeConfig.primaryButtonClass}`}
          >
            <span>Celebrate One More Time! 🎆</span>
          </button>

          <button
            type="button"
            onClick={handleReplayClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full font-serif font-semibold text-xs sm:text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors"
          >
            <RotateCcw size={13} />
            <span>{config.replayButtonText || "Replay Celebration ↺"}</span>
          </button>
        </div>

        {/* Thank Sender WhatsApp Button */}
        <div className="mt-8 pt-6 border-t border-amber-100">
          <a
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors"
          >
            <MessageCircle size={13} />
            <span>Thank {senderName} on WhatsApp ❤️</span>
          </a>
        </div>
      </div>
    </section>
  );
}
