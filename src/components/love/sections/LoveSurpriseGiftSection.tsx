"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, Sparkles, Heart, Ticket, CheckCircle2, RotateCcw, PartyPopper } from "lucide-react";
import { LoveSurpriseGiftConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveSurpriseGiftConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
}

export function LoveSurpriseGiftSection({
  config,
  recipientName,
  senderName,
  theme,
}: Props) {
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);

  const surprises = config.surprises || [
    {
      id: "coup-1",
      title: "Spontaneous Midnight Ice Cream Run 🍦",
      description: "Valid anytime, no questions asked. I'll drive, you pick the flavors.",
      tag: "Redeemable Coupon",
    },
    {
      id: "coup-2",
      title: "One Full Back Massage & Spa Night 💆‍♀️",
      description: "Complete with warm candles, relaxing music, and zero complaints.",
      tag: "VIP Love Pass",
    },
    {
      id: "coup-3",
      title: "Movie Night Dictator Pass 🎬",
      description: "You choose the movie, the snacks, and I promise not to fall asleep.",
      tag: "Golden Ticket",
    },
  ];

  const handleUnbox = () => {
    setIsUnboxed(true);
    // Play sweet chime if audio available
    try {
      if (typeof window !== "undefined" && (window as any).AudioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      }
    } catch {}
  };

  return (
    <section id="sec-love-surprise-gift" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Gift size={11} className="text-amber-300" />
            <span>Romantic Surprise &bull; Date Night Reveal</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "A Surprise Made Just For You"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext ||
              "Because love isn't just about words—it's about the adventures and memories waiting for us."}
          </p>
        </div>

        {/* Gift Box / Unboxed Coupons Container */}
        <div className="relative">
          {!isUnboxed ? (
            /* Sealed 3D Gift Box */
            <div
              onClick={handleUnbox}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleUnbox();
                }
              }}
              className="group cursor-pointer select-none max-w-md mx-auto bg-gradient-to-b from-[#3a0a14] via-[#24060c] to-[#160307] rounded-3xl p-8 sm:p-12 border-2 border-amber-400/50 shadow-2xl shadow-rose-950/80 hover:scale-102 hover:border-amber-400/80 transition-all duration-300 text-center"
            >
              {/* Animated Gift Box Ribbon & Icon */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-amber-500 border-2 border-amber-300 shadow-xl shadow-rose-950/60 flex items-center justify-center text-stone-950 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Gift size={36} className="animate-bounce" />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-rose-100 mb-2">
                {config.giftTitle || "Tap To Unwrap Your Surprise"}
              </h3>

              <p className="text-xs sm:text-sm text-rose-300/80 font-serif italic mb-6">
                Special love voucher prepared by {senderName} for {recipientName}
              </p>

              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles size={13} />
                <span>Open Romantic Surprise</span>
              </div>
            </div>
          ) : (
            /* Unboxed Surprise Card & Coupons */
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border-2 border-amber-400/50 shadow-2xl text-stone-900 animate-fadeIn relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono uppercase tracking-wider mb-4">
                <CheckCircle2 size={11} className="text-emerald-700" />
                <span>Surprise Unboxed &bull; Valid Forever</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-rose-950 mb-2">
                {config.giftTitle || "Your Personal Date-Night Love Voucher"}
              </h3>

              <p className="font-serif text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed mb-6">
                {config.giftDescription ||
                  "This coupon entitles you to one unforgettable evening entirely centered around you—your choice of restaurant, your playlist, and my undivided attention."}
              </p>

              {/* Coupon Code Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100/80 border border-amber-300 text-xs font-mono font-bold text-amber-950 mb-8 shadow-xs">
                <Ticket size={14} className="text-amber-700" />
                <span>VOUCHER CODE: {config.couponCode || `LOVE-${recipientName.toUpperCase()}-FOREVER`}</span>
              </div>

              {/* Additional Surprise Coupons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-6">
                {surprises.map((surp, idx) => (
                  <div
                    key={surp.id || idx}
                    className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="inline-block text-[9px] font-mono uppercase font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md mb-2">
                        {surp.tag}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-stone-900 mb-1">
                        {surp.title}
                      </h4>
                      <p className="text-xs text-stone-600 leading-snug">
                        {surp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Redeem Button */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsRedeemed(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#541D2B] hover:bg-[#3d141e] text-white text-xs font-serif font-bold shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <Heart size={13} className="fill-current text-rose-300" />
                  <span>{isRedeemed ? "Claimed With A Kiss! 💋" : (config.redeemPrompt || "Redeem With A Kiss ❤️")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUnboxed(false);
                    setIsRedeemed(false);
                  }}
                  className="text-xs font-mono text-stone-500 hover:text-stone-800 underline transition-colors"
                >
                  Re-wrap Gift Box
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
