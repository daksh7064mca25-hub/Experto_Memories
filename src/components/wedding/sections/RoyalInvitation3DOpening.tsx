"use client";

import React, { useState, useRef, useEffect } from "react";
import { WeddingOpeningConfig } from "@/types/website";
import { Sparkles, Volume2, VolumeX, MailOpen, Crown } from "lucide-react";
import gsap from "gsap";

interface Props {
  config: WeddingOpeningConfig;
  groomName: string;
  brideName: string;
  coupleNames: string;
  weddingDateText: string;
  onOpenInvitation: () => void;
  isOpen: boolean;
}

/**
 * Authentic Royal Shehnai & Temple Bell Audio cue using Web Audio API.
 * Synthesizes a warm auspicious golden chime upon opening.
 * Triggered only by user click/tap.
 */
function playRoyalOpeningChime(volume = 0.45) {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const tones = [
      { freq: 523.25, time: 0, decay: 2.2, gain: 0.35 },    // C5
      { freq: 659.25, time: 0.12, decay: 2.4, gain: 0.32 }, // E5
      { freq: 783.99, time: 0.24, decay: 2.8, gain: 0.38 }, // G5
      { freq: 1046.50, time: 0.36, decay: 3.2, gain: 0.42 },// C6
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    tones.forEach(({ freq, time, decay, gain }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      pGain.gain.setValueAtTime(0.0001, ctx.currentTime + time);
      pGain.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + time + 0.015);
      pGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + time + decay);

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + decay);
    });
  } catch {
    // Fail gracefully
  }
}

