"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar, ZoomIn, Heart } from "lucide-react";
import { AnniversaryGalleryConfig, PolaroidPhoto, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { isProtectedMediaUrl } from "@/lib/media-utils";

interface Props {
  config: AnniversaryGalleryConfig;
  theme: ThemeId;
}

export function AnniversaryGallerySection({ config, theme }: Props) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const themeConfig = getThemeConfig(theme, "anniversary");
  const photos = config.photos || [];

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
  };

  return (
    <section id="anniv-sec-gallery" className="py-16 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-amber-100 dark:bg-purple-950 text-amber-800 dark:text-purple-300 mb-2 border border-amber-200/80 dark:border-purple-800">
          Our Cherished Moments 📸
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100">
          {config.headline || "Moments Frozen in Time"}
        </h2>
        <p className="text-sm opacity-80 mt-2 max-w-md mx-auto font-sans leading-relaxed">
          {config.subtext ||
            "A scrapbook of the spontaneous, cozy, and silly moments that define our love."}
        </p>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 px-2 sm:px-6">
        {photos.map((photo, index) => {
          const rot = photo.rotation ?? (index % 2 === 0 ? -2 : 3);

          return (
            <div
              key={photo.id || index}
              onClick={() => openLightbox(index)}
              className="relative cursor-pointer group transition-all duration-300 transform hover:scale-[1.03] active:scale-95 flex flex-col items-center"
              style={{
                transform: `rotate(${rot}deg)`,
              }}
            >
              {/* Washi Tape Accent at Top */}
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-200/85 dark:bg-purple-800/80 backdrop-blur-sm z-20 shadow-sm border-t border-b border-amber-300/40"
                style={{
                  clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
                }}
              />

              {/* Polaroid Frame */}
              <div className="bg-white dark:bg-stone-900 p-3.5 sm:p-4 pb-5 sm:pb-6 rounded-xl shadow-xl border border-stone-200/80 dark:border-stone-800 w-full max-w-[320px] mx-auto">
                {/* Photo Image Canvas */}
                <div className="relative aspect-square w-full rounded overflow-hidden bg-stone-100 dark:bg-stone-800 mb-3">
                  <Image
                    src={photo.url}
                    alt={photo.caption || "Special anniversary memory"}
                    fill
                    unoptimized={isProtectedMediaUrl(photo.url)}
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Tap hint icon */}
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={14} />
                  </div>
                </div>

                {/* Handwritten Caption & Date */}
                <div className="text-center px-1 min-w-0">
                  <p className="font-handwriting text-xl sm:text-3xl text-stone-800 dark:text-stone-100 line-clamp-2 leading-snug break-words">
                    {photo.caption}
                  </p>
                  {photo.date && (
                    <span className="font-serif italic text-xs text-amber-600 dark:text-purple-400 mt-1 inline-block break-words">
                      {photo.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          {/* Close button (min 44px touch target) */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close photo preview"
            className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors flex items-center justify-center"
          >
            <X size={22} />
          </button>

          {/* Left Arrow (min 44px touch target) */}
          <button
            type="button"
            onClick={prevPhoto}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 z-50 w-11 h-11 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow (min 44px touch target) */}
          <button
            type="button"
            onClick={nextPhoto}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 z-50 w-11 h-11 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors flex items-center justify-center"
          >
            <ChevronRight size={24} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 shadow-2xl text-center"
          >
            <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-4">
              <Image
                src={photos[selectedPhotoIndex].url}
                alt={photos[selectedPhotoIndex].caption}
                fill
                unoptimized={isProtectedMediaUrl(photos[selectedPhotoIndex]?.url)}
                sizes="(max-width: 640px) 100vw, 550px"
                className="object-contain sm:object-cover"
              />
            </div>

            <p className="font-handwriting text-2xl sm:text-3xl text-stone-900 dark:text-purple-100">
              {photos[selectedPhotoIndex].caption}
            </p>

            {photos[selectedPhotoIndex].date && (
              <p className="font-serif text-xs text-amber-600 dark:text-purple-400 mt-1">
                {photos[selectedPhotoIndex].date}
              </p>
            )}

            <div className="mt-3 text-xs text-stone-400 font-mono">
              {selectedPhotoIndex + 1} of {photos.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

