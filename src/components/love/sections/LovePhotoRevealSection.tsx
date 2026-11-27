"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Heart, Eye, RotateCcw, Camera, CheckCircle2 } from "lucide-react";
import { LovePhotoRevealConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LovePhotoRevealConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
}

export function LovePhotoRevealSection({
  config,
  recipientName,
  senderName,
  theme,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawing = useRef(false);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const photoUrl =
    config.photoUrl ||
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80";

  // Initialize Canvas Scratch Layer
  const initCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = container.offsetWidth || 360;
    const height = container.offsetHeight || 380;
    canvas.width = width;
    canvas.height = height;

    // Draw shimmering rose gold foil overlay
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#e11d48");
    grad.addColorStop(0.3, "#f43f5e");
    grad.addColorStop(0.5, "#fb7185");
    grad.addColorStop(0.7, "#be123c");
    grad.addColorStop(1, "#881337");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative heart & sparkle pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;
    for (let i = -width; i < width * 2; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Centered label & prompt
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ SCRATCH TO REVEAL OUR PHOTO ✨", width / 2, height / 2 - 12);
    ctx.font = "italic 12px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillText(
      config.scratchPromptText || "Touch or drag to uncover our favourite memory",
      width / 2,
      height / 2 + 12
    );

    setIsRevealed(false);
    setScratchPercent(0);
  };

  useEffect(() => {
    const timer = setTimeout(initCanvas, 150);
    window.addEventListener("resize", initCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  const handleScratchMove = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    // Periodically calculate scratched percentage
    const sampleWidth = canvas.width;
    const sampleHeight = canvas.height;
    try {
      const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
      let transparentPixels = 0;
      const totalPixels = imageData.data.length / 4;
      // Sample every 16th pixel for high performance
      for (let i = 3; i < imageData.data.length; i += 64) {
        if (imageData.data[i] === 0) {
          transparentPixels += 16;
        }
      }
      const percent = Math.min(100, Math.round((transparentPixels / totalPixels) * 100));
      setScratchPercent(percent);

      if (percent >= 40 && !isRevealed) {
        setIsRevealed(true);
      }
    } catch {}
  };

  const handleForceReveal = () => {
    setIsRevealed(true);
    setScratchPercent(100);
  };

  const handleReset = () => {
    setIsRevealed(false);
    setScratchPercent(0);
    setTimeout(initCanvas, 50);
  };

  return (
    <section id="sec-love-photo-reveal" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-2xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Camera size={11} className="text-amber-300" />
            <span>Cherished Moment &bull; Photo Reveal</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "Our Favourite Photograph"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext ||
              "Of all the pictures we have ever taken, this one holds a special piece of my heart."}
          </p>
        </div>

        {/* Polaroid Scratch Card Container */}
        <div className="relative inline-block w-full max-w-md mx-auto">
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-amber-400/40 transform transition-all duration-300 hover:rotate-0 -rotate-1">
            {/* Top Tape Accent */}
            <div className="w-20 h-5 bg-amber-200/40 backdrop-blur-sm -top-3 left-1/2 -translate-x-1/2 absolute rotate-1 z-30 border border-white/40 shadow-xs" />

            {/* Photo & Scratch Frame */}
            <div
              ref={containerRef}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-inner select-none"
            >
              {/* Revealed Image */}
              <Image
                src={photoUrl}
                alt={config.caption || "Our favourite memory"}
                fill
                sizes="(max-width: 640px) 92vw, 440px"
                className="object-cover"
                unoptimized={photoUrl.startsWith("/api/media/view")}
                priority
              />

              {/* Canvas Foil Overlay */}
              <canvas
                ref={canvasRef}
                onMouseDown={(e) => {
                  isDrawing.current = true;
                  handleScratchMove(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  if (!isDrawing.current) return;
                  handleScratchMove(e.clientX, e.clientY);
                }}
                onMouseUp={() => {
                  isDrawing.current = false;
                }}
                onMouseLeave={() => {
                  isDrawing.current = false;
                }}
                onTouchStart={(e) => {
                  if (e.touches.length > 0) {
                    handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length > 0) {
                    handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-700 z-10 touch-none ${
                  isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              />

              {/* Reveal Sparkle Badge */}
              {isRevealed && (
                <div className="absolute top-3 right-3 z-20 animate-fadeIn">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-400/40 shadow-md">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                    <span>Memory Revealed</span>
                  </span>
                </div>
              )}
            </div>

            {/* Polaroid Bottom Caption Area */}
            <div className="pt-4 pb-2 text-center">
              <p className="font-serif italic font-bold text-stone-900 text-sm sm:text-base leading-snug">
                &ldquo;{config.caption || "Forever my favourite person to make memories with."}&rdquo;
              </p>
              {config.loveNote && (
                <p className="text-xs text-rose-800 font-serif mt-1 font-medium">
                  {config.loveNote}
                </p>
              )}
              <div className="mt-2 text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                {recipientName} &amp; {senderName}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {!isRevealed ? (
              <button
                type="button"
                onClick={handleForceReveal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-bold bg-amber-400 hover:bg-amber-500 text-stone-950 shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Eye size={13} />
                <span>{config.buttonText || "Unwrap / Reveal Photo ✨"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono text-rose-300/80 hover:text-amber-300 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Scratch Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
