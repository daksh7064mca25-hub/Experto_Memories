"use client";

import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Gift, Sparkles, Heart, RotateCcw, Check, Trophy } from "lucide-react";
import { AnniversarySpinWheelConfig, AnniversaryWheelOption, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversarySpinWheelConfig;
  partner1Name?: string;
  partner2Name?: string;
  theme?: ThemeId;
}

const DEFAULT_OPTIONS: AnniversaryWheelOption[] = [
  {
    id: "opt-1",
    label: "Candlelight Dinner",
    description: "A romantic dinner at your favorite restaurant — dessert and drinks on me!",
    color: "#6B2D38",
    icon: "🕯️",
  },
  {
    id: "opt-2",
    label: "Full Body Massage",
    description: "30 minutes of gentle relaxation and pampering whenever you want.",
    color: "#C46879",
    icon: "💆",
  },
  {
    id: "opt-3",
    label: "Weekend Getaway",
    description: "A spontaneous road trip or cozy cabin escape together for two.",
    color: "#8C3A49",
    icon: "🚗",
  },
  {
    id: "opt-4",
    label: "Breakfast in Bed",
    description: "Warm pancakes, fresh coffee, and sleeping in as late as you like.",
    color: "#E8B4B8",
    icon: "🥞",
  },
  {
    id: "opt-5",
    label: "Movie Night Choice",
    description: "You pick any movie, no objections! Plus homemade popcorn and sweet treats.",
    color: "#D89BA1",
    icon: "🎬",
  },
  {
    id: "opt-6",
    label: "One Free Wish",
    description: "Any wish you ask for, no questions asked! Valid forever.",
    color: "#4A1D25",
    icon: "✨",
  },
];

