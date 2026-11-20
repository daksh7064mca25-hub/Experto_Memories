"use client";

import React, { useState } from "react";
import { Mail, Heart, Sparkles, Volume2, KeyRound } from "lucide-react";
import { LoveLetterConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveLetterConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
}

export function LoveLetterSection({
  config,
  recipientName,
  senderName,
  theme,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="sec-love-letter" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Mail size={11} className="text-amber-300" />
            <span>Private Correspondence</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "A Letter From My Heart"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Written late at night when the world is quiet and only your face remains in my thoughts."}
          </p>
        </div>

        {/* The Sealed Envelope / Unfolded Letter */}
        <div className="relative">
          {!isOpen ? (
            /* Sealed Wax Envelope Card */
            <div
              onClick={() => setIsOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }}
              className="group cursor-pointer select-none bg-gradient-to-b from-[#3a0a14] via-[#24060c] to-[#160307] rounded-3xl p-8 sm:p-12 border-2 border-amber-400/40 shadow-2xl shadow-rose-950/80 text-center transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/70"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-2 border-amber-400/80 shadow-2xl flex flex-col items-center justify-center text-amber-200 mb-5 group-hover:scale-110 transition-transform">
                <Heart size={22} className="fill-amber-300 text-amber-300 mb-0.5" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-amber-200 uppercase">
                  {config.waxSealText || "FOREVER"}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-100 mb-2">
                Wax-Sealed Love Letter
              </h3>

              <p className="text-xs sm:text-sm text-rose-300/80 font-serif italic mb-6">
                Addressed to {recipientName} • Tap to break seal &amp; unfold
              </p>

              <div className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg">
                <KeyRound size={12} />
                <span>Break The Seal &amp; Read</span>
              </div>
            </div>
          ) : (
            /* Unfolded Vintage Parchment Letter */
            <div className="relative bg-[#fffdf9] text-stone-900 rounded-3xl p-8 sm:p-14 border border-amber-200/90 shadow-2xl shadow-rose-950/40 animate-fadeIn">
              {/* Subtle Paper Texture Accents */}
              <div className="absolute top-4 right-6 text-xs font-mono text-amber-900/60 flex items-center gap-1.5">
                <Sparkles size={11} className="text-amber-600" />
                <span>{config.dateText || "Tonight & Always"}</span>
              </div>

              {/* Salutation */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-950 mb-6 italic">
                {config.salutation || `My Dearest ${recipientName},`}
              </h3>

              {/* Letter Paragraphs */}
              <div className="space-y-4 font-serif text-stone-800 text-sm sm:text-base leading-relaxed tracking-wide">
                {config.letterBody
                  ?.split("\n\n")
                  .map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Signoff & Signature */}
              <div className="mt-8 pt-6 border-t border-amber-200/60 flex flex-col items-end">
                <p className="font-serif text-xs sm:text-sm text-stone-600 italic mb-1">
                  {config.closing || "With all my love and devotion,"}
                </p>
                <p className="font-serif text-lg sm:text-xl font-bold text-rose-950 font-cursive">
                  {config.signature || senderName}
                </p>
              </div>

              {/* Re-seal Option */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-mono text-stone-400 hover:text-stone-700 underline transition-colors"
                >
                  Fold and re-seal letter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
