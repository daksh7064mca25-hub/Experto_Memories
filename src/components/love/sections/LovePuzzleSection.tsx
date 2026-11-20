"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Heart, RotateCcw, Unlock, CheckCircle2, Trophy, Gift } from "lucide-react";
import { LovePuzzleConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LovePuzzleConfig;
  theme: ThemeConfig;
}

interface PuzzleTile {
  id: number;
  pairId: number;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const INITIAL_PAIRS = [
  { pairId: 1, symbol: "💌", label: "Secret Letter" },
  { pairId: 2, symbol: "🌹", label: "Everlasting Rose" },
  { pairId: 3, symbol: "✨", label: "Starlit Magic" },
];

export function LovePuzzleSection({ config, theme }: Props) {
  const [tiles, setTiles] = useState<PuzzleTile[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize or reset puzzle
  const initGame = () => {
    const rawTiles: PuzzleTile[] = [];
    let idCounter = 0;

    INITIAL_PAIRS.forEach((p) => {
      // 2 cards per pair
      rawTiles.push({
        id: idCounter++,
        pairId: p.pairId,
        symbol: p.symbol,
        label: p.label,
        isFlipped: false,
        isMatched: false,
      });
      rawTiles.push({
        id: idCounter++,
        pairId: p.pairId,
        symbol: p.symbol,
        label: p.label,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle tiles
    const shuffled = [...rawTiles].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
    setSelectedIndices([]);
    setIsCompleted(false);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, [config.puzzleType]);

  const handleTileClick = (index: number) => {
    if (isCompleted) return;
    if (tiles[index].isFlipped || tiles[index].isMatched) return;
    if (selectedIndices.length >= 2) return;

    const nextSelected = [...selectedIndices, index];
    const newTiles = [...tiles];
    newTiles[index].isFlipped = true;
    setTiles(newTiles);
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextSelected;
      const firstTile = newTiles[firstIdx];
      const secondTile = newTiles[secondIdx];

      if (firstTile.pairId === secondTile.pairId) {
        // Matched!
        setTimeout(() => {
          setTiles((prev) => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            // Check if all matched
            if (updated.every((t) => t.isMatched)) {
              setIsCompleted(true);
            }
            return updated;
          });
          setSelectedIndices([]);
        }, 500);
      } else {
        // Not matched -> Flip back
        setTimeout(() => {
          setTiles((prev) => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setSelectedIndices([]);
        }, 900);
      }
    }
  };

  const handleSkip = () => {
    setTiles((prev) =>
      prev.map((t) => ({ ...t, isFlipped: true, isMatched: true }))
    );
    setIsCompleted(true);
  };

  return (
    <section id="sec-love-puzzle" className="py-16 sm:py-20 px-4 relative">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Gift size={11} className="text-amber-300" />
            <span>Playable Romantic Mini-Game</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "The Love Puzzle"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Match the pairs of our romantic memories to unlock a hidden surprise made just for you."}
          </p>
        </div>

        {/* Puzzle Board Container */}
        <div className="bg-[#24060c]/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-amber-400/30 shadow-2xl shadow-rose-950/80 relative">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-rose-900/60 text-xs font-mono text-amber-300">
            <span>Pairs Matched: {tiles.filter((t) => t.isMatched).length / 2} / 3</span>
            <span>Moves: {moves}</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            {tiles.map((tile, idx) => {
              const isShowing = tile.isFlipped || tile.isMatched;
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleTileClick(idx)}
                  disabled={tile.isMatched || isCompleted}
                  className={`relative aspect-square rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 select-none cursor-pointer border ${
                    isShowing
                      ? "bg-gradient-to-br from-[#4e101d] via-[#3a0a13] to-[#20050b] border-amber-400/80 shadow-lg shadow-rose-950/70 scale-[1.02]"
                      : "bg-[#180307]/90 border-rose-900/50 hover:border-amber-400/50 hover:bg-[#25060d]"
                  }`}
                >
                  {isShowing ? (
                    <div className="flex flex-col items-center text-center animate-fadeIn">
                      <span className="text-2xl sm:text-3xl mb-1">{tile.symbol}</span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-amber-200 truncate max-w-full">
                        {tile.label}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center opacity-70">
                      <Heart size={20} className="text-rose-500 fill-rose-500/30 mb-1" />
                      <span className="text-[9px] font-mono text-rose-400">TAP</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Skip / Actions Bar */}
          {!isCompleted ? (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-400/30 hover:border-amber-400 bg-white/5 hover:bg-white/10 text-amber-300 text-xs font-mono transition-all"
              >
                <Unlock size={12} />
                <span>{config.skipButtonText || "Reveal Secret Surprise 🔓"}</span>
              </button>
            </div>
          ) : (
            /* Completed Surprise Card */
            <div className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-[#440d18] via-[#2f0810] to-[#1a0307] border-2 border-amber-400/80 shadow-2xl shadow-rose-950 text-center animate-fadeIn">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 flex items-center justify-center shadow-lg mb-3">
                <Trophy size={20} />
              </div>

              <h4 className="font-serif text-lg sm:text-xl font-bold text-amber-200 mb-2">
                Puzzle Completed!
              </h4>

              <p className="font-serif text-xs sm:text-sm text-rose-100 mb-4 leading-relaxed">
                {config.completionMessage ||
                  "You found every missing piece! Just like you completed every piece of my heart."}
              </p>

              {/* Secret Reward Coupon */}
              <div className="p-4 rounded-xl bg-black/40 border border-dashed border-amber-400/60 mb-5 text-left">
                <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-xs uppercase mb-1">
                  <Gift size={13} />
                  <span>Your Unlocked Reward</span>
                </div>
                <p className="text-xs text-rose-200 font-serif leading-relaxed">
                  {config.secretRewardText ||
                    "SPECIAL REWARD: One spontaneous midnight date with your favorite dessert, zero phone distractions, and endless hugs."}
                </p>
              </div>

              <button
                type="button"
                onClick={initGame}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <RotateCcw size={12} />
                <span>Play Again ↺</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
