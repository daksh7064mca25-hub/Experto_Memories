"use client";

import React, { useState } from "react";
import { Heart, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { ReadyCheckSectionConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: ReadyCheckSectionConfig;
  theme: ThemeId;
  onAccept?: () => void;
}

export function ReadyCheckSection({ config, theme, onAccept }: Props) {
  const [response, setResponse] = useState<"accepted" | "waiting" | null>(null);
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  const handleAccept = () => {
    if (response === "accepted") return;
    setResponse("accepted");
    onAccept?.();
    const letterElem = document.getElementById("sec-letter");
    if (letterElem) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      setTimeout(() => {
        letterElem.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }, 500);
    }
  };

  const handleWait = () => {
    setResponse("waiting");
  };

  return (
    <section
      id="sec-ready-check"
      className="py-16 px-4 max-w-xl mx-auto text-center"
    >
      <div className={`${themeConfig.cardBgClass} rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300`}>
        {/* Decorative corner stars */}
        <div className="absolute top-3 left-4 text-pink-300">✦</div>
        <div className="absolute top-4 right-4 text-pink-300">✦</div>

        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/60 flex items-center justify-center text-pink-500">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
          {config.question || "Before I say anything... can you hear me out?"}
        </h2>

        <p className="text-sm sm:text-base opacity-80 mb-6 font-sans leading-relaxed">
          {config.subtext || "Take a deep breath. No pressure, just honest words from my heart."}
        </p>

        {response === null && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={handleAccept}
              data-testid="ready-accept-btn"
              className={`w-full sm:w-auto px-6 py-3.5 rounded-full font-serif font-semibold text-base transition-transform active:scale-95 ${themeConfig.primaryButtonClass}`}
            >
              {config.acceptButtonText || "Okay, tell me ❤️"}
            </button>

            <button
              type="button"
              onClick={handleWait}
              data-testid="ready-wait-btn"
              className={`w-full sm:w-auto px-6 py-3.5 rounded-full font-serif font-medium text-base transition-transform active:scale-95 ${themeConfig.secondaryButtonClass}`}
            >
              {config.waitButtonText || "Let me think..."}
            </button>
          </div>
        )}

        {response === "waiting" && (
          <div className="mt-4 p-5 rounded-2xl bg-pink-50/90 dark:bg-pink-950/40 border border-pink-200/80 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-pink-300 font-serif font-semibold mb-2">
              <Clock size={18} />
              <span>Take All The Time You Need</span>
            </div>
            <p className="text-sm text-rose-900/80 dark:text-pink-200/90 leading-relaxed mb-4">
              {config.waitMessage ||
                "Take all the time you need. I'm right here whenever you feel ready to listen. 🤍"}
            </p>
            <button
              type="button"
              onClick={handleAccept}
              data-testid="ready-resume-btn"
              className={`px-5 py-2.5 rounded-full text-xs font-serif font-semibold ${themeConfig.primaryButtonClass}`}
            >
              I&apos;m ready now, show me the letter 🌸
            </button>
          </div>
        )}

        {response === "accepted" && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2 text-sm font-medium animate-in fade-in">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span>Thank you for opening your heart. Scrolling to my letter...</span>
          </div>
        )}
      </div>
    </section>
  );
}

