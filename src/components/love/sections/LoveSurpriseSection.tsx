"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Heart, RotateCcw, Send, CheckCircle2, Flame, Award, PartyPopper } from "lucide-react";
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
  const [isPromised, setIsPromised] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSealPromise = () => {
    setIsPromised(true);
    setShowCelebration(true);

    // Audio chime if context is available
    try {
      if (typeof window !== "undefined" && (window as any).AudioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch {}
  };

  const handleShareBack = () => {
    const message =
      config.whatsappShareText ||
      `I just experienced our Secret World website and I promised forever! ❤️✨ Devoted to you always.`;
    const encoded = encodeURIComponent(message);
    if (typeof window !== "undefined") {
      window.open(`https://wa.me/?text=${encoded}`, "_blank");
    }
  };

  return (
    <section id="sec-love-surprise" className="py-20 sm:py-28 px-4 relative text-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-rose-600/20 blur-3xl animate-pulse" />
      </div>

      {/* Floating Hearts Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl sm:text-4xl animate-bounce"
              style={{
                top: `${((i * 31) % 85) + 5}%`,
                left: `${((i * 47) % 85) + 5}%`,
                animationDuration: `${1.5 + ((i * 13) % 20) / 10}s`,
                animationDelay: `${((i * 7) % 10) * 0.08}s`,
                opacity: 0.9,
              }}
            >
              {i % 3 === 0 ? "❤️" : i % 3 === 1 ? "✨" : "🌹"}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border border-amber-400/40 text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase shadow-xl mb-6">
          <Sparkles size={11} className="text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span>The Climax &bull; A Forever Promise</span>
          <Sparkles size={11} className="text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
        </div>

        <div className="bg-gradient-to-br from-[#3b0b15] via-[#24060c] to-[#120205] border-2 border-amber-400/70 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-rose-950/80 relative overflow-hidden">
          {/* Top Gold Foil Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Central Heart Emblem */}
          <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-yellow-300 text-stone-950 flex items-center justify-center shadow-xl shadow-rose-900/40 mb-6">
            <Heart size={32} className="fill-current animate-pulse" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100 mb-2">
            {config.surpriseTitle || "My Eternal Promise To You"}
          </h2>

          <p className="text-xs sm:text-sm text-rose-300/80 font-serif italic mb-6">
            Dedicated with all my heart to <strong className="text-amber-300">{recipientName}</strong> &bull; From <strong className="text-amber-300">{senderName}</strong>
          </p>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto mb-6" />

          {/* Optional Photograph */}
          {config.photoUrl && (
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 border border-amber-400/40 shadow-xl">
              <Image
                src={config.photoUrl}
                alt={config.surpriseTitle}
                fill
                sizes="(max-width: 672px) 92vw, 672px"
                className="object-cover"
                unoptimized={config.photoUrl.startsWith("/api/media/view")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0307]/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Emotional Climax Quote */}
          <blockquote className="font-serif italic text-base sm:text-lg text-amber-200/95 my-4 px-4 border-y border-amber-400/25 py-3">
            &ldquo;Out of all the people in this world, I&apos;m still glad it&apos;s you.&rdquo;
          </blockquote>

          {/* Surprise Body Message */}
          <p className="font-serif text-sm sm:text-base text-rose-100 leading-relaxed mb-8 max-w-lg mx-auto">
            {config.surpriseBody ||
              `I promise to celebrate your victories as if they are my own, to hold you through the storms, to always leave you the last bite of dessert, and to choose you—every single morning—for the rest of my days.`}
          </p>

          {/* Interactive Promise Button or Sealed Banner */}
          {!isPromised ? (
            <div className="mb-8">
              <button
                type="button"
                onClick={handleSealPromise}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-500 hover:to-rose-600 text-stone-950 font-serif font-bold text-sm uppercase tracking-wider shadow-2xl shadow-rose-900/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer"
              >
                <Heart size={16} className="fill-current text-rose-950" />
                <span>I Seal This Promise Forever ❤️</span>
              </button>
              <p className="text-[11px] font-mono text-amber-300/80 mt-2">
                Tap to confirm your answer and illuminate our world
              </p>
            </div>
          ) : (
            <div className="mb-8 p-5 rounded-2xl bg-amber-400/15 border border-amber-400/50 text-center animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-mono font-bold mb-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>PROMISE SEALED FOR ETERNITY</span>
              </div>
              <p className="font-serif text-sm text-rose-100 italic">
                &ldquo;You and I, against the whole world, always and forever.&rdquo;
              </p>
            </div>
          )}

          {/* Action Buttons: WhatsApp and Replay */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-rose-900/50">
            <button
              type="button"
              onClick={handleShareBack}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#25050b] hover:bg-[#340810] border border-amber-400/40 text-rose-200 hover:text-amber-200 font-serif text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send size={13} className="text-amber-300" />
              <span>{config.actionButtonText || "Send My Love Back ❤️"}</span>
            </button>

            {onReplay && (
              <button
                type="button"
                onClick={onReplay}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-amber-200 font-serif text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw size={13} />
                <span>Replay Our Journey</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
