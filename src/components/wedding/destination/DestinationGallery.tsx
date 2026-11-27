"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";

interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

interface DestinationGalleryProps {
  photos?: GalleryPhoto[];
  headline?: string;
  subtext?: string;
}

export const DestinationGallery: React.FC<DestinationGalleryProps> = ({
  photos,
  headline = "Moments Captured in Paradise 📸",
  subtext = "Glimpses of quiet sunsets, oceanside strolls, and memories leading to our vows.",
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  // Reliable destination photos with valid Unsplash URLs
  const displayPhotos: GalleryPhoto[] = photos && photos.length > 0 ? photos : [
    {
      id: "dest-gal-1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      caption: "Golden hour glow by the shores of Mobor beach",
      category: "Sunset Romance",
    },
    {
      id: "dest-gal-2",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      caption: "Under the palm canopy at The Leela resort grounds",
      category: "Resort Grounds",
    },
    {
      id: "dest-gal-3",
      url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
      caption: "Spontaneous laughter during our destination venue scouting",
      category: "Candid Joy",
    },
    {
      id: "dest-gal-4",
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
      caption: "Walking barefoot into the gentle ocean surf",
      category: "Coastal Stroll",
    },
    {
      id: "dest-gal-5",
      url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
      caption: "Evening lanterns reflecting upon the lagoon waters",
      category: "Twilight Lights",
    },
    {
      id: "dest-gal-6",
      url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      caption: "Ready to say forever where the ocean embraces the sky",
      category: "Forever Promise",
    },
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((activePhotoIdx + 1) % displayPhotos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((activePhotoIdx - 1 + displayPhotos.length) % displayPhotos.length);
    }
  };

  return (
    <section
      id="sec-destination-gallery"
      className="relative w-full max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-16"
      aria-label="Destination Wedding Photo Gallery"
    >
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#0E2437]/80 text-[#E5C378] text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-2 sm:mb-3 shadow-xs">
          <Camera size={12} className="text-[#F5D061]" />
          <span>DESTINATION ALBUM</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#0F2336] tracking-wide">
          {headline}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-serif italic text-stone-600 max-w-md mx-auto px-2">
          {subtext}
        </p>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
        {displayPhotos.map((photo, index) => (
          <div
            key={photo.id || `photo-${index}`}
            onClick={() => setActivePhotoIdx(index)}
            className="group relative h-40 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden bg-stone-200 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
          >
            <Image
              src={photo.url}
              alt={photo.caption || "Destination Wedding Photograph"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 sm:p-3.5 text-white">
              {photo.category && (
                <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-[#F5D061] mb-0.5">
                  {photo.category}
                </span>
              )}
              <p className="text-[10px] sm:text-xs font-serif line-clamp-2 leading-tight">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div
          onClick={() => setActivePhotoIdx(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setActivePhotoIdx(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50"
            aria-label="Close photo preview"
          >
            <X size={24} />
          </button>

          {/* Prev Photo Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50"
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Active Photo Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[80vh] flex flex-col items-center"
          >
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={displayPhotos[activePhotoIdx].url}
                alt={displayPhotos[activePhotoIdx].caption || "Photograph"}
                fill
                sizes="(max-width: 1024px) 90vw, 1000px"
                className="object-contain"
                priority
              />
            </div>
            {displayPhotos[activePhotoIdx].caption && (
              <p className="mt-4 text-center text-sm font-serif text-stone-200">
                {displayPhotos[activePhotoIdx].caption}
              </p>
            )}
            <span className="mt-1 text-[11px] font-mono text-[#D4AF37]">
              {activePhotoIdx + 1} of {displayPhotos.length}
            </span>
          </div>

          {/* Next Photo Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50"
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
};
