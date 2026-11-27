"use client";

import React, { useState } from "react";
import { Gift, Sparkles, Heart, Ticket, CheckCircle2, RotateCcw } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface CouponItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
}

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    giftBoxTitle?: string;
    giftBoxDescription?: string;
    couponCode?: string;
    surprises?: CouponItem[];
  };
  theme: ThemeConfig;
}

export function LoveBookChapterSurprise({
  recipientName,
  senderName,
  config,
  theme,
}: Props) {
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);

  const headline = config.headline || "Chapter VI • A Little Surprise";
  const subtext =
    config.subtext || "Untie the golden ribbon to reveal a collection of real, redeemable date-night privileges.";
  const couponCode = config.couponCode || "LOVE-FOREVER-US";

  const surprises: CouponItem[] =
    config.surprises && config.surprises.length > 0
      ? config.surprises
      : [
          {
            id: "cp-1",
            title: "Spontaneous Midnight Ice Cream Run 🍦",
            description: "Valid anytime, no questions asked. I'll drive, you pick the flavors.",
            tag: "Anytime",
          },
          {
            id: "cp-2",
            title: "Master Chef Home Dinner + Movie 🎬",
            description: "I cook your favorite comfort meal and let you choose every movie.",
            tag: "VIP Pass",
          },
          {
            id: "cp-3",
            title: "One Free Argument Win Pass 🏆",
            description: "Hand this to me anytime and I will instantly agree you were 100% right.",
            tag: "Golden Ticket",
          },
        ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 font-serif text-stone-900 select-text overflow-y-auto">
      {/* Chapter Title */}
      <div className="mb-3">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-800 font-bold block mb-1">
          Surprise Unwrapping
        </span>
        <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-[#3a0d15] leading-tight">
          {headline}
        </h2>
        <p className="font-serif text-[11px] sm:text-xs text-stone-600 italic mt-0.5 leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Sealed Gift Box vs. Unboxed Coupons */}
      <div className="my-auto">
        {!isUnboxed ? (
          /* Mounted 3D Gift Box */
          <div
            onClick={() => setIsUnboxed(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsUnboxed(true);
              }
            }}
            className="group cursor-pointer select-none max-w-sm mx-auto bg-gradient-to-br from-[#FFF5F6] via-[#FAF0F2] to-[#F5E1E6] rounded-2xl p-6 sm:p-8 border-2 border-rose-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center relative"
          >
            {/* Animated Ribbon Gift Box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-amber-500 border-2 border-amber-300 shadow-md flex items-center justify-center text-stone-950 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Gift size={28} className="animate-bounce" />
            </div>

            <h3 className="font-serif text-base sm:text-lg font-bold text-[#3a0d15] mb-1">
              {config.giftBoxTitle || "Tap To Unwrap Your Pass"}
            </h3>
            <p className="text-[11px] font-serif italic text-stone-600 mb-4">
              Special love vouchers prepared by {senderName} for {recipientName}
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-[10px] uppercase tracking-wider shadow-md group-hover:scale-105 transition-transform"
            >
              <Sparkles size={11} />
              <span>Untie The Golden Ribbon</span>
            </button>
          </div>
        ) : (
          /* Unboxed Vouchers List */
          <div className="bg-[#FFFDF9] rounded-xl p-3.5 sm:p-5 border border-amber-200/90 shadow-inner max-h-[350px] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-2 mb-3">
              <span className="font-mono text-[9px] font-bold text-amber-800 uppercase tracking-wider">
                Voucher Code: {couponCode}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                ✓ Valid Forever
              </span>
            </div>

            <div className="space-y-2.5 mb-3">
              {surprises.map((coupon, idx) => (
                <div
                  key={coupon.id || idx}
                  className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5"
                >
                  <Ticket size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-xs font-bold text-[#3a0d15]">
                        {coupon.title}
                      </h4>
                      {coupon.tag && (
                        <span className="font-mono text-[8px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                          {coupon.tag}
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-[11px] text-stone-600 mt-0.5">
                      {coupon.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-900/10">
              <button
                type="button"
                onClick={() => setIsRedeemed(true)}
                disabled={isRedeemed}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-800 text-rose-50 text-[10px] font-bold font-serif hover:bg-rose-900 shadow-sm transition-all"
              >
                {isRedeemed ? (
                  <>
                    <CheckCircle2 size={11} className="text-amber-300" />
                    <span>Redeemed With A Kiss! 💋</span>
                  </>
                ) : (
                  <>
                    <Heart size={11} className="fill-current text-rose-300" />
                    <span>Redeem With A Kiss ❤️</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsUnboxed(false);
                  setIsRedeemed(false);
                }}
                className="text-[10px] text-stone-400 hover:text-stone-700"
              >
                Re-tie ribbon
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Annotation */}
      <div className="mt-2 pt-2 border-t border-amber-900/10 flex items-center justify-between text-[10px] text-stone-500 italic">
        <span className="font-handwriting text-xs text-rose-800">
          &ldquo;The best things in life are the memories we make together.&rdquo;
        </span>
        <span className="font-mono text-[9px]">Page 7</span>
      </div>
    </div>
  );
}
