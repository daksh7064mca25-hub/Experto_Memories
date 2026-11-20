"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, X, Eye } from "lucide-react";
import { AnniversaryMuseumConfig, AnniversaryMuseumExhibit, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryMuseumConfig;
  theme?: ThemeId;
}

const DEFAULT_EXHIBITS: AnniversaryMuseumExhibit[] = [
  {
    id: "ex-1",
    title: "Exhibit A: The Rainstorm Coffee",
    date: "October 2022",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    description: "Caught in an unexpected downpour, we ran laughing into that tiny café and talked until the streetlights came on.",
    tag: "Origin",
  },
  {
    id: "ex-2",
    title: "Exhibit B: Mountain Summit Sunset",
    date: "July 2023",
    photoUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    description: "After three hours of steep hiking, we sat on the rock ledge wrapped in one jacket, watching the sun dip into the valley.",
    tag: "Adventure",
  },
  {
    id: "ex-3",
    title: "Exhibit C: Midnight Road Trip",
    date: "December 2023",
    photoUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Windows down, playlist on repeat, singing every word at the top of our lungs while the highway stretched endlessly.",
    tag: "Memory",
  },
];

export function AnniversaryMuseumSection({ config, theme }: Props) {
  const themeConfig = getThemeConfig(theme || "pink-paradise", "anniversary");
  const exhibits = config.exhibits && config.exhibits.length > 0 ? config.exhibits : DEFAULT_EXHIBITS;
  const [activeExhibit, setActiveExhibit] = useState<AnniversaryMuseumExhibit | null>(null);

  return (
    <section
      id="anniv-sec-museum"
      className="relative py-16 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-3 shadow-xs">
        <Sparkles size={13} className="text-amber-600" />
        <span>Permanent Collection</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-2">
        {config.headline || "The Love Museum 🏛️"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-10">
        {config.subtext || "Curated moments and priceless artifacts from the journey of us. Tap any exhibit for curatorial notes."}
      </p>

      {/* Museum Exhibits Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
        {exhibits.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveExhibit(item)}
            className="group w-full max-w-xs rounded-3xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-103 hover:shadow-2xl text-left flex flex-col"
          >
            {/* Image Frame */}
            <div className="relative w-full aspect-4/3 bg-stone-100 overflow-hidden">
              <img
                src={item.photoUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80";
                }}
              />
              {item.tag && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider font-bold">
                  {item.tag}
                </div>
              )}
            </div>

            {/* Plaque / Description */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 mb-1 group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>
                {item.date && (
                  <p className="text-[11px] font-mono text-stone-400 mb-2">
                    {item.date}
                  </p>
                )}
                <p className="font-sans text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-serif font-semibold text-rose-500">
                <span>View Exhibit Plaque</span>
                <Eye size={13} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Focused Exhibit Modal */}
      {activeExhibit && (
        <div
          onClick={() => setActiveExhibit(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 text-left"
          >
            <button
              type="button"
              onClick={() => setActiveExhibit(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="Close Plaque"
            >
              <X size={16} />
            </button>

            <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 mb-4 border border-stone-200">
              <img
                src={activeExhibit.photoUrl}
                alt={activeExhibit.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {activeExhibit.title}
              </h3>
            </div>
            {activeExhibit.date && (
              <p className="text-xs font-mono text-amber-800 mb-3">
                {activeExhibit.date}
              </p>
            )}

            <p className="font-serif text-sm text-stone-700 leading-relaxed italic bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
              &ldquo;{activeExhibit.description}&rdquo;
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
