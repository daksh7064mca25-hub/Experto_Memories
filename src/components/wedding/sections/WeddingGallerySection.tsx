"use client";

import React, { useState } from "react";
import { WeddingGalleryConfig, WeddingGalleryPhoto } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Image as ImageIcon, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  config: WeddingGalleryConfig;
  theme: WeddingThemeStyles;
}

export const WeddingGallerySection: React.FC<Props> = ({ config, theme }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const photos = config.photos || [];

  const openLightbox = (index: number) => setActivePhotoIndex(index);
  const closeLightbox = () => setActivePhotoIndex(null);

  const prevPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <ImageIcon size={13} className="text-[#D4AF37]" />
          <span>Cherished Frames</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {config.headline || "Portraits of Love"}
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {config.subtext}
        </p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => openLightbox(idx)}
            className={`group relative rounded-2xl overflow-hidden border shadow-lg cursor-pointer aspect-[3/4] bg-stone-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${theme.cardBorder}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption || "Wedding portrait"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Caption badge */}
            {photo.caption && (
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <p className="text-xs font-serif font-medium text-[#FAF7F2] drop-shadow-md">
                  {photo.caption}
                </p>
                {photo.category && (
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">
                    {photo.category}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && photos[activePhotoIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10 cursor-pointer"
          >
            <X size={22} />
          </button>

          {/* Nav buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition z-10 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activePhotoIndex].url}
              alt={photos[activePhotoIndex].caption || "Full portrait"}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            {photos[activePhotoIndex].caption && (
              <p className="font-serif text-sm sm:text-base text-stone-200 mt-4 text-center">
                {photos[activePhotoIndex].caption}
              </p>
            )}
            <p className="text-xs text-stone-400 mt-1">
              {activePhotoIndex + 1} of {photos.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
