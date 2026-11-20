"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Play, RotateCcw, Heart, Trophy, Timer, Sparkles } from "lucide-react";
import { CatchLoveGameConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: CatchLoveGameConfig;
  theme: ThemeId;
}

interface FallingHeart {
  id: number;
  x: number; // %
  speed: number;
  size: number;
  symbol: string;
}

export function CatchLoveGameSection({ config, theme }: Props) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.durationSeconds || 20);
  const [fallingHearts, setFallingHearts] = useState<FallingHeart[]>([]);
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const nextHeartId = useRef(0);

  // Countdown timer
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("finished");
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#f43f5e", "#fb7185", "#fbbf24"],
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Spawn falling hearts while playing
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawner = setInterval(() => {
      const symbols = ["💖", "💕", "💗", "💓", "💝", "✨"];
      const newHeart: FallingHeart = {
        id: nextHeartId.current++,
        x: Math.floor(Math.random() * 85) + 5, // %
        speed: Math.floor(Math.random() * 2) + 2.5, // sec
        size: Math.floor(Math.random() * 12) + 26, // px
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      };

      setFallingHearts((prev) => [...prev.slice(-12), newHeart]);
    }, 600);

    return () => clearInterval(spawner);
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(config.durationSeconds || 20);
    setFallingHearts([]);
    setGameState("playing");
  };

  const catchHeart = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setScore((s) => s + 1);
    setFallingHearts((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <section id="sec-catch-love-game" className="py-16 px-4 max-w-xl mx-auto text-center">
      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2">
        Love Mini-Game 🎮
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
        {config.headline || "Catch My Falling Love!"}
      </h2>
      <p className="text-sm sm:text-base opacity-80 mt-2 max-w-md mx-auto font-sans mb-6">
        {config.subtext || "Catch as many floating hearts as you can in 20 seconds. Ready?"}
      </p>

      {/* Game Stage Area */}
      <div
        ref={gameAreaRef}
        className="relative mx-auto w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-200/80 dark:border-pink-900 bg-gradient-to-b from-rose-50/70 via-pink-100/40 to-pink-200/50 dark:from-slate-950 dark:to-pink-950/60 select-none flex flex-col justify-between p-4"
      >
        {/* Top Status Bar */}
        <div className="flex items-center justify-between z-20 bg-white/70 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-pink-200/50">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-pink-300 font-serif font-bold text-sm">
            <Trophy size={16} className="text-amber-500" />
            <span>Caught: {score}</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-700 dark:text-pink-300 font-mono font-bold text-sm">
            <Timer size={16} className="text-rose-500" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Falling Hearts (Active during game) */}
        {gameState === "playing" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-auto">
            {fallingHearts.map((heart) => (
              <button
                key={heart.id}
                type="button"
                onPointerDown={(e) => catchHeart(heart.id, e)}
                style={{
                  left: `${heart.x}%`,
                  fontSize: `${heart.size}px`,
                  animation: `fallDown ${heart.speed}s linear forwards`,
                }}
                className="absolute select-none cursor-pointer transform active:scale-125 transition-transform hover:scale-110 p-2 touch-manipulation z-30"
              >
                {heart.symbol}
              </button>
            ))}
          </div>
        )}

        {/* Start Game Overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6">
            <Heart size={48} className="text-rose-500 fill-rose-400 mb-3 animate-pulse" />
            <h3 className="font-serif font-bold text-xl text-rose-950 dark:text-pink-100 mb-1">
              Ready to catch some love?
            </h3>
            <p className="text-xs text-stone-600 dark:text-pink-200 mb-5">
              Tap the hearts before they reach the ground!
            </p>
            <button
              type="button"
              onClick={startGame}
              className={`px-6 py-3 rounded-full font-serif font-semibold text-base flex items-center gap-2 shadow-lg ${themeConfig.primaryButtonClass}`}
            >
              <Play size={16} />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {/* Game Finished Overlay */}
        {gameState === "finished" && (
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 animate-in fade-in">
            <Trophy size={42} className="text-amber-500 mb-2 animate-bounce" />
            <h3 className="font-serif font-bold text-2xl text-rose-950 dark:text-pink-100 mb-1">
              Final Score: {score} Hearts!
            </h3>
            <p className="font-handwriting text-2xl text-rose-600 dark:text-pink-300 max-w-sm mb-5 leading-snug">
              {config.winMessage ||
                "You caught my whole heart! You’re undefeated at making me smile. 💕"}
            </p>
            <button
              type="button"
              onClick={startGame}
              className={`px-6 py-2.5 rounded-full font-serif font-semibold text-sm flex items-center gap-2 ${themeConfig.primaryButtonClass}`}
            >
              <RotateCcw size={15} />
              <span>{config.replayButtonText || "Play Again"}</span>
            </button>
          </div>
        )}

        <div className="text-[10px] text-stone-400 text-center z-10">
          Target: {config.targetScore || 10} hearts
        </div>
      </div>

      <style jsx>{`
        @keyframes fallDown {
          0% {
            top: -10%;
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 105%;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

