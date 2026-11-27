"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Heart, Sparkles, PartyPopper, Calendar, RotateCcw, Gift } from "lucide-react";
import { AnniversaryFinaleConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { isProtectedMediaUrl } from "@/lib/media-utils";

interface Props {
  config: AnniversaryFinaleConfig;
  partner1Name?: string;
  partner2Name?: string;
  theme?: ThemeId;
  onReplay?: () => void;
}

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80";

export function AnniversaryFinaleSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme = "pink-paradise",
  onReplay,
}: Props) {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [revealedSurprise, setRevealedSurprise] = useState(false);
  const themeConfig = getThemeConfig(theme, "anniversary");

  const finalPhoto = config.finalPhotoUrl || DEFAULT_PHOTO;

  const handleCelebrate = () => {
    setHasCelebrated(true);
    confetti({
      particleCount: 130,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0", "#f43f5e", "#ffd700"],
    });
  };

  const handleReplayClick = () => {
    if (onReplay) {
      onReplay();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section id="anniv-sec-finale" className="py-16 sm:py-24 px-4 max-w-xl mx-auto text-center select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E8B4B8]/80 shadow-[#6B2D38]/12 relative overflow-hidden">
        {/* Heart Medallion */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#C46879] via-[#E8B4B8] to-[#6B2D38] flex items-center justify-center text-white shadow-xl shadow-[#C46879]/30">
          <Heart size={30} className="fill-white text-white animate-pulse" />
        </div>

        {/* Closing Heading with Couple Names */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#3D262A] mb-2 leading-snug">
          {config.headline || `Happy Anniversary, ${partner1Name} & ${partner2Name}!`}
        </h2>

        {config.anniversaryDate && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-serif italic text-[#6B2D38]/80 mb-5">
            <Calendar size={13} className="text-[#C46879]" />
            <span>{config.anniversaryDate}</span>
          </div>
        )}

        {/* Special Couple Photograph */}
        {finalPhoto && (
          <div className="relative aspect-[4/3] max-w-xs mx-auto rounded-3xl overflow-hidden mb-6 border-2 border-[#E8B4B8] shadow-lg bg-[#FAF6F0]">
            <Image
              src={finalPhoto}
              alt="Final anniversary memory"
              fill
              unoptimized={isProtectedMediaUrl(finalPhoto)}
              sizes="(max-width: 640px) 280px, 340px"
              className="object-cover"
            />
          </div>
        )}

        {/* Final Romantic Message */}
        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/90 leading-relaxed mb-8 max-w-md mx-auto">
          {config.finalMessage ||
            "Every single day with you proves that true love isn't just found — it is created, treasured, and chosen every morning."}
        </p>

        {!hasCelebrated ? (
          /* Question & Celebrate Button */
          <div className="space-y-4">
            <p className="font-serif font-bold text-base sm:text-lg text-[#3D262A]">
              {config.questionText || "Ready for another beautiful lifetime with me?"}
            </p>

            <button
              type="button"
              onClick={handleCelebrate}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full font-serif font-bold text-sm sm:text-base bg-gradient-to-r from-[#C46879] via-[#B35768] to-[#6B2D38] text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#C46879]/30"
            >
              {config.acceptButtonText || "Yes, Forever & Always 💍"}
            </button>
          </div>
        ) : (
          /* Celebration Response Screen with One Last Surprise */
          <div className="p-6 rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8] animate-in zoom-in-95 duration-300 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#FAF6F0] border border-[#E8B4B8] flex items-center justify-center text-[#C46879]">
              <PartyPopper size={22} className="animate-bounce" />
            </div>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3D262A] mb-2">
              {config.celebrationTitle || "To Us, Today and Always! 🥂"}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-[#6B2D38] leading-relaxed mb-5 max-w-sm mx-auto">
              {config.celebrationMessage ||
                "Thank you for making our story the most magical adventure of my life. I love you more than words could ever tell."}
            </p>

            {/* "One Last Surprise ❤️" Button */}
            {!revealedSurprise ? (
              <button
                onClick={() => setRevealedSurprise(true)}
                className="mb-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-semibold bg-white border border-[#E8B4B8] text-[#6B2D38] hover:bg-[#FAF6F0] shadow-sm transition-all active:scale-95"
              >
                <Gift size={14} className="text-[#C46879]" />
                <span>One Last Surprise ❤️</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-[#E8B4B8] text-xs sm:text-sm font-serif italic text-[#3D262A] mb-5 animate-in fade-in leading-relaxed shadow-xs">
                &ldquo;You will always be my favorite hello, my hardest goodbye, and my happiest forever.&rdquo; — With all my love, always. ❤️
              </div>
            )}

            <div className="pt-3 border-t border-[#E8B4B8]/40">
              <button
                type="button"
                onClick={handleReplayClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif text-[#6B2D38] hover:text-[#3D262A] transition-colors"
              >
                <RotateCcw size={12} />
                <span>Relive Our Story from the Beginning</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
