"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Compass, CheckCircle2, Circle, Sparkles, MapPin, Heart } from "lucide-react";
import { AnniversaryBucketListConfig, BucketListItem, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryBucketListConfig;
  theme: ThemeId;
}

export function AnniversaryBucketListSection({ config, theme }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const themeConfig = getThemeConfig(theme, "anniversary");
  const items = config.items || [];

  // Load saved bucket list selections from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("em_anniv_bucket_list");
      if (saved) {
        setSelectedIds(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#f59e0b", "#10b981", "#ec4899"],
        });
      }
      try {
        localStorage.setItem("em_anniv_bucket_list", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  return (
    <section id="anniv-sec-bucket-list" className="py-16 px-4 max-w-3xl mx-auto select-none">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-amber-100 dark:bg-purple-950 text-amber-800 dark:text-purple-300 mb-2 border border-amber-200/80 dark:border-purple-800">
          Adventures Ahead 🧭
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100">
          {config.headline || "Our Next Adventures"}
        </h2>
        <p className="text-sm opacity-80 mt-2 max-w-md mx-auto font-sans leading-relaxed">
          {config.subtext ||
            "Tap the experiences you want us to check off next together!"}
        </p>
      </div>

      {/* Bucket List Grid */}
      <div className="space-y-3 px-2">
        {items.map((item, index) => {
          const isSelected = selectedIds.has(item.id);

          return (
            <div
              key={item.id || index}
              onClick={() => toggleItem(item.id)}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-300 flex items-center justify-between gap-4 border min-h-[56px] ${
                isSelected
                  ? "bg-amber-50/90 dark:bg-purple-950/60 border-amber-400 dark:border-purple-600 shadow-md scale-[1.01]"
                  : "bg-white/70 dark:bg-stone-900/60 border-stone-200/80 dark:border-stone-800 hover:bg-white/90"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "text-amber-600 dark:text-purple-400"
                      : "text-stone-300 dark:text-stone-600"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 size={24} className="fill-amber-100 dark:fill-purple-900" />
                  ) : (
                    <Circle size={24} />
                  )}
                </div>

                <div>
                  <h3
                    className={`font-serif text-base sm:text-lg text-stone-900 dark:text-purple-100 ${
                      isSelected ? "font-bold text-amber-950 dark:text-purple-50" : "font-normal"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.category && (
                    <span className="text-[10px] font-mono tracking-wider text-amber-700 dark:text-purple-300 uppercase">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs text-stone-400 shrink-0 font-serif italic">
                {isSelected ? "Selected ✓" : "Tap to pick"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-xs text-stone-500 dark:text-purple-300">
        Chosen {selectedIds.size} of {items.length} upcoming adventures 🌟
      </div>
    </section>
  );
}

