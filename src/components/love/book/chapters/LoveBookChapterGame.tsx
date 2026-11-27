"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Trophy, RotateCcw, CheckCircle2, Gift } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    completionMessage?: string;
    secretRewardText?: string;
    skipButtonText?: string;
  };
  theme: ThemeConfig;
}

interface Tile {
  id: number;
  symbol: string;
  label: string;
}

const BASE_TILES = [
  { symbol: "☕", label: "First Coffee" },
  { symbol: "🚗", label: "Late Drive" },
  { symbol: "🎬", label: "Movie Night" },
  { symbol: "🍦", label: "Ice Cream" },
];

function createShuffledDeck(): Tile[] {
  const doubled = [...BASE_TILES, ...BASE_TILES].map((t, idx) => ({
    ...t,
    id: idx,
  }));
  // Fisher-Yates shuffle
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export function LoveBookChapterGame({
  recipientName,
  senderName,
  config,
  theme,
}: Props) {
  const [deck, setDeck] = useState<Tile[]>(() => createShuffledDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedSymbols, setMatchedSymbols] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  const headline = config.headline || "Chapter V • Our Fun Side";
  const subtext =
    config.subtext || "Match the pairs of our favourite memories to unlock a hidden secret made just for you.";
  const secretReward =
    config.secretRewardText ||
    "SPECIAL REWARD: One spontaneous midnight date with your favourite dessert, zero phone distractions, and endless hugs.";

  const handleTileClick = (index: number) => {
    if (flippedIndices.length >= 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedSymbols.has(deck[index].symbol)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const first = deck[newFlipped[0]];
      const second = deck[newFlipped[1]];

      if (first.symbol === second.symbol) {
        setMatchedSymbols((prev) => {
          const next = new Set(prev);
          next.add(first.symbol);
          if (next.size === BASE_TILES.length) {
            setIsCompleted(true);
          }
          return next;
        });
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 750);
      }
    }
  };

  const handleBypass = () => {
    setIsCompleted(true);
  };

  const handleReset = () => {
    setDeck(createShuffledDeck());
    setMatchedSymbols(new Set());
    setFlippedIndices([]);
    setIsCompleted(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 font-serif text-stone-900 select-text overflow-y-auto">
      {/* Chapter Title */}
      <div className="mb-3">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-800 font-bold block mb-1">
          Interactive Keepsake Game
        </span>
        <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-[#3a0d15] leading-tight">
          {headline}
        </h2>
        <p className="font-serif text-[11px] sm:text-xs text-stone-600 italic mt-0.5 leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Main Game Board vs. Reward Reveal */}
      <div className="my-auto max-w-sm mx-auto w-full">
        {!isCompleted ? (
          <div>
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mb-3">
              {deck.map((tile, idx) => {
                const isFlipped =
                  flippedIndices.includes(idx) || matchedSymbols.has(tile.symbol);

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handleTileClick(idx)}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all duration-300 transform ${
                      isFlipped
                        ? "bg-gradient-to-br from-amber-100 to-rose-100 border-rose-300 shadow-sm scale-100"
                        : "bg-white hover:bg-stone-50 border-stone-200 shadow-xs hover:scale-105"
                    }`}
                  >
                    {isFlipped ? (
                      <div className="text-center animate-fadeIn">
                        <span className="text-lg sm:text-xl block">{tile.symbol}</span>
                        <span className="font-mono text-[7px] text-stone-600 font-bold block leading-none mt-0.5">
                          {tile.label}
                        </span>
                      </div>
                    ) : (
                      <Heart size={14} className="text-rose-300/80" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="font-mono text-stone-500">
                Pairs: {matchedSymbols.size} / {BASE_TILES.length}
              </span>
              <button
                type="button"
                onClick={handleBypass}
                className="text-rose-700 hover:text-rose-900 font-bold font-mono underline"
              >
                {config.skipButtonText || "Reveal Reward 🔓"}
              </button>
            </div>
          </div>
        ) : (
          /* Secret Reward Revealed */
          <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-md text-center animate-fadeIn">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-stone-900 mb-2 shadow-sm">
              <Trophy size={20} className="animate-bounce" />
            </div>

            <h4 className="font-serif text-sm sm:text-base font-bold text-[#3a0d15] mb-1">
              You Solved Our Love Puzzle! 💖
            </h4>

            <p className="font-serif text-xs text-stone-700 italic mb-3 leading-relaxed">
              {secretReward}
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-[10px] font-mono text-stone-700 hover:bg-stone-50 transition-colors shadow-xs"
            >
              <RotateCcw size={10} /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Bottom Annotation */}
      <div className="mt-2 pt-2 border-t border-amber-900/10 flex items-center justify-between text-[10px] text-stone-500 italic">
        <span className="font-handwriting text-xs text-rose-800">
          &ldquo;You&apos;re my favourite person to play games and laugh with.&rdquo;
        </span>
        <span className="font-mono text-[9px]">Page 6</span>
      </div>
    </div>
  );
}
