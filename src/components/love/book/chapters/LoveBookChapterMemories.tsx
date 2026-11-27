"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Sparkles, Heart, X, ZoomIn } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  location?: string;
  tag?: string;
}

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    photos?: PhotoItem[];
  };
  theme: ThemeConfig;
}

export function LoveBookChapterMemories({
  recipientName,
  senderName,
  config,
  theme,
}: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const headline = config.headline || "Chapter II • Our Little Memories";
  const subtext =
    config.subtext ||
    "Every photograph is proof of a quiet afternoon where I fell in love with you all over again.";

  const photos: PhotoItem[] = config.photos && config.photos.length > 0
    ? config.photos
    : [
        {
          id: "mem-1",
          url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
          caption: "Golden hour beach walk & your smile.",
          date: "Summer",
          location: "The Coast",
        },
        {
          id: "mem-2",
          url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
          caption: "Silly jokes over warm cinnamon coffee.",
          date: "Autumn Rain",
          location: "Porch Cafe",
        },
        {
          id: "mem-3",
          url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
          caption: "The world blurred out completely, only you in focus.",
          date: "Forever Spot",
          location: "Our Bench",
        },
      ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-8 font-serif text-stone-900 select-text overflow-y-auto">
      {/* CHAPTER HEADER */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8b3a4a] font-bold">
            SCRAPBOOK ALBUM • CHAPTER II
          </span>
          <span className="text-[#8b3a4a]/40 text-xs">•</span>
          <Camera size={11} className="text-[#8b3a4a]" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[#3a0d15] tracking-tight leading-tight">
          {headline}
        </h2>
        <p className="font-serif text-xs sm:text-sm text-stone-600 italic mt-1 leading-relaxed max-w-md">
          {subtext}
        </p>
      </div>

      {/* SCRAPBOOK PHOTO CLUSTER WITH ANTIQUE PHOTO CORNERS */}
      <div className="my-auto grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
        {photos.slice(0, 3).map((photo, idx) => {
          const rotations = ["-rotate-2", "rotate-2", "-rotate-1"];
          const rotClass = rotations[idx % rotations.length];

          return (
            <div
              key={photo.id || idx}
              onClick={() => setSelectedPhoto(photo)}
              className={`group relative cursor-pointer bg-[#FFFDF9] p-2 sm:p-2.5 pb-4 sm:pb-5 rounded-xs shadow-md border border-stone-200/90 transform ${rotClass} hover:rotate-0 hover:scale-105 transition-all duration-300`}
              style={{
                boxShadow: "0 6px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              {/* VINTAGE BLACK/GOLD PHOTO MOUNTING CORNERS (Top-Left & Bottom-Right) */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-stone-800 pointer-events-none z-10" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-stone-800 pointer-events-none z-10" />
              <div className="absolute bottom-5 left-1 w-3 h-3 border-b-2 border-l-2 border-stone-800 pointer-events-none z-10" />
              <div className="absolute bottom-5 right-1 w-3 h-3 border-b-2 border-r-2 border-stone-800 pointer-events-none z-10" />

              {/* Photo Box */}
              <div className="relative aspect-[4/5] rounded-xs overflow-hidden bg-stone-100 shadow-inner">
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 130px, 180px"
                />
                <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn size={16} className="text-white drop-shadow" />
                </div>
              </div>

              {/* Handwritten Note underneath */}
              <div className="mt-2 text-center">
                <p className="font-handwriting text-[10px] sm:text-[11px] text-stone-800 font-bold truncate">
                  {photo.caption}
                </p>
                {photo.date && (
                  <span className="font-mono text-[8px] text-stone-500 block mt-0.5">
                    {photo.date} {photo.location ? `• ${photo.location}` : ""}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SCRAPBOOK MARGINALIA NOTE */}
      <div className="mt-3 pt-2.5 border-t border-stone-300/60 flex items-center justify-between text-stone-500">
        <div className="flex items-center gap-1.5 text-rose-800">
          <Heart size={11} className="fill-rose-600 text-rose-600" />
          <span className="font-handwriting text-xs font-semibold">
            &ldquo;Frozen moments of pure happiness with you.&rdquo;
          </span>
        </div>
        <span className="font-mono text-[9px] font-bold text-stone-500">
          — 2 —
        </span>
      </div>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF9] p-4 sm:p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-stone-300 animate-fadeIn"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-serif text-xs text-stone-600 italic">Our Memories</span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-900 mb-3">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                fill
                className="object-contain"
                sizes="500px"
              />
            </div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 mb-1">
              {selectedPhoto.caption}
            </h4>
            <div className="flex items-center gap-3 text-xs text-stone-500 font-mono">
              {selectedPhoto.date && <span>📅 {selectedPhoto.date}</span>}
              {selectedPhoto.location && <span>📍 {selectedPhoto.location}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
