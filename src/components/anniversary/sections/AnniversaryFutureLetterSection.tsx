"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Mail, MailOpen, Heart, Sparkles, Feather, Check } from "lucide-react";
import { AnniversaryFutureLetterConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryFutureLetterConfig;
  partner1Name?: string;
  partner2Name?: string;
  theme: ThemeId;
}

export function AnniversaryFutureLetterSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const themeConfig = getThemeConfig(theme, "anniversary");

  const paragraphs = config.letterBody || [
    "As we celebrate where we are today, my heart is overflowing with excitement for everything that still awaits us.",
    "I picture the cozy home we'll make, the morning coffees on sunlit balconies, the spontaneous weekend getaways, and the quiet comfort of being by each other's side through every season of life.",
    "Thank you for being my anchor, my best friend, and my greatest adventure. I promise to keep dating you, cherishing you, and choosing you forever.",
  ];

  const promises = config.promises || [
    "I promise to always hold your hand when walking together.",
    "I promise to make you laugh when life gets too serious.",
    "I promise to never stop listening with an open heart.",
  ];

  const handleOpenLetter = () => {
    if (!isOpen) {
      setIsOpen(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ec4899", "#a855f7"],
      });
    }
  };

  return (
    <section id="anniv-sec-future-letter" className="py-16 px-4 max-w-2xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-amber-100 dark:bg-purple-950 text-amber-800 dark:text-purple-300 mb-2 border border-amber-200/80 dark:border-purple-800">
          Letters to Tomorrow ✉️
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100">
          A Letter From Our Future
        </h2>
        <p className="text-sm opacity-80 mt-1 max-w-md mx-auto font-sans leading-relaxed">
          {config.envelopeTeaser || "Open this when you imagine our future..."}
        </p>
      </div>

      {!isOpen ? (
        /* Sealed Future Envelope View */
        <div
          onClick={handleOpenLetter}
          className="cursor-pointer group relative mx-auto w-full max-w-[360px] aspect-[4/3] rounded-3xl p-6 bg-gradient-to-br from-amber-100 via-rose-50 to-amber-200 dark:from-purple-900/60 dark:to-stone-900 border-2 border-amber-300/80 dark:border-purple-700 shadow-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95"
        >
          {/* Heart Wax Seal */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform"
            style={{
              background: "radial-gradient(circle, #f59e0b 30%, #b45309 100%)",
              boxShadow: "0 6px 18px rgba(245, 158, 11, 0.45)",
            }}
          >
            <Heart size={26} className="fill-white text-white" />
          </div>

          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-purple-100 mb-1">
            {config.headline || "To The Tomorrow We Build Together"}
          </h3>

          <span className="font-serif italic text-xs text-amber-800 dark:text-purple-300">
            Tap wax seal to unfold letter
          </span>
        </div>
      ) : (
        /* Unfolded Letter Paper View */
        <div
          className={`relative ${themeConfig.paperBgClass} rounded-2xl p-6 sm:p-10 shadow-2xl border transition-all animate-in fade-in duration-500`}
        >
          {/* Vintage Stamp */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-70 pointer-events-none">
            <div className="w-14 h-16 border-2 border-dashed border-amber-400 rounded flex flex-col items-center justify-center p-1 rotate-2">
              <Feather size={14} className="text-amber-500" />
              <span className="text-[8px] font-mono tracking-widest font-bold text-amber-600 mt-1">
                FOREVER
              </span>
            </div>
          </div>

          {/* Letter Salutation */}
          <div className="border-b border-amber-200/60 pb-3 mb-6">
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-purple-100 mb-1">
              {config.headline || "To The Tomorrow We Build Together"}
            </h3>
            <p className="font-serif italic text-base sm:text-lg text-amber-700 dark:text-purple-300">
              My Forever Love, {partner1Name},
            </p>
          </div>

          {/* Letter Paragraphs */}
          <div className="font-handwriting text-2xl sm:text-3xl leading-relaxed text-stone-800 dark:text-purple-100 space-y-4 mb-8">
            {paragraphs.map((p, pIdx) => (
              <p key={pIdx}>{p}</p>
            ))}
          </div>

          {/* Future Promises Box */}
          {promises.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-purple-950/40 border border-amber-200/70 dark:border-purple-800 mb-6">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-purple-300 block mb-3">
                Our Written Vows to Tomorrow
              </span>
              <div className="space-y-2">
                {promises.map((promise, promIdx) => (
                  <div key={promIdx} className="flex items-start gap-2 text-xs sm:text-sm font-sans text-stone-800 dark:text-purple-200">
                    <Check size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>{promise}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signoff */}
          <div className="pt-4 border-t border-amber-200/60 flex flex-col items-end">
            <p className="font-handwriting text-2xl sm:text-3xl text-amber-800 dark:text-purple-300">
              {config.signoff || "Yours through all our tomorrows,"}
            </p>
            <p className="font-handwriting text-3xl sm:text-4xl font-bold text-amber-600 dark:text-purple-400 mt-1">
              {partner2Name} 🤍
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

