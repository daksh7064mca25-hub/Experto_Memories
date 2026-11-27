"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Mic, MicOff, Cake, PartyPopper, Utensils, Check } from "lucide-react";
import { BirthdayCakeConfig, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayCakeConfig;
  recipientName: string;
  theme?: ThemeId;
}

type CuttingPhase = "uncut" | "slicing" | "separating" | "cut";

export function BirthdayCakeSection({
  config,
  recipientName = "Birthday Superstar",
  theme,
}: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const totalCandles = Math.min(Math.max(config.candlesCount || 5, 1), 7);

  // Lit status of each candle
  const [litCandles, setLitCandles] = useState<boolean[]>(() =>
    Array(totalCandles).fill(true)
  );
  const [isMakeWishOpen, setIsMakeWishOpen] = useState(false);
  const [userWish, setUserWish] = useState("");
  const [wishSaved, setWishSaved] = useState(false);
  const [allExtinguished, setAllExtinguished] = useState(false);

  // Interactive cake cutting state machine
  const [cuttingPhase, setCuttingPhase] = useState<CuttingPhase>("uncut");
  const isCakeCut = cuttingPhase === "cut" || cuttingPhase === "separating";

  // Optional mic blowing
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sliceTimerRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      sliceTimerRef.current.forEach(clearTimeout);
    };
  }, []);

  // Geometry constants for 2.5D round cake
  const cx = 160;
  const cy = 120;
  const rx = 95;
  const ry = 32;
  const H = 64;

  // Slice angles (front-right quadrant)
  // a1 = 18 deg (right side), a2 = 72 deg (front-right)
  const a1 = (18 * Math.PI) / 180;
  const a2 = (72 * Math.PI) / 180;

  const p1 = useMemo(
    () => ({
      x: +(cx + rx * Math.cos(a1)).toFixed(2),
      y: +(cy + ry * Math.sin(a1)).toFixed(2),
    }),
    [cx, cy, rx, ry, a1]
  );

  const p2 = useMemo(
    () => ({
      x: +(cx + rx * Math.cos(a2)).toFixed(2),
      y: +(cy + ry * Math.sin(a2)).toFixed(2),
    }),
    [cx, cy, rx, ry, a2]
  );

  const bp1 = useMemo(
    () => ({
      x: +(cx + (rx - 4) * Math.cos(a1)).toFixed(2),
      y: +(cy + (ry - 3) * Math.sin(a1)).toFixed(2),
    }),
    [cx, cy, rx, ry, a1]
  );

  const bp2 = useMemo(
    () => ({
      x: +(cx + (rx - 4) * Math.cos(a2)).toFixed(2),
      y: +(cy + (ry - 3) * Math.sin(a2)).toFixed(2),
    }),
    [cx, cy, rx, ry, a2]
  );

  // Dynamically position candles in a gentle arch across top-back ellipse
  const candlePositions = useMemo(() => {
    const list: { x: number; y: number; isLit: boolean; color: string }[] = [];
    for (let i = 0; i < totalCandles; i++) {
      const t = (i + 0.5) / totalCandles;
      // Angle across back half: from 200° to 340°
      const angleDeg = 200 + t * 140;
      const angleRad = (angleDeg * Math.PI) / 180;
      const candleX = cx + rx * 0.72 * Math.cos(angleRad);
      const candleY = cy + ry * 0.72 * Math.sin(angleRad);
      list.push({
        x: +candleX.toFixed(1),
        y: +candleY.toFixed(1),
        isLit: litCandles[i] ?? true,
        color:
          i % 2 === 0
            ? "from-rose-400 via-pink-400 to-rose-500"
            : "from-amber-300 via-yellow-400 to-amber-500",
      });
    }
    return list;
  }, [totalCandles, litCandles, cx, cy, rx, ry]);

  // Extinguish individual candle
  const extinguishCandle = (index: number) => {
    setLitCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListeningMic(false);
  };

  // Check if all candles are blown
  useEffect(() => {
    const unlit = litCandles.every((lit) => !lit);
    if (unlit && !allExtinguished) {
      Promise.resolve().then(() => {
        setAllExtinguished(true);
        confetti({
          particleCount: 110,
          spread: 95,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#fbbf24"],
        });
        stopMic();
      });
    }
  }, [litCandles, allExtinguished]);

  // Optional Microphone Blow Handler
  const startMicBlowing = async () => {
    setMicError(null);
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicError("Microphone detection is not supported on this browser. Tap the candles instead!");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListeningMic(true);

      const checkBlow = () => {
        if (!analyser || !streamRef.current) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        if (average > 48) {
          setLitCandles((prev) => prev.map(() => false));
          stopMic();
          return;
        }

        requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      setMicError("Microphone access was denied or unavailable. Tap the candles to blow them out!");
      setIsListeningMic(false);
    }
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const handleRelight = () => {
    sliceTimerRef.current.forEach(clearTimeout);
    sliceTimerRef.current = [];
    setLitCandles(Array(totalCandles).fill(true));
    setAllExtinguished(false);
    setCuttingPhase("uncut");
  };

  // Coordinated Cake Cutting Animation Sequence (~2.3s total)
  const handleCutCake = () => {
    if (cuttingPhase !== "uncut") return; // Prevent duplicate triggers

    // Respect reduced-motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setCuttingPhase("cut");
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ec4899", "#f43f5e", "#fbbf24"],
      });
      return;
    }

    // Phase 1: Knife glides in diagonally (0s)
    setCuttingPhase("slicing");

    // Phase 2: Knife finishes cut and slice begins separating (1.0s)
    const timer1 = setTimeout(() => {
      setCuttingPhase("separating");
    }, 1000);

    // Phase 3: Slice arrives at saucer, sparkles & confetti burst, completed (2.2s)
    const timer2 = setTimeout(() => {
      setCuttingPhase("cut");
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ec4899", "#f43f5e", "#fbbf24", "#8b5cf6"],
      });
    }, 2200);

    sliceTimerRef.current = [timer1, timer2];
  };

  return (
    <section
      id="bday-sec-cake"
      data-candles-blown={allExtinguished ? "true" : "false"}
      data-cake-cut={isCakeCut ? "true" : "false"}
      data-cutting-phase={cuttingPhase}
      className="relative min-h-[90vh] py-16 px-4 max-w-xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-3 shadow-2xs">
        <Cake size={13} className="text-amber-600" />
        <span>The Centerpiece Moment</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2 tracking-tight">
        {config.headline || "Blow The Candles & Make A Wish 🎂"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
        {config.subtext ||
          "Close your eyes, make the secret wish of your heart, and tap each candle flame to extinguish it!"}
      </p>

      {/* Main Cake Card Container */}
      <div className="relative w-full max-w-[340px] sm:max-w-[420px] p-4 sm:p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-amber-200/80 shadow-2xl shadow-amber-900/10 flex flex-col items-center">
        {/* Interactive Cake Illustration Area */}
        <div className="relative w-full aspect-[380/260] max-w-[380px] mx-auto select-none">
          {/* CANDLES LAYER (Positioned directly over top frosting) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {candlePositions.map((candle, idx) => (
              <div
                key={idx}
                data-testid={`candle-item-${idx}`}
                onClick={() => candle.isLit && extinguishCandle(idx)}
                style={{
                  position: "absolute",
                  left: `${(candle.x / 380) * 100}%`,
                  top: `${(candle.y / 260) * 100}%`,
                  transform: "translate(-50%, -100%)",
                }}
                className="pointer-events-auto cursor-pointer flex flex-col items-center group transition-transform hover:scale-105 active:scale-95"
                title={candle.isLit ? "Tap to blow out candle" : "Extinguished"}
              >
                {/* Flame or smoke puff */}
                {candle.isLit ? (
                  <div
                    data-testid={`candle-flame-${idx}`}
                    className="relative w-3.5 h-5 mb-0.5 flex items-center justify-center animate-pulse [animation-duration:1.4s]"
                  >
                    <div className="w-3 h-4.5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-white shadow-md shadow-amber-400/90 group-hover:scale-125 transition-transform" />
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-[2px] opacity-80" />
                  </div>
                ) : (
                  <div className="h-5 mb-0.5 flex flex-col items-center justify-end">
                    <span className="text-[10px] text-stone-400 animate-fade-out font-mono font-bold leading-none">
                      ~
                    </span>
                    <div className="w-0.5 h-1.5 bg-stone-700 rounded-xs" />
                  </div>
                )}

                {/* Candle Stick */}
                <div
                  className={`w-2 sm:w-2.5 h-7 sm:h-8 rounded-t-xs border border-stone-200/70 shadow-xs bg-gradient-to-b ${candle.color}`}
                />
              </div>
            ))}
          </div>

          {/* LAYERED SVG CAKE WITH INDEPENDENTLY ANIMATED SLICE */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 380 260"
            className="w-full h-full overflow-visible"
            aria-label="Birthday celebration cake with separable slice"
          >
            <defs>
              {/* Platter Stand Gradient */}
              <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#E2E8F0" />
              </linearGradient>

              {/* Top Frosting Gradient */}
              <linearGradient id="topFrostingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF0F3" />
                <stop offset="55%" stopColor="#FCE7F3" />
                <stop offset="100%" stopColor="#FBCFE8" />
              </linearGradient>

              {/* Outer Cylinder Wall Frosting */}
              <linearGradient id="wallFrostingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE2E8" />
                <stop offset="25%" stopColor="#FFF0F3" />
                <stop offset="75%" stopColor="#FDE2E8" />
                <stop offset="100%" stopColor="#FBCFE8" />
              </linearGradient>

              {/* Berry Jam Ribbon */}
              <linearGradient id="jamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#BE185D" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#9D174D" />
              </linearGradient>

              {/* Stainless Steel Knife Blade */}
              <linearGradient id="knifeBlade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#E2E8F0" />
                <stop offset="80%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              {/* Knife Handle */}
              <linearGradient id="knifeHandle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BE123C" />
                <stop offset="50%" stopColor="#881337" />
                <stop offset="100%" stopColor="#4C0519" />
              </linearGradient>

              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.12" floodColor="#881337" />
              </filter>
              <filter id="sliceShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="3" dy="8" stdDeviation="5" floodOpacity="0.18" floodColor="#881337" />
              </filter>
            </defs>

            {/* 1. CAKE STAND / PLATTER */}
            <ellipse cx={cx} cy={cy + H + 36} rx="136" ry="22" fill="#000000" opacity="0.08" />
            <path
              d={`M${cx - 25} ${cy + H + 32} Q${cx} ${cy + H + 44} ${cx + 25} ${cy + H + 32} L${cx + 20} ${cy + H + 44} Q${cx} ${cy + H + 52} ${cx - 20} ${cy + H + 44} Z`}
              fill="#CBD5E1"
            />
            <ellipse
              cx={cx}
              cy={cy + H + 28}
              rx="132"
              ry="24"
              fill="url(#standGrad)"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            <ellipse
              cx={cx}
              cy={cy + H + 26}
              rx="128"
              ry="22"
              fill="#FFFFFF"
              stroke="#FDE68A"
              strokeWidth="1.5"
            />

            {/* Serving Saucer for the slice */}
            <g
              id="saucerGroup"
              className="transition-opacity duration-700"
              style={{ opacity: isCakeCut ? 1 : 0.4 }}
            >
              <ellipse cx="308" cy={cy + H + 24} rx="44" ry="16" fill="#000000" opacity="0.07" />
              <ellipse
                cx="308"
                cy={cy + H + 20}
                rx="42"
                ry="14"
                fill="#FFFFFF"
                stroke="#FDE68A"
                strokeWidth="1.5"
              />
              <ellipse
                cx="308"
                cy={cy + H + 20}
                rx="35"
                ry="11"
                fill="#FFFDF8"
                stroke="#F1F5F9"
                strokeWidth="1"
              />
            </g>

            {/* 2. UNCUT INTACT CAKE (Rendered before cut is initiated) */}
            {!isCakeCut && (
              <g id="intactCake" filter="url(#softShadow)">
                <path
                  d={`
                    M ${cx - rx} ${cy}
                    L ${cx - rx} ${cy + H}
                    A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy + H}
                    L ${cx + rx} ${cy}
                    A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}
                    Z
                  `}
                  fill="url(#wallFrostingGrad)"
                  stroke="#FBCFE8"
                  strokeWidth="1"
                />

                <path
                  d={`
                    M ${cx - rx + 5} ${cy + H}
                    A ${rx - 5} ${ry - 2} 0 0 0 ${cx + rx - 5} ${cy + H}
                  `}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="1 8"
                  opacity="0.9"
                />

                {/* Frosting Drips */}
                <path
                  d={`
                    M ${cx - rx} ${cy}
                    Q ${cx - 70} ${cy + 20} ${cx - 50} ${cy + 5}
                    Q ${cx - 30} ${cy + 25} ${cx - 10} ${cy + 7}
                    Q ${cx + 15} ${cy + 28} ${cx + 40} ${cy + 8}
                    Q ${cx + 65} ${cy + 22} ${cx + 80} ${cy + 5}
                    L ${cx + rx} ${cy}
                  `}
                  fill="none"
                  stroke="#FFF0F3"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.95"
                />

                {/* Name on Frosting */}
                <text
                  x={cx}
                  y={cy + H - 18}
                  textAnchor="middle"
                  fontFamily="serif"
                  fontWeight="bold"
                  fontSize="12"
                  fill="#881337"
                  opacity="0.85"
                  letterSpacing="0.5"
                >
                  {recipientName} • Happy Birthday
                </text>

                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill="url(#topFrostingGrad)"
                  stroke="#FBCFE8"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={rx - 4}
                  ry={ry - 3}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="2 10"
                  opacity="0.95"
                />

                {/* Strawberries on Top */}
                <g transform={`translate(${cx - 55}, ${cy - 7})`}>
                  <ellipse cx="0" cy="0" rx="9" ry="11" fill="#E11D48" />
                  <polygon points="-7,-7 0,-12 7,-7 0,-4" fill="#16A34A" />
                  <circle cx="-3" cy="-2" r="0.8" fill="#FDE047" />
                  <circle cx="3" cy="2" r="0.8" fill="#FDE047" />
                </g>
                <g transform={`translate(${cx - 5}, ${cy - 21})`}>
                  <ellipse cx="0" cy="0" rx="8" ry="10" fill="#E11D48" />
                  <polygon points="-6,-6 0,-10 6,-6 0,-3" fill="#16A34A" />
                  <circle cx="-2" cy="-1" r="0.7" fill="#FDE047" />
                </g>
                <g transform={`translate(${cx + 46}, ${cy + 1})`}>
                  <ellipse cx="0" cy="0" rx="9" ry="11" fill="#E11D48" />
                  <polygon points="-7,-7 0,-12 7,-7 0,-4" fill="#16A34A" />
                  <circle cx="-3" cy="-2" r="0.8" fill="#FDE047" />
                  <circle cx="2" cy="1" r="0.8" fill="#FDE047" />
                </g>
                <circle cx={cx - 30} cy={cy + 13} r="5" fill="#FFFFFF" opacity="0.95" />
                <circle cx={cx - 30} cy={cy + 13} r="3" fill="#FFF0F3" />
                <circle cx={cx + 20} cy={cy + 13} r="5" fill="#FFFFFF" opacity="0.95" />
                <circle cx={cx + 20} cy={cy + 13} r="3" fill="#FFF0F3" />
              </g>
            )}

            {/* 3. CUT CAKE MAIN BODY (Revealed when cut starts, showing internal sponge layers) */}
            {isCakeCut && (
              <g id="cutCakeBody" filter="url(#softShadow)">
                {/* Left outer cylinder wall */}
                <path
                  d={`
                    M ${cx - rx} ${cy}
                    L ${cx - rx} ${cy + H}
                    A ${rx} ${ry} 0 0 0 ${p2.x} ${p2.y + H}
                    L ${p2.x} ${p2.y}
                    A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}
                    Z
                  `}
                  fill="url(#wallFrostingGrad)"
                  stroke="#FBCFE8"
                  strokeWidth="1"
                />

                {/* Far right outer wall */}
                <path
                  d={`
                    M ${p1.x} ${p1.y}
                    L ${p1.x} ${p1.y + H}
                    A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy + H}
                    L ${cx + rx} ${cy}
                    A ${rx} ${ry} 0 0 1 ${p1.x} ${p1.y}
                    Z
                  `}
                  fill="url(#wallFrostingGrad)"
                  stroke="#FBCFE8"
                  strokeWidth="0.8"
                />

                {/* INTERNAL CUT SURFACE LEFT (Center to p2) showing multi-layer sponge & jam */}
                <g>
                  <polygon
                    points={`${cx},${cy} ${p2.x},${p2.y} ${p2.x},${p2.y + H} ${cx},${cy + H}`}
                    fill="#FDE68A"
                    stroke="#FCD34D"
                    strokeWidth="0.5"
                  />
                  {/* Layer 1: Top Sponge */}
                  <polygon
                    points={`${cx},${cy} ${p2.x},${p2.y} ${p2.x},${p2.y + 14} ${cx},${cy + 14}`}
                    fill="#FEF08A"
                  />
                  {/* Layer 2: Strawberry Filling Ribbon */}
                  <polygon
                    points={`${cx},${cy + 14} ${p2.x},${p2.y + 14} ${p2.x},${p2.y + 20} ${cx},${cy + 20}`}
                    fill="url(#jamGrad)"
                  />
                  {/* Layer 3: Middle Sponge */}
                  <polygon
                    points={`${cx},${cy + 20} ${p2.x},${p2.y + 20} ${p2.x},${p2.y + 38} ${cx},${cy + 38}`}
                    fill="#FDE68A"
                  />
                  {/* Layer 4: Cream & Berry Ribbon */}
                  <polygon
                    points={`${cx},${cy + 38} ${p2.x},${p2.y + 38} ${p2.x},${p2.y + 46} ${cx},${cy + 46}`}
                    fill="url(#jamGrad)"
                  />
                  {/* Layer 5: Bottom Sponge */}
                  <polygon
                    points={`${cx},${cy + 46} ${p2.x},${p2.y + 46} ${p2.x},${p2.y + H} ${cx},${cy + H}`}
                    fill="#FCD34D"
                  />
                  <polygon
                    points={`${cx},${cy} ${p2.x},${p2.y} ${p2.x},${p2.y + H} ${cx},${cy + H}`}
                    fill="black"
                    opacity="0.08"
                  />
                </g>

                {/* INTERNAL CUT SURFACE RIGHT (Center to p1) */}
                <g>
                  <polygon
                    points={`${cx},${cy} ${p1.x},${p1.y} ${p1.x},${p1.y + H} ${cx},${cy + H}`}
                    fill="#FDE68A"
                    stroke="#FCD34D"
                    strokeWidth="0.5"
                  />
                  <polygon
                    points={`${cx},${cy} ${p1.x},${p1.y} ${p1.x},${p1.y + 14} ${cx},${cy + 14}`}
                    fill="#FEF08A"
                  />
                  <polygon
                    points={`${cx},${cy + 14} ${p1.x},${p1.y + 14} ${p1.x},${p1.y + 20} ${cx},${cy + 20}`}
                    fill="url(#jamGrad)"
                  />
                  <polygon
                    points={`${cx},${cy + 20} ${p1.x},${p1.y + 20} ${p1.x},${p1.y + 38} ${cx},${cy + 38}`}
                    fill="#FDE68A"
                  />
                  <polygon
                    points={`${cx},${cy + 38} ${p1.x},${p1.y + 38} ${p1.x},${p1.y + 46} ${cx},${cy + 46}`}
                    fill="url(#jamGrad)"
                  />
                  <polygon
                    points={`${cx},${cy + 46} ${p1.x},${p1.y + 46} ${p1.x},${p1.y + H} ${cx},${cy + H}`}
                    fill="#FCD34D"
                  />
                  <polygon
                    points={`${cx},${cy} ${p1.x},${p1.y} ${p1.x},${p1.y + H} ${cx},${cy + H}`}
                    fill="white"
                    opacity="0.08"
                  />
                </g>

                {/* Main Top Frosting Surface (Large arc with cutout) */}
                <path
                  d={`
                    M ${cx} ${cy}
                    L ${p2.x} ${p2.y}
                    A ${rx} ${ry} 0 1 1 ${p1.x} ${p1.y}
                    Z
                  `}
                  fill="url(#topFrostingGrad)"
                  stroke="#FBCFE8"
                  strokeWidth="1.5"
                />

                <path
                  d={`
                    M ${bp2.x} ${bp2.y}
                    A ${rx - 4} ${ry - 3} 0 1 1 ${bp1.x} ${bp1.y}
                  `}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="2 10"
                  opacity="0.95"
                />

                <g transform={`translate(${cx - 55}, ${cy - 7})`}>
                  <ellipse cx="0" cy="0" rx="9" ry="11" fill="#E11D48" />
                  <polygon points="-7,-7 0,-12 7,-7 0,-4" fill="#16A34A" />
                  <circle cx="-3" cy="-2" r="0.8" fill="#FDE047" />
                  <circle cx="3" cy="2" r="0.8" fill="#FDE047" />
                </g>
                <g transform={`translate(${cx - 5}, ${cy - 21})`}>
                  <ellipse cx="0" cy="0" rx="8" ry="10" fill="#E11D48" />
                  <polygon points="-6,-6 0,-10 6,-6 0,-3" fill="#16A34A" />
                  <circle cx="-2" cy="-1" r="0.7" fill="#FDE047" />
                </g>
                <circle cx={cx - 30} cy={cy + 13} r="5" fill="#FFFFFF" opacity="0.95" />
                <circle cx={cx - 30} cy={cy + 13} r="3" fill="#FFF0F3" />
              </g>
            )}

            {/* 4. THE SEPARATED SLICE (Animates outward to saucer) */}
            {isCakeCut && (
              <g
                id="sliceGroup"
                data-testid="cake-separated-slice"
                filter="url(#sliceShadow)"
                className="transition-transform duration-1000 ease-out"
                style={{
                  transform:
                    cuttingPhase === "separating" || cuttingPhase === "cut"
                      ? "translate(48px, -8px) rotate(5deg)"
                      : "translate(0px, 0px)",
                }}
              >
                {/* Slice Left Cut Face */}
                <g>
                  <polygon
                    points={`${cx},${cy} ${p2.x},${p2.y} ${p2.x},${p2.y + H} ${cx},${cy + H}`}
                    fill="#FDE68A"
                    stroke="#FCD34D"
                    strokeWidth="0.5"
                  />
                  <polygon
                    points={`${cx},${cy} ${p2.x},${p2.y} ${p2.x},${p2.y + 14} ${cx},${cy + 14}`}
                    fill="#FEF08A"
                  />
                  <polygon
                    points={`${cx},${cy + 14} ${p2.x},${p2.y + 14} ${p2.x},${p2.y + 20} ${cx},${cy + 20}`}
                    fill="url(#jamGrad)"
                  />
                  <polygon
                    points={`${cx},${cy + 20} ${p2.x},${p2.y + 20} ${p2.x},${p2.y + 38} ${cx},${cy + 38}`}
                    fill="#FDE68A"
                  />
                  <polygon
                    points={`${cx},${cy + 38} ${p2.x},${p2.y + 38} ${p2.x},${p2.y + 46} ${cx},${cy + 46}`}
                    fill="url(#jamGrad)"
                  />
                  <polygon
                    points={`${cx},${cy + 46} ${p2.x},${p2.y + 46} ${p2.x},${p2.y + H} ${cx},${cy + H}`}
                    fill="#FCD34D"
                  />
                </g>

                {/* Slice Outer Curved Frosting Wall */}
                <path
                  d={`
                    M ${p2.x} ${p2.y}
                    L ${p2.x} ${p2.y + H}
                    A ${rx} ${ry} 0 0 0 ${p1.x} ${p1.y + H}
                    L ${p1.x} ${p1.y}
                    A ${rx} ${ry} 0 0 1 ${p2.x} ${p2.y}
                    Z
                  `}
                  fill="url(#wallFrostingGrad)"
                  stroke="#FBCFE8"
                  strokeWidth="1"
                />

                {/* Slice Top Triangular Frosting */}
                <path
                  d={`
                    M ${cx} ${cy}
                    L ${p2.x} ${p2.y}
                    A ${rx} ${ry} 0 0 0 ${p1.x} ${p1.y}
                    Z
                  `}
                  fill="url(#topFrostingGrad)"
                  stroke="#FBCFE8"
                  strokeWidth="1.5"
                />

                {/* Strawberry atop the Slice */}
                <g
                  transform={`translate(${(p1.x + p2.x + cx) / 3}, ${(p1.y + p2.y + cy) / 3 - 2})`}
                >
                  <ellipse cx="0" cy="0" rx="9" ry="11" fill="#E11D48" />
                  <polygon points="-7,-7 0,-12 7,-7 0,-4" fill="#16A34A" />
                  <circle cx="-3" cy="-2" r="0.8" fill="#FDE047" />
                  <circle cx="2" cy="1" r="0.8" fill="#FDE047" />
                </g>
                <circle cx={cx + 20} cy={cy + 13} r="4.5" fill="#FFFFFF" opacity="0.95" />
                <circle cx={cx + 20} cy={cy + 13} r="2.5" fill="#FFF0F3" />

                {/* Golden Crumbs falling to saucer */}
                {cuttingPhase === "cut" && (
                  <g id="crumbsGroup" className="animate-in fade-in duration-500">
                    <circle cx={p2.x + 25} cy={cy + H + 20} r="1.5" fill="#F59E0B" opacity="0.9" />
                    <circle cx={p2.x + 33} cy={cy + H + 24} r="1.8" fill="#D97706" opacity="0.85" />
                    <circle cx={p2.x + 41} cy={cy + H + 21} r="1.2" fill="#FBBF24" opacity="0.9" />
                    <circle cx={p2.x + 50} cy={cy + H + 25} r="1.6" fill="#F59E0B" opacity="0.8" />
                  </g>
                )}
              </g>
            )}

            {/* 5. CUTTING LINES (Active during slicing) */}
            {cuttingPhase === "slicing" && (
              <g id="cutLinesGroup" data-testid="cake-cut-lines">
                <line
                  x1={cx}
                  y1={cy}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <line
                  x1={cx}
                  y1={cy}
                  x2={p1.x}
                  y2={p1.y}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <line
                  x1={cx}
                  y1={cy}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1={cx}
                  y1={cy}
                  x2={p1.x}
                  y2={p1.y}
                  stroke="#F59E0B"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 6. PASTRY KNIFE (Animated across cake) */}
            <g
              id="knifeGroup"
              data-testid="cake-cutting-knife"
              className="transition-all duration-700 ease-in-out pointer-events-none"
              style={{
                opacity: cuttingPhase === "slicing" ? 1 : 0,
                transform:
                  cuttingPhase === "slicing"
                    ? `translate(${cx + 35}px, ${cy - 28}px) rotate(-30deg)`
                    : `translate(${cx + 80}px, ${cy - 60}px) rotate(-45deg)`,
              }}
            >
              <path d="M 0 0 L 90 0 L 80 18 L 0 9 Z" fill="url(#knifeBlade)" stroke="#94A3B8" strokeWidth="0.8" />
              <line x1="2" y1="1" x2="85" y2="1" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
              <rect x="-6" y="-2" width="6" height="13" rx="1.5" fill="#D97706" stroke="#B45309" strokeWidth="0.6" />
              <path d="M -6 0 L -48 -2 C -52 -2 -54 11 -48 11 L -6 9 Z" fill="url(#knifeHandle)" stroke="#4C0519" strokeWidth="0.8" />
              <circle cx="-16" cy="4" r="1.5" fill="#FCD34D" />
              <circle cx="-34" cy="4" r="1.5" fill="#FCD34D" />
            </g>

            {/* 7. CELEBRATORY SPARKLES (shown after cut) */}
            {cuttingPhase === "cut" && (
              <g id="sparklesGroup" className="animate-in zoom-in-75 duration-500">
                <path d="M 270 120 Q 274 120 274 116 Q 274 120 278 120 Q 274 120 274 124 Q 274 120 270 120 Z" fill="#F59E0B" />
                <path d="M 315 140 Q 318 140 318 137 Q 318 140 321 140 Q 318 140 318 143 Q 318 140 315 140 Z" fill="#EC4899" />
                <path d="M 285 178 Q 288 178 288 175 Q 288 178 291 178 Q 288 178 288 181 Q 288 178 285 178 Z" fill="#EAB308" />
              </g>
            )}
          </svg>
        </div>

        {/* Completion Message after cake cut */}
        {cuttingPhase === "cut" && (
          <div
            data-testid="cake-completion-msg"
            className="mt-4 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200/80 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <p className="font-serif italic font-semibold text-sm sm:text-base text-rose-900">
              A slice of happiness, just for you! 🎂
            </p>
          </div>
        )}

        {/* Instructions & Interactive Controls */}
        <div className="mt-6 flex flex-col items-center gap-2 w-full">
          {!allExtinguished ? (
            <div className="space-y-2">
              <p className="text-xs font-serif text-amber-900 font-semibold">
                Tap each candle to blow it out!
              </p>
              {config.allowMicBlowing !== false && (
                <button
                  type="button"
                  onClick={isListeningMic ? stopMic : startMicBlowing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-sans font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors shadow-2xs"
                >
                  {isListeningMic ? (
                    <>
                      <MicOff size={12} className="text-rose-500 animate-pulse" />
                      <span>Listening... Blow into microphone!</span>
                    </>
                  ) : (
                    <>
                      <Mic size={12} className="text-amber-600" />
                      <span>Or Blow Using Microphone</span>
                    </>
                  )}
                </button>
              )}
              {micError && (
                <p className="text-[10px] text-stone-500 max-w-xs">{micError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3 animate-in zoom-in-95 w-full">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-green-100 text-green-900 border border-green-200 shadow-2xs">
                <PartyPopper size={13} className="text-green-600" />
                <span>All Candles Extinguished! May Your Wish Come True! 🌟</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  type="button"
                  data-testid="make-wish-btn"
                  onClick={() => setIsMakeWishOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-serif font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md transition-all"
                >
                  {wishSaved ? "Wish Sealed ✨" : "Make A Secret Wish 💌"}
                </button>

                {cuttingPhase === "uncut" && (
                  <button
                    type="button"
                    data-testid="cut-cake-btn"
                    onClick={handleCutCake}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-serif font-semibold bg-rose-500 hover:bg-rose-600 active:scale-95 text-white shadow-md transition-all"
                  >
                    <Utensils size={12} />
                    <span>Cut The Cake 🍰</span>
                  </button>
                )}

                {cuttingPhase === "slicing" && (
                  <button
                    type="button"
                    onClick={handleCutCake}
                    data-testid="cut-cake-btn"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-semibold bg-rose-300 text-white cursor-wait shadow-xs"
                  >
                    <Utensils size={12} className="animate-spin" />
                    <span>Slicing Cake... 🔪</span>
                  </button>
                )}

                {(cuttingPhase === "separating" || cuttingPhase === "cut") && (
                  <button
                    type="button"
                    onClick={handleCutCake}
                    data-testid="cut-cake-btn"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-serif font-semibold bg-pink-100 text-pink-900 border border-pink-200 shadow-2xs cursor-default"
                  >
                    <Check size={12} className="text-pink-600" />
                    <span>Cake Cut! ✨</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Relight button if all extinguished */}
      {allExtinguished && (
        <button
          type="button"
          data-testid="relight-candles-btn"
          onClick={handleRelight}
          className="mt-6 text-xs text-stone-400 hover:text-stone-700 underline font-serif transition-colors"
        >
          Relight candles to blow again 🕯️
        </button>
      )}

      {/* Make a Wish Modal */}
      {isMakeWishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-amber-200 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
              Your Secret Birthday Wish
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Type your wish to lock it into the stars (kept strictly between you and the universe):
            </p>
            <textarea
              value={userWish}
              onChange={(e) => setUserWish(e.target.value)}
              placeholder="I wish for..."
              rows={3}
              className="w-full p-3 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsMakeWishOpen(false)}
                className="flex-1 py-2 rounded-full text-xs font-serif font-medium bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setWishSaved(true);
                  setIsMakeWishOpen(false);
                  confetti({ particleCount: 60, spread: 70 });
                }}
                className="flex-1 py-2 rounded-full text-xs font-serif font-bold bg-amber-500 hover:bg-amber-600 text-white"
              >
                Lock Into Stars ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
