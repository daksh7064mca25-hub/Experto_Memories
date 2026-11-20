"use client";

import React, { useRef, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Eye } from "lucide-react";
import { ScratchCardConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: ScratchCardConfig;
  theme: ThemeId;
}

export function ScratchCardSection({ config, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const isDrawingRef = useRef(false);
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  // Initialize canvas with silver/gold shimmer scratch coating
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create glamorous gradient coating
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#cbd5e1");
    gradient.addColorStop(0.3, "#f1f5f9");
    gradient.addColorStop(0.5, "#fda4af");
    gradient.addColorStop(0.7, "#f1f5f9");
    gradient.addColorStop(1, "#94a3b8");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw playful scratch pattern/text
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH HERE ✨", width / 2, height / 2 - 8);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Rub with finger or mouse", width / 2, height / 2 + 16);
  }, []);

  const calculateScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;

    // Sample every 4th pixel for speed
    for (let i = 3; i < data.length; i += 16) {
      if (data[i] === 0) {
        transparentPixels++;
      }
    }

    const totalSampled = data.length / 16;
    const pct = Math.round((transparentPixels / totalSampled) * 100);
    setScratchProgress(pct);

    const threshold = config.scratchPercentageToReveal || 45;
    if (pct >= threshold && !isRevealed) {
      triggerFullReveal();
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    calculateScratchPercentage();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const triggerFullReveal = () => {
    setIsRevealed(true);
    setScratchProgress(100);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#f43f5e", "#fbbf24"],
    });
  };

  return (
    <section id="sec-scratch-card" className="py-16 px-4 max-w-xl mx-auto text-center">
      <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 mb-2">
        Surprise Gift 🎁
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
        {config.headline || "A Secret Under the Shimmer"}
      </h2>
      <p className="text-sm sm:text-base opacity-80 mt-2 max-w-md mx-auto font-sans mb-8">
        {config.subtext || "Use your finger or mouse to scratch the surface below!"}
      </p>

      {/* Card Box */}
      <div className="relative mx-auto w-full max-w-[360px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-2 border-rose-200/80 dark:border-pink-900 select-none touch-none">
        {/* Hidden Surprise Beneath */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 p-6 flex flex-col items-center justify-center text-white text-center shadow-inner">
          <Sparkles className="w-8 h-8 mb-2 animate-bounce text-amber-200" />
          <h3 className="font-serif font-bold text-lg sm:text-xl leading-snug drop-shadow-sm">
            {config.secretMessage || "I love you more than all the stars in the night sky. 🌟"}
          </h3>
          <p className="font-handwriting text-xl sm:text-2xl text-rose-100 mt-2">
            {config.secretSubtext || "P.S. Tonight’s dinner and ice cream are on me!"}
          </p>
        </div>

        {/* Scratch Canvas Overlay */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={360}
            height={225}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10 transition-opacity duration-500"
          />
        )}
      </div>

      {/* Helper & Quick Reveal Button */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {!isRevealed ? (
          <>
            <span className="text-xs text-stone-500 dark:text-pink-300">
              Scratched: {scratchProgress}%
            </span>
            <button
              type="button"
              onClick={triggerFullReveal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-semibold bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors"
            >
              <Eye size={12} />
              <span>Reveal Now</span>
            </button>
          </>
        ) : (
          <span className="text-xs text-rose-600 dark:text-pink-300 font-semibold flex items-center gap-1">
            <Sparkles size={14} /> Secret Unlocked!
          </span>
        )}
      </div>
    </section>
  );
}

