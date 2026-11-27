"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, MessageCircle, Clock, Sparkles, Send } from "lucide-react";
import { FinalApologyConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: FinalApologyConfig;
  senderName: string;
  theme: ThemeId;
}

export function FinalApologySection({ config, senderName, theme }: Props) {
  const [response, setResponse] = useState<"accepted" | "paused" | null>(null);
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  const handleAccept = () => {
    setResponse("accepted");
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.65 },
      colors: ["#ec4899", "#f43f5e", "#fda4af", "#e879f9"],
    });
  };

  const handlePause = () => {
    setResponse("paused");
  };

  return (
    <section id="sec-final-apology" className="py-20 px-4 max-w-xl mx-auto text-center">
      <div className={`${themeConfig.cardBgClass} rounded-3xl p-8 sm:p-10 shadow-2xl border relative overflow-hidden`}>
        {/* Decorative corner stars */}
        <div className="absolute top-4 left-4 text-pink-300">✦</div>
        <div className="absolute top-4 right-4 text-pink-300">✦</div>

        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-rose-500">
          <Heart className="w-7 h-7 fill-rose-500 text-rose-500 animate-pulse" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100 mb-3">
          {config.headline || "Looking Ahead"}
        </h2>

        <p className="font-sans text-sm sm:text-base opacity-85 leading-relaxed mb-8 max-w-md mx-auto">
          {config.message ||
            "I can't undo what happened, but I hope we can make a better tomorrow. What does your heart say?"}
        </p>

        {response === null && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
            <button
              type="button"
              onClick={handleAccept}
              className={`w-full sm:w-auto px-7 py-4 rounded-full font-serif font-bold text-base transition-transform active:scale-95 shadow-lg ${themeConfig.primaryButtonClass}`}
            >
              {config.acceptButtonText || "Yes, let's talk ❤️"}
            </button>

            <button
              type="button"
              onClick={handlePause}
              className={`w-full sm:w-auto px-7 py-4 rounded-full font-serif font-semibold text-base transition-transform active:scale-95 ${themeConfig.secondaryButtonClass}`}
            >
              {config.pauseButtonText || "I need some time 💗"}
            </button>
          </div>
        )}

        {/* Accepted Response Experience */}
        {response === "accepted" && (
          <div className="mt-4 p-6 rounded-2xl bg-gradient-to-b from-rose-50 to-pink-100/70 dark:bg-pink-950/40 border border-pink-200 text-rose-950 dark:text-pink-100 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-200/70 dark:bg-pink-900 flex items-center justify-center text-rose-600">
              <Sparkles size={24} className="animate-spin-slow" />
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl mb-2">
              {config.acceptedResponseTitle || "Thank you for opening your heart 🌸"}
            </h3>
            <p className="font-sans text-sm opacity-90 leading-relaxed mb-5 max-w-md mx-auto">
              {config.acceptedResponseMessage ||
                "I’m ready whenever you are. Let’s talk, cuddle, and make everything sweet again."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I read your letter, ${senderName}. Let's talk ❤️`)}`}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-serif font-semibold text-sm ${themeConfig.primaryButtonClass}`}
              >
                <MessageCircle size={16} />
                <span>Text {senderName} On WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setResponse(null)}
                className="text-xs text-rose-600 hover:underline py-2"
              >
                Change response
              </button>
            </div>
          </div>
        )}

        {/* Paused Response Experience - Respectful & Caring */}
        {response === "paused" && (
          <div className="mt-4 p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 animate-in zoom-in-95 duration-300 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
              <Clock size={22} />
            </div>
            <h3 className="font-serif font-bold text-xl mb-2 text-rose-950 dark:text-pink-100">
              {config.pausedResponseTitle || "I respect your space completely 🤍"}
            </h3>
            <p className="font-sans text-sm opacity-85 leading-relaxed mb-5 max-w-md mx-auto">
              {config.pausedResponseMessage ||
                "Please take all the time you need. I will be here patiently, loving you just the same."}
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setResponse("accepted")}
                className={`px-5 py-2.5 rounded-full font-serif font-semibold text-xs ${themeConfig.primaryButtonClass}`}
              >
                Actually, I&apos;m ready to talk ❤️
              </button>

              <button
                type="button"
                onClick={() => setResponse(null)}
                className="text-xs text-stone-500 hover:underline"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}