export function AnniversarySpinWheelSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme = "pink-paradise",
}: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");
  const options = config.options && config.options.length >= 2 ? config.options : DEFAULT_OPTIONS;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [winner, setWinner] = useState<AnniversaryWheelOption | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const numSlices = options.length;
  const sliceAngle = 360 / numSlices;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Pick random winning index
    const targetIndex = Math.floor(Math.random() * numSlices);
    const targetOption = options[targetIndex];

    // Total rotations: minimum 5 full rotations (1800 deg) + offset to align target slice with top pointer
    // Pointer is at the top (angle 0). Center of slice i is at i * sliceAngle.
    // To bring slice i to top (angle 0), rotate clockwise by (360 - i * sliceAngle).
    const extraRotations = 5 * 360;
    // Add subtle random jitter within slice (+/- 25% of sliceAngle) for natural realism
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.4);
    const targetDegree =
      Math.floor(rotationDegrees / 360 + 1) * 360 +
      extraRotations +
      (360 - targetIndex * sliceAngle) +
      jitter;

    setRotationDegrees(targetDegree);

    // After deceleration transition finishes (4.5s)
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(targetOption);
      setHasSpun(true);

      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0", "#f43f5e", "#ffd700"],
      });
    }, 4500);
  };

  // Helper to round coordinates to 2 decimal places as fixed string to guarantee 100% identical SSR and client hydration
  const roundCoord = (val: number): string => (Math.round(val * 100) / 100).toFixed(2);

  // Helper to generate SVG pie slices
  const createSlicePath = (index: number) => {
    const startAngle = (index * sliceAngle - sliceAngle / 2 - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - sliceAngle / 2 - 90) * (Math.PI / 180);
    const r = 140;
    const cx = 150;
    const cy = 150;

    const x1 = roundCoord(cx + r * Math.cos(startAngle));
    const y1 = roundCoord(cy + r * Math.sin(startAngle));
    const x2 = roundCoord(cx + r * Math.cos(endAngle));
    const y2 = roundCoord(cy + r * Math.sin(endAngle));

    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <section id="anniv-sec-spin-wheel" className="py-14 sm:py-20 px-3.5 sm:px-4 max-w-xl mx-auto select-none text-center">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-[#E8B4B8]/80 shadow-[#6B2D38]/10">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-[#FFF5F6] text-[#6B2D38] border border-[#E8B4B8]/70 shadow-sm mb-3">
          <Gift size={13} className="text-[#C46879]" />
          <span>Interactive Anniversary Surprise</span>
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3D262A] mb-2">
          {config.headline || "The Anniversary Prize Wheel"}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-sm mx-auto mb-8 leading-relaxed">
          {config.subtext || "Whatever it lands on, I owe you! Give it a spin to claim your romantic treat."}
        </p>

        {/* Wheel Assembly - Responsive diameter so 320px screens don't overflow */}
        <div className="relative mx-auto w-60 h-60 min-[360px]:w-68 min-[360px]:h-68 sm:w-80 sm:h-80 max-w-full flex items-center justify-center mb-6">
          {/* Top Indicator Pointer */}
          <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none filter drop-shadow-md">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#6B2D38]" />
            <div className="w-3 h-3 rounded-full bg-[#E8B4B8] -mt-6 border border-white" />
          </div>

          {/* Golden Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#E8B4B8] shadow-2xl shadow-[#6B2D38]/20 bg-gradient-to-tr from-[#FAF6F0] via-white to-[#FFF5F6] p-1.5">
            {/* Spinning SVG Disc */}
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full rounded-full transition-transform duration-[4500ms]"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transitionTimingFunction: "cubic-bezier(0.15, 0.9, 0.25, 1)",
              }}
              suppressHydrationWarning={true}
            >
              <defs>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.2" />
                </filter>
              </defs>

              {options.map((opt, idx) => {
                const angle = roundCoord(idx * sliceAngle);
                const rad = ((Number(angle) - 90) * Math.PI) / 180;
                const textDist = 92;
                const tx = roundCoord(150 + textDist * Math.cos(rad));
                const ty = roundCoord(150 + textDist * Math.sin(rad));

                const palette = [
                  "#6B2D38",
                  "#C46879",
                  "#8C3A49",
                  "#D89BA1",
                  "#501B24",
                  "#B35768",
                  "#7A2E3D",
                  "#E0A2AC",
                ];
                const sliceColor = opt.color || palette[idx % palette.length];

                return (
                  <g key={opt.id || idx}>
                    <path
                      d={createSlicePath(idx)}
                      fill={sliceColor}
                      stroke="#FAF6F0"
                      strokeWidth="2"
                      suppressHydrationWarning={true}
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#FFF"
                      fontSize={numSlices > 6 ? "9" : "10"}
                      fontFamily="'Playfair Display', Georgia, serif"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${angle}, ${tx}, ${ty})`}
                      filter="url(#shadow)"
                      suppressHydrationWarning={true}
                    >
                      {opt.label.length > 13 ? `${opt.label.slice(0, 11)}…` : opt.label}
                    </text>
                  </g>
                );
              })}

              {/* Decorative Ring Slices Divider */}
              <circle cx="150" cy="150" r="140" fill="none" stroke="#FAF6F0" strokeWidth="3" />
            </svg>
          </div>

          {/* Center Hub & Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#8C3A49] via-[#6B2D38] to-[#4A1D25] border-3 border-white text-white flex flex-col items-center justify-center shadow-xl shadow-[#6B2D38]/40 transition-all ${
              isSpinning ? "opacity-90 scale-95 cursor-not-allowed" : "hover:scale-105 active:scale-95 cursor-pointer"
            }`}
            aria-label="Spin Wheel"
          >
            <Heart size={16} className="fill-white text-white mb-0.5 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider">
              {isSpinning ? "SPINNING" : "SPIN"}
            </span>
          </button>
        </div>

        {/* Winner Announcement Card */}
        {winner && (
          <div className="mt-4 p-5 rounded-2xl bg-[#FFF5F6] border-2 border-[#E8B4B8] animate-in zoom-in-95 duration-400 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white border border-[#E8B4B8] flex items-center justify-center text-[#C46879] shadow-xs">
              <Trophy size={18} />
            </div>

            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C46879] block mb-1">
              🎉 Congratulations, My Love!
            </span>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3D262A] mb-1">
              {winner.label}
            </h3>

            {winner.description && (
              <p className="font-sans text-xs sm:text-sm text-[#6B2D38] leading-relaxed max-w-sm mx-auto mb-3">
                {winner.description}
              </p>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E8B4B8] text-xs font-serif italic text-[#3D262A] font-medium shadow-2xs">
              <Heart size={12} className="text-[#C46879] fill-[#C46879]" />
              <span>Whatever it lands on, I owe you! ❤️</span>
            </div>
          </div>
        )}

        {/* Footer Note & Spin Again */}
        <div className="mt-5 flex items-center justify-center gap-3">
          {hasSpun && !isSpinning && (
            <button
              onClick={spinWheel}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-medium text-[#6B2D38] hover:text-[#3D262A] bg-[#FAF6F0] hover:bg-white border border-[#E8B4B8]/60 transition-all shadow-xs active:scale-95"
            >
              <RotateCcw size={13} />
              <span>Spin Again</span>
            </button>
          )}
        </div>

        <p className="mt-4 text-[11px] font-serif italic text-[#6B2D38]/70">
          {config.footerNote || "Redeemable with unlimited hugs and smiles whenever you wish."}
        </p>
      </div>
    </section>
  );
}
