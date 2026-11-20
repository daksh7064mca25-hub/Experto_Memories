"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Mail, Heart, Volume2 } from "lucide-react";
import { BirthdayLetterConfig, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayLetterConfig;
  recipientName: string;
  senderName: string;
  theme?: ThemeId;
}

export function BirthdayLetterSection({
  config,
  recipientName = "My Favorite Person",
  senderName = "Someone Who Loves You",
  theme,
}: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const paragraphs =
    config.letterBody && config.letterBody.length > 0
      ? config.letterBody
      : [
          `Happy, happy birthday! As you celebrate another incredible milestone, I wanted to pause and remind you just how deeply special you are.`,
          `Your kindness, your strength, and the effortless way you bring warmth into the lives of everyone around you is nothing short of extraordinary. The world is so much brighter simply because you are in it.`,
          `May this coming year bring you health, audacious joy, adventures you'll talk about for decades, and peace in every quiet moment. Never forget how loved and cherished you are.`,
        ];

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#ec4899", "#f59e0b", "#fbbf24"],
    });
  };

  const handlePlayVoice = () => {
    if (!config.audioNarrationUrl) return;
    const audio = new Audio(config.audioNarrationUrl);
    setIsPlayingAudio(true);
    audio.play().catch(() => setIsPlayingAudio(false));
    audio.onended = () => setIsPlayingAudio(false);
  };

  return (
    <section
      id="bday-sec-letter"
      className="relative min-h-[90vh] py-16 px-4 max-w-2xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-3">
        <Mail size={13} className="text-amber-600" />
        <span>From The Heart</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2">
        {config.envelopeTitle || "A Birthday Letter For You 💌"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8">
        Personal words written especially for this day. Tap the sealed envelope to read.
      </p>

      {!isOpen ? (
        /* Sealed Envelope Visual */
        <div
          onClick={handleOpenEnvelope}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenEnvelope();
            }
          }}
          className="group relative cursor-pointer w-full max-w-md aspect-5/3 rounded-3xl bg-gradient-to-tr from-amber-100 via-rose-50 to-pink-100 border-2 border-amber-200 shadow-2xl p-6 flex flex-col items-center justify-center transition-transform hover:scale-102 active:scale-98"
        >
          {/* Envelope Flap Lines */}
          <div className="absolute top-0 inset-x-0 h-1/2 border-b-2 border-amber-200/80 bg-white/30 backdrop-blur-xs rounded-t-3xl flex items-center justify-center">
            {/* Wax Seal */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 shadow-lg shadow-rose-600/40 border-2 border-rose-400 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Heart size={24} className="fill-current" />
            </div>
          </div>

          <div className="absolute bottom-4 text-center">
            <span className="font-serif font-bold text-sm text-stone-800 block">
              For {recipientName}
            </span>
            <span className="text-[11px] font-sans text-stone-500">
              Tap wax seal to unseal letter
            </span>
          </div>
        </div>
      ) : (
        /* Opened Letter */
        <div className="w-full max-w-xl rounded-3xl bg-[#fffefc] border border-amber-200 shadow-2xl p-6 sm:p-10 text-left animate-in zoom-in-95 duration-500 relative">
          {/* Subtle Stamp Corner */}
          <div className="absolute top-6 right-6 w-12 h-14 border-2 border-dashed border-amber-300 rounded-sm flex flex-col items-center justify-center text-[9px] font-mono text-amber-800 bg-amber-50/60 rotate-2">
            <span>BDAY</span>
            <span>★</span>
          </div>

          {/* Salutation */}
          <p className="font-serif font-bold text-lg sm:text-xl text-stone-900 mb-4">
            {config.salutation || `Dearest ${recipientName},`}
          </p>

          {/* Letter Body */}
          <div className="space-y-4 font-serif text-sm sm:text-base text-stone-700 leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Signoff */}
          <div className="mt-8 pt-6 border-t border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-serif italic text-xs text-stone-500">
                {config.signoff || "With all my love and warmest wishes,"}
              </p>
              <p className="font-serif font-bold text-base sm:text-lg text-rose-950 mt-0.5">
                {config.senderName || senderName}
              </p>
            </div>

            {config.audioNarrationUrl && (
              <button
                type="button"
                onClick={handlePlayVoice}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 transition-colors"
              >
                <Volume2 size={13} className={isPlayingAudio ? "animate-pulse text-rose-600" : ""} />
                <span>{isPlayingAudio ? "Playing Voice Note..." : "Listen To Audio Note 🎙️"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
