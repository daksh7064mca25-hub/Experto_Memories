"use client";

import React, { useState } from "react";
import { Heart, Sparkles, ShieldCheck, Check } from "lucide-react";
import { PromisesSectionConfig, PromiseCard, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: PromisesSectionConfig;
  theme: ThemeId;
}

export function PromisesSection({ config, theme }: Props) {
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];
  const promises = config.promises || [];

  const toggleOpen = (id: string) => {
    setOpenedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section id="sec-promises" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-rose-100 text-rose-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2">
          Written in Ink & Heart 📜
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
          {config.headline || "Sealed Promises"}
        </h2>
        <p className="text-sm sm:text-base opacity-80 mt-2 max-w-md mx-auto font-sans">
          {config.subtext || "Tap each wax seal to reveal a promise I am committed to keeping."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2">
        {promises.map((promise, index) => {
          const isOpen = openedIds.has(promise.id);
          const sealColor = promise.sealColor || "#e11d48";

          return (
            <div
              key={promise.id || index}
              onClick={() => toggleOpen(promise.id)}
              className="relative cursor-pointer min-h-[220px] rounded-2xl transition-all duration-500 perspective select-none group"
            >
              {/* Card Container */}
              <div
                className={`relative w-full h-full rounded-2xl p-6 transition-all duration-500 shadow-lg border flex flex-col justify-between ${
                  isOpen
                    ? "bg-[#fffdfa] dark:bg-stone-900 border-rose-300 dark:border-pink-800 scale-100"
                    : `${themeConfig.cardBgClass} hover:shadow-xl hover:scale-[1.02] active:scale-95`
                }`}
              >
                {!isOpen ? (
                  // Front: Sealed View
                  <div className="flex flex-col items-center justify-center my-auto text-center">
                    {/* 3D Wax Seal */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform"
                      style={{
                        background: `radial-gradient(circle, ${sealColor} 30%, #881337 100%)`,
                        boxShadow: `0 6px 16px ${sealColor}66`,
                      }}
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center">
                        <Heart className="w-6 h-6 fill-white text-white" />
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-rose-950 dark:text-pink-100 mb-1">
                      {promise.title}
                    </h3>
                    <span className="text-xs text-rose-500 dark:text-pink-400 font-serif italic">
                      Tap seal to unbreak & read
                    </span>
                  </div>
                ) : (
                  // Back: Unsealed Promise View
                  <div className="flex flex-col justify-between h-full animate-in fade-in duration-300">
                    <div>
                      <div className="flex items-center justify-between border-b border-rose-100 dark:border-pink-900/40 pb-2 mb-3">
                        <span className="text-xs font-serif font-semibold text-rose-600 dark:text-pink-400 flex items-center gap-1">
                          <ShieldCheck size={14} /> Promise #{index + 1}
                        </span>
                        <span className="text-[10px] text-stone-400">Tap to fold</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-rose-950 dark:text-pink-100 mb-2">
                        {promise.title}
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                        {promise.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-rose-100 dark:border-pink-900/40 flex items-center justify-between text-[11px] text-rose-500 dark:text-pink-400 font-serif italic">
                      <span>Held to heart</span>
                      <Check size={14} className="text-emerald-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

