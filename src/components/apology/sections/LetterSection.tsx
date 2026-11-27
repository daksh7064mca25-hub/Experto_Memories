"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, Feather } from "lucide-react";
import { LetterSectionConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: LetterSectionConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeId;
  typingStatus?: "waiting" | "writing" | "completed";
  onTypingStatusChange?: (status: "waiting" | "writing" | "completed") => void;
}

export function LetterSection({
  config,
  recipientName,
  senderName,
  theme,
  typingStatus = "writing",
  onTypingStatusChange,
}: Props) {
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];
  const fullText = (config.paragraphs || []).join("\n\n");

  const [displayedText, setDisplayedText] = useState(() => {
    if (!config.enableTypewriter || typingStatus === "completed") {
      return fullText;
    }
    return "";
  });

  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!config.enableTypewriter || typingStatus === "completed") {
      return fullText.length;
    }
    return 0;
  });

  // Handle external status changes (e.g. user clicks "Okay, tell me ❤️")
  useEffect(() => {
    if (!config.enableTypewriter) {
      Promise.resolve().then(() => {
        setDisplayedText(fullText);
        setCurrentIndex(fullText.length);
        setIsTyping(false);
      });
      return;
    }

    if (typingStatus === "waiting") {
      Promise.resolve().then(() => {
        setDisplayedText("");
        setCurrentIndex(0);
        setIsTyping(false);
      });
    } else if (typingStatus === "writing") {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      queueMicrotask(() => {
        if (prefersReducedMotion) {
          setDisplayedText(fullText);
          setCurrentIndex(fullText.length);
          setIsTyping(false);
          onTypingStatusChange?.("completed");
        } else {
          setIsTyping(true);
        }
      });
    } else if (typingStatus === "completed") {
      queueMicrotask(() => {
        setDisplayedText(fullText);
        setCurrentIndex(fullText.length);
        setIsTyping(false);
      });
    }
  }, [typingStatus, config.enableTypewriter, fullText, onTypingStatusChange]);

  // Gentle, emotional typewriter typing loop
  useEffect(() => {
    if (!config.enableTypewriter) return;
    if (!isTyping) return;

    if (currentIndex < fullText.length) {
      const char = fullText[currentIndex];

      // Natural cadence: subtle emotional pauses on punctuation and paragraph breaks
      let delay = 24;
      if (char === "." || char === "!" || char === "?") {
        delay = 180;
      } else if (char === "," || char === ";" || char === ":") {
        delay = 100;
      } else if (char === "\n") {
        delay = 180;
      }

      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      Promise.resolve().then(() => {
        setIsTyping(false);
        onTypingStatusChange?.("completed");
      });
    }
  }, [currentIndex, isTyping, fullText, config.enableTypewriter, onTypingStatusChange]);

  const toggleTyping = () => {
    if (currentIndex >= fullText.length) {
      // Replay
      setDisplayedText("");
      setCurrentIndex(0);
      setIsTyping(true);
      onTypingStatusChange?.("writing");
    } else {
      setIsTyping((prev) => !prev);
    }
  };

  const showAllText = () => {
    setDisplayedText(fullText);
    setCurrentIndex(fullText.length);
    setIsTyping(false);
    onTypingStatusChange?.("completed");
  };

  return (
    <section
      id="sec-letter"
      data-typing-status={typingStatus}
      className="py-16 px-4 max-w-2xl mx-auto"
    >
      {/* Paper Container */}
      <div
        className={`relative ${themeConfig.paperBgClass} rounded-2xl p-6 sm:p-10 shadow-2xl border transition-all duration-300`}
      >
        {/* Vintage postal stamp in corner */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 select-none opacity-80 pointer-events-none">
          <div className="w-14 h-16 border-2 border-dashed border-rose-300 dark:border-pink-800 rounded flex flex-col items-center justify-center p-1 rotate-3 bg-rose-50/50 dark:bg-rose-950/20">
            <Feather size={16} className="text-rose-400 mb-0.5" />
            <span className="text-[9px] font-mono tracking-widest text-rose-500 font-bold">AIR MAIL</span>
            <span className="text-[8px] font-mono text-rose-400">LOVE</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 border-b border-rose-200/50 pb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-serif font-medium bg-rose-100/70 text-rose-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2">
            A Letter From The Heart
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
            {config.headline || "I am truly, deeply sorry."}
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-rose-700 dark:text-pink-300 mt-2">
            {config.salutation || "My Dearest"} {recipientName},
          </p>
        </div>

        {/* Letter Body - Caveat handwritten look */}
        <div
          data-testid="letter-body"
          data-char-count={displayedText.length}
          className="font-handwriting text-2xl sm:text-3xl leading-relaxed text-stone-800 dark:text-rose-100 space-y-4 min-h-[160px] whitespace-pre-line tracking-wide"
        >
          {displayedText}
          {isTyping && <span className="inline-block w-1.5 h-6 bg-pink-500 animate-pulse ml-1 align-middle" />}
        </div>

        {/* Signoff */}
        <div className="mt-8 pt-6 border-t border-rose-200/50 flex flex-col items-end">
          <p className="font-handwriting text-2xl sm:text-3xl text-rose-800 dark:text-pink-200">
            {config.signoff || "Forever yours with all my love,"}
          </p>
          <p className="font-handwriting text-3xl sm:text-4xl font-bold text-rose-600 dark:text-pink-400 mt-1">
            {senderName} 🤍
          </p>
        </div>

        {/* Controls for typewriter */}
        {config.enableTypewriter && typingStatus !== "waiting" && (
          <div className="mt-6 pt-4 flex items-center justify-between border-t border-rose-100 dark:border-pink-950/40 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTyping}
                data-testid="letter-toggle-typing-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100/70 hover:bg-rose-200/80 dark:bg-pink-950/50 text-rose-800 dark:text-pink-200 transition-colors"
              >
                {currentIndex >= fullText.length ? (
                  <>
                    <RotateCcw size={13} />
                    <span>Replay Typing</span>
                  </>
                ) : isTyping ? (
                  <>
                    <Pause size={13} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={13} />
                    <span>Resume Typing</span>
                  </>
                )}
              </button>

              {currentIndex < fullText.length && (
                <button
                  type="button"
                  onClick={showAllText}
                  data-testid="letter-show-full-btn"
                  className="px-2 py-1.5 text-rose-600 dark:text-pink-300 hover:underline"
                >
                  Show full letter
                </button>
              )}
            </div>

            {config.audioNarrationUrl && (
              <a
                href={config.audioNarrationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800"
              >
                <Volume2 size={14} />
                <span>Audio Narration</span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
