"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Calendar, Heart, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { AnniversaryTimelineConfig, TimelineMilestone, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { isProtectedMediaUrl } from "@/lib/media-utils";

interface Props {
  config: AnniversaryTimelineConfig;
  theme: ThemeId;
}

export function AnniversaryTimelineSection({ config, theme }: Props) {
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(
    config.milestones?.[0]?.id || null
  );
  const themeConfig = getThemeConfig(theme, "anniversary");
  const milestones = config.milestones || [];

  const toggleMilestone = (id: string) => {
    setExpandedMilestoneId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="anniv-sec-timeline" className="py-16 px-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-amber-100 dark:bg-purple-950 text-amber-800 dark:text-purple-300 mb-2 border border-amber-200/80 dark:border-purple-800">
          Our Love Story Timeline ⏳
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100">
          {config.headline || "How It All Began"}
        </h2>
        <p className="text-sm opacity-80 mt-2 max-w-md mx-auto font-sans leading-relaxed">
          {config.subtext ||
            "From strangers across a crowded cafe to two hearts beating as one."}
        </p>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-amber-300/80 dark:border-purple-700/80 ml-4 sm:ml-8 space-y-8">
        {milestones.map((item, index) => {
          const isExpanded = expandedMilestoneId === item.id;

          return (
            <div key={item.id || index} className="relative group">
              {/* Timeline Heart Marker Node */}
              <div
                onClick={() => toggleMilestone(item.id)}
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  isExpanded
                    ? "bg-amber-500 text-white scale-110 ring-4 ring-amber-100 dark:ring-purple-900"
                    : "bg-white dark:bg-stone-900 text-amber-600 dark:text-purple-400 border-2 border-amber-300 dark:border-purple-600 hover:scale-105"
                }`}
              >
                <Heart size={14} className="fill-current" />
              </div>

              {/* Milestone Card */}
              <div
                onClick={() => toggleMilestone(item.id)}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 border ${
                  isExpanded
                    ? `${themeConfig.cardBgClass} shadow-xl scale-[1.01] border-amber-300/80 dark:border-purple-600`
                    : "bg-white/70 dark:bg-stone-900/60 hover:bg-white/90 border-stone-200/70 dark:border-stone-800"
                }`}
              >
                {/* Milestone Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100/70 dark:bg-purple-950 text-amber-800 dark:text-purple-300 border border-amber-200/50">
                      {item.tag || `Chapter #${index + 1}`}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-purple-300 font-serif italic">
                      {item.date}
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? "Collapse memory" : "Expand memory"}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 min-h-[32px] min-w-[32px] flex items-center justify-center"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Milestone Title */}
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-purple-100 mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-purple-200 leading-relaxed">
                  {item.description}
                </p>

                {/* Expanded Photos/Media */}
                {isExpanded && item.photos && item.photos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-amber-100 dark:border-purple-900/40 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.photos.map((photoUrl, pIdx) => {
                        if (!photoUrl) return null;
                        return (
                          <div
                            key={pIdx}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-sm border border-stone-200/60"
                          >
                            <Image
                              src={photoUrl}
                              alt={`${item.title} photograph`}
                              fill
                              unoptimized={isProtectedMediaUrl(photoUrl)}
                              sizes="(max-width: 640px) 100vw, 300px"
                              className="object-cover"
                            />
                          </div>
                        );
                      })}
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

