"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Heart, MapPin, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { AnniversaryTimelineConfig, TimelineMilestone, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { isProtectedMediaUrl } from "@/lib/media-utils";

interface Props {
  config: AnniversaryTimelineConfig;
  theme: ThemeId;
}

export function AnniversaryTimelineSection({ config, theme }: Props) {
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(
    config.milestones?.[0]?.id || null
  );
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const themeConfig = getThemeConfig(theme, "anniversary");
  const milestones = config.milestones || [];

  const toggleMilestone = (id: string) => {
    setExpandedMilestoneId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="anniv-sec-timeline" className="py-14 sm:py-20 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-white/90 text-[#6B2D38] border border-[#E8B4B8]/60 shadow-sm mb-3">
          <Sparkles size={13} className="text-[#C46879]" />
          <span>Our Love Story Timeline</span>
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3D262A]">
          {config.headline || "Chapters of Our Story"}
        </h2>
        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 mt-2 max-w-lg mx-auto leading-relaxed">
          {config.subtext ||
            "From strangers across a crowded cafe to two hearts beating as one."}
        </p>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative pl-6 sm:pl-10 border-l-2 border-dashed border-[#E8B4B8] ml-4 sm:ml-8 space-y-8 sm:space-y-10">
        {milestones.map((item, index) => {
          const isExpanded = expandedMilestoneId === item.id;

          return (
            <div key={item.id || index} className="relative group">
              {/* Timeline Heart Marker Node */}
              <button
                type="button"
                onClick={() => toggleMilestone(item.id)}
                aria-label={`Toggle milestone ${item.title}`}
                className={`absolute -left-[31px] sm:-left-[47px] top-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  isExpanded
                    ? "bg-[#C46879] text-white scale-110 ring-4 ring-[#E8B4B8]/40"
                    : "bg-white text-[#C46879] border-2 border-[#E8B4B8] hover:scale-105"
                }`}
              >
                <Heart size={13} className="fill-current" />
              </button>

              {/* Milestone Card */}
              <div
                onClick={() => toggleMilestone(item.id)}
                className={`cursor-pointer rounded-3xl p-5 sm:p-7 transition-all duration-300 border ${
                  isExpanded
                    ? "bg-white/95 backdrop-blur-md shadow-xl border-[#E8B4B8] shadow-[#6B2D38]/8 scale-[1.005]"
                    : "bg-white/80 hover:bg-white/95 backdrop-blur-sm border-[#E8B4B8]/50 shadow-sm"
                }`}
              >
                {/* Milestone Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-3 py-0.5 rounded-full bg-[#FFF5F6] text-[#6B2D38] border border-[#E8B4B8]/70">
                      {item.tag || `Chapter #${index + 1}`}
                    </span>
                    <span className="text-xs text-[#6B2D38]/80 font-serif italic flex items-center gap-1">
                      <Calendar size={12} className="text-[#C46879]" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <div className="text-[#C46879] p-1">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Milestone Title */}
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#3D262A] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-[#3D262A]/85 leading-relaxed">
                  {item.description}
                </p>

                {/* Expanded Photos/Media */}
                {isExpanded && item.photos && item.photos.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#E8B4B8]/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {item.photos.map((photoUrl, pIdx) => {
                        if (!photoUrl) return null;
                        return (
                          <div
                            key={pIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPhoto(photoUrl);
                            }}
                            className="group/photo relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF6F0] shadow-sm border border-[#E8B4B8]/60 cursor-zoom-in"
                          >
                            <img
                              src={photoUrl}
                              alt={`${item.title} memory ${pIdx + 1}`}
                              className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-serif text-[#6B2D38] shadow-md flex items-center gap-1">
                                <ImageIcon size={12} />
                                <span>View Photo</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Photo Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedPhoto}
              alt="Expanded milestone memory"
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-4 px-5 py-2 rounded-full bg-white/90 text-xs font-serif font-semibold text-[#6B2D38] hover:bg-white shadow-lg"
            >
              Close Photo
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
