"use client";

import React from "react";
import { WeddingStoryConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { BookOpen, Sparkles, Quote } from "lucide-react";

interface Props {
  config: WeddingStoryConfig;
  theme: WeddingThemeStyles;
}

export const WeddingStorySection: React.FC<Props> = ({ config, theme }) => {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <BookOpen size={13} className="text-[#D4AF37]" />
          <span>Our Journey</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {config.headline || "How Our Worlds Collided"}
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {config.subtext}
        </p>
      </div>

      {/* Quote Banner */}
      {config.quote && (
        <div className={`mb-12 rounded-2xl p-6 sm:p-8 border text-center relative overflow-hidden ${theme.cardBg} ${theme.cardBorder}`}>
          <Quote size={40} className="absolute top-2 left-4 text-[#D4AF37]/15 pointer-events-none" />
          <p className="font-serif text-lg sm:text-2xl italic text-[#FAF7F2] max-w-2xl mx-auto leading-relaxed relative z-10">
            {config.quote}
          </p>
        </div>
      )}

      {/* Narrative Story Paragraphs */}
      {(config.storyParagraphs || []).length > 0 && (
        <div className={`rounded-3xl p-6 sm:p-10 border shadow-xl mb-12 space-y-4 ${theme.cardBg} ${theme.cardBorder}`}>
          {config.storyParagraphs.map((p, idx) => (
            <p
              key={idx}
              className={`text-sm sm:text-base leading-relaxed font-serif ${
                idx === 0 ? "first-letter:font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-[#D4AF37] first-letter:mr-2 first-letter:float-left" : ""
              } ${theme.textSecondary}`}
            >
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Chapters Grid */}
      {(config.chapters || []).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.chapters?.map((chap, idx) => (
            <div
              key={chap.id || idx}
              className={`rounded-2xl p-6 border shadow-md flex flex-col items-center text-center transition hover:scale-[1.02] ${theme.cardBg} ${theme.cardBorder}`}
            >
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#D4AF37] mb-1 font-semibold">
                {chap.yearOrDate}
              </span>
              <h4 className={`font-serif text-lg font-bold mb-2 ${theme.textPrimary}`}>
                {chap.title}
              </h4>
              <p className={`text-xs leading-relaxed font-serif italic ${theme.textSecondary}`}>
                {chap.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
