"use client";

import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart, Lock, Unlock, Sparkles } from "lucide-react";
import { SecretHeartConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: SecretHeartConfig;
  theme: ThemeId;
}

export function SecretHeartSection({ config, theme }: Props) {
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [isUnlocked, setIsUnlocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  const requiredSeconds = config.requiredHoldSeconds || 3;

  const startHold = () => {
    if (isUnlocked) return;

    const intervalMs = 50;
    const step = 100 / ((requiredSeconds * 1000) / intervalMs);

    timerRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timerRef.current!);
          setIsUnlocked(true);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#ec4899", "#f43f5e", "#fb7185"],
          });
          return 100;
        }
        return next;
      });
    }, intervalMs);
  };

  const endHold = () => {
    if (isUnlocked) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section id="sec-secret-heart" className="py-16 px-4 max-w-xl mx-auto text-center">
      <div className={`${themeConfig.cardBgClass} rounded-3xl p-8 shadow-xl border relative overflow-hidden`}>
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-rose-100 text-rose-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2">
          Hidden Whisper 🤫
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-rose-950 dark:text-pink-100 mb-2">
          Hold My Heart
        </h2>
        <p className="text-sm opacity-80 max-w-sm mx-auto font-sans mb-8">
          {config.teaser || "Hold down the glowing heart for 3 seconds to reveal a secret..."}
        </p>

        {/* Hold Button Container with Circular Progress */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center select-none">
          {/* Circular SVG Progress */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-pink-200 dark:stroke-pink-950/60"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-rose-500 transition-all duration-75"
              strokeWidth="6"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * holdProgress) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Core Interactive Heart Button */}
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            onContextMenu={(e) => e.preventDefault()}
            className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center transition-transform active:scale-90 shadow-xl ${
              isUnlocked
                ? "bg-rose-500 text-white"
                : holdProgress > 0
                ? "bg-rose-400 text-white scale-95"
                : "bg-white dark:bg-stone-800 text-rose-500 hover:scale-105"
            }`}
          >
            {isUnlocked ? (
              <Unlock size={28} className="animate-bounce" />
            ) : (
              <Heart
                size={32}
                className={`transition-colors ${
                  holdProgress > 0 ? "fill-white text-white" : "fill-rose-500 text-rose-500 animate-pulse"
                }`}
              />
            )}
            <span className="text-[10px] font-mono mt-1 font-bold">
              {isUnlocked ? "UNLOCKED" : holdProgress > 0 ? `${Math.round(holdProgress)}%` : "HOLD"}
            </span>
          </button>
        </div>

        {/* Secret Content */}
        {isUnlocked ? (
          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-pink-950/40 border border-rose-200 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-1.5 text-rose-600 dark:text-pink-300 font-serif font-bold text-sm mb-2">
              <Sparkles size={16} /> Secret Revealed <Sparkles size={16} />
            </div>
            <p className="font-handwriting text-2xl sm:text-3xl text-rose-950 dark:text-pink-100 leading-snug">
              &ldquo;{config.hiddenSecret || "Every single day with you is my favorite day. I promise to keep working on being the partner you truly deserve."}&rdquo;
            </p>
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Keep pressing without lifting your finger
          </p>
        )}
      </div>
    </section>
  );
}

