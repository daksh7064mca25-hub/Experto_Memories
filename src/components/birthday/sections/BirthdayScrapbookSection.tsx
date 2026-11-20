"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, X, Image as ImageIcon, Calendar } from "lucide-react";
import { BirthdayScrapbookConfig, PolaroidPhoto, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayScrapbookConfig;
  theme?: ThemeId;
}

export function BirthdayScrapbookSection({ config, theme }: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const photos = config.photos || [];
  const [activePhoto, setActivePhoto] = useState<PolaroidPhoto | null>(null);

  return (
    <section
      id="bday-sec-scrapbook"
      className="relative min-h-[85vh] py-16 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center select-none"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-2">
          <Sparkles size={13} className="text-amber-600" />
          <span>Golden Memories</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2">
          {config.headline || "The Birthday Scrapbook 📸"}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          {config.subtext || "Moments frozen in time that capture your joy, your adventures, and the laughter we share."}
        </p>
      </div>

      {/* Polaroid Gallery Grid */}
      {photos.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {photos.map((photo, index) => {
            const rotation = photo.rotation ?? (index % 2 === 0 ? -2 : 2.5);
            return (
              <div
                key={photo.id || index}
                onClick={() => setActivePhoto(photo)}
                className="group relative cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 active:scale-98"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {/* Washi Tape Accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/70 border border-amber-300/40 rounded-xs shadow-xs z-10 rotate-1 backdrop-blur-xs" />

                {/* Polaroid Frame */}
                <div className="w-64 sm:w-68 p-3 pb-5 rounded-2xl bg-[#fffefc] border border-stone-200/90 shadow-xl shadow-stone-900/10 flex flex-col items-center">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                    <img
                      src={photo.url}
                      alt={photo.caption || "Birthday Memory"}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback image
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>

                  {/* Caption & Date */}
                  <div className="w-full text-center px-2">
                    <p className="font-serif font-bold text-xs sm:text-sm text-stone-800 line-clamp-2 leading-snug">
                      {photo.caption || "A cherished moment"}
                    </p>
                    {photo.date && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-400 mt-1">
                        <Calendar size={10} />
                        <span>{photo.date}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-dashed border-amber-300 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <ImageIcon size={22} />
          </div>
          <h3 className="font-serif font-bold text-sm text-stone-800 mb-1">
            Awaiting Birthday Memories
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Upload your favorite photos in the editor to showcase sweet moments here!
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>

            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 mb-4">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || "Expanded Memory"}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="font-serif font-bold text-base text-stone-900 text-center mb-1">
              {activePhoto.caption || "Birthday Memory"}
            </p>
            {activePhoto.date && (
              <p className="text-xs font-mono text-stone-400 text-center">
                {activePhoto.date}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
