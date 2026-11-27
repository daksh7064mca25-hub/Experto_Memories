"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Calendar, Sliders } from "lucide-react";
import { AnniversaryThenNowConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryThenNowConfig;
  theme?: ThemeId;
}

export function AnniversaryThenNowSection({ config, theme }: Props) {
  const themeConfig = getThemeConfig(theme || "pink-paradise", "anniversary");
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const thenPhoto =
    config.thenPhotoUrl ||
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80";
  const nowPhoto =
    config.nowPhotoUrl ||
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80";

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(x, rect.width));
    const percent = (clamped / rect.width) * 100;
    setSliderPos(percent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    updatePosition(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    if (e.touches[0]) updatePosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    if (e.touches[0]) updatePosition(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      id="anniv-sec-then-now"
      className="relative py-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-rose-100 text-rose-900 border border-rose-200 mb-3 shadow-xs">
        <Sliders size={13} className="text-rose-600" />
        <span>Time Traveler</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-2">
        {config.headline || "Then vs Now ⏳"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8">
        {config.subtext || "Drag the slider left and right to see how our story began versus how much we've grown together."}
      </p>

      {/* Comparison Frame */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden border-2 border-rose-200 shadow-2xl cursor-ew-resize select-none touch-none bg-stone-100"
        style={{ containerType: "inline-size" }}
      >
        {/* RIGHT / "NOW" IMAGE (Background) */}
        <img
          src={nowPhoto}
          alt="Now memory"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold tracking-wide">
          {config.nowLabel || "NOW"}
        </div>

        {/* LEFT / "THEN" IMAGE (Clipped Overlay) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={thenPhoto}
            alt="Then memory"
            className="absolute inset-y-0 left-0 max-w-none object-cover h-full"
            style={{
              width: "100cqw",
            }}
            draggable={false}
          />
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-rose-900/80 backdrop-blur-md text-white text-[11px] font-mono font-bold tracking-wide">
            {config.thenLabel || "THEN"}
          </div>
        </div>

        {/* DRAGGABLE DIVIDER HANDLE */}
        <div
          className="absolute inset-y-0 w-1 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl border-2 border-rose-400 flex items-center justify-center text-rose-600">
            <Sliders size={14} />
          </div>
        </div>
      </div>

      <p className="text-[11px] font-mono text-stone-400 mt-4">
        ↔ Drag slider horizontally to compare
      </p>
    </section>
  );
}
