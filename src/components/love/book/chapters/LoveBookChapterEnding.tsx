"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Share2, Book, CheckCircle2, MessageCircle } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    surpriseTitle?: string;
    surpriseBody?: string;
    photoUrl?: string;
    actionButtonText?: string;
    whatsappShareText?: string;
  };
  theme: ThemeConfig;
  onCloseBook: () => void;
}

export function LoveBookChapterEnding({
  recipientName,
  senderName,
  config,
  theme,
  onCloseBook,
}: Props) {
  const [isSealed, setIsSealed] = useState(false);

  const headline =
    config.headline ||
    "Out of all the people in this world, I'm still glad it's you ❤️";
  const subtext =
    config.subtext ||
    "Our story doesn't end on the final page of this book. The best chapters are yet to be written.";
  const promiseTitle = config.surpriseTitle || "My Eternal Promise To You";
  const promiseBody =
    config.surpriseBody ||
    "I promise to celebrate your victories as if they are my own, to hold you through the storms, to always leave you the last bite of dessert, and to choose you—every single morning—for the rest of my days.";

  const photoUrl =
    config.photoUrl ||
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80";

  const handleSealPromise = () => {
    setIsSealed(true);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#fb7185", "#e11d48", "#fbcfe8", "#fbbf24"],
      });
    } catch (e) {}
  };

  const handleWhatsAppReply = () => {
    const text = encodeURIComponent(
      config.whatsappShareText ||
        `I just read through our love story book and it made me so happy! I love you more than words can say! ❤️📖✨`
    );
    if (typeof window !== "undefined") {
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 font-serif text-stone-900 select-text overflow-y-auto">
      {/* Chapter Title */}
      <div className="text-center mb-3">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-800 font-bold block mb-1">
          The Climax
        </span>
        <h2 className="font-serif text-base sm:text-xl font-extrabold text-[#3a0d15] leading-tight max-w-sm mx-auto">
          {headline}
        </h2>
        <p className="font-serif text-[11px] sm:text-xs text-stone-600 italic mt-0.5 max-w-xs mx-auto leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Center Climax Spread */}
      <div className="my-auto max-w-sm mx-auto w-full text-center space-y-3">
        {/* Pinned Polaroid Photo */}
        <div className="relative inline-block bg-[#FFFDF9] p-2 rounded-lg shadow-md border border-stone-200 rotate-1">
          <div className="w-14 h-3.5 bg-amber-100/70 border border-white/60 absolute -top-1.5 left-1/2 -translate-x-1/2 -rotate-1" />
          <div className="relative w-44 sm:w-52 h-28 sm:h-32 rounded overflow-hidden bg-stone-100 mx-auto">
            <Image
              src={photoUrl}
              alt="Our eternal promise"
              fill
              className="object-cover"
              sizes="220px"
            />
          </div>
          <p className="font-handwriting text-[10px] text-stone-700 mt-1">
            Maya &amp; Dev • Forever &amp; Always
          </p>
        </div>

        {/* Promise Parchment Card */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
          <h4 className="font-serif text-xs font-bold text-[#3a0d15] mb-1">
            {promiseTitle}
          </h4>
          <p className="font-serif text-[11px] text-stone-700 italic leading-relaxed">
            &ldquo;{promiseBody}&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleSealPromise}
            disabled={isSealed}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-800 to-rose-900 text-rose-50 font-serif font-bold text-[11px] shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {isSealed ? (
              <>
                <CheckCircle2 size={12} className="text-amber-300" />
                <span>Promise Sealed Forever 💍</span>
              </>
            ) : (
              <>
                <Heart size={12} className="fill-current text-amber-300" />
                <span>{config.actionButtonText || "Seal Our Promise 💍"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppReply}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] text-white font-sans font-bold text-[11px] shadow-sm hover:bg-[#20ba5a] hover:scale-105 transition-all"
          >
            <MessageCircle size={12} />
            <span>Send Love Back</span>
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={onCloseBook}
            className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 hover:text-stone-800 mt-1"
          >
            <Book size={11} />
            <span>Close Book (Return to Cover)</span>
          </button>
        </div>
      </div>

      {/* Official ExpertoMemories Subtle Signature */}
      <div className="mt-2 pt-2 border-t border-amber-900/10 text-center">
        <p className="font-serif text-[10px] sm:text-[11px] text-[#6B3245]/80">
          Made with love by{" "}
          <a
            href="https://expertomemories.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#9E2A4B] hover:text-[#73273C] hover:underline underline-offset-2"
          >
            ExpertoMemories
          </a>
        </p>
        <span className="font-mono text-[8px] text-stone-400 block mt-0.5">
          Page 9 • Epilogue
        </span>
      </div>
    </div>
  );
}
