"use client";

import React from "react";
import { WeddingStoryConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { BookOpen, Sparkles, Quote, Heart } from "lucide-react";

interface Props {
  config: WeddingStoryConfig;
  theme: WeddingThemeStyles;
}

export const WeddingStorySection: React.FC<Props> = ({ config, theme }) => {
  const quote = config.quote || (config as any).romanticQuote;
  const subtext =
    config.subtext ||
    "Every love story is sacred, but ours is our favorite blessing.";
  const paragraphs = config.storyParagraphs || [];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto" id="story-section">
      {/* Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <BookOpen size={13} className="text-[#D4AF37]" />
          <span>Our Sacred Journey</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {config.headline || "How Our Worlds Collided"}
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {subtext}
        </p>
      </div>

      {/* Quote Banner */}
      {quote && (
        <div className={`mb-12 rounded-3xl p-6 sm:p-10 border text-center relative overflow-hidden shadow-xl ${theme.cardBg} ${theme.cardBorder}`}>
          <Quote size={48} className="absolute top-3 left-4 text-[#D4AF37]/15 pointer-events-none" />
          <p className="font-serif text-lg sm:text-2xl italic text-[#FAF7F2] max-w-2xl mx-auto leading-relaxed relative z-10">
            {quote}
          </p>
        </div>
      )}

      {/* Narrative Story Paragraphs */}
      {paragraphs.length > 0 && (
        <div className={`rounded-3xl p-6 sm:p-10 border shadow-xl mb-12 space-y-4 ${theme.cardBg} ${theme.cardBorder}`}>
          {paragraphs.map((p, idx) => (
            <p
              key={idx}
              className={`text-sm sm:text-base leading-relaxed font-serif ${
                idx === 0
                  ? "first-letter:font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-[#D4AF37] first-letter:mr-2 first-letter:float-left"
                  : ""
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
          {config.chapters?.map((chap, idx) => {
            const yearText = chap.yearOrDate || (chap as any).year;
            const descText = chap.description || (chap as any).story;
            const photoUrl = chap.photoUrl;

            return (
              <div
                key={chap.id || idx}
                className={`rounded-2xl overflow-hidden border shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] ${theme.cardBg} ${theme.cardBorder}`}
              >
                {photoUrl && (
                  <div className="w-full h-44 overflow-hidden relative border-b border-[#D4AF37]/30 bg-stone-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={chap.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#D4AF37] mb-1 font-bold">
                    {yearText}
                  </span>
                  <h4 className={`font-serif text-lg font-bold mb-2 ${theme.textPrimary}`}>
                    {chap.title}
                  </h4>
                  <p className={`text-xs leading-relaxed font-serif italic mt-auto ${theme.textSecondary}`}>
                    {descText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
