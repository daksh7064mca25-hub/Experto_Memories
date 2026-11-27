"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar, ZoomIn, Camera, Heart } from "lucide-react";
import { AnniversaryGalleryConfig, PolaroidPhoto, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { isProtectedMediaUrl } from "@/lib/media-utils";

interface Props {
  config: AnniversaryGalleryConfig;
  theme?: ThemeId;
}

const DEFAULT_PHOTOS: PolaroidPhoto[] = [
  {
    id: "p-1",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80",
    caption: "Rainy afternoon coffee talks where hours slipped by like minutes.",
    date: "October 2021",
  },
  {
    id: "p-2",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80",
    caption: "Our first sunset walk under the golden city lights.",
    date: "December 2021",
  },
  {
    id: "p-3",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
    caption: "Mountain summit road trip — wind in our hair and joy in our hearts.",
    date: "July 2022",
  },
  {
    id: "p-4",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    caption: "Seaside weekend getaway walking barefoot along the quiet shore.",
    date: "August 2023",
  },
  {
    id: "p-5",
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
    caption: "Our anniversary dinner celebrating another chapter of loving you.",
    date: "October 2024",
  },
];

export function AnniversaryGallerySection({ config, theme = "pink-paradise" }: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");
  const photos = config.photos && config.photos.length > 0 ? config.photos : DEFAULT_PHOTOS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Touch swipe handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || !e.changedTouches[0]) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextPhoto();
    } else if (diff < -45) {
      prevPhoto();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") setSelectedPhotoIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
      }
      if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, photos.length]);

  return (
    <section id="anniv-sec-gallery" className="py-14 sm:py-20 px-4 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-white/90 text-[#6B2D38] border border-[#E8B4B8]/60 shadow-sm mb-3">
          <Camera size={13} className="text-[#C46879]" />
          <span>Our Cherished Memories</span>
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3D262A]">
          {config.headline || "My Favourite Photos of Us"}
        </h2>
        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 mt-2 max-w-md mx-auto leading-relaxed">
          {config.subtext || "Swipe through the moments that make my heart skip a beat every single time."}
        </p>
      </div>

      {/* 3D Photo Carousel Container */}
      <div
        className="relative w-full max-w-3xl mx-auto h-[380px] sm:h-[440px] flex items-center justify-center [perspective:1200px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {photos.map((photo, index) => {
          // Calculate offset relative to currentIndex
          let offset = index - currentIndex;
          if (offset < -Math.floor(photos.length / 2)) offset += photos.length;
          if (offset > Math.floor(photos.length / 2)) offset -= photos.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;
          const isVisible = Math.abs(offset) <= 1;

          if (!isVisible) return null;

          let transformStyle = "";
          let zIndex = 10;
          let opacity = 0.6;

          if (isCenter) {
            transformStyle = "translateX(0%) scale(1) rotateY(0deg)";
            zIndex = 30;
            opacity = 1;
          } else if (isLeft) {
            transformStyle = "translateX(-65%) scale(0.85) rotateY(24deg)";
            zIndex = 20;
            opacity = 0.65;
          } else if (isRight) {
            transformStyle = "translateX(65%) scale(0.85) rotateY(-24deg)";
            zIndex = 20;
            opacity = 0.65;
          }

          return (
            <div
              key={photo.id || index}
              onClick={() => {
                if (isCenter) {
                  setSelectedPhotoIndex(index);
                } else if (isLeft) {
                  prevPhoto();
                } else if (isRight) {
                  nextPhoto();
                }
              }}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
              }}
              className="absolute transition-all duration-500 ease-out cursor-pointer flex flex-col items-center w-[260px] sm:w-[320px]"
            >
              {/* Polaroid Card Frame */}
              <div
                className={`w-full bg-white p-3.5 sm:p-4 pb-5 sm:pb-6 rounded-3xl shadow-2xl transition-shadow ${
                  isCenter
                    ? "border-2 border-[#E8B4B8] shadow-[#6B2D38]/15"
                    : "border border-[#E8B4B8]/50 shadow-md"
                }`}
              >
                {/* Photo Aspect Ratio */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FAF6F0] mb-3">
                  <Image
                    src={photo.url}
                    alt={photo.caption || "Couple memory"}
                    fill
                    unoptimized={isProtectedMediaUrl(photo.url)}
                    sizes="(max-width: 640px) 260px, 320px"
                    className="object-cover"
                  />

                  {isCenter && (
                    <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-90 transition-opacity">
                      <ZoomIn size={13} />
                    </div>
                  )}
                </div>

                {/* Caption & Date */}
                <div className="text-center px-1">
                  <p className="font-serif italic text-xs sm:text-sm text-[#3D262A] line-clamp-2 leading-snug">
                    {photo.caption || "A moment we will cherish forever"}
                  </p>

                  {photo.date && (
                    <p className="text-[10px] font-mono text-[#6B2D38]/70 mt-1 flex items-center justify-center gap-1">
                      <Calendar size={10} className="text-[#C46879]" />
                      <span>{photo.date}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Buttons */}
        <button
          onClick={prevPhoto}
          className="absolute left-1 sm:left-4 z-40 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-white text-[#6B2D38] border border-[#E8B4B8] shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Previous photo"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextPhoto}
          className="absolute right-1 sm:right-4 z-40 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-white text-[#6B2D38] border border-[#E8B4B8] shadow-lg transition-all active:scale-95 flex items-center justify-center"
          aria-label="Next photo"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Carousel Dot Indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-7 bg-[#C46879]"
                : "w-2 bg-[#E8B4B8]/70 hover:bg-[#C46879]/60"
            }`}
            aria-label={`Go to photo ${idx + 1}`}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-colors z-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Lightbox"
          >
            <X size={20} />
          </button>

          {/* Navigation in Lightbox */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-colors z-50 min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Previous photograph"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-colors z-50 min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Next photograph"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Lightbox Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center max-h-[90vh] overflow-y-auto border border-[#E8B4B8]"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF6F0] mb-4">
              <Image
                src={photos[selectedPhotoIndex].url}
                alt={photos[selectedPhotoIndex].caption || "Full resolution anniversary photo"}
                fill
                unoptimized={isProtectedMediaUrl(photos[selectedPhotoIndex].url)}
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
              />
            </div>

            <p className="font-serif italic text-base sm:text-lg text-[#3D262A] text-center mb-1">
              {photos[selectedPhotoIndex].caption || "Our favourite moment"}
            </p>

            {photos[selectedPhotoIndex].date && (
              <p className="text-xs font-mono text-[#6B2D38]/80 flex items-center gap-1.5">
                <Calendar size={12} className="text-[#C46879]" />
                <span>{photos[selectedPhotoIndex].date}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
