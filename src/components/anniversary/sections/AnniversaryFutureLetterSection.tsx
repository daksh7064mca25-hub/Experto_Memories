"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Mail, Heart, Sparkles, Feather, Check, RotateCcw, FastForward } from "lucide-react";
import { AnniversaryFutureLetterConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryFutureLetterConfig;
  partner1Name?: string;
  partner2Name?: string;
  theme?: ThemeId;
}

const DEFAULT_PARAGRAPHS = [
  "As we celebrate where we are today, my heart is overflowing with gratitude for everything you are and excitement for everything that still awaits us.",
  "I picture the cozy home we'll continue building, the morning coffees on sunlit balconies, the spontaneous weekend getaways, and the quiet comfort of being by each other's side through every season of life.",
  "Thank you for being my anchor, my best friend, and my greatest adventure. I promise to keep dating you, cherishing you, and choosing you forever.",
];

const DEFAULT_PROMISES = [
  "I promise to always hold your hand when walking together.",
  "I promise to make you laugh when life gets too serious.",
  "I promise to never stop listening with an open heart.",
];

export function AnniversaryFutureLetterSection({
  config,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme = "pink-paradise",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedCharIndex, setTypedCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const themeConfig = getThemeConfig(theme, "anniversary");

  const paragraphs =
    config.letterBody && config.letterBody.length > 0 ? config.letterBody : DEFAULT_PARAGRAPHS;
  const promises =
    config.promises && config.promises.length > 0 ? config.promises : DEFAULT_PROMISES;

  // Full letter text combined with paragraph breaks
  const fullText = paragraphs.join("\n\n");
  const totalChars = fullText.length;

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live typewriter effect
  useEffect(() => {
    if (!isOpen) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      Promise.resolve().then(() => {
        setTypedCharIndex(0);
        setIsTypingComplete(false);
      });
      return;
    }

    if (isTypingComplete) return;

    typingTimerRef.current = setInterval(() => {
      setTypedCharIndex((prev) => {
        if (prev + 1 >= totalChars) {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setIsTypingComplete(true);
          return totalChars;
        }
        return prev + 1;
      });
    }, 24);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [isOpen, isTypingComplete, totalChars]);

  const handleOpenLetter = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTypedCharIndex(0);
      setIsTypingComplete(false);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0"],
      });
    }
  };

  const handleSkipTyping = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setTypedCharIndex(totalChars);
    setIsTypingComplete(true);
  };

  const handleReplayTyping = () => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setTypedCharIndex(0);
    setIsTypingComplete(false);
  };

  // Convert current typed slice back into paragraphs for rendering
  const currentTypedText = fullText.slice(0, typedCharIndex);
  const renderedParagraphs = currentTypedText.split("\n\n");

  return (
    <section id="anniv-sec-future-letter" className="py-14 sm:py-20 px-4 max-w-2xl mx-auto select-none">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-white/90 text-[#6B2D38] border border-[#E8B4B8]/60 shadow-sm mb-3">
          <Mail size={13} className="text-[#C46879]" />
          <span>A Letter From My Heart</span>
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3D262A]">
          {config.headline || "To My Forever Person"}
        </h2>
        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 mt-2 max-w-md mx-auto leading-relaxed">
          {config.envelopeTeaser || "Tap the wax seal below to unfold my letter to you..."}
        </p>
      </div>

      {!isOpen ? (
        /* Sealed Love Letter Envelope View */
        <div
          onClick={handleOpenLetter}
          className="cursor-pointer group relative mx-auto w-full max-w-[380px] aspect-[4/3] rounded-3xl p-6 bg-[#FFF5F6] border-2 border-[#E8B4B8] shadow-2xl shadow-[#6B2D38]/15 flex flex-col items-center justify-center text-center transition-all hover:scale-105 active:scale-95"
        >
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF6F0] via-transparent to-[#FCE8EB] rounded-3xl pointer-events-none" />

          {/* Heart Wax Seal */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#8C3A49] via-[#6B2D38] to-[#4A1D25] border-2 border-[#E8B4B8] flex items-center justify-center shadow-xl shadow-[#6B2D38]/40 mb-4 group-hover:scale-110 transition-transform">
            <Heart size={24} className="fill-rose-100 text-rose-100" />
            <div className="absolute -inset-1 rounded-full bg-[#C46879]/20 animate-ping pointer-events-none" />
          </div>

          <h3 className="relative font-serif font-bold text-lg sm:text-xl text-[#3D262A] mb-1">
            For {partner1Name}
          </h3>

          <span className="relative font-serif italic text-xs text-[#6B2D38]">
            Tap wax seal to unfold letter
          </span>

          <span className="relative mt-2 text-[10px] font-mono text-[#6B2D38]/70">
            From {partner2Name}
          </span>
        </div>
      ) : (
        /* Unfolded Letter Paper View */
        <div className="relative bg-[#FAF6F0] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E8B4B8]/80 text-[#3D262A] transition-all animate-in fade-in zoom-in-95 duration-500">
          {/* Vintage Postmark Stamp */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-75 pointer-events-none">
            <div className="w-14 h-16 border-2 border-dashed border-[#C46879]/60 rounded-lg flex flex-col items-center justify-center p-1 rotate-2">
              <Feather size={14} className="text-[#C46879]" />
              <span className="text-[8px] font-mono tracking-widest font-bold text-[#6B2D38] mt-1">
                SEALED
              </span>
            </div>
          </div>

          {/* Salutation */}
          <p className="font-serif italic font-bold text-xl sm:text-2xl text-[#6B2D38] mb-4">
            My Dearest {partner1Name},
          </p>

          {/* Letter Body Paragraphs with Live Typing */}
          <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed text-[#3D262A]/90 min-h-[160px]">
            {renderedParagraphs.map((p, idx) => (
              <p
                key={idx}
                className="first-letter:text-2xl first-letter:font-bold first-letter:text-[#6B2D38]"
              >
                {p}
                {idx === renderedParagraphs.length - 1 && !isTypingComplete && (
                  <span className="inline-block w-1.5 h-4 bg-[#C46879] animate-pulse ml-0.5 align-middle" />
                )}
              </p>
            ))}
          </div>

          {/* Typing Controls Bar */}
          <div className="mt-4 flex items-center justify-between border-t border-[#E8B4B8]/40 pt-3">
            {!isTypingComplete ? (
              <button
                onClick={handleSkipTyping}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif text-[#6B2D38] hover:text-[#3D262A] bg-white/70 hover:bg-white border border-[#E8B4B8]/50 shadow-2xs transition-all"
              >
                <FastForward size={12} />
                <span>Skip Typing</span>
              </button>
            ) : (
              <button
                onClick={handleReplayTyping}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif text-[#6B2D38] hover:text-[#3D262A] bg-white/70 hover:bg-white border border-[#E8B4B8]/50 shadow-2xs transition-all"
              >
                <RotateCcw size={12} />
                <span>Replay Letter</span>
              </button>
            )}

            <span className="text-[10px] font-mono text-[#6B2D38]/60">
              {isTypingComplete ? "Letter Complete" : "Writing live..."}
            </span>
          </div>

          {/* Promises Checklist (Visible once typing done or skipped) */}
          {promises && promises.length > 0 && isTypingComplete && (
            <div className="mt-6 pt-6 border-t border-[#E8B4B8]/60 animate-in fade-in duration-300">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#6B2D38] mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-[#C46879]" />
                <span>My Vows & Promises To You</span>
              </h4>
              <ul className="space-y-2.5">
                {promises.map((promise, pIdx) => (
                  <li
                    key={pIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-[#3D262A]/90"
                  >
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-[#FFF5F6] border border-[#E8B4B8] flex items-center justify-center shrink-0 text-[#C46879]">
                      <Check size={11} />
                    </span>
                    <span>{promise}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Signoff */}
          <div className="mt-8 pt-4 text-right">
            <p className="font-serif italic text-xs sm:text-sm text-[#6B2D38]">
              {config.signoff || "Yours through all our tomorrows,"}
            </p>
            <p className="font-serif font-bold text-base sm:text-lg text-[#3D262A] mt-0.5">
              {partner2Name}
            </p>
          </div>

          {/* Re-fold Button */}
          <div className="mt-6 pt-4 border-t border-[#E8B4B8]/40 flex justify-center">
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-serif text-[#6B2D38] hover:text-[#3D262A] transition-colors"
            >
              <RotateCcw size={12} />
              <span>Fold Letter Back</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
