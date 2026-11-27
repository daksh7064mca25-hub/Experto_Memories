"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Sparkles, Eye, CheckCircle2 } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface ReasonCard {
  id: string;
  title: string;
  message: string;
  badge?: string;
  photoUrl?: string;
}

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    cards?: ReasonCard[];
    finalCardTitle?: string;
    finalCardMessage?: string;
  };
  theme: ThemeConfig;
}

export function LoveBookChapterReasons({
  recipientName,
  senderName,
  config,
  theme,
}: Props) {
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());

  const headline = config.headline || "Chapter IV • Little Things I Love About You";
  const subtext =
    config.subtext ||
    "Tap each mounted keepsake note to unfold what my heart notices when you are simply being you.";

  const cards: ReasonCard[] = config.cards && config.cards.length > 0
    ? config.cards
    : [
        {
          id: "r-1",
          title: "Your Spontaneous Laughter",
          message:
            "The way you crinkle your nose and laugh without holding back—it instantly dissolves every heavy thought in the world.",
          badge: "Reason #1",
        },
        {
          id: "r-2",
          title: "How You Look When Sleepy",
          message:
            "Wrapped in blankets, rubbing your eyes, speaking in soft sleepy murmurs. You are the safest home I have ever known.",
          badge: "Reason #2",
        },
        {
          id: "r-3",
          title: "The Kindness In Your Eyes",
          message:
            "How gently you treat strangers, little animals, and me even when you are exhausted. Your goodness is effortless.",
          badge: "Reason #3",
        },
        {
          id: "r-4",
          title: "The Way You Hold My Hand",
          message:
            "A quiet squeeze at crosswalks, fingers interlaced in movie theaters, an anchor that tells me I will never walk alone again.",
          badge: "Reason #4",
        },
      ];

  const finalTitle = config.finalCardTitle || "And The Biggest Reason Of All...";
  const finalMessage =
    config.finalCardMessage ||
    "Because loving you is as natural as breathing. I don't love you for what you do—I love you for the incredible, irreplaceable soul that you are.";

  const toggleReason = (id: string) => {
    setOpenedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 font-serif text-stone-900 select-text overflow-y-auto">
      {/* Chapter Title */}
      <div className="mb-3">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-800 font-bold block mb-1">
          Mounted Keepsake Notes
        </span>
        <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-[#3a0d15] leading-tight">
          {headline}
        </h2>
        <p className="font-serif text-[11px] sm:text-xs text-stone-600 italic mt-0.5 leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Grid of Mounted Folded Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-auto">
        {cards.slice(0, 4).map((card, idx) => {
          const isRevealed = openedIds.has(card.id || `r-${idx}`);
          const noteColors = [
            "bg-[#FFF7F8] border-rose-200",
            "bg-[#FBF8F0] border-amber-200",
            "bg-[#F5F9F6] border-emerald-200",
            "bg-[#FAF5FB] border-purple-200",
          ];
          const colorClass = noteColors[idx % noteColors.length];

          return (
            <div
              key={card.id || idx}
              onClick={() => toggleReason(card.id || `r-${idx}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleReason(card.id || `r-${idx}`);
                }
              }}
              className={`group cursor-pointer select-none p-3 rounded-xl border ${colorClass} shadow-xs hover:shadow-md transition-all duration-300 relative text-left`}
            >
              {/* Paper Clip / Stamp Accent */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-rose-800 bg-white/80 px-2 py-0.5 rounded-full border border-rose-200/60">
                  {card.badge || `Note #${idx + 1}`}
                </span>
                <span className="text-[10px] text-rose-400 group-hover:scale-110 transition-transform">
                  {isRevealed ? "📖 Unfolded" : "💌 Tap to read"}
                </span>
              </div>

              <h4 className="font-serif text-xs font-bold text-[#3a0d15] mb-1">
                {card.title}
              </h4>

              {isRevealed ? (
                <p className="font-serif text-[11px] text-stone-700 leading-relaxed animate-fadeIn">
                  {card.message}
                </p>
              ) : (
                <p className="font-handwriting text-xs text-stone-400 italic">
                  Tap to unfold this intimate whisper...
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Gold Foil Finale Card */}
      <div className="mt-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-100/80 via-yellow-50 to-amber-100/80 border border-amber-300 text-center shadow-xs">
        <span className="font-mono text-[8px] font-bold text-amber-900 uppercase tracking-widest block mb-0.5">
          {finalTitle}
        </span>
        <p className="font-serif text-[11px] text-stone-800 italic leading-snug">
          &ldquo;{finalMessage}&rdquo;
        </p>
      </div>

      {/* Bottom Annotation */}
      <div className="mt-2 pt-2 border-t border-amber-900/10 flex items-center justify-between text-[10px] text-stone-500 italic">
        <span className="font-handwriting text-xs text-rose-800">
          &ldquo;A thousand little reasons, and all of them you.&rdquo;
        </span>
        <span className="font-mono text-[9px]">Page 5</span>
      </div>
    </div>
  );
}