export const RoyalInvitation3DOpening: React.FC<Props> = ({
  config,
  groomName,
  brideName,
  coupleNames,
  weddingDateText,
  onOpenInvitation,
  isOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  const innerCardRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const screenFlashRef = useRef<HTMLDivElement | null>(null);

  const initials = config.monogram || `${groomName.charAt(0)} & ${brideName.charAt(0)}`;

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    if (soundEnabled) {
      playRoyalOpeningChime(0.48);
    }

    // Check user reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (screenFlashRef.current) {
        gsap.to(screenFlashRef.current, {
          opacity: 1,
          duration: 0.5,
          onComplete: onOpenInvitation,
        });
      } else {
        onOpenInvitation();
      }
      return;
    }

    // GSAP 3D Unfolding Choreography
    const tl = gsap.timeline({
      onComplete: () => {
        onOpenInvitation();
      },
    });

    // 1. Monogram Wax Seal Dissolves with a soft golden scale
    if (sealRef.current) {
      tl.to(sealRef.current, {
        scale: 1.25,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      }, 0);
    }

    // 2. Physical 3D Double Flaps Swing Outward 115 degrees around vertical outer hinges
    if (leftDoorRef.current) {
      tl.to(leftDoorRef.current, {
        rotateY: -115,
        duration: 1.6,
        ease: "power2.inOut",
      }, 0.2);
    }

    if (rightDoorRef.current) {
      tl.to(rightDoorRef.current, {
        rotateY: 115,
        duration: 1.6,
        ease: "power2.inOut",
      }, 0.2);
    }

    // 3. Inner card elevates gently forward into viewport
    if (innerCardRef.current) {
      tl.to(innerCardRef.current, {
        scale: 1.04,
        duration: 1.6,
        ease: "power2.out",
      }, 0.3);
    }

    // 4. Whole invitation glides outward towards user as background dissolves in
    if (cardContainerRef.current) {
      tl.to(cardContainerRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      }, 1.2);
    }

    // 5. Warm golden light envelops screen for smooth reveal into palace hero
    if (screenFlashRef.current) {
      tl.to(screenFlashRef.current, {
        opacity: 1,
        duration: 0.7,
        ease: "power2.inOut",
      }, 1.3);
    }
  };

  const handleQuickSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenInvitation();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSoundEnabled((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#1F070E] select-none transition-opacity duration-1000 ${
        isOpen ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Royal Palace Atmosphere Backdrop behind the Card */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4A0E17] via-[#2B0B14] to-[#120307]">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/royal/palace_hero.jpg')] bg-cover bg-center filter blur-xs" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Screen Flash Dissolve Overlay */}
      <div
        ref={screenFlashRef}
        className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFEB] opacity-0 pointer-events-none z-50 transition-opacity"
      />

      {/* Top Header: Sound Toggle & Quick Skip */}
      <div className="absolute top-4 inset-x-0 px-4 sm:px-8 flex justify-between items-center z-40 pointer-events-auto">
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-xs font-serif text-[#FDE68A] hover:text-white transition cursor-pointer shadow-lg"
          title={soundEnabled ? "Mute Royal Chime" : "Enable Royal Chime"}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={14} className="text-[#F59E0B]" />
              <span className="text-[11px]">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX size={14} className="text-stone-400" />
              <span className="text-[11px] text-stone-400">Muted</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleQuickSkip}
          className="px-4 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-xs font-serif text-[#FDE68A] hover:text-white transition cursor-pointer shadow-lg"
        >
          <span>Skip to Wedding &rarr;</span>
        </button>
      </div>

      {/* ========================================================
          STAGE 1: PHYSICAL LUXURY WEDDING INVITATION CARD (3D)
         ======================================================== */}
      <div
        ref={cardContainerRef}
        className="relative z-30 w-[92vw] max-w-[420px] sm:max-w-[480px] aspect-[4/5] sm:aspect-[3/4] p-2"
        style={{ perspective: "1400px" }}
      >
        {/* Soft Drop Shadow beneath Invitation Card */}
        <div className="absolute inset-4 rounded-xl bg-black/60 blur-2xl transform translate-y-6 pointer-events-none" />

        {/* Outer Card Frame with 3D Preservation */}
        <div
          className="relative w-full h-full rounded-sm shadow-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#FFFDF9]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ========================================================
              INNER CARD CONTENT (Revealed as flaps open)
             ======================================================== */}
          <div
            ref={innerCardRef}
            className="absolute inset-0 bg-[#FAF7F2] p-6 sm:p-8 flex flex-col items-center justify-between text-center select-none"
          >
            {/* Subtle Gold Floral Damask Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C5A36A_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Top Ornamental Arch */}
            <div className="relative pt-2">
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#C5A36A] font-bold block mb-1">
                || श्री गणेशाय नमः ||
              </span>
              <p className="font-serif italic text-xs text-[#8B5E3C]">
                Together with our families, we invite you to celebrate our wedding
              </p>
            </div>

            {/* Couple Names Headline */}
            <div className="my-auto py-2">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E141B] font-normal tracking-tight">
                {groomName}
              </h2>
              <span className="font-serif italic text-2xl text-[#C5A36A] my-1 block">&</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E141B] font-normal tracking-tight">
                {brideName}
              </h2>
              <div className="w-16 h-px bg-[#C5A36A] mx-auto my-3" />
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#8B5E3C] font-semibold">
                {weddingDateText}
              </p>
            </div>

            {/* Bottom Auspicious Note */}
            <div className="pb-2">
              <span className="text-[11px] font-serif text-[#C5A36A] tracking-widest uppercase">
                Fairmont &bull; Jaipur, Rajasthan
              </span>
            </div>
          </div>

          {/* ========================================================
              LEFT 3D FLAP (Hinged at left edge: origin left center)
             ======================================================== */}
          <div
            ref={leftDoorRef}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#FFFDF9] border-r border-[#D4AF37]/60 shadow-lg z-20 overflow-hidden cursor-pointer"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            onClick={handleOpen}
          >
            {/* Luxurious Gold Foil Filigree Corner & Border */}
            <div className="absolute inset-3 sm:inset-4 border border-[#C5A36A]/50 border-r-0 rounded-l-xs flex flex-col justify-between p-3 sm:p-4">
              <div className="text-left text-[#C5A36A] opacity-60">🪷</div>
              <div className="text-left text-[#C5A36A] opacity-60">🪷</div>
            </div>
          </div>

          {/* ========================================================
              RIGHT 3D FLAP (Hinged at right edge: origin right center)
             ======================================================== */}
          <div
            ref={rightDoorRef}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#FFFDF9] border-l border-[#D4AF37]/60 shadow-lg z-20 overflow-hidden cursor-pointer"
            style={{
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            onClick={handleOpen}
          >
            {/* Luxurious Gold Foil Filigree Corner & Border */}
            <div className="absolute inset-3 sm:inset-4 border border-[#C5A36A]/50 border-l-0 rounded-r-xs flex flex-col justify-between p-3 sm:p-4 text-right">
              <div className="text-[#C5A36A] opacity-60">🪷</div>
              <div className="text-[#C5A36A] opacity-60">🪷</div>
            </div>
          </div>

          {/* ========================================================
              CENTER GOLD WAX SEAL / EMBLEM & OPEN BUTTON
             ======================================================== */}
          <div
            ref={sealRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none p-4"
          >
            {/* Royal Gold Monogram Crest */}
            <div
              onClick={handleOpen}
              className="pointer-events-auto group cursor-pointer relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#FAF7F2] via-[#F3EAD8] to-[#E5D7BE] p-1.5 shadow-[0_4px_25px_rgba(212,175,55,0.4)] border border-[#C5A36A] transform transition duration-300 group-hover:scale-105"
            >
              <div className="w-full h-full rounded-full border border-dashed border-[#C5A36A] flex flex-col items-center justify-center p-2 text-center bg-[#FAF7F2]">
                <Crown size={16} className="text-[#C5A36A] mb-0.5" />
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#3E141B]">
                  {initials}
                </span>
                <span className="text-[8px] uppercase tracking-widest font-sans text-[#8B5E3C] mt-0.5">
                  ROYAL UNION
                </span>
              </div>
            </div>

            {/* Couple Names on Closed Card */}
            <div className="mt-4 text-center">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#3E141B] font-semibold tracking-tight">
                {coupleNames}
              </h1>
              <p className="font-serif italic text-xs text-[#8B5E3C] max-w-[260px] mx-auto mt-1">
                “Together with our families, we invite you to celebrate our wedding.”
              </p>
            </div>

            {/* Open Invitation CTA Button */}
            <div className="mt-5 pointer-events-auto">
              <button
                type="button"
                onClick={handleOpen}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A36A] via-[#D4AF37] to-[#B89248] text-[#2E0B14] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition cursor-pointer border border-[#FFFDF9]/60"
              >
                <MailOpen size={14} />
                <span>{config.actionButtonText || "Open Wedding Invitation ✨"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
