"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, RotateCcw, Heart, Gift } from "lucide-react";
import { BirthdayBalloonsConfig, BirthdayBalloonWish, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayBalloonsConfig;
  theme?: ThemeId;
}

const DEFAULT_BALLOONS: BirthdayBalloonWish[] = [
  {
    id: "bal-1",
    color: "#f43f5e",
    message: "May your coming year be filled with endless belly laughs and unexpected road trips! 🌟",
    author: "With Love",
  },
  {
    id: "bal-2",
    color: "#ec4899",
    message: "Wishing you big wins, effortless courage, and dreams coming true faster than you imagine! ✨",
    author: "Always Cheering",
  },
  {
    id: "bal-3",
    color: "#8b5cf6",
    message: "Thank you for being the person who lights up every single room you walk into! 💖",
    author: "Forever Grateful",
  },
  {
    id: "bal-4",
    color: "#3b82f6",
    message: "May your coffee be strong, your skin glowing, and your heart always at peace! ☕",
    author: "Best Wishes",
  },
  {
    id: "bal-5",
    color: "#10b981",
    message: "Here's to another year of celebrating YOU — the world is so much luckier with you in it! 🥂",
    author: "Cheers!",
  },
];

export function BirthdayBalloonsSection({ config, theme }: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const balloons = config.balloons && config.balloons.length > 0 ? config.balloons : DEFAULT_BALLOONS;

  const [poppedMap, setPoppedMap] = useState<Record<string, boolean>>({});
  const [selectedWish, setSelectedWish] = useState<BirthdayBalloonWish | null>(null);

  const handlePop = (balloon: BirthdayBalloonWish, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setPoppedMap((prev) => ({ ...prev, [balloon.id]: true }));
    setSelectedWish(balloon);

    // Mini localized confetti pop
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: [balloon.color, "#fbbf24", "#ffffff"],
    });
  };

  const handleResetBalloons = () => {
    setPoppedMap({});
    setSelectedWish(null);
  };

  const poppedCount = Object.values(poppedMap).filter(Boolean).length;

  return (
    <section
      id="bday-sec-balloons"
      className="relative min-h-[85vh] py-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center select-none"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-2">
          <Sparkles size={13} className="text-amber-600" />
          <span>Interactive Wish Balloons</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2">
          {config.headline || "Pop The Birthday Balloons 🎈"}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          {config.subtext || "Each floating balloon holds a secret wish written especially for you. Tap them to pop!"}
        </p>

        <div className="mt-2 text-[11px] font-mono text-stone-400">
          Popped: {poppedCount} of {balloons.length}
        </div>
      </div>

      {/* Floating Balloons Cluster */}
      <div className="w-full flex flex-wrap items-center justify-center gap-5 sm:gap-8 py-6">
        {balloons.map((b, idx) => {
          const isPopped = Boolean(poppedMap[b.id]);
          return (
            <div
              key={b.id}
              onClick={(e) => !isPopped && handlePop(b, e)}
              className="flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
              style={{
                animation: isPopped ? undefined : `pulse 3s ease-in-out infinite ${idx * 0.4}s`,
              }}
            >
              {!isPopped ? (
                <div className="relative group">
                  {/* Balloon Body */}
                  <div
                    className="w-18 h-24 sm:w-22 sm:h-28 rounded-full shadow-lg relative flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: b.color,
                      boxShadow: `0 10px 25px -5px ${b.color}60`,
                    }}
                  >
                    {/* Gloss / Shine */}
                    <div className="absolute top-3 left-3 w-4 h-8 bg-white/40 rounded-full blur-[1px] rotate-[-25deg]" />
                    <Sparkles size={16} className="text-white/80 group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Balloon Knot & String */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-2 rounded-xs"
                      style={{ backgroundColor: b.color }}
                    />
                    <div className="w-0.5 h-10 sm:h-14 bg-stone-300/80" />
                  </div>
                </div>
              ) : (
                <div className="w-18 h-24 sm:w-22 sm:h-28 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-300 shadow-inner">
                    <Sparkles size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 mt-1 uppercase">Popped!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Wish Modal / Reveal Card */}
      {selectedWish && (
        <div className="w-full max-w-md mt-6 p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-2xl animate-in zoom-in-95 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
            <Heart size={20} className="fill-current" />
          </div>
          <p className="font-serif font-bold text-lg text-stone-900 mb-2">A Secret Wish For You</p>
          <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
            &ldquo;{selectedWish.message}&rdquo;
          </p>
          {selectedWish.author && (
            <p className="text-[11px] font-mono font-semibold text-amber-800">
              — {selectedWish.author}
            </p>
          )}
          <button
            type="button"
            onClick={() => setSelectedWish(null)}
            className="mt-4 px-5 py-1.5 rounded-full text-xs font-serif font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            Close &amp; Keep Popping
          </button>
        </div>
      )}

      {/* Reset button if all or some popped */}
      {poppedCount > 0 && (
        <button
          type="button"
          onClick={handleResetBalloons}
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-semibold bg-white/80 hover:bg-white text-stone-600 border border-stone-200 shadow-sm transition-all"
        >
          <RotateCcw size={12} />
          <span>Inflate All Balloons Again</span>
        </button>
      )}
    </section>
  );
}
