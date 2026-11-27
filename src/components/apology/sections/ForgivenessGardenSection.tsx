"use client";

import React, { useState, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Sprout, Flower2 } from "lucide-react";
import { ForgivenessGardenConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: ForgivenessGardenConfig;
  theme: ThemeId;
}

const STAGE_LABELS = [
  { level: 1, label: "Hurting" },
  { level: 2, label: "Reflecting" },
  { level: 3, label: "Better" },
  { level: 4, label: "Smiling" },
  { level: 5, label: "Warm Hugs" },
];

export function ForgivenessGardenSection({ config, theme }: Props) {
  // REQUIREMENT 1: Always start at Stage 1 of 5
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const hasCelebratedStage5 = useRef<boolean>(false);

  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];
  const milestones = config.milestones || [];
  const activeMilestone =
    milestones.find((m) => m.level === currentLevel) ||
    milestones[currentLevel - 1] || {
      level: currentLevel,
      title:
        currentLevel === 1
          ? "Still a little hurt"
          : currentLevel === 2
          ? "Maybe thinking it through"
          : currentLevel === 3
          ? "A tiny bit better"
          : currentLevel === 4
          ? "Smiling again"
          : "Sending a warm virtual hug",
      description:
        "Feelings take time and that's okay. Move the heart to see how our garden blossoms.",
      flowerStage: "seedling",
    };

  const triggerCelebration = useCallback(() => {
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.62 },
      colors: ["#ec4899", "#8b5cf6", "#f43f5e", "#10b981", "#fbbf24", "#fda4af"],
    });
  }, []);

  const calculateLevelFromProgress = (progress: number): number => {
    if (progress <= 0.125) return 1;
    if (progress <= 0.375) return 2;
    if (progress <= 0.625) return 3;
    if (progress <= 0.875) return 4;
    return 5;
  };

  const handleSelectStage = (level: number) => {
    const clampedLevel = Math.max(1, Math.min(5, level));
    setCurrentLevel(clampedLevel);
    setDragProgress(null);

    if (clampedLevel === 5) {
      if (!hasCelebratedStage5.current) {
        triggerCelebration();
        hasCelebratedStage5.current = true;
      }
    } else {
      hasCelebratedStage5.current = false;
    }
  };

  const updateFromPointer = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const width = rect.width;
    if (width <= 0) return;

    const offsetX = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(width, offsetX));
    const progress = clampedX / width; // 0.0 to 1.0

    setDragProgress(progress);
    const newLevel = calculateLevelFromProgress(progress);
    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel);
      if (newLevel === 5) {
        if (!hasCelebratedStage5.current) {
          triggerCelebration();
          hasCelebratedStage5.current = true;
        }
      } else {
        hasCelebratedStage5.current = false;
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
    setDragProgress(null); // Snaps smoothly to current stage
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
    setDragProgress(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      handleSelectStage(currentLevel + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      handleSelectStage(currentLevel - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      handleSelectStage(1);
    } else if (e.key === "End") {
      e.preventDefault();
      handleSelectStage(5);
    }
  };

  // Percentage along the track: 0% at stage 1, 100% at stage 5
  const displayPercent =
    dragProgress !== null ? dragProgress * 100 : ((currentLevel - 1) / 4) * 100;

  return (
    <section
      id="sec-forgiveness-garden"
      data-stage={currentLevel}
      className="py-16 px-4 max-w-3xl mx-auto"
    >
      <div className={`${themeConfig.cardBgClass} rounded-3xl p-6 sm:p-10 shadow-xl border text-center relative overflow-hidden`}>
        {/* Header Eyebrow */}
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
        <div
          data-testid="garden-plant-stage"
          data-level={currentLevel}
          className="my-8 relative h-48 sm:h-56 flex flex-col items-center justify-center select-none"
        >
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
          <div
            key={currentLevel}
            className="relative z-10 transition-transform duration-500 transform hover:scale-105 animate-in fade-in zoom-in-95 duration-300"
          >
            {currentLevel === 1 && (
              <div className="flex flex-col items-center">
                <span className="text-6xl animate-bounce">🌱</span>
                <div className="w-16 h-2.5 bg-amber-900/20 dark:bg-amber-950/40 rounded-full filter blur-[1px] mt-1" />
                <span className="text-xs text-stone-500 mt-2 font-serif italic">
                  Resting quietly in gentle soil
                </span>
              </div>
            )}
            {currentLevel === 2 && (
              <div className="flex flex-col items-center">
                <span className="text-7xl animate-pulse">🌿</span>
                <div className="w-20 h-2.5 bg-amber-900/20 dark:bg-amber-950/40 rounded-full filter blur-[1px] mt-1" />
                <span className="text-xs text-stone-500 mt-2 font-serif italic">
                  A tender shoot reaching for light
                </span>
              </div>
            )}
            {currentLevel === 3 && (
              <div className="flex flex-col items-center">
                <span className="text-8xl animate-bounce">🌷</span>
                <div className="w-24 h-3 bg-amber-900/20 dark:bg-amber-950/40 rounded-full filter blur-[1px] mt-1" />
                <span className="text-xs text-rose-500 mt-2 font-serif italic">
                  Soft pink buds beginning to open
                </span>
              </div>
            )}
            {currentLevel === 4 && (
              <div className="flex flex-col items-center">
                <span className="text-8xl animate-pulse">🌸</span>
                <div className="w-28 h-3 bg-amber-900/20 dark:bg-amber-950/40 rounded-full filter blur-[1px] mt-1" />
                <span className="text-xs text-rose-500 mt-2 font-serif italic">
                  Full sweet blossoms in the sunlight
                </span>
              </div>
            )}
            {currentLevel === 5 && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <span className="text-9xl filter drop-shadow-lg animate-pulse">💐</span>
                  <span className="absolute -top-3 -right-2 text-3xl animate-bounce">🦋</span>
                  <span className="absolute -top-1 -left-3 text-2xl animate-bounce delay-150">✨</span>
                </div>
                <div className="w-32 h-3 bg-rose-900/20 dark:bg-pink-950/40 rounded-full filter blur-[1px] mt-1" />
                <span className="text-xs text-pink-600 dark:text-pink-300 mt-2 font-serif font-bold">
                  Radiant garden filled with love &amp; warm hugs!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Milestone Text Box */}
        <div
          data-testid="garden-milestone-card"
          className="bg-white/85 dark:bg-stone-900/85 rounded-2xl p-5 border border-rose-200/80 dark:border-pink-900/50 shadow-sm max-w-lg mx-auto mb-7 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-rose-500">
              Stage {currentLevel} of 5:
            </span>
            <h3 className="font-serif font-bold text-lg text-rose-950 dark:text-pink-100">
              {activeMilestone.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-sans leading-relaxed">
            {activeMilestone.description}
          </p>
        </div>

        {/* 3. EMOTIONAL INSTRUCTION */}
        <div className="max-w-md mx-auto mb-2 text-center">
          <p className="font-serif text-sm sm:text-base font-semibold text-rose-950 dark:text-pink-100 flex items-center justify-center gap-1.5">
            <span>Drag the heart to help our little garden bloom.</span>
            <span className="text-rose-500 text-xs">🌱</span>
          </p>
        </div>

        {/* 2 & 5. INTERACTIVE HEART-SHAPED SLIDER TRACK */}
        <div className="max-w-md mx-auto px-4 select-none">
          <div
            ref={trackRef}
            data-testid="garden-slider-track"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className="relative py-5 touch-none cursor-pointer"
          >
            {/* The Track Bar Line */}
            <div className="relative h-3 sm:h-3.5 bg-rose-100/90 dark:bg-rose-950/60 rounded-full border border-rose-200/80 dark:border-rose-900/50 shadow-inner">
              {/* Progress Fill */}
              <div
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-rose-300 via-rose-400 to-rose-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.35)]"
                style={{
                  width: `${displayPercent}%`,
                  transition: isDragging ? "none" : "width 0.25s ease-out",
                }}
              />

              {/* Milestone Dots along Track (0%, 25%, 50%, 75%, 100%) */}
              {[0, 25, 50, 75, 100].map((pct, idx) => (
                <div
                  key={idx}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 transition-colors duration-200 pointer-events-none ${
                    displayPercent >= pct
                      ? "bg-white border-rose-500 shadow-xs"
                      : "bg-rose-50 dark:bg-stone-900 border-rose-200 dark:border-rose-800"
                  }`}
                  style={{ left: `${pct}%` }}
                />
              ))}

              {/* The Draggable Heart Handle */}
              <div
                role="slider"
                tabIndex={0}
                data-testid="garden-heart-handle"
                aria-label="Forgiveness Garden emotional stage slider"
                aria-valuemin={1}
                aria-valuemax={5}
                aria-valuenow={currentLevel}
                aria-valuetext={`Stage ${currentLevel} of 5: ${activeMilestone.title}`}
                onKeyDown={handleKeyDown}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing select-none z-20 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/60 rounded-full ${
                  isDragging ? "scale-115" : "hover:scale-110"
                }`}
                style={{
                  left: `${displayPercent}%`,
                  transition: isDragging
                    ? "none"
                    : "left 0.25s ease-out, transform 0.15s ease-out",
                }}
              >
                <div className="relative group flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(190,24,93,0.35)]">
                  {/* Heart Handle Body */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#541D2B] via-[#E11D48] to-[#FB7185] border-2 border-white flex items-center justify-center shadow-md">
                    <Heart
                      size={19}
                      className="fill-white text-white drop-shadow-xs transition-transform group-hover:scale-110"
                    />
                  </div>

                  {/* Subtle pulsing glow when idle */}
                  {!isDragging && (
                    <span className="absolute inset-0 rounded-full bg-rose-400/25 animate-ping pointer-events-none -z-10" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Five-Stage Clickable Labels */}
          <div className="flex justify-between items-center text-[10px] sm:text-xs font-serif text-stone-500 mt-1">
            {STAGE_LABELS.map((stage) => {
              const isActive = currentLevel === stage.level;
              return (
                <button
                  key={stage.level}
                  type="button"
                  data-testid={`garden-stage-btn-${stage.level}`}
                  onClick={() => handleSelectStage(stage.level)}
                  className={`transition-all duration-200 hover:text-rose-600 ${
                    isActive
                      ? "font-bold text-rose-600 dark:text-pink-300 scale-105"
                      : "text-stone-500 dark:text-stone-400 opacity-75 hover:opacity-100"
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>

          {/* 3. SUBTLE SUPPORTING MESSAGE */}
          <div className="mt-3 text-center">
            <p className="font-sans italic text-xs text-rose-700/80 dark:text-pink-300/80">
              &ldquo;Every little step brings us closer to brighter days.&rdquo;
            </p>
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
