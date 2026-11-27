"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Sparkles, ChevronRight, Eye } from "lucide-react";
import { LoveReasonsConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveReasonsConfig;
  theme: ThemeConfig;
}

export function LoveReasonsSection({ config, theme }: Props) {
  // Set of opened card IDs
  const [openedCardIds, setOpenedCardIds] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setOpenedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="sec-love-reasons" className="py-16 sm:py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Heart size={11} className="fill-amber-300" />
            <span>Curated Affection</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "Little Whispers of Why I Love You"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Tap each card to reveal what my heart notices when you are simply being yourself."}
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8">
          {config.cards?.map((card, idx) => {
            const isRevealed = openedCardIds.has(card.id || `rc-${idx}`);
            return (
              <div
                key={card.id || idx}
                onClick={() => toggleCard(card.id || `rc-${idx}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(card.id || `rc-${idx}`);
                  }
                }}
                className={`group relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
                  isRevealed
                    ? "bg-[#330810]/95 border-amber-400/60 shadow-2xl shadow-rose-950/70"
                    : "bg-[#20050b]/80 border-rose-900/50 hover:border-amber-400/40 hover:bg-[#28070e] shadow-xl"
                }`}
              >
                {/* Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-rose-950 text-amber-300 border border-amber-400/30">
                    {card.badge || `Reason #${idx + 1}`}
                  </span>
                  <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                    {isRevealed ? "Hide Whisper" : "Tap to Reveal"}
                    <ChevronRight
                      size={12}
                      className={`transition-transform duration-300 ${
                        isRevealed ? "rotate-90" : "group-hover:translate-x-1"
                      }`}
                    />
                  </span>
                </div>

                {/* Optional Photo */}
                {card.photoUrl && (
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-rose-900/60 shadow-inner">
                    <Image
                      src={card.photoUrl}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 92vw, 436px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={card.photoUrl.startsWith("/api/media/view")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#20050b] via-transparent to-transparent opacity-60" />
                  </div>
                )}

                {/* Card Title */}
                <h3 className="font-serif text-lg font-bold text-rose-100 mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Secret Message Reveal */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isRevealed
                      ? "max-h-96 opacity-100 mt-3 pt-3 border-t border-amber-400/20"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-rose-200/90 font-serif leading-relaxed italic">
                    &ldquo;{card.message}&rdquo;
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grand Final Card */}
        <div className="relative rounded-3xl p-7 sm:p-9 border-2 border-amber-400/70 bg-gradient-to-br from-[#420b16] via-[#2d070f] to-[#1a0307] shadow-2xl shadow-rose-950/80 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 mb-4 shadow-lg">
            <Sparkles size={20} className="animate-spin-slow" />
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-200 mb-3">
            {config.finalCardTitle || "And The Biggest Reason Of All..."}
          </h3>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-4" />

          <p className="font-serif text-sm sm:text-base text-rose-100 leading-relaxed max-w-xl mx-auto">
            {config.finalCardMessage ||
              `Because loving you is as natural as breathing. I don't love you because of what you do—I love you for the incredible, irreplaceable soul that you are.`}
          </p>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs font-mono text-amber-300/80">
            <Heart size={12} className="fill-current text-rose-400 animate-pulse" />
            <span>Infinitely &amp; Forever Yours</span>
          </div>
        </div>
      </div>
    </section>
  );
}
