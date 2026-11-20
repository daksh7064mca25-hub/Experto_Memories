"use client";

import React, { useState } from "react";
import { Heart, Sparkles, CheckCircle2, MessageCircleHeart } from "lucide-react";
import { LoveQuestionConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveQuestionConfig;
  recipientName: string;
  theme: ThemeConfig;
}

export function LoveQuestionSection({ config, recipientName, theme }: Props) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  const selectedAnswer =
    config.answers?.find((a) => a.id === selectedAnswerId) || null;

  return (
    <section id="sec-love-question" className="py-16 sm:py-20 px-4 relative">
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <MessageCircleHeart size={11} />
            <span>Interactive Heart Check</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "A Question From The Heart"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Before we venture deeper into our world, tell me what you feel..."}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-[#24060c]/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-amber-400/30 shadow-2xl shadow-rose-950/80 relative overflow-hidden">
          {/* Subtle gold foil accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          <div className="text-center mb-8">
            <span className="text-3xl sm:text-4xl block mb-3 animate-pulse">💭</span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-rose-100 leading-snug">
              {config.questionText || `Do you know how much you mean to me, ${recipientName}?`}
            </h3>
            <p className="text-[11px] text-amber-300/80 font-mono mt-1">
              Tap the answer that speaks to your heart:
            </p>
          </div>

          {/* Interactive Answer Choices */}
          <div className="space-y-3">
            {config.answers?.map((ans, idx) => {
              const isSelected = selectedAnswerId === ans.id;
              return (
                <button
                  key={ans.id || idx}
                  type="button"
                  onClick={() => setSelectedAnswerId(ans.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? "bg-gradient-to-r from-[#4d0f1b] to-[#3a0a13] border-amber-400 text-amber-200 shadow-lg shadow-rose-950 scale-[1.01]"
                      : "bg-[#180307]/70 border-rose-900/50 text-rose-200 hover:border-amber-400/50 hover:bg-[#20050b]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-rose-950/90 border border-amber-400/30 flex items-center justify-center text-xs font-mono text-amber-300 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-serif font-medium leading-relaxed">
                      {ans.label}
                    </span>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isSelected ? (
                      <CheckCircle2 size={18} className="text-amber-300" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-rose-800 group-hover:border-amber-400/60" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Revealed Response Box */}
          {selectedAnswer && (
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#380913]/90 border border-amber-400/40 shadow-inner animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm mb-2">
                <Sparkles size={14} className="animate-spin-slow" />
                <span>{selectedAnswer.responseTitle || "You found it..."}</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-100 font-serif leading-relaxed mb-4">
                {selectedAnswer.responseMessage}
              </p>
              <div className="pt-3 border-t border-rose-900/60 flex items-center justify-between text-[11px] text-amber-300/80 font-mono">
                <span>{config.finalReveal || "My answer: Unconditionally and endlessly."}</span>
                <Heart size={12} className="fill-rose-500 text-rose-500 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
