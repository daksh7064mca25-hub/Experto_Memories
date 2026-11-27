"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Sparkles, Heart, RotateCcw, Eye, Camera } from "lucide-react";
import { AnniversaryScratchConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { isProtectedMediaUrl } from "@/lib/media-utils";

interface Props {
  config: AnniversaryScratchConfig;
  partner1Name?: string;
  partner2Name?: string;
  theme?: ThemeId;
}

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80";

export function AnniversaryScratchSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme = "pink-paradise",
}: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isCheckingRef = useRef<boolean>(false);
  const isDrawingRef = useRef<boolean>(false);

  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const headline = config.headline || "Our Favourite Memory";
  const subtext =
    config.subtext ||
    "Rub your finger or mouse over the card below to reveal our most special moment together.";
  const coverTitle = config.coverTitle || "Scratch to Reveal ❤️";
  const coverSubtitle = config.coverSubtitle || "Rub here to uncover our memory";
  const photoUrl = config.photoUrl || config.secretPhotoUrl || DEFAULT_PHOTO;
  const photoCaption =
    config.photoCaption || "The day that became my favorite chapter in our story.";
  const secretMessage =
    config.secretMessage || "Every second with you is a memory I treasure forever.";

  // Paint the rose-gold shimmer foil canvas overlay
  const paintCoverFoil = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Rose gold shimmer foil gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#E8B4B8");
      grad.addColorStop(0.25, "#FCE8EB");
      grad.addColorStop(0.5, "#D89BA1");
      grad.addColorStop(0.75, "#F7D6DA");
      grad.addColorStop(1, "#C46879");

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle decorative border inside canvas
      ctx.strokeStyle = "rgba(107, 45, 56, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, width - 24, height - 24);

      // Decorative corner sparkles
      ctx.fillStyle = "rgba(107, 45, 56, 0.35)";
      ctx.font = "16px serif";
      ctx.fillText("✦", 24, 30);
      ctx.fillText("✦", width - 32, 30);
      ctx.fillText("✦", 24, height - 20);
      ctx.fillText("✦", width - 32, height - 20);

      // Cover Title
      ctx.fillStyle = "#6B2D38";
      ctx.font = "bold 18px 'Playfair Display', Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(coverTitle, width / 2, height / 2 - 10);

      // Cover Subtitle
      ctx.font = "italic 12px sans-serif";
      ctx.fillStyle = "#8C3A49";
      ctx.fillText(coverSubtitle, width / 2, height / 2 + 16);
    },
    [coverTitle, coverSubtitle]
  );

  // Initialize canvas on mount or reset
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    paintCoverFoil(canvas);
    setIsScratched(false);
    setScratchPercent(0);
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, [paintCoverFoil]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Accurately calculate actual scratched surface area (not time or repeat visits)
  const calculateClearedPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      const { width, height } = canvas;
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let clearedPixels = 0;
      let sampledCount = 0;

      // Sample every 4th pixel (stride 16 in RGBA byte array)
      const stride = 16;
      for (let i = 3; i < data.length; i += stride) {
        sampledCount++;
        // Pixel is cleared if alpha is near 0
        if (data[i] < 30) {
          clearedPixels++;
        }
      }

      if (sampledCount === 0) return;
      const percent = Math.min(100, Math.round((clearedPixels / sampledCount) * 100));
      setScratchPercent(percent);

      // 70% threshold: automatically complete and celebrate
      if (percent >= 70) {
        setIsScratched(true);
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.65 },
          colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0", "#f43f5e"],
        });
      }
    } catch {
      // Fallback
    }
  }, []);

  const requestProgressCheck = useCallback(() => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    requestAnimationFrame(() => {
      calculateClearedPercent();
      isCheckingRef.current = false;
    });
  }, [calculateClearedPercent]);

  // Scratch stroke between previous point and current point
  const drawScratchLine = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isScratched) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.lineWidth = 44;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      if (lastPosRef.current) {
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.arc(x, y, 22, 0, Math.PI * 2, false);
        ctx.fill();
      }

      lastPosRef.current = { x, y };
      requestProgressCheck();
    },
    [isScratched, requestProgressCheck]
  );

  const startScratching = (clientX: number, clientY: number) => {
    if (isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    isDrawingRef.current = true;
    lastPosRef.current = null;
    drawScratchLine(x, y);
  };

  const continueScratching = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current || isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    drawScratchLine(x, y);
  };

  const stopScratching = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    calculateClearedPercent();
  };

  const handleRevealAll = () => {
    setIsScratched(true);
    setScratchPercent(100);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.65 },
      colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0", "#f43f5e"],
    });
  };

  // Issue 2 Fix: Reliable reset that works repeatedly
  const handleScratchAgain = () => {
    initCanvas();
  };

  return (
    <section
      id="anniv-sec-scratch"
      data-scratched={isScratched ? "true" : "false"}
      data-progress={scratchPercent}
      className="py-14 sm:py-20 px-4 max-w-xl mx-auto select-none"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8B4B8]/80 shadow-[#6B2D38]/10 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-[#FFF5F6] text-[#6B2D38] border border-[#E8B4B8]/70 shadow-sm mb-3">
          <Camera size={13} className="text-[#C46879]" />
          <span>Interactive Surprise</span>
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3D262A] mb-2">
          {headline}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-md mx-auto mb-6 leading-relaxed">
          {subtext}
        </p>

        {/* Scratch Card Frame Container */}
        <div
          ref={containerRef}
          className="relative mx-auto w-full max-w-sm aspect-[4/3] rounded-3xl border-2 border-[#E8B4B8] shadow-xl overflow-hidden bg-gradient-to-br from-[#FFF5F6] via-[#FAF6F0] to-[#FCE8EB] flex items-center justify-center p-3 text-center"
        >
          {/* Photograph Underneath */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/5 flex flex-col items-center justify-center">
            <Image
              src={photoUrl}
              alt={photoCaption || "Our favourite memory"}
              fill
              unoptimized={isProtectedMediaUrl(photoUrl)}
              sizes="(max-width: 640px) 340px, 380px"
              className="object-cover"
            />

            {/* Gradient Overlay for Caption readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart size={14} className="fill-rose-400 text-rose-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-200">
                  Our Special Memory
                </span>
              </div>
              <p className="font-serif italic text-xs sm:text-sm font-medium line-clamp-2 leading-snug">
                {photoCaption}
              </p>
            </div>
          </div>

          {/* Canvas Foil Overlay - Kept always mounted so reset works repeatedly */}
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            data-testid="anniversary-scratch-canvas"
            onMouseDown={(e) => startScratching(e.clientX, e.clientY)}
            onMouseMove={(e) => continueScratching(e.clientX, e.clientY)}
            onMouseUp={stopScratching}
            onMouseLeave={stopScratching}
            onTouchStart={(e) => {
              if (e.touches[0]) {
                e.preventDefault();
                startScratching(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                e.preventDefault();
                continueScratching(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={stopScratching}
            onTouchCancel={stopScratching}
            className={`absolute inset-0 w-full h-full z-10 touch-none rounded-3xl transition-opacity duration-700 ${
              isScratched
                ? "opacity-0 pointer-events-none"
                : "opacity-100 cursor-pointer pointer-events-auto"
            }`}
          />
        </div>

        {/* Subtle, elegant scratch progress indicator */}
        <div className="mt-4 flex flex-col items-center justify-center gap-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF5F6] border border-[#E8B4B8]/60 text-[#6B2D38] text-xs font-serif shadow-2xs">
            <Sparkles size={13} className="text-[#C46879]" />
            <span data-testid="scratch-progress-text">
              {isScratched ? "Memory 100% revealed ✨" : `Memory revealed: ${scratchPercent}%`}
            </span>
          </div>

          {/* Subtle mini progress bar */}
          {!isScratched && (
            <div className="w-36 h-1.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#E8B4B8]/40 mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#E8B4B8] to-[#C46879] rounded-full transition-all duration-150"
                style={{ width: `${scratchPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Scratched Progress or Secret Message */}
        {secretMessage && (
          <p className="mt-4 font-serif italic text-xs sm:text-sm text-[#6B2D38]/90 max-w-sm mx-auto leading-relaxed">
            &ldquo;{secretMessage}&rdquo;
          </p>
        )}

        {/* Interaction Controls */}
        <div className="mt-5 flex items-center justify-center gap-3">
          {!isScratched ? (
            <button
              type="button"
              data-testid="scratch-reveal-all-btn"
              onClick={handleRevealAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-medium text-[#6B2D38] hover:text-[#3D262A] bg-[#FAF6F0] hover:bg-white border border-[#E8B4B8]/60 transition-all shadow-xs active:scale-95"
            >
              <Eye size={13} />
              <span>Reveal Photo Instantly</span>
            </button>
          ) : (
            <button
              type="button"
              data-testid="scratch-again-btn"
              onClick={handleScratchAgain}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-medium text-[#6B2D38] hover:text-[#3D262A] bg-[#FAF6F0] hover:bg-white border border-[#E8B4B8]/60 transition-all shadow-xs active:scale-95"
            >
              <RotateCcw size={13} />
              <span>Scratch Again</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
