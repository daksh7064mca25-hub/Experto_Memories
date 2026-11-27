"use client";

import React, { useState, useEffect } from "react";
import { Mail, Heart, Sparkles, Volume2, KeyRound, Download, Feather, Check, RotateCcw } from "lucide-react";
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
  const [isCopied, setIsCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typedChars, setTypedChars] = useState(0);

  const fullLetterBody = config.letterBody || "";
  const paragraphs = (config.letterBody || "").split("\n\n").filter(Boolean);

  // Typewriter effect when opened
  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setTypedChars(0);
        setIsTyping(false);
      });
      return;
    }

    queueMicrotask(() => {
      setIsTyping(true);
      setTypedChars(0);
    });

    const step = 4; // Reveal 4 characters per tick for smooth natural reading speed
    const interval = setInterval(() => {
      setTypedChars((prev) => {
        const next = prev + step;
        if (next >= fullLetterBody.length) {
          clearInterval(interval);
          setIsTyping(false);
          return fullLetterBody.length;
        }
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isOpen, fullLetterBody]);

  const handleSkipTyping = () => {
    setTypedChars(fullLetterBody.length);
    setIsTyping(false);
  };

  const currentTypedText = fullLetterBody.slice(0, typedChars);
  const displayedParagraphs = (isTyping ? currentTypedText : fullLetterBody)
    .split("\n\n")
    .filter(Boolean);

  const handleSaveKeepsake = () => {
    const letterText = `${config.salutation || `My Dearest ${recipientName},`}\n\n${config.letterBody}\n\n${config.closing || "With all my love and devotion,"}\n${config.signature || senderName}\n${config.dateText || "Tonight & Always"}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(letterText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

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

        {/* The Sealed Envelope / Unfolded Vintage Parchment */}
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
              <div className="w-18 h-18 sm:w-22 sm:h-22 mx-auto rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(244,63,94,0.35)] flex flex-col items-center justify-center text-amber-200 mb-5 group-hover:scale-110 transition-transform">
                <Heart size={24} className="fill-amber-300 text-amber-300 mb-0.5 animate-pulse" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-amber-200 uppercase">
                  {config.waxSealText || "FOREVER"}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-100 mb-2">
                Handcrafted Wax-Sealed Love Letter
              </h3>

              <p className="text-xs sm:text-sm text-rose-300/80 font-serif italic mb-6">
                Addressed to {recipientName} &bull; Tap to break seal &amp; unfold
              </p>

              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg group-hover:scale-105 transition-transform">
                <KeyRound size={13} />
                <span>Break The Seal &amp; Read</span>
              </div>
            </div>
          ) : (
            /* Unfolded Vintage Parchment Letter */
            <div className="relative bg-[#fffdfa] text-stone-900 rounded-3xl p-8 sm:p-14 border-2 border-[#D4AF37]/50 shadow-[0_15px_60px_rgba(0,0,0,0.5)] animate-fadeIn">
              {/* Deckle Edge & Corner Floral Details */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#C5A36A] to-transparent" />

              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-amber-900/15 pb-4 mb-6">
                <div className="flex items-center gap-2 text-xs font-serif italic text-amber-900/70">
                  <Feather size={14} className="text-amber-700" />
                  <span>Written for {recipientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isTyping && (
                    <button
                      type="button"
                      onClick={handleSkipTyping}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono text-amber-800 bg-amber-100/80 hover:bg-amber-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Sparkles size={10} />
                      <span>Skip Typing ⏩</span>
                    </button>
                  )}
                  <div className="text-xs font-mono text-amber-900/70 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-amber-600" />
                    <span>{config.dateText || "Tonight & Always"}</span>
                  </div>
                </div>
              </div>

              {/* Salutation */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#420d18] mb-6 italic tracking-tight">
                {config.salutation || `My Dearest ${recipientName},`}
              </h3>

              {/* Letter Paragraphs with Typewriter Output */}
              <div className="space-y-5 font-serif text-stone-800 text-sm sm:text-base leading-relaxed tracking-wide min-h-[160px]">
                {displayedParagraphs.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed first-letter:text-2xl first-letter:font-bold first-letter:text-[#881337] first-letter:mr-0.5">
                    {paragraph}
                  </p>
                ))}
                {isTyping && (
                  <span className="inline-block w-1.5 h-4 bg-[#881337] animate-pulse ml-0.5" />
                )}
              </div>

              {/* Signoff, Signature & Wax Stamp Emblem */}
              <div className="mt-10 pt-6 border-t border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Wax Seal Stamp on Parchment */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#881337] to-[#4c0519] border border-amber-400/80 shadow-md flex flex-col items-center justify-center text-amber-200">
                    <Heart size={16} className="fill-amber-300 text-amber-300 mb-0.5" />
                    <span className="text-[7px] font-mono font-bold tracking-widest uppercase">
                      {config.waxSealText || "SEAL"}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-mono text-amber-900/60 uppercase tracking-wider">
                      AUTHENTICATED SEAL
                    </span>
                    <span className="font-serif text-xs italic text-stone-600">
                      Eternal promise from {senderName}
                    </span>
                  </div>
                </div>

                {/* Signature */}
                <div className="text-right">
                  <p className="font-serif text-xs sm:text-sm text-stone-600 italic mb-1">
                    {config.closing || "With all my love and devotion,"}
                  </p>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#5c1322] tracking-wide">
                    {config.signature || senderName}
                  </p>
                </div>
              </div>

              {/* Keepsake Actions */}
              <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveKeepsake}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300/80 text-xs font-serif font-bold text-amber-900 transition-colors cursor-pointer shadow-xs"
                >
                  {isCopied ? (
                    <>
                      <Check size={13} className="text-emerald-700" />
                      <span>Copied to Keepsake!</span>
                    </>
                  ) : (
                    <>
                      <Download size={13} className="text-amber-800" />
                      <span>Save Love Letter Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-500 hover:text-stone-800 underline transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Fold and re-seal letter</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
