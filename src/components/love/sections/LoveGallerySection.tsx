"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Calendar, MapPin, X, ZoomIn, Heart, RotateCw, Sparkles, Feather } from "lucide-react";
import { LoveGalleryConfig, LoveGalleryPhoto } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveGalleryConfig;
  theme: ThemeConfig;
}

export function LoveGallerySection({ config, theme }: Props) {
  const [activePhoto, setActivePhoto] = useState<LoveGalleryPhoto | null>(null);
  const [flippedPhotoIds, setFlippedPhotoIds] = useState<Set<string>>(new Set());

  const photos = config.photos || [];

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedPhotoIds((prev) => {
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
    <section id="sec-love-gallery" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Camera size={11} className="text-amber-300" />
            <span>Visual Archive &bull; Tap Polaroid to Flip</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "Moments Frozen In Our World"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Every photograph is proof of a moment where I fell in love with you all over again. Tap any polaroid to read the secret note on the back."}
          </p>
        </div>

        {/* Gallery Grid */}
        {photos.length === 0 ? (
          <div className="p-10 rounded-3xl bg-[#24060c]/60 border border-dashed border-rose-900/60 text-center max-w-md mx-auto">
            <Heart size={28} className="text-rose-500 mx-auto mb-2 opacity-60" />
            <p className="font-serif text-sm text-rose-300 mb-1">Our Gallery is Ready</p>
            <p className="text-xs text-rose-400/80">Add your romantic photographs in the editor to display them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((p, idx) => {
              const photoKey = p.id || `photo-${idx}`;
              const isFlipped = flippedPhotoIds.has(photoKey);

              return (
                <div
                  key={photoKey}
                  className="perspective-1000 select-none"
                  style={{ minHeight: "400px" }}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                      isFlipped ? "[transform:rotateY(180deg)]" : ""
                    }`}
                  >
                    {/* FRONT OF POLAROID */}
                    <div
                      onClick={() => toggleFlip(photoKey)}
                      className="absolute inset-0 [backface-visibility:hidden] bg-[#2a070e]/90 backdrop-blur-md rounded-2xl p-3 border border-amber-400/30 shadow-xl shadow-rose-950/60 hover:shadow-2xl hover:border-amber-400/60 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      {/* Polaroid Tape Accent */}
                      <div className="w-16 h-4 bg-amber-200/30 backdrop-blur-sm -top-2 left-1/2 -translate-x-1/2 absolute rotate-1 z-10 border border-white/20" />

                      {/* Photo Image Frame */}
                      <div>
                        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black/40 mb-3 group">
                          <Image
                            src={p.url}
                            alt={p.caption || "Romantic memory"}
                            fill
                            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 320px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized={p.url.startsWith("/api/media/view")}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePhoto(p);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm text-[10px] font-mono text-amber-300 border border-amber-400/40 hover:bg-black"
                            >
                              <ZoomIn size={11} />
                              <span>Zoom</span>
                            </button>
                            <span className="text-[10px] font-mono text-amber-300 flex items-center gap-1">
                              <RotateCw size={10} />
                              <span>Tap to flip</span>
                            </span>
                          </div>
                        </div>

                        {/* Caption */}
                        <p className="font-serif text-xs sm:text-sm text-rose-100 font-medium line-clamp-2 leading-relaxed mb-2 px-1">
                          {p.caption}
                        </p>
                      </div>

                      {/* Metadata & Flip Pill */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-300/80 pt-2 border-t border-rose-950/80 px-1">
                        {p.date ? (
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {p.date}
                          </span>
                        ) : (
                          <span className="italic text-rose-400">Timeless</span>
                        )}
                        <span className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold">
                          <RotateCw size={11} />
                          <span>Secret Note</span>
                        </span>
                      </div>
                    </div>

                    {/* BACK OF POLAROID (Secret Handwritten Note) */}
                    <div
                      onClick={() => toggleFlip(photoKey)}
                      className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#fffdf9] text-stone-900 rounded-2xl p-6 border-2 border-amber-300/80 shadow-2xl flex flex-col justify-between cursor-pointer select-none"
                    >
                      <div>
                        {/* Stamp & Date Header */}
                        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                          <div className="flex items-center gap-1.5 text-xs font-serif text-[#881337] font-bold">
                            <Feather size={14} />
                            <span>Memory Note</span>
                          </div>
                          <span className="text-[10px] font-mono text-stone-500 uppercase">
                            {p.date || "Secret Chapter"}
                          </span>
                        </div>

                        {/* Handwritten Note Body */}
                        <p className="font-serif italic text-sm text-stone-800 leading-relaxed mb-4">
                          &ldquo;{p.caption || "A moment where time stopped and only your laugh echoed in my world."}&rdquo;
                        </p>

                        {p.location && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-900/70 font-mono mt-2">
                            <MapPin size={12} className="text-amber-700" />
                            <span>Captured at: {p.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer Stamp & Flip Back */}
                      <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono text-stone-500">
                        <span className="text-[#881337] font-serif italic">Forever archived ❤️</span>
                        <span className="inline-flex items-center gap-1 text-stone-600 font-bold hover:text-stone-900">
                          <RotateCw size={11} />
                          <span>Flip to Photo</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Image Zoom Modal */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="relative max-w-3xl w-full max-h-[85vh] bg-[#1a0307] rounded-3xl overflow-hidden border border-amber-400/40 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X size={18} />
              </button>

              <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden">
                <Image
                  src={activePhoto.url}
                  alt={activePhoto.caption || "Full romantic photo"}
                  fill
                  sizes="(max-width: 768px) 95vw, 768px"
                  className="object-contain"
                  unoptimized={activePhoto.url.startsWith("/api/media/view")}
                />
              </div>

              <div className="p-4 text-center">
                <p className="font-serif text-sm sm:text-base text-rose-100 italic mb-1">
                  {activePhoto.caption}
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-amber-300/80">
                  {activePhoto.date && <span>📅 {activePhoto.date}</span>}
                  {activePhoto.location && <span>📍 {activePhoto.location}</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
