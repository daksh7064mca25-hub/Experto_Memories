"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Sun, CloudRain, Flower2, Sprout } from "lucide-react";
import { ForgivenessGardenConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: ForgivenessGardenConfig;
  theme: ThemeId;
}

export function ForgivenessGardenSection({ config, theme }: Props) {
  const [currentLevel, setCurrentLevel] = useState<number>(3); // starts in middle
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];
  const milestones = config.milestones || [];
  const activeMilestone = milestones.find((m) => m.level === currentLevel) || milestones[2] || {
    level: 3,
    title: "A tiny bit better",
    description: "Delicate pink petals begin to unfurl.",
    flowerStage: "budding",
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentLevel(val);
    if (val === 5) {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#8b5cf6", "#f43f5e", "#10b981", "#fbbf24"],
      });
    }
  };

  return (
    <section id="sec-forgiveness-garden" className="py-16 px-4 max-w-3xl mx-auto">
      <div className={`${themeConfig.cardBgClass} rounded-3xl p-6 sm:p-10 shadow-xl border text-center relative overflow-hidden`}>
        {/* Header */}
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-2">
          Interactive Garden 🌱
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
          {config.headline || "The Forgiveness Garden"}
        </h2>
        <p className="text-sm sm:text-base opacity-80 mt-2 max-w-md mx-auto font-sans">
          {config.subtext ||
            "Feelings take time and that's okay. Move the heart to see how our garden blossoms."}
        </p>

        {/* Visual Flower Stage Display */}
        <div className="my-8 relative h-48 sm:h-56 flex flex-col items-center justify-center">
          {/* Garden Backdrop Glow */}
          <div
            className={`absolute w-44 h-44 rounded-full filter blur-2xl transition-all duration-700 ${
              currentLevel === 1
                ? "bg-slate-300/30 dark:bg-slate-800/30"
                : currentLevel === 2
                ? "bg-amber-200/40 dark:bg-amber-900/30"
                : currentLevel === 3
                ? "bg-rose-200/50 dark:bg-pink-900/40"
                : currentLevel === 4
                ? "bg-emerald-200/50 dark:bg-emerald-900/40"
                : "bg-pink-300/60 dark:bg-pink-700/50 animate-pulse"
            }`}
          />

          {/* Plant Animation based on level */}
          <div className="relative z-10 transition-transform duration-500 transform hover:scale-110">
            {currentLevel === 1 && (
              <div className="flex flex-col items-center">
                <span className="text-6xl animate-bounce">🌱</span>
                <span className="text-xs text-stone-500 mt-2 font-serif italic">Resting quietly in gentle soil</span>
              </div>
            )}
            {currentLevel === 2 && (
              <div className="flex flex-col items-center">
                <span className="text-7xl animate-pulse">🌿</span>
                <span className="text-xs text-stone-500 mt-2 font-serif italic">A tender shoot reaching for light</span>
              </div>
            )}
            {currentLevel === 3 && (
              <div className="flex flex-col items-center">
                <span className="text-8xl animate-bounce">🌷</span>
                <span className="text-xs text-rose-500 mt-2 font-serif italic">Soft pink buds beginning to open</span>
              </div>
            )}
            {currentLevel === 4 && (
              <div className="flex flex-col items-center">
                <span className="text-8xl">🌸</span>
                <span className="text-xs text-rose-500 mt-2 font-serif italic">Full sweet blossoms in the sunlight</span>
              </div>
            )}
            {currentLevel === 5 && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <span className="text-9xl filter drop-shadow-lg animate-pulse">💐</span>
                  <span className="absolute -top-3 -right-2 text-3xl animate-bounce">🦋</span>
                  <span className="absolute -top-1 -left-3 text-2xl animate-bounce delay-150">✨</span>
                </div>
                <span className="text-xs text-pink-600 dark:text-pink-300 mt-2 font-serif font-bold">
                  Radiant garden filled with love & warm hugs!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Milestone Text Box */}
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-2xl p-5 border border-rose-200/80 dark:border-pink-900/50 shadow-sm max-w-lg mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-500">Stage {currentLevel} of 5:</span>
            <h3 className="font-serif font-bold text-lg text-rose-950 dark:text-pink-100">
              {activeMilestone.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
            {activeMilestone.description}
          </p>
        </div>

        {/* Interactive Slider */}
        <div className="max-w-md mx-auto px-4">
          <label htmlFor="garden-slider" className="sr-only">
            Move garden slider
          </label>
          <input
            id="garden-slider"
            type="range"
            min="1"
            max="5"
            step="1"
            value={currentLevel}
            onChange={handleSliderChange}
            className="w-full h-3 bg-pink-200 dark:bg-pink-950 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none"
          />

          <div className="flex justify-between items-center text-[11px] font-serif text-stone-500 mt-2">
            <span>Hurting</span>
            <span>Reflecting</span>
            <span>Better</span>
            <span>Smiling</span>
            <span>Warm Hugs</span>
          </div>
        </div>

        {/* Gentle Note */}
        <div className="mt-8 text-xs text-stone-500 dark:text-pink-300/70 italic">
          (No pressure ever: emotions take time, and every step of your process is respected.)
        </div>
      </div>
    </section>
  );
}

