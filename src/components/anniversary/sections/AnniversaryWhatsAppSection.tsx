"use client";

import React from "react";
import { MessageSquare, Heart, Sparkles, Calendar, ShieldCheck, Flame } from "lucide-react";
import { AnniversaryWhatsAppConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryWhatsAppConfig;
  theme: ThemeId;
}

const DEFAULT_METRICS = {
  totalMessages: 14850,
  partner1Name: "Olivia",
  partner1Messages: 7640,
  partner2Name: "Liam",
  partner2Messages: 7210,
  firstMessageDate: "October 14, 2021",
  mostActiveDay: "Sunday",
  mostActiveHour: "10:30 PM",
  loveEmojisCount: 2430,
  topWords: [
    { word: "love", count: 1240 },
    { word: "home", count: 680 },
    { word: "coffee", count: 520 },
    { word: "miss", count: 480 },
    { word: "forever", count: 390 },
  ],
  funFact: "You exchanged over 28 messages every single day!",
};

export function AnniversaryWhatsAppSection({ config, theme }: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");
  const metrics = config.metrics || config.placeholderMetrics || DEFAULT_METRICS;

  const total = metrics.totalMessages || 1;
  const p1Pct = Math.round((metrics.partner1Messages / total) * 100);
  const p2Pct = 100 - p1Pct;

  return (
    <section id="anniv-sec-whatsapp" className="py-14 sm:py-20 px-4 max-w-4xl mx-auto select-none">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E8B4B8]/80 shadow-[#6B2D38]/10 text-center">
        {/* Header */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-[#FFF5F6] text-[#6B2D38] border border-[#E8B4B8]/70 shadow-sm mb-3">
          <MessageSquare size={13} className="text-[#C46879]" />
          <span>Our Conversation Insights</span>
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#3D262A] mb-2">
          {config.headline || "The Language of Us"}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-md mx-auto mb-8 leading-relaxed">
          {config.subtext ||
            "Every text, midnight laugh, and quick 'I love you' — our relationship in numbers."}
        </p>

        {/* Top Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8]/60 shadow-xs">
            <span className="block font-serif font-bold text-2xl sm:text-3xl text-[#3D262A]">
              {metrics.totalMessages.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B2D38]/70 font-semibold mt-0.5 block">
              Total Messages
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8]/60 shadow-xs">
            <span className="block font-serif font-bold text-2xl sm:text-3xl text-[#C46879]">
              {metrics.loveEmojisCount.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B2D38]/70 font-semibold mt-0.5 block">
              Love Emojis Sent
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8]/60 shadow-xs">
            <span className="block font-serif font-bold text-xl sm:text-2xl text-[#3D262A] truncate">
              {metrics.mostActiveDay}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B2D38]/70 font-semibold mt-0.5 block">
              Peak Chat Day
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8]/60 shadow-xs">
            <span className="block font-serif font-bold text-xl sm:text-2xl text-[#3D262A] truncate">
              {metrics.firstMessageDate || "Oct 2021"}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B2D38]/70 font-semibold mt-0.5 block">
              First Conversation
            </span>
          </div>
        </div>

        {/* Message Distribution Balance Bar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF6F0] border border-[#E8B4B8]/70 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs sm:text-sm font-serif font-bold text-[#3D262A] mb-2">
            <span>
              {metrics.partner1Name} ({p1Pct}%)
            </span>
            <span>
              {metrics.partner2Name} ({p2Pct}%)
            </span>
          </div>

          {/* Dual Bar */}
          <div className="h-3.5 w-full bg-stone-200 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${p1Pct}%` }}
              className="h-full bg-gradient-to-r from-[#C46879] to-[#B35768] transition-all duration-700"
            />
            <div
              style={{ width: `${p2Pct}%` }}
              className="h-full bg-gradient-to-r from-[#E8B4B8] to-[#D89BA1] transition-all duration-700"
            />
          </div>

          <p className="text-[11px] font-serif italic text-[#6B2D38]/80 mt-3 text-center">
            {metrics.funFact || "A perfect balance of sweet morning texts and cozy late-night chats."}
          </p>
        </div>

        {/* Top Words Cloud */}
        {metrics.topWords && metrics.topWords.length > 0 && (
          <div className="mb-6">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#6B2D38] mb-3">
              Words We Use The Most
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {metrics.topWords.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8B4B8]/60 text-xs font-serif font-medium text-[#3D262A] shadow-xs flex items-center gap-1.5"
                >
                  <span className="text-[#C46879] font-bold">&ldquo;{item.word}&rdquo;</span>
                  <span className="text-[10px] font-mono text-[#6B2D38]/60">({item.count})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Assurance Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#E8B4B8]/40 text-[10px] font-mono text-[#6B2D38]/70">
          <ShieldCheck size={12} className="text-[#C46879]" />
          <span>100% In-Browser Privacy • Zero Raw Messages Ever Sent To Servers</span>
        </div>
      </div>
    </section>
  );
}
