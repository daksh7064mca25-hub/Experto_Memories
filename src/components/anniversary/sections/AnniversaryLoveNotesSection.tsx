"use client";

import React, { useState } from "react";
import { Heart, Sparkles, Home, Shield, Star, Smile, Gift } from "lucide-react";
import { AnniversaryLoveNotesConfig, AnniversaryLoveNote, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryLoveNotesConfig;
  theme: ThemeId;
}

export function AnniversaryLoveNotesSection({ config, theme }: Props) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const themeConfig = getThemeConfig(theme, "anniversary");
  const notes = config.notes || [];

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getNoteIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "home":
        return <Home size={20} />;
      case "shield":
        return <Shield size={20} />;
      case "star":
        return <Star size={20} />;
      case "smile":
        return <Smile size={20} />;
      case "gift":
        return <Gift size={20} />;
      default:
        return <Heart size={20} className="fill-current" />;
    }
  };

  return (
    <section id="anniv-sec-love-notes" className="py-16 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-rose-100 dark:bg-purple-950 text-rose-800 dark:text-purple-300 mb-2 border border-rose-200/80 dark:border-purple-800">
          Daily Devotion 💌
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100">
          {config.headline || "Reasons I Choose You, Every Day"}
        </h2>
        <p className="text-sm opacity-80 mt-2 max-w-md mx-auto font-sans leading-relaxed">
          {config.subtext ||
            "Tap each card to reveal the little truths I carry in my heart."}
        </p>
      </div>

      {/* Love Note Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-2">
        {notes.map((note, index) => {
          const isRevealed = revealedIds.has(note.id);

          return (
            <div
              key={note.id || index}
              onClick={() => toggleReveal(note.id)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 transform active:scale-98 border min-h-[140px] flex flex-col justify-between ${
                isRevealed
                  ? `${themeConfig.cardBgClass} shadow-xl scale-[1.01] border-rose-300 dark:border-purple-600`
                  : "bg-white/70 dark:bg-stone-900/60 backdrop-blur-sm border-dashed border-rose-200 dark:border-purple-900/60 hover:bg-white/90"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon Button */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-sm ${
                    isRevealed
                      ? "bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-rose-300/40"
                      : "bg-rose-100 dark:bg-purple-950 text-rose-600 dark:text-purple-300"
                  }`}
                >
                  {getNoteIcon(note.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-purple-100 break-words">
                      {note.title}
                    </h3>
                    <span className="text-[11px] text-rose-500 dark:text-purple-300 font-serif italic shrink-0">
                      {isRevealed ? "Open" : "Tap note"}
                    </span>
                  </div>

                  {isRevealed ? (
                    <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-purple-200 leading-relaxed mt-2 animate-in fade-in duration-300 break-words">
                      {note.content}
                    </p>
                  ) : (
                    <p className="text-xs text-stone-400 italic mt-1 font-serif break-words">
                      A whisper of love locked inside...
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

