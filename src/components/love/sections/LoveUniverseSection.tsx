"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Star, X, Calendar, Compass, Heart } from "lucide-react";
import { LoveUniverseConfig, LoveUniverseStar } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveUniverseConfig;
  theme: ThemeConfig;
}

export function LoveUniverseSection({ config, theme }: Props) {
  const [activeStar, setActiveStar] = useState<LoveUniverseStar | null>(null);
  const [showCentralStar, setShowCentralStar] = useState(false);

  return (
    <section id="sec-love-universe" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-amber-300/40 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Compass size={11} className="text-amber-300 animate-spin-slow" />
            <span>Interactive Celestial Map</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-50 mb-3">
            {config.headline || "Our Little Universe"}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Touch each glowing star to illuminate memories and promises written into our night sky."}
          </p>
        </div>

        {/* The Celestial Sky Canvas Frame */}
        <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl bg-gradient-to-b from-[#050614] via-[#0b0d26] to-[#04040d] border border-amber-400/30 shadow-2xl shadow-indigo-950/90 overflow-hidden select-none">
          {/* Subtle Nebula Clouds */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

          {/* SVG Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {config.stars?.map((star, idx) => {
              if (idx === 0) return null;
              const prev = config.stars[idx - 1];
              return (
                <line
                  key={`line-${star.id}-${prev.id}`}
                  x1={`${prev.x}%`}
                  y1={`${prev.y}%`}
                  x2={`${star.x}%`}
                  y2={`${star.y}%`}
                  stroke="rgba(251, 191, 36, 0.35)"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
              );
            })}
            {/* Lines connecting each star to the center */}
            {config.stars?.map((star) => (
              <line
                key={`line-center-${star.id}`}
                x1="50%"
                y1="50%"
                x2={`${star.x}%`}
                y2={`${star.y}%`}
                stroke="rgba(244, 63, 94, 0.2)"
                strokeWidth="0.8"
              />
            ))}
          </svg>

          {/* Glowing Constellation Stars */}
          {config.stars?.map((star) => {
            const sizeClass =
              star.size === "large"
                ? "w-7 h-7 sm:w-8 sm:h-8"
                : star.size === "medium"
                ? "w-6 h-6 sm:w-7 sm:h-7"
                : "w-5 h-5 sm:w-6 sm:h-6";

            return (
              <div
                key={star.id}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute z-20 group"
              >
                <button
                  type="button"
                  onClick={() => setActiveStar(star)}
                  aria-label={`Open memory star: ${star.title}`}
                  className={`relative flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-125 active:scale-95 cursor-pointer ${sizeClass}`}
                  style={{
                    backgroundColor: star.glowColor || "#f59e0b",
                    boxShadow: `0 0 16px ${star.glowColor || "#f59e0b"}, 0 0 32px rgba(251, 191, 36, 0.4)`,
                  }}
                >
                  <Star size={12} className="text-stone-950 fill-stone-950" />
                </button>

                {/* Floating Label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap px-2 py-0.5 rounded-full bg-stone-950/80 border border-amber-400/30 text-[9px] font-mono text-amber-200 pointer-events-none group-hover:scale-105 transition-transform opacity-90">
                  {star.title}
                </div>
              </div>
            );
          })}

          {/* Prominent Central North Star */}
          <div
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            className="absolute z-20 flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setShowCentralStar(true)}
              aria-label="Open North Star core memory"
              className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-yellow-300 text-stone-950 shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer animate-pulse"
              style={{
                boxShadow: "0 0 25px rgba(251, 191, 36, 0.8), 0 0 50px rgba(244, 63, 94, 0.4)",
              }}
            >
              <Sparkles size={22} className="animate-spin-slow" />
            </button>
            <span className="mt-2 px-2.5 py-0.5 rounded-full bg-rose-950/90 border border-amber-400/40 text-[10px] font-mono font-bold tracking-wider text-amber-200 uppercase whitespace-nowrap shadow-md">
              Core Star ✨
            </span>
          </div>

          <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none text-[10px] font-mono text-indigo-300/60">
            Touch any star to reveal our story
          </div>
        </div>

        {/* Modal: Star Memory Reveal */}
        {activeStar && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#13152c] border border-amber-400/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left">
              <button
                type="button"
                onClick={() => setActiveStar(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-rose-300 hover:text-white transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-amber-300 bg-indigo-950 border border-amber-400/30 mb-3">
                <Star size={10} className="fill-amber-300" />
                <span>Celestial Memory</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 mb-1">
                {activeStar.title}
              </h3>

              {activeStar.date && (
                <div className="flex items-center gap-1 text-xs text-rose-300/80 font-mono mb-4">
                  <Calendar size={12} />
                  <span>{activeStar.date}</span>
                </div>
              )}

              {activeStar.photoUrl && (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-amber-400/20 shadow-inner">
                  <Image
                    src={activeStar.photoUrl}
                    alt={activeStar.title}
                    fill
                    className="object-cover"
                    unoptimized={activeStar.photoUrl.startsWith("/api/media/view")}
                  />
                </div>
              )}

              <p className="text-xs sm:text-sm text-indigo-100 font-serif leading-relaxed">
                {activeStar.story}
              </p>

              <button
                type="button"
                onClick={() => setActiveStar(null)}
                className="mt-6 w-full py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Keep Exploring The Stars
              </button>
            </div>
          </div>
        )}

        {/* Modal: Central North Star Reveal */}
        {showCentralStar && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-[#260a16] via-[#160c29] to-[#0a0514] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-center">
              <button
                type="button"
                onClick={() => setShowCentralStar(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-amber-300 hover:text-white transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>

              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-stone-950 shadow-xl mb-4">
                <Sparkles size={24} className="animate-spin-slow" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 mb-2">
                {config.centralStarTitle || "The North Star of My Life"}
              </h3>

              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-4" />

              {config.centralStarPhotoUrl && (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 border border-amber-400/40 shadow-xl">
                  <Image
                    src={config.centralStarPhotoUrl}
                    alt={config.centralStarTitle}
                    fill
                    className="object-cover"
                    unoptimized={config.centralStarPhotoUrl.startsWith("/api/media/view")}
                  />
                </div>
              )}

              <p className="font-serif text-sm sm:text-base text-rose-100 leading-relaxed max-w-md mx-auto">
                {config.centralStarStory ||
                  `You are the steady beacon in my universe. Whenever life gets chaotic, I look at you and immediately remember who I am and where I belong.`}
              </p>

              <button
                type="button"
                onClick={() => setShowCentralStar(false)}
                className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Return to Our Constellation
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
