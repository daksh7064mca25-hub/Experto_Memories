"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Heart, RotateCcw, Share2, Send, Flame } from "lucide-react";
import { LoveSurpriseConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveSurpriseConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
  onReplay?: () => void;
}

export function LoveSurpriseSection({
  config,
  recipientName,
  senderName,
  theme,
  onReplay,
}: Props) {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleActionClick = () => {
    setHasInteracted(true);
    const message =
      config.whatsappShareText ||
      `I just experienced our Secret World website and I love you more than words can say! ❤️✨`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <section id="sec-love-surprise" className="py-20 sm:py-28 px-4 relative text-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-rose-600/20 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border border-amber-400/40 text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase shadow-xl mb-6">
          <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
          <span>The Grand Finale</span>
        </div>

        <div className="bg-gradient-to-br from-[#3b0b15] via-[#24060c] to-[#120205] border-2 border-amber-400/70 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-rose-950/80 relative overflow-hidden">
          {/* Subtle gold ribbon top edge */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Central Heart Emblem */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-300 text-stone-950 flex items-center justify-center shadow-xl shadow-rose-900/40 mb-6">
            <Heart size={28} className="fill-current animate-pulse" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-100 mb-2">
            {config.surpriseTitle || "My Eternal Promise To You"}
          </h2>

          <p className="text-xs sm:text-sm text-rose-300/80 font-serif italic mb-6">
            Dedicated with all my heart to {recipientName}
          </p>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-6" />

          {/* Optional Photograph */}
          {config.photoUrl && (
            <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden mb-6 border border-amber-400/40 shadow-xl">
              <Image
                src={config.photoUrl}
                alt={config.surpriseTitle}
                fill
                className="object-cover"
                unoptimized={config.photoUrl.startsWith("/api/media/view")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0307]/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Surprise Body Message */}
          <p className="font-serif text-sm sm:text-base text-rose-100 leading-relaxed mb-8 max-w-lg mx-auto">
            {config.surpriseBody ||
              `I promise to celebrate your victories as if they are my own, to hold you through the storms, to always leave you the last bite of dessert, and to choose you—every single morning—for the rest of my days.`}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleActionClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-500 hover:to-rose-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-rose-900/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Send size={13} />
              <span>{config.actionButtonText || "Send My Love Back ❤️"}</span>
            </button>

            {onReplay && (
              <button
                type="button"
                onClick={onReplay}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-400/30 text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={13} />
                <span>Replay Our World ↺</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Credit */}
        <p className="mt-8 text-[11px] font-serif text-rose-300/50">
          Created with ExpertoMemories • A Private Digital Time Capsule
        </p>
      </div>
    </section>
  );
}
