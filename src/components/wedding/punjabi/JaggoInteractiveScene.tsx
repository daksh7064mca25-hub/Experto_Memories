"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Flame, Volume2, ArrowDown, ChevronRight, Check } from "lucide-react";
import { PhulkariDiamondBorder } from "./PhulkariPatterns";

interface JaggoProps {
  weddingDateText?: string;
  venueCity?: string;
  onExploreNext?: () => void;
  config?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    time?: string;
    venueName?: string;
  };
}

export const JaggoInteractiveScene: React.FC<JaggoProps> = ({
  weddingDateText,
  venueCity,
  onExploreNext,
  config,
}) => {
  const [isLit, setIsLit] = useState(false);
  const [litStep, setLitStep] = useState(0); // 0 = unlit, 1 = lighting, 2 = fully illuminated
  const [soundPlayed, setSoundPlayed] = useState(false);

  // Play synthesized energetic festive dhol rhythmic beat via Web Audio API
  const playDholBeats = () => {
    try {
      if (typeof window === "undefined") return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Rhythmic sequence: Dha (low deep thud) - Dha - Tin (crisp snap) - Dha
      const now = ctx.currentTime;
      const drumBeats = [
        { time: 0.0, freq: 85, duration: 0.28, gain: 0.6 },
        { time: 0.18, freq: 110, duration: 0.18, gain: 0.4 },
        { time: 0.35, freq: 80, duration: 0.32, gain: 0.7 },
        { time: 0.55, freq: 140, duration: 0.15, gain: 0.35 },
        { time: 0.72, freq: 75, duration: 0.4, gain: 0.8 },
      ];

      drumBeats.forEach((beat) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(beat.freq, now + beat.time);
        osc.frequency.exponentialRampToValueAtTime(35, now + beat.time + beat.duration);

        gainNode.gain.setValueAtTime(beat.gain, now + beat.time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + beat.time + beat.duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + beat.time);
        osc.stop(now + beat.time + beat.duration);
      });

      setSoundPlayed(true);
    } catch {
      // Graceful fallback if audio context is blocked
    }
  };

  const handleInteractJaggo = () => {
    if (isLit) return;
    setIsLit(true);
    setLitStep(1);

    // Progressive illumination of diyas
    setTimeout(() => {
      setLitStep(2);
      playDholBeats();
    }, 600);
  };

  return (
    <section
      id="jaggo-scene"
      aria-label="Interactive Jaggo Celebration"
      className="relative min-h-[85vh] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
      style={{
        background: isLit
          ? "radial-gradient(ellipse at center, #4A0E17 0%, #26050C 60%, #120205 100%)"
          : "radial-gradient(ellipse at center, #26050C 0%, #150206 70%, #0A0103 100%)",
      }}
    >
      {/* Starlit Night Courtyard Lights & Floating Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fairy lights string along the top */}
        <div className="w-full flex justify-around opacity-70">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-700 ${
                isLit
                  ? "bg-amber-300 shadow-[0_0_12px_#F59E0B] scale-125"
                  : "bg-amber-700/60 shadow-none"
              }`}
            />
          ))}
        </div>

        {/* Ambient golden courtyard radiance */}
        <div
          className={`absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent transition-opacity duration-1000 ${
            isLit ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Cultural Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E5A910]/15 border border-[#E5A910]/40 text-[#FBBF24] text-[11px] font-mono uppercase tracking-[0.25em]">
          <Sparkles size={13} className="text-[#FBBF24]" />
          <span>FESTIVE NIGHT COURTYARD &bull; JAGGO CELEBRATION</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
          {config?.title || "Jaggo Aayi Aa! The Night of Lights"}
        </h2>

        <p className="font-serif italic text-sm sm:text-base text-amber-200/90 max-w-xl mx-auto leading-relaxed">
          {config?.description ||
            "An exuberant tradition of lighting brass lamps, singing joyous folk boliyan, and dancing under the stars to herald the wedding celebration."}
        </p>

        {/* INTERACTIVE JAGGO POT COMPONENT */}
        <div className="relative my-8 flex flex-col items-center justify-center">
          {/* Ornate Tap/Click Prompt */}
          {!isLit && (
            <button
              type="button"
              onClick={handleInteractJaggo}
              className="absolute -top-10 z-20 px-5 py-2 rounded-full text-xs font-serif font-bold text-[#2A060E] bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] shadow-[0_0_25px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 transition-transform"
            >
              <Flame size={14} className="fill-current text-rose-800" />
              <span>Tap to Light the Auspicious Jaggo</span>
            </button>
          )}

          {/* Handcrafted Decorated Brass Jaggo SVG Pot */}
          <div
            onClick={handleInteractJaggo}
            className={`relative cursor-pointer transition-transform duration-500 select-none ${
              isLit ? "scale-105" : "hover:scale-102 active:scale-98"
            }`}
            title="Click to light the Jaggo"
          >
            <svg
              width="260"
              height="280"
              viewBox="0 0 260 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
            >
              {/* TOP FLAMES / DIYAS (ILLUMINATE ON TAP) */}
              <g className={`transition-opacity duration-700 ${litStep >= 1 ? "opacity-100" : "opacity-20"}`}>
                {/* Center Main Diya Flame */}
                <ellipse cx="130" cy="24" rx="8" ry="16" fill="#F59E0B" />
                <ellipse cx="130" cy="22" rx="4" ry="10" fill="#FEF08A" />
                <circle cx="130" cy="20" r="14" fill="#F59E0B" opacity="0.3" className="animate-ping" />

                {/* Left Diya Flame */}
                <ellipse cx="85" cy="42" rx="6" ry="13" fill="#F59E0B" />
                <ellipse cx="85" cy="40" rx="3.5" ry="8" fill="#FEF08A" />

                {/* Right Diya Flame */}
                <ellipse cx="175" cy="42" rx="6" ry="13" fill="#F59E0B" />
                <ellipse cx="175" cy="40" rx="3.5" ry="8" fill="#FEF08A" />

                {/* Far Left Flame */}
                <ellipse cx="48" cy="72" rx="5" ry="10" fill="#EA580C" />
                <ellipse cx="48" cy="71" rx="2.5" ry="6" fill="#FEF08A" />

                {/* Far Right Flame */}
                <ellipse cx="212" cy="72" rx="5" ry="10" fill="#EA580C" />
                <ellipse cx="212" cy="71" rx="2.5" ry="6" fill="#FEF08A" />
              </g>

              {/* CLAY/BRASS DIYA BASES */}
              <path d="M118 36 Q130 44 142 36 Z" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
              <path d="M75 52 Q85 58 95 52 Z" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
              <path d="M165 52 Q175 58 185 52 Z" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
              <path d="M40 80 Q48 85 56 80 Z" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
              <path d="M204 80 Q212 85 220 80 Z" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />

              {/* TOP PYRAMIDAL TIER (JAGGO SHIKHAR) */}
              <path d="M100 48 L160 48 L170 78 L90 78 Z" fill="#B45309" stroke="#FDE68A" strokeWidth="1.5" />
              {/* Middle Tier */}
              <path d="M70 78 L190 78 L205 118 L55 118 Z" fill="#D97706" stroke="#FDE68A" strokeWidth="1.5" />

              {/* Decorative Mirror-work Insets (Aablas) */}
              <circle cx="100" cy="98" r="6" fill="#E2E8F0" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="130" cy="98" r="7" fill="#E2E8F0" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="160" cy="98" r="6" fill="#E2E8F0" stroke="#78350F" strokeWidth="1.5" />

              {/* MAIN BRASS POT BODY (GAGAR / KALASH) */}
              <ellipse cx="130" cy="180" rx="85" ry="65" fill="#B45309" stroke="#FDE68A" strokeWidth="2" />
              {/* Golden metallic gradient sheen */}
              <ellipse cx="130" cy="175" rx="76" ry="55" fill="#D97706" opacity="0.85" />
              <ellipse cx="115" cy="165" rx="50" ry="38" fill="#F59E0B" opacity="0.6" />

              {/* Phulkari-inspired painted bands across the pot */}
              <path d="M48 165 Q130 195 212 165" stroke="#C2185B" strokeWidth="8" fill="none" />
              <path d="M52 185 Q130 215 208 185" stroke="#044E36" strokeWidth="6" fill="none" />
              <path d="M50 165 Q130 195 210 165" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />

              {/* MIRROR-WORK DIAMONDS ALONG THE RIM */}
              <rect x="85" y="165" width="8" height="8" transform="rotate(45 89 169)" fill="#FFFFFF" stroke="#78350F" />
              <rect x="110" y="172" width="9" height="9" transform="rotate(45 114 176)" fill="#FFFFFF" stroke="#78350F" />
              <rect x="140" y="172" width="9" height="9" transform="rotate(45 144 176)" fill="#FFFFFF" stroke="#78350F" />
              <rect x="165" y="165" width="8" height="8" transform="rotate(45 169 169)" fill="#FFFFFF" stroke="#78350F" />

              {/* BASE RING */}
              <ellipse cx="130" cy="242" rx="55" ry="12" fill="#78350F" stroke="#FDE68A" strokeWidth="2" />

              {/* COLORFUL SILK HANGING TASSELS (LATCHAN / PARANDI DETAILS) */}
              <g>
                {/* Left magenta tassel */}
                <path d="M50 190 Q40 220 44 250" stroke="#C2185B" strokeWidth="3" fill="none" />
                <circle cx="44" cy="252" r="4" fill="#C2185B" />
                <circle cx="44" cy="258" r="2.5" fill="#E5A910" />

                {/* Right magenta tassel */}
                <path d="M210 190 Q220 220 216 250" stroke="#C2185B" strokeWidth="3" fill="none" />
                <circle cx="216" cy="252" r="4" fill="#C2185B" />
                <circle cx="216" cy="258" r="2.5" fill="#E5A910" />

                {/* Center-left emerald tassel */}
                <path d="M85 225 L82 265" stroke="#044E36" strokeWidth="2.5" fill="none" />
                <circle cx="82" cy="268" r="3.5" fill="#044E36" />

                {/* Center-right mustard tassel */}
                <path d="M175 225 L178 265" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                <circle cx="178" cy="268" r="3.5" fill="#F59E0B" />
              </g>
            </svg>

            {/* Radiant glow surrounding illuminated Jaggo */}
            {isLit && (
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl pointer-events-none animate-pulse" />
            )}
          </div>
        </div>

        {/* REVEALED CELEBRATION MESSAGE ONCE LIT */}
        <div
          className={`transition-all duration-700 ${
            isLit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="inline-block p-4 sm:p-5 rounded-2xl bg-[#3E0A16]/90 border border-[#E5A910]/60 shadow-xl max-w-lg mx-auto">
            <p className="font-serif font-bold text-lg sm:text-xl text-[#FDE68A] mb-1">
              ✨ Jaggo Aayi Aa! Shava Ni Jaggo Aayi Aa! ✨
            </p>
            <p className="text-xs sm:text-sm text-amber-100 font-sans leading-relaxed">
              The lamps are ablaze, the dholis are playing, and the whole courtyard is singing. May this light bring boundless joy, prosperity, and blessings to the happy couple!
            </p>
          </div>
        </div>

        {/* NAVIGATION ACTIONS */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#ceremony-section"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-serif font-bold tracking-wider uppercase bg-[#E5A910] hover:bg-[#FBBF24] text-[#2A060E] shadow-xl hover:scale-103 transition-all cursor-pointer"
          >
            <span>Proceed to Ceremony &amp; Functions</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>

          {!isLit && (
            <a
              href="#ceremony-section"
              className="text-xs text-amber-200/70 hover:text-white underline underline-offset-4 font-sans"
            >
              Skip directly to itinerary &darr;
            </a>
          )}
        </div>
      </div>

      {/* Decorative Phulkari Divider at bottom of section */}
      <div className="absolute bottom-0 inset-x-0">
        <PhulkariDiamondBorder />
      </div>
    </section>
  );
};
