"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Heart, Calendar, MapPin, Milestone, ChevronRight, X } from "lucide-react";
import { LoveTimelineConfig, LoveTimelineItem } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveTimelineConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
}

export function LoveTimelineSection({
  config,
  recipientName,
  senderName,
  theme,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<LoveTimelineItem | null>(null);

  const items = (config.items || []).filter(
    (item) => item.title || item.description || item.photoUrl
  );

  return (
    <section id="sec-love-timeline" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Milestone size={11} className="text-amber-300" />
            <span>Our Relationship Chapters</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "The Story of Us"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext ||
              "Every chapter with you is my favourite. Here are the unforgettable moments that brought our hearts together."}
          </p>
        </div>

        {/* Timeline Items */}
        {items.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#24060c]/60 border border-dashed border-rose-900/60 text-center max-w-md mx-auto">
            <Heart size={24} className="text-rose-400 mx-auto mb-2 opacity-60" />
            <p className="font-serif text-sm text-rose-200">Our Timeline is Ready</p>
            <p className="text-xs text-rose-300/70 mt-1">
              Add your special couple milestones in the editor to showcase them here.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Central Romantic Timeline Line */}
            <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-400/80 via-rose-500/60 to-amber-400/80 -translate-x-1/2 hidden sm:block" />
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-400/80 via-rose-500/60 to-amber-400/80 sm:hidden" />

            <div className="space-y-10 sm:space-y-14">
              {items.map((item, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={item.id || idx}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                      isEven ? "sm:flex-row-reverse" : ""
                    } gap-4 sm:gap-10`}
                  >
                    {/* Heart Node in Center */}
                    <div className="absolute left-6 sm:left-1/2 top-4 sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-gradient-to-br from-[#881337] to-[#4c0519] border-2 border-amber-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center justify-center text-amber-300">
                      <Heart size={13} className="fill-amber-300 animate-pulse" />
                    </div>

                    {/* Timeline Card Content */}
                    <div
                      className={`w-full sm:w-[calc(50%-2.5rem)] pl-12 sm:pl-0 ${
                        isEven ? "sm:text-right" : "sm:text-left"
                      }`}
                    >
                      <div className="group bg-[#2a070e]/85 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-amber-400/30 shadow-xl shadow-rose-950/70 hover:border-amber-400/60 hover:shadow-2xl transition-all duration-300">
                        {/* Tag & Date */}
                        <div
                          className={`flex items-center gap-2 mb-3 ${
                            isEven ? "sm:justify-end" : "sm:justify-start"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-rose-950 text-amber-300 border border-amber-400/30">
                            {item.tag || `Chapter ${idx + 1}`}
                          </span>
                          {item.date && (
                            <span className="text-[11px] font-mono text-rose-300/80 flex items-center gap-1">
                              <Calendar size={11} className="text-amber-400" />
                              <span>{item.date}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-rose-100 group-hover:text-amber-200 transition-colors mb-2">
                          {item.title}
                        </h3>

                        {/* Story / Description */}
                        <p className="text-xs sm:text-sm text-rose-200/90 font-serif leading-relaxed mb-4">
                          {item.description}
                        </p>

                        {/* Optional Photo */}
                        {item.photoUrl && (
                          <div
                            onClick={() => setSelectedItem(item)}
                            className="relative w-full h-44 rounded-2xl overflow-hidden border border-amber-400/25 shadow-inner cursor-pointer group/img"
                          >
                            <Image
                              src={item.photoUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 80vw, 360px"
                              className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                              unoptimized={item.photoUrl.startsWith("/api/media/view")}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-serif font-bold gap-1.5">
                              <Sparkles size={13} className="text-amber-300" />
                              <span>View Memory</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spacer for other side */}
                    <div className="hidden sm:block sm:w-[calc(50%-2.5rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && selectedItem.photoUrl && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#2a070e] border border-amber-400/50 rounded-3xl p-5 max-w-lg w-full relative text-center"
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full bg-black/50"
            >
              <X size={18} />
            </button>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
              <Image
                src={selectedItem.photoUrl}
                alt={selectedItem.title}
                fill
                sizes="(max-width: 640px) 90vw, 448px"
                className="object-cover"
                unoptimized={selectedItem.photoUrl.startsWith("/api/media/view")}
              />
            </div>
            <h4 className="font-serif text-lg font-bold text-rose-100 mb-1">
              {selectedItem.title}
            </h4>
            <p className="text-xs text-rose-300 font-serif leading-relaxed">
              {selectedItem.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
