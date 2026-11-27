"use client";

import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart, RotateCcw, Trophy, CheckCircle2 } from "lucide-react";
import { AnniversaryMemoryMatchConfig, AnniversaryMemoryMatchCard, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryMemoryMatchConfig;
  theme: ThemeId;
}

interface GameTile {
  uid: string;
  cardId: string;
  label: string;
  iconOrImageUrl: string;
  type: "icon" | "image";
}

const DEFAULT_CARDS: AnniversaryMemoryMatchCard[] = [
  { id: "c-1", label: "First Coffee", iconOrImageUrl: "☕", type: "icon" },
  { id: "c-2", label: "Sunset Walk", iconOrImageUrl: "🌅", type: "icon" },
  { id: "c-3", label: "Road Trip", iconOrImageUrl: "🚗", type: "icon" },
  { id: "c-4", label: "Stargazing", iconOrImageUrl: "✨", type: "icon" },
  { id: "c-5", label: "Home Cooking", iconOrImageUrl: "🥞", type: "icon" },
  { id: "c-6", label: "Forever Ring", iconOrImageUrl: "💍", type: "icon" },
];

export function AnniversaryMemoryMatchSection({ config, theme }: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");
  const rawCards = config.cards && config.cards.length >= 3 ? config.cards : DEFAULT_CARDS;

  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedCardIds, setMatchedCardIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize and shuffle game board
  const setupBoard = useCallback(() => {
    // Generate pairs
    const pairs: GameTile[] = [];
    rawCards.forEach((c) => {
      pairs.push({ uid: `${c.id}-a`, cardId: c.id, label: c.label, iconOrImageUrl: c.iconOrImageUrl, type: c.type });
      pairs.push({ uid: `${c.id}-b`, cardId: c.id, label: c.label, iconOrImageUrl: c.iconOrImageUrl, type: c.type });
    });

    // Fisher-Yates Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setTiles(pairs);
    setFlippedUids([]);
    setMatchedCardIds([]);
    setMoves(0);
    setIsWon(false);
  }, [rawCards]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setupBoard();
    });
  }, [setupBoard]);

  const handleTileClick = (tile: GameTile) => {
    // Ignore if already matched or already flipped
    if (matchedCardIds.includes(tile.cardId)) return;
    if (flippedUids.includes(tile.uid)) return;
    if (flippedUids.length === 2) return;

    const nextFlipped = [...flippedUids, tile.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [uid1, uid2] = nextFlipped;
      const tile1 = tiles.find((t) => t.uid === uid1);
      const tile2 = tiles.find((t) => t.uid === uid2);

      if (tile1 && tile2 && tile1.cardId === tile2.cardId) {
        // Match!
        const nextMatched = [...matchedCardIds, tile1.cardId];
        setMatchedCardIds(nextMatched);
        setFlippedUids([]);

        if (nextMatched.length === rawCards.length) {
          setIsWon(true);
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.65 },
            colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0"],
          });
        }
      } else {
        // Not a match, flip back after brief pause
        setTimeout(() => {
          setFlippedUids([]);
        }, 850);
      }
    }
  };

  return (
    <section id="anniv-sec-memory-match" className="py-14 sm:py-20 px-4 max-w-2xl mx-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8B4B8]/80 shadow-[#6B2D38]/10 text-center">
        {/* Header */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-[#FFF5F6] text-[#6B2D38] border border-[#E8B4B8]/70 shadow-sm mb-3">
          <Sparkles size={13} className="text-[#C46879]" />
          <span>Interactive Mini-Game</span>
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3D262A] mb-2">
          {config.headline || "Memory Match: Two of a Kind"}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-md mx-auto mb-6 leading-relaxed">
          {config.subtext || "Find all matching pairs of our favorite memories!"}
        </p>

        {/* Moves & Score Tracker */}
        <div className="flex items-center justify-between max-w-xs mx-auto mb-6 px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8B4B8]/60 text-xs font-mono text-[#6B2D38]">
          <span>Moves: {moves}</span>
          <span className="text-[#C46879] font-bold">
            Matched: {matchedCardIds.length}/{rawCards.length}
          </span>
          <button
            onClick={setupBoard}
            className="hover:text-[#3D262A] transition-colors p-1"
            title="Reset Board"
            aria-label="Reset memory match game"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-md mx-auto mb-6">
          {tiles.map((tile) => {
            const isFlipped = flippedUids.includes(tile.uid) || matchedCardIds.includes(tile.cardId);
            const isMatched = matchedCardIds.includes(tile.cardId);

            return (
              <div
                key={tile.uid}
                onClick={() => handleTileClick(tile)}
                className={`aspect-square rounded-2xl cursor-pointer p-2 flex flex-col items-center justify-center transition-all duration-300 border text-center ${
                  isMatched
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 scale-95 shadow-xs"
                    : isFlipped
                    ? "bg-white border-[#E8B4B8] shadow-md scale-102"
                    : "bg-[#FFF5F6] hover:bg-[#FAF0F2] border-[#E8B4B8]/60 shadow-sm"
                }`}
              >
                {isFlipped ? (
                  <div className="animate-in zoom-in-75 duration-200 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1">{tile.iconOrImageUrl}</span>
                    <span className="text-[10px] font-serif font-bold text-[#3D262A] line-clamp-1 leading-tight">
                      {tile.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#E8B4B8]">
                    <Heart size={20} className="fill-[#E8B4B8]/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Win Screen Modal or Banner */}
        {isWon && (
          <div className="mt-6 p-5 rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8] animate-in zoom-in-95 duration-300">
            <Trophy size={28} className="mx-auto text-[#C46879] mb-2" />
            <h3 className="font-serif font-bold text-lg text-[#3D262A] mb-1">
              {config.winTitle || "Perfect Match! You Won! 🥂"}
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-[#6B2D38]/90 max-w-xs mx-auto mb-4">
              {config.winMessage ||
                "Just like these cards, we were always meant to find each other. Happy Anniversary!"}
            </p>
            <button
              onClick={setupBoard}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-serif font-semibold bg-gradient-to-r from-[#C46879] to-[#6B2D38] text-white shadow-md hover:scale-105 transition-all"
            >
              <RotateCcw size={13} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
