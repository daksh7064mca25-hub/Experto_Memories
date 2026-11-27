"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Gift,
  Check,
  Heart,
  Coffee,
  Cake,
  Plane,
  Star,
  Music,
  Compass,
  Smile,
  Ticket,
  Trophy,
} from "lucide-react";
import {
  BirthdayGameConfig,
  BirthdaySurpriseItem,
  BirthdayScratchReward,
  BirthdaySurpriseIcon,
  ThemeId,
} from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayGameConfig;
  recipientName?: string;
  senderName?: string;
  theme?: ThemeId;
  projectSlug?: string;
  previewMode?: boolean;
}

interface StoredScratchState {
  isScratched: boolean;
  rewardId?: string;
  timestamp?: number;
}

// Icon dictionary
const ICON_MAP: Record<BirthdaySurpriseIcon | string, React.ComponentType<{ size?: number; className?: string }>> = {
  gift: Gift,
  heart: Heart,
  sparkles: Sparkles,
  coffee: Coffee,
  trophy: Trophy,
  cake: Cake,
  plane: Plane,
  star: Star,
  music: Music,
  compass: Compass,
  smile: Smile,
  ticket: Ticket,
};

// Storage prefix specifically versioned to prevent pollution from legacy multi-round state
const STORAGE_PREFIX = "em_bday_scratch_v2_";

