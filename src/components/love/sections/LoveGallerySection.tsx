"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Calendar, MapPin, X, ZoomIn, Heart } from "lucide-react";
import { LoveGalleryConfig, LoveGalleryPhoto } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveGalleryConfig;
  theme: ThemeConfig;
}

export function LoveGallerySection({ config, theme }: Props) {
  const [activePhoto, setActivePhoto] = useState<LoveGalleryPhoto | null>(null);

  const photos = config.photos || [];

  return (
    <section id="sec-love-gallery" className="py-16 sm:py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Camera size={11} className="text-amber-300" />
            <span>Visual Archive</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "Moments Frozen In Our World"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext || "Every photograph is proof of a moment where I fell in love with you all over again."}
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
            {photos.map((p, idx) => (
              <div
                key={p.id || idx}
                onClick={() => setActivePhoto(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActivePhoto(p);
                  }
                }}
                className="group bg-[#2a070e]/85 backdrop-blur-md rounded-2xl p-3 border border-amber-400/25 shadow-xl shadow-rose-950/60 hover:shadow-2xl hover:border-amber-400/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none relative"
              >
                {/* Polaroid Tape Illusion */}
                <div className="w-16 h-4 bg-amber-200/30 backdrop-blur-sm -top-2 left-1/2 -translate-x-1/2 absolute rotate-1 z-10 border border-white/20" />

                {/* Photo Image Frame */}
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-black/40 mb-3">
                  <Image
                    src={p.url}
                    alt={p.caption || "Romantic memory"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={p.url.startsWith("/api/media/view")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-mono text-amber-300 border border-amber-400/40">
                      <ZoomIn size={11} />
                      <span>View Full Image</span>
                    </span>
                  </div>
                </div>

                {/* Caption & Metadata */}
                <div className="px-1.5 pb-1">
                  <p className="font-serif text-xs sm:text-sm text-rose-100 font-medium line-clamp-2 leading-relaxed mb-2">
                    {p.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-300/80 pt-2 border-t border-rose-950/80">
                    {p.date ? (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {p.date}
                      </span>
                    ) : (
                      <span />
                    )}
                    {p.location && (
                      <span className="flex items-center gap-1 truncate max-w-[120px]">
                        <MapPin size={10} />
                        {p.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#1f050b] border border-amber-400/50 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative">
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-rose-300 hover:text-white transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="relative w-full h-80 sm:h-96 bg-black">
                <Image
                  src={activePhoto.url}
                  alt={activePhoto.caption || "Expanded memory"}
                  fill
                  className="object-contain"
                  unoptimized={activePhoto.url.startsWith("/api/media/view")}
                />
              </div>

              <div className="p-6 text-left">
                <p className="font-serif text-sm sm:text-base text-rose-100 leading-relaxed mb-3">
                  {activePhoto.caption}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-amber-300/80">
                  {activePhoto.date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {activePhoto.date}
                    </span>
                  )}
                  {activePhoto.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {activePhoto.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
