"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Heart, RotateCcw, Unlock, CheckCircle2, Trophy, Gift, Eraser } from "lucide-react";
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

function createInitialMemoryTiles(): PuzzleTile[] {
  const rawTiles: PuzzleTile[] = [];
  let idCounter = 0;
  INITIAL_PAIRS.forEach((p) => {
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
  return [...rawTiles].sort(() => Math.random() - 0.5);
}

export function LovePuzzleSection({ config, theme }: Props) {
  const [activeTab, setActiveTab] = useState<"scratch" | "memory">("scratch");

  // Scratch Card state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawing = useRef(false);

  // Memory match state
  const [tiles, setTiles] = useState<PuzzleTile[]>(() => createInitialMemoryTiles());
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize Canvas Scratch Card
  const initScratchCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth || 340;
    const height = canvas.offsetHeight || 220;
    canvas.width = width;
    canvas.height = height;

    // Draw shimmering golden foil background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#D4AF37");
    grad.addColorStop(0.3, "#F5DEB3");
    grad.addColorStop(0.5, "#CA8A04");
    grad.addColorStop(0.8, "#EAB308");
    grad.addColorStop(1, "#B8924B");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative foil pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 24, height);
      ctx.stroke();
    }

    // Centered instruction text
    ctx.fillStyle = "#3E1108";
    ctx.font = "bold 14px serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ SCRATCH TO REVEAL SECRET NOTE ✨", width / 2, height / 2 - 8);
    ctx.font = "italic 11px sans-serif";
    ctx.fillStyle = "#5c1322";
    ctx.fillText("Touch or drag cursor across the golden foil", width / 2, height / 2 + 14);

    setIsScratched(false);
    setScratchPercent(0);
  };

  useEffect(() => {
    if (activeTab === "scratch") {
      // Short delay to ensure client canvas layout
      const timer = setTimeout(initScratchCanvas, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleScratchMove = (clientX: number, clientY: number) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Check scratched percentage approximately
    setScratchPercent((prev) => {
      const next = prev + 3;
      if (next >= 45 && !isScratched) {
        setIsScratched(true);
        // Clear remaining canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return next;
    });
  };

  const handleInstantReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsScratched(true);
    setScratchPercent(100);
  };

  // Memory Match Logic
  const initMemoryGame = () => {
    setTiles(createInitialMemoryTiles());
    setSelectedIndices([]);
    setIsCompleted(false);
    setMoves(0);
  };

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
        // Matched
        setTimeout(() => {
          setTiles((prev) => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            if (updated.every((t) => t.isMatched)) {
              setIsCompleted(true);
            }
            return updated;
          });
          setSelectedIndices([]);
        }, 500);
      } else {
        // Not matched
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

  return (
    <section id="sec-love-puzzle" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Gift size={11} className="text-amber-300" />
            <span>Interactive Heart Keepsake</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "The Love Keepsake & Secret Note"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Scratch the golden foil or match the romantic pairs to reveal a secret promise."}
          </p>

          {/* Mode Tabs */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-[#1e050a] border border-amber-400/30 mt-6 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("scratch")}
              className={`px-4 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                activeTab === "scratch"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md"
                  : "text-rose-200 hover:text-amber-300"
              }`}
            >
              <span>Golden Scratch Note 🪙</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("memory")}
              className={`px-4 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                activeTab === "memory"
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-md"
                  : "text-rose-200 hover:text-amber-300"
              }`}
            >
              <span>Memory Match Game 🧩</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GOLDEN SCRATCH CARD */}
        {activeTab === "scratch" && (
          <div className="bg-[#24060c]/90 rounded-3xl p-6 sm:p-10 border-2 border-amber-400/40 shadow-2xl shadow-rose-950/80 relative overflow-hidden animate-fadeIn">
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-widest block mb-1">
                SECRET SCRATCH CARD
              </span>
              <p className="font-serif text-sm text-rose-200 italic">
                Rub your finger or cursor over the golden card to reveal what lies beneath:
              </p>
            </div>

            {/* Scratch Frame Container */}
            <div className="relative w-full max-w-md mx-auto aspect-[16/10] rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl bg-[#fffdfa] select-none touch-none">
              {/* Underlying Secret Message & Photo */}
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#fffbf0] via-[#fffdf8] to-[#fef2f2] text-stone-900">
                <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 mb-2">
                  <Heart size={20} className="fill-current animate-pulse" />
                </div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#881337] mb-1">
                  You Unlocked My Secret Note!
                </h4>
                <p className="font-serif text-xs sm:text-sm text-stone-700 italic leading-relaxed max-w-xs mb-3">
                  {config.secretRewardText ||
                    "SPECIAL REWARD: One spontaneous midnight date with your favorite dessert, zero phone distractions, and endless hugs."}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-mono font-bold text-amber-900">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>PERMANENT REDEMPTION GRANTED</span>
                </div>
              </div>

              {/* Golden Canvas Overlay */}
              <canvas
                ref={canvasRef}
                onMouseDown={() => (isDrawing.current = true)}
                onMouseUp={() => (isDrawing.current = false)}
                onMouseLeave={() => (isDrawing.current = false)}
                onTouchStart={(e) => {
                  isDrawing.current = true;
                  if (e.touches && e.touches[0]) {
                    handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchEnd={() => (isDrawing.current = false)}
                onMouseMove={(e) => {
                  if (isDrawing.current) {
                    handleScratchMove(e.clientX, e.clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches && e.touches[0]) {
                    handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className={`absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-500 ${
                  isScratched ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleInstantReveal}
                className="px-5 py-2 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-xs font-mono text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eraser size={13} />
                <span>Instant Reveal Note</span>
              </button>

              <button
                type="button"
                onClick={initScratchCanvas}
                className="px-5 py-2 rounded-full bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Scratch Card</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MEMORY MATCH GAME */}
        {activeTab === "memory" && (
          <div className="bg-[#24060c]/90 rounded-3xl p-6 sm:p-10 border border-amber-400/30 shadow-2xl shadow-rose-950/80 animate-fadeIn">
            {/* Game Stats */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-900/60 text-xs font-mono text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Moves: {moves}</span>
              </span>
              <button
                type="button"
                onClick={initMemoryGame}
                className="flex items-center gap-1 text-rose-300 hover:text-amber-200 transition-colors underline cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Grid</span>
              </button>
            </div>

            {/* 6 Tiles Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-6">
              {tiles.map((tile, idx) => (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => handleTileClick(idx)}
                  className={`aspect-square rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 cursor-pointer select-none ${
                    tile.isFlipped || tile.isMatched
                      ? "bg-gradient-to-br from-[#4d0f1b] to-[#20050b] border-amber-400 text-amber-200 scale-102 shadow-lg"
                      : "bg-[#180307] border-rose-900/50 hover:border-amber-400/50 hover:bg-[#25060d]"
                  }`}
                >
                  {tile.isFlipped || tile.isMatched ? (
                    <>
                      <span className="text-3xl sm:text-4xl block mb-1">{tile.symbol}</span>
                      <span className="text-[10px] font-mono text-amber-300/90 text-center leading-tight">
                        {tile.label}
                      </span>
                    </>
                  ) : (
                    <Heart size={24} className="text-rose-800 animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Success Banner */}
            {isCompleted && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-400/20 via-rose-500/20 to-amber-500/20 border border-amber-400/50 text-center animate-fadeIn">
                <Trophy size={24} className="text-amber-400 mx-auto mb-2" />
                <h4 className="font-serif text-base font-bold text-amber-200 mb-1">
                  {config.completionMessage || "You found every missing piece!"}
                </h4>
                <p className="font-serif text-xs text-rose-200 italic">
                  {config.secretRewardText}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
