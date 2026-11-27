"use client";

import React, { useState, useEffect } from "react";
import { Mail, Heart, Feather, KeyRound, Check, Download, RotateCcw } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    waxSealText?: string;
    salutation?: string;
    letterBody?: string;
    closing?: string;
    signature?: string;
    dateText?: string;
  };
  theme: ThemeConfig;
}

export function LoveBookChapterLetter({
  recipientName,
  senderName,
  config,
  theme,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const headline = config.headline || "Chapter III • A Letter For You";
  const salutation = config.salutation || `My Dearest ${recipientName},`;
  const letterBody =
    config.letterBody ||
    `I wanted to write this because sometimes ordinary days move too fast, and I don't say the things that truly matter nearly often enough.

Before you, love was just a word in books and songs. With you, it became the comforting smell of fresh coffee on quiet mornings, the sound of your key in the door, and the deep peace that settles in my chest whenever you rest your head on my shoulder.

Thank you for choosing me. Thank you for your patience on my quiet days, your silly laughter on stressful days, and your hand in mine on every walk we take.

Wherever this life takes us, remember this: you will never have to face the world alone again. My heart is yours, today, tomorrow, and across every tomorrow that follows.`;

  const closing = config.closing || "With all my love and devotion,";
  const signature = config.signature || senderName;
  const dateText = config.dateText || "Tonight & Always";

  // Typing animation when unfolded
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
    });
    const interval = setInterval(() => {
      setTypedChars((prev) => {
        if (prev >= letterBody.length) {
          setIsTyping(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 3; // Smooth progressive typing speed
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isOpen, letterBody]);

  const handleSkipTyping = () => {
    setTypedChars(letterBody.length);
    setIsTyping(false);
  };

  const handleCopyKeepsake = () => {
    const fullText = `${salutation}\n\n${letterBody}\n\n${closing}\n${signature}\n${dateText}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const displayedText = isTyping
    ? letterBody.substring(0, typedChars)
    : letterBody;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 font-serif text-stone-900 select-text overflow-y-auto">
      {/* Chapter Title */}
      <div className="mb-3">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-800 font-bold block mb-1">
          Private Envelope
        </span>
        <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-[#3a0d15] leading-tight">
          {headline}
        </h2>
      </div>

      {/* Sealed Envelope vs. Unfolded Parchment */}
      <div className="my-auto">
        {!isOpen ? (
          /* Sealed Mounted Envelope Card */
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
            className="group cursor-pointer select-none max-w-sm mx-auto bg-gradient-to-b from-[#FAF4E8] via-[#F5EDDC] to-[#EBDCC5] rounded-2xl p-6 sm:p-8 border-2 border-amber-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center relative"
          >
            {/* Top Envelope Flap Triangle */}
            <div className="absolute top-0 inset-x-0 h-10 bg-amber-100/70 border-b border-amber-300/80 rounded-t-2xl shadow-xs" />

            {/* Mounted Wax Seal Button */}
            <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-2 border-amber-400 shadow-[0_0_20px_rgba(244,63,94,0.35)] flex flex-col items-center justify-center text-amber-200 mb-4 group-hover:scale-110 transition-transform">
              <Heart size={20} className="fill-amber-300 text-amber-300 animate-pulse mb-0.5" />
              <span className="font-mono text-[8px] font-bold tracking-widest text-amber-200 uppercase">
                {config.waxSealText || "FOREVER"}
              </span>
            </div>

            <h3 className="relative z-10 font-serif text-base sm:text-lg font-bold text-[#3a0d15] mb-1">
              Handcrafted Wax-Sealed Letter
            </h3>
            <p className="relative z-10 text-[11px] font-serif italic text-stone-600 mb-4">
              Addressed to {recipientName} • Tap to break seal &amp; unfold
            </p>

            <button
              type="button"
              className="relative z-10 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-[10px] uppercase tracking-wider shadow-md group-hover:scale-105 transition-transform"
            >
              <KeyRound size={11} />
              <span>Break The Wax Seal</span>
            </button>
          </div>
        ) : (
          /* Unfolded Parchment Letter with Typing Animation */
          <div className="relative bg-[#FFFDF9] rounded-xl p-4 sm:p-6 border border-amber-200/90 shadow-inner max-h-[360px] sm:max-h-[400px] overflow-y-auto">
            {/* Top Bar with Controls */}
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-[11px] font-serif italic text-amber-900/70">
                <Feather size={12} className="text-amber-700" />
                <span>Written for {recipientName}</span>
              </div>
              <div className="flex items-center gap-2">
                {isTyping && (
                  <button
                    type="button"
                    onClick={handleSkipTyping}
                    className="text-[10px] font-mono text-rose-700 hover:text-rose-900 font-bold"
                  >
                    Skip Typing ⏩
                  </button>
                )}
                <span className="text-[10px] font-mono text-stone-400">{dateText}</span>
              </div>
            </div>

            {/* Salutation */}
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#3a0d15] mb-2 italic">
              {salutation}
            </h4>

            {/* Letter Body */}
            <div className="font-serif text-xs text-stone-800 leading-relaxed whitespace-pre-line space-y-2">
              {displayedText}
              {isTyping && <span className="inline-block w-1.5 h-3 bg-rose-600 animate-pulse ml-0.5" />}
            </div>

            {/* Closing & Handwritten Signature */}
            <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-end justify-between">
              <div>
                <p className="font-serif text-[11px] italic text-stone-600">{closing}</p>
                <p className="font-handwriting text-lg sm:text-xl font-bold text-rose-900 mt-0.5">
                  {signature}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyKeepsake}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] text-stone-700 transition-colors"
                >
                  {isCopied ? <Check size={11} className="text-emerald-600" /> : <Download size={11} />}
                  <span>{isCopied ? "Saved!" : "Save"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                  title="Fold back into envelope"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Annotation */}
      <div className="mt-2 pt-2 border-t border-amber-900/10 flex items-center justify-between text-[10px] text-stone-500 italic">
        <span className="font-handwriting text-xs text-rose-800">
          &ldquo;From my heart to yours, always.&rdquo;
        </span>
        <span className="font-mono text-[9px]">Page 4</span>
      </div>
    </div>
  );
}
