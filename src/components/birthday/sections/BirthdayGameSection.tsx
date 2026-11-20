"use client";

import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, Gift, RotateCcw, Check } from "lucide-react";
import { BirthdayGameConfig, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayGameConfig;
  recipientName: string;
  theme?: ThemeId;
}

export function BirthdayGameSection({
  config,
  recipientName = "Birthday Star",
  theme,
}: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  const secretMessage =
    config.scratchMessage ||
    `SURPRISE! 🎁\nYou have won 100 warm hugs, unlimited dessert coupons, and an epic birthday celebration dinner!`;
  const secretGift =
    config.secretGiftText || "Redeemable with the sender anytime this year! 🥂";

  // Initialize Canvas Foil
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Golden / Shimmer foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#d97706");
    grad.addColorStop(0.3, "#fef08a");
    grad.addColorStop(0.5, "#f59e0b");
    grad.addColorStop(0.8, "#fef08a");
    grad.addColorStop(1, "#b45309");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add sparkles & text on foil
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 14px serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ SCRATCH HERE ✨", width / 2, height / 2 - 8);
    ctx.font = "11px sans-serif";
    ctx.fillText("Rub to reveal birthday secret", width / 2, height / 2 + 12);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2, false);
    ctx.fill();

    // Calculate approximate scratched percentage periodically
    checkScratchedRatio();
  };

  const checkScratchedRatio = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sample pixels to compute transparency
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    let transparentCount = 0;
    const totalPixels = data.length / 4;

    // Sample every 16th pixel for high performance
    for (let i = 3; i < data.length; i += 16 * 4) {
      if (data[i] === 0) {
        transparentCount++;
      }
    }

    const ratio = (transparentCount / (totalPixels / 16)) * 100;
    setScratchPercent(Math.round(ratio));

    if (ratio > 35) {
      revealFull();
    }
  };

  const revealFull = () => {
    setIsScratched(true);
    setScratchPercent(100);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981"],
    });
  };

  const handleReset = () => {
    setIsScratched(false);
    setScratchPercent(0);
    initCanvas();
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };
  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isDrawingRef.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchEnd = () => {
    isDrawingRef.current = false;
  };

  return (
    <section
      id="bday-sec-game"
      className="relative min-h-[80vh] py-16 px-4 max-w-xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-3">
        <Trophy size={13} className="text-amber-600" />
        <span>Birthday Surprise Game</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2">
        {config.headline || "Scratch To Reveal Your Prize 🎁"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6">
        {config.subtext || "Rub or drag your finger across the golden foil to unlock your personalized birthday surprise!"}
      </p>

      {/* Scratch Card Container */}
      <div className="relative w-full max-w-sm aspect-4/3 rounded-3xl bg-gradient-to-tr from-amber-50 to-pink-50 border-2 border-amber-300 shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Hidden Prize Layer (Below Canvas) */}
        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center z-0">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2 shadow-inner">
            <Gift size={24} className="animate-bounce" />
          </div>
          <p className="font-serif font-bold text-sm sm:text-base text-amber-950 whitespace-pre-line leading-snug mb-2">
            {secretMessage}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            <Sparkles size={11} /> {secretGift}
          </span>
        </div>

        {/* Scratchable Canvas Layer */}
        <canvas
          ref={canvasRef}
          width={360}
          height={270}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`absolute inset-0 w-full h-full cursor-pointer touch-none z-10 transition-opacity duration-500 ${
            isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      </div>

      {/* Progress & Controls */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {!isScratched ? (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-stone-500">
              Scratched: {scratchPercent}%
            </span>
            <button
              type="button"
              onClick={revealFull}
              className="px-4 py-1.5 rounded-full text-xs font-serif font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 transition-colors"
            >
              Reveal Instantly ✨
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 animate-in zoom-in-95">
            <span className="text-xs font-serif font-bold text-green-700 flex items-center gap-1">
              <Check size={14} /> Secret Unlocked!
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-serif font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Scratch Again</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
