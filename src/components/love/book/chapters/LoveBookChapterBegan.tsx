"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Sparkles, X, ZoomIn } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface TimelineItem {
  id: string;
  title: string;
  date?: string;
  description: string;
  photoUrl?: string;
  tag?: string;
}

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    items?: TimelineItem[];
  };
  theme: ThemeConfig;
}

export function LoveBookChapterBegan({
  recipientName,
  senderName,
  config,
  theme,
}: Props) {
  const [photoZoom, setPhotoZoom] = useState(false);

  const headline = config.headline || "Chapter I • Where It All Began";
  const subtext =
    config.subtext ||
    "Before all the inside jokes and quiet Sundays, there was a day that quietly changed everything.";

  const items = config.items || [
    {
      id: "began-1",
      title: "The First Day Our Eyes Met ✨",
      date: "The Very Beginning",
      description:
        "I still remember the exact clothes you were wearing, the sound of your laugh across the room, and how my heart quietly knew you would be someone special.",
      photoUrl:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      tag: "Day One",
    },
    {
      id: "began-2",
      title: "Our Very First Conversation ☕",
      date: "Sparks",
      description:
        "What was supposed to be a polite five-minute hello turned into two hours of talking about everything and nothing. Time just melted away.",
      tag: "The Spark",
    },
  ];

  const primaryPhoto = items.find((i) => i.photoUrl)?.photoUrl || items[0]?.photoUrl;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-8 font-serif text-stone-900 select-text overflow-y-auto">
      {/* VINTAGE POSTAGE STAMP IN TOP RIGHT CORNER */}
      <div className="absolute top-3 right-4 sm:top-5 sm:right-6 pointer-events-none select-none z-10 flex items-center gap-1.5">
        {/* Postmark cancellation mark (circular stamp with wavy lines) */}
        <div className="hidden sm:flex flex-col items-center opacity-40 -rotate-12 mr-1">
          <div className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center p-0.5 text-[7px] font-mono uppercase tracking-tighter text-stone-800 text-center leading-none">
            ROMANCE<br />OFFICIAL
          </div>
          <div className="w-12 h-1 border-t border-b border-stone-800 my-0.5" />
        </div>

        {/* Perforated Postage Stamp */}
        <div
          className="relative bg-[#fff7f0] p-1 shadow-sm rotate-3 border border-rose-300/80"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
          }}
        >
          <div className="w-10 h-12 sm:w-11 sm:h-14 bg-gradient-to-br from-rose-100 to-rose-200 border border-dashed border-rose-400/70 p-1 flex flex-col items-center justify-between text-rose-900">
            <span className="font-mono text-[7px] font-bold uppercase tracking-wider">LOVE 100</span>
            <Heart size={13} className="fill-rose-600 text-rose-600 animate-pulse" />
            <span className="font-mono text-[6px] tracking-tight">SPECIAL POST</span>
          </div>
        </div>
      </div>

      {/* CHAPTER HEADER */}
      <div className="pr-16 sm:pr-24 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8b3a4a] font-bold">
            PROLOGUE • VOLUME I
          </span>
          <span className="text-[#8b3a4a]/40 text-xs">•</span>
          <span className="text-[10px] text-stone-500 font-serif italic">The Beginning</span>
        </div>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[#3a0d15] tracking-tight leading-tight">
          {headline}
        </h2>
        <p className="font-serif text-xs sm:text-sm text-stone-600 italic mt-1 leading-relaxed max-w-md">
          {subtext}
        </p>
      </div>

      {/* SCRAPBOOK BODY LAYOUT */}
      <div className="my-auto space-y-4">
        {/* TIPPED-IN POLAROID WITH WASHI TAPE */}
        {primaryPhoto && (
          <div className="flex items-center gap-4 sm:gap-6 bg-[#faf4ec]/60 p-3 sm:p-4 rounded-xl border border-stone-200/80 shadow-xs">
            {/* Polaroid Frame */}
            <div
              onClick={() => setPhotoZoom(true)}
              className="group relative cursor-pointer bg-[#FFFDF9] p-2 sm:p-2.5 pb-5 sm:pb-6 rounded-xs shadow-md border border-stone-200/90 -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 shrink-0 w-28 sm:w-36"
              style={{
                boxShadow: "0 6px 16px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08)",
              }}
            >
              {/* Semi-transparent Frosted Washi Tape across top */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-4 bg-amber-200/75 backdrop-blur-[1px] rotate-2 border border-white/60 shadow-xs z-10"
                style={{
                  clipPath: "polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)",
                }}
              />

              {/* Photo Box */}
              <div className="relative aspect-[4/5] rounded-xs overflow-hidden bg-stone-100 shadow-inner">
                <Image
                  src={primaryPhoto}
                  alt="Where it all began"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 120px, 160px"
                />
                <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn size={16} className="text-white drop-shadow" />
                </div>
              </div>

              {/* Handwritten Polaroid Caption */}
              <p className="font-handwriting text-stone-800 text-[10px] sm:text-[11px] text-center mt-2 font-bold truncate">
                {items[0]?.tag || "Day One ✨"}
              </p>
            </div>

            {/* Handwritten Story Excerpt next to Polaroid */}
            <div className="flex-1 space-y-1.5">
              <span className="font-mono text-[8px] uppercase tracking-wider text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 inline-block">
                {items[0]?.date || "The Spark"}
              </span>
              <h3 className="font-serif text-xs sm:text-sm font-bold text-[#3a0d15]">
                {items[0]?.title}
              </h3>
              <p className="font-serif text-[11px] sm:text-xs text-stone-700 leading-relaxed italic">
                &ldquo;{items[0]?.description}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* SECOND MILESTONE ENTRY */}
        {items[1] && (
          <div className="relative p-3 sm:p-3.5 rounded-xl bg-[#FAF6EE] border-l-3 border-[#8b3a4a] border-y border-r border-stone-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-[#8b3a4a] font-bold uppercase tracking-wider">
                {items[1].tag || "Milestone"}
              </span>
              {items[1].date && (
                <span className="text-[10px] font-mono text-stone-500">
                  {items[1].date}
                </span>
              )}
            </div>
            <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 mb-1">
              {items[1].title}
            </h4>
            <p className="font-serif text-[11px] sm:text-xs text-stone-700 leading-relaxed">
              {items[1].description}
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM RUNNING FOLIO & WAX SEAL ACCENT */}
      <div className="mt-3 pt-2.5 border-t border-stone-300/60 flex items-center justify-between text-stone-500">
        <div className="flex items-center gap-2">
          {/* Mini Red Wax Seal */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-700 to-rose-950 flex items-center justify-center shadow-xs">
            <Heart size={10} className="fill-amber-300 text-amber-300" />
          </div>
          <span className="font-serif italic text-[10px] text-stone-600">
            &ldquo;Every love story begins with a simple hello.&rdquo;
          </span>
        </div>
        <span className="font-mono text-[9px] font-bold text-stone-500">
          — 1 —
        </span>
      </div>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {photoZoom && primaryPhoto && (
        <div
          onClick={() => setPhotoZoom(false)}
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF9] p-4 sm:p-5 rounded-2xl max-w-md w-full shadow-2xl border border-stone-300"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-serif text-xs text-stone-600 italic">Where It All Began</span>
              <button
                type="button"
                onClick={() => setPhotoZoom(false)}
                className="p-1 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-900 mb-2">
              <Image
                src={primaryPhoto}
                alt="Full size memory"
                fill
                className="object-contain"
                sizes="500px"
              />
            </div>
            <p className="font-handwriting text-stone-800 text-center text-sm font-bold">
              {items[0]?.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