export function BirthdayGameSection({
  config,
  recipientName = "Birthday Star",
  senderName = "Someone Special",
  theme,
  projectSlug = "default",
  previewMode = false,
}: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Clean slug for storage
  const cleanSlug = useMemo(() => {
    return (projectSlug || recipientName || "gift")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
  }, [projectSlug, recipientName]);

  const storageKey = useMemo(() => {
    return `${STORAGE_PREFIX}${cleanSlug}`;
  }, [cleanSlug]);

  const isDemo = cleanSlug.startsWith("demo-");

  // Resolve the single reward to reveal
  const resolvedReward: BirthdayScratchReward = useMemo(() => {
    // 1. Creator in-editor live preview override
    if (config.previewRewardId) {
      if (Array.isArray(config.randomRewards)) {
        const found = config.randomRewards.find((r) => r.id === config.previewRewardId);
        if (found) return found;
      }
      if (Array.isArray(config.surprises)) {
        const found = config.surprises.find((s) => s.id === config.previewRewardId);
        if (found) {
          return {
            id: found.id,
            title: found.title,
            description: found.description || "",
            redemptionInstructions:
              found.redemptionInstructions || "Show this card to the sender anytime to claim!",
            icon: found.icon || "gift",
            badge: found.badge || "Special Treat",
            category: found.category || "experience",
            enabled: true,
          };
        }
      }
    }

    // 2. Pre-selected / server-persisted random reward
    if (config.revealedReward && config.revealedReward.title) {
      return config.revealedReward;
    }

    // 3. Mode A: Custom Reward
    if (config.mode === "custom" && config.customReward && config.customReward.title) {
      return config.customReward;
    }

    // 4. Mode B: Random Reward candidate resolution
    if (config.mode === "random" && Array.isArray(config.randomRewards) && config.randomRewards.length > 0) {
      const active = config.randomRewards.filter((r) => r.enabled !== false);
      if (active.length > 0) {
        if (config.selectedRewardId) {
          const match = active.find((r) => r.id === config.selectedRewardId);
          if (match) return match;
        }
        return active[0];
      }
    }

    // 5. Backward-compatible fallback from legacy surprises array
    if (Array.isArray(config.surprises) && config.surprises.length > 0) {
      const first = config.surprises.find((s) => s.enabled !== false) || config.surprises[0];
      return {
        id: first.id || "legacy-surprise-1",
        title: first.title || config.scratchMessage || "Happy Birthday! 🎂✨",
        description: first.description || config.secretGiftText || "A special celebration treat just for you!",
        redemptionInstructions:
          first.redemptionInstructions || "Show this card to the sender anytime to claim your surprise!",
        icon: first.icon || "gift",
        badge: first.badge || "Birthday Surprise",
        category: first.category || "experience",
        enabled: true,
      };
    }

    // 6. Absolute default fallback
    return {
      id: "default-reward",
      title: config.scratchMessage || "A Special Birthday Celebration Dinner! 🍽️✨",
      description:
        config.secretGiftText ||
        "An unforgettable evening filled with wonderful food, laughter, and loving celebration.",
      redemptionInstructions: "Show this screen to the sender anytime to claim your surprise!",
      icon: "gift",
      badge: "Birthday Treat",
      category: "experience",
      enabled: true,
    };
  }, [
    config.previewRewardId,
    config.revealedReward,
    config.mode,
    config.customReward,
    config.randomRewards,
    config.selectedRewardId,
    config.surprises,
    config.scratchMessage,
    config.secretGiftText,
  ]);

  // Is creator currently previewing a specific outcome card in the editor?
  const isEditorOutcomePreview = Boolean(previewMode && config.previewRewardId);

  const [isScratched, setIsScratched] = useState(isEditorOutcomePreview);
  const [scratchPercent, setScratchPercent] = useState(isEditorOutcomePreview ? 100 : 0);
  const [hasScratchedPixels, setHasScratchedPixels] = useState(false);
  const isDrawingRef = useRef(false);
  const checkPendingRef = useRef(false);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  // 1. Persistence check on mount
  useEffect(() => {
    // If creator is previewing a candidate in editor, it is already initialized to scratched
    if (isEditorOutcomePreview) {
      return;
    }

    // Check URL for explicit reset (?reset=1)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("reset") === "1") {
        try {
          localStorage.removeItem(storageKey);
          sessionStorage.removeItem(storageKey);
        } catch {}
        queueMicrotask(() => {
          setIsScratched(false);
          setScratchPercent(0);
        });
        return;
      }
    }

    // Check persistent storage
    try {
      const raw = isDemo ? sessionStorage.getItem(storageKey) : localStorage.getItem(storageKey);
      if (raw) {
        const parsed: StoredScratchState = JSON.parse(raw);
        if (parsed && parsed.isScratched) {
          queueMicrotask(() => {
            setIsScratched(true);
            setScratchPercent(100);
          });
          return;
        }
      }
    } catch {}

    // Default: Must start unscratched
    queueMicrotask(() => {
      setIsScratched(false);
      setScratchPercent(0);
    });
  }, [storageKey, isEditorOutcomePreview, isDemo]);

  // 2. High-DPI Golden Foil Drawing
  const drawFoil = useCallback((canvas: HTMLCanvasElement, width: number, height: number) => {
    if (width <= 0 || height <= 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // Set internal buffer dimensions scaled by DPR for razor-sharp rendering on Retina/mobile
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Set CSS display dimensions
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale drawing context to match CSS pixels
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "source-over";

    // Luxury Metallic Gold Shimmer Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#b45309");    // Deep amber/bronze
    grad.addColorStop(0.18, "#f59e0b"); // Vibrant gold
    grad.addColorStop(0.38, "#fef08a"); // Shimmer highlight
    grad.addColorStop(0.52, "#d97706"); // Rich warm gold
    grad.addColorStop(0.72, "#fef08a"); // Shimmer highlight
    grad.addColorStop(0.88, "#f59e0b"); // Golden tone
    grad.addColorStop(1, "#92400e");    // Deep bronze border

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative inner metallic border
    ctx.strokeStyle = "rgba(120, 53, 15, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // Corner Star Sparkles
    ctx.fillStyle = "rgba(120, 53, 15, 0.6)";
    ctx.font = "16px serif";
    ctx.fillText("✦", 24, 32);
    ctx.fillText("✦", width - 32, 32);
    ctx.fillText("✦", 24, height - 22);
    ctx.fillText("✦", width - 32, height - 22);

    // Center Gift / Sparkle Accent Icon
    ctx.font = "34px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎁", width / 2, height / 2 - 34);

    // Headline Text on Foil
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 17px 'Playfair Display', Georgia, serif";
    ctx.fillText("✨ SCRATCH TO REVEAL ✨", width / 2, height / 2 + 10);

    // Instructional Text on Foil
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#92400e";
    ctx.fillText("Rub or drag with finger or mouse to uncover", width / 2, height / 2 + 34);
  }, []);

  // 3. Canvas Resizing and Mounting Observer
  useEffect(() => {
    if (isScratched) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const setupCanvas = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);

      if (width > 0 && height > 0) {
        if (
          canvasSizeRef.current.width !== width ||
          canvasSizeRef.current.height !== height
        ) {
          canvasSizeRef.current = { width, height };
          drawFoil(canvas, width, height);
        }
      }
    };

    // Initial setup
    setupCanvas();

    // Listen for resize events
    const observer = new ResizeObserver(() => {
      if (!isScratched) {
        setupCanvas();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [drawFoil, isScratched]);

  // 4. Complete Reveal Action
  const revealFull = useCallback(() => {
    if (isScratched) return;
    setIsScratched(true);
    setScratchPercent(100);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Persist permanently
    try {
      const state: StoredScratchState = {
        isScratched: true,
        rewardId: resolvedReward.id,
        timestamp: Date.now(),
      };
      const serialized = JSON.stringify(state);
      if (isDemo) {
        sessionStorage.setItem(storageKey, serialized);
      } else {
        localStorage.setItem(storageKey, serialized);
      }
    } catch {}

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.65 },
      colors: ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#d97706"],
    });
  }, [isScratched, resolvedReward.id, storageKey, isDemo]);

  // 5. Scratched Percentage Calculation
  const checkScratchedRatio = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparentCount = 0;
      const step = 16 * 4; // Sample every 16th pixel for high performance
      const totalSampled = Math.floor(data.length / step);

      if (totalSampled === 0) return;

      for (let i = 3; i < data.length; i += step) {
        if (data[i] < 128) {
          transparentCount++;
        }
      }

      const ratio = (transparentCount / totalSampled) * 100;
      const currentPercent = Math.min(100, Math.round(ratio));
      setScratchPercent(currentPercent);

      const threshold = config.scratchPercentageToReveal || 35;
      if (currentPercent >= threshold) {
        revealFull();
      }
    } catch {}
  }, [isScratched, config.scratchPercentageToReveal, revealFull]);

  // 6. Scratch Action using Pointer Events
  const scratch = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // Exact coordinates in DPR-scaled buffer
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    // Erase foil pixels at pointer location
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    // Scratch radius: 34px scaled by DPR for comfortable touch on mobile and mouse on desktop
    ctx.arc(x, y, 34 * dpr, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();

    if (!hasScratchedPixels) {
      setHasScratchedPixels(true);
    }

    // Throttle ratio check using requestAnimationFrame
    if (!checkPendingRef.current) {
      checkPendingRef.current = true;
      animationFrameRef.current = requestAnimationFrame(() => {
        checkScratchedRatio();
        checkPendingRef.current = false;
      });
    }
  }, [isScratched, hasScratchedPixels, checkScratchedRatio]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Pointer event handlers with pointer capture
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDrawingRef.current = true;
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const IconComponent = ICON_MAP[resolvedReward.icon || "gift"] || Gift;

  return (
    <section
      id="bday-sec-game"
      className="relative min-h-[75vh] py-16 px-4 max-w-xl mx-auto flex flex-col items-center justify-center text-center select-none font-sans"
    >
      {/* Top Eyebrow Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-3 shadow-xs">
        <Sparkles size={13} className="text-amber-600" />
        <span>YOUR BIRTHDAY SURPRISE 🎁</span>
      </div>

      {/* Main Section Heading */}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 mb-2 leading-tight">
        {config.headline || "Your Birthday Surprise! 🎁"}
      </h2>

      {/* Subtext Instructions */}
      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6">
        {config.subtext ||
          "Rub or drag your finger across the golden foil to reveal your gift!"}
      </p>

      {/* Single Scratch Card Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-md min-h-[380px] sm:min-h-[420px] rounded-3xl bg-gradient-to-tr from-amber-50/90 via-white to-pink-50/90 border-2 border-amber-300 shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden transition-all duration-300"
      >
        {/* Layer 1: Revealed Surprise Content (Underneath the foil) */}
        <div
          className={`w-full flex flex-col items-center justify-center text-center py-2 space-y-3.5 transition-opacity duration-300 ${
            isScratched ? "opacity-100" : "opacity-90 select-none pointer-events-none"
          }`}
          aria-hidden={!isScratched}
        >
          {/* Category Icon */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-100/90 border border-amber-200 shadow-inner flex items-center justify-center text-amber-700 transition-transform hover:scale-105">
            <IconComponent size={34} className={isScratched ? "animate-bounce" : ""} />
          </div>

          {/* Optional Category Badge */}
          {resolvedReward.badge && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 border border-amber-200 px-3 py-0.5 rounded-full">
              <Sparkles size={11} className="text-amber-600" />
              <span>{resolvedReward.badge}</span>
            </span>
          )}

          {/* Prominent Reward Title */}
          <h3 className="font-serif font-extrabold text-xl sm:text-2xl md:text-3xl text-amber-950 whitespace-pre-line leading-snug max-w-sm">
            {resolvedReward.title}
          </h3>

          {/* Readable Reward Description */}
          {resolvedReward.description && (
            <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed max-w-xs sm:max-w-sm mx-auto bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-amber-200/60 shadow-2xs">
              {resolvedReward.description}
            </p>
          )}

          {/* Dedicated How-to-Claim / Redemption Instructions Box */}
          <div className="w-full bg-gradient-to-r from-amber-100/90 via-yellow-100/80 to-amber-100/90 border border-amber-300/90 rounded-2xl p-3.5 text-left shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-serif font-bold text-amber-950 uppercase tracking-wide">
              <Gift size={13} className="text-amber-600" />
              <span>How to Redeem / Claim:</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              {resolvedReward.redemptionInstructions ||
                "Show this screen to the sender anytime to claim your surprise!"}
            </p>
          </div>

          {/* Confirmation that the surprise is theirs */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-4 py-1.5 rounded-full shadow-xs mt-1">
            <Check size={14} className="text-emerald-700 stroke-[3]" />
            <span>This surprise is yours ❤️</span>
          </div>
        </div>

        {/* Layer 2: Scratchable Golden Foil Canvas Layer (Positioned directly over card) */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none z-20 rounded-3xl"
            style={{ touchAction: "none" }}
          />
        )}
      </div>

      {/* Instant Reveal Control (only shown prior to scratching, for accessibility) */}
      {!isScratched && (
        <div className="mt-6 flex items-center gap-3">
          <span className="text-[11px] font-mono text-stone-500">
            Scratched: {scratchPercent}%
          </span>
          <button
            type="button"
            onClick={revealFull}
            className="px-4 py-1.5 rounded-full text-xs font-serif font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 transition-colors shadow-xs cursor-pointer"
          >
            Reveal Instantly ✨
          </button>
        </div>
      )}
    </section>
  );
}
