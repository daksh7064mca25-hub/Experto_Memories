"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Heart,
  Utensils,
  Film,
  IceCream,
  Mail,
  CheckCircle2,
  Ticket,
  Scissors,
} from "lucide-react";
import { CouponBookConfig, ApologyCoupon, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: CouponBookConfig;
  theme: ThemeId;
}

export function CouponBookSection({ config, theme }: Props) {
  const [redeemedMap, setRedeemedMap] = useState<Record<string, string>>({});
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];
  const coupons = config.coupons || [];

  // Load redeemed coupons from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("em_redeemed_coupons");
      if (saved) {
        setRedeemedMap(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleRedeem = (couponId: string) => {
    const dateStr = new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    const updated = {
      ...redeemedMap,
      [couponId]: dateStr,
    };

    setRedeemedMap(updated);
    try {
      localStorage.setItem("em_redeemed_coupons", JSON.stringify(updated));
    } catch {}

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#f43f5e", "#fda4af", "#fbbf24"],
    });
  };

  const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case "utensils":
        return <Utensils size={18} />;
      case "film":
        return <Film size={18} />;
      case "icecream":
        return <IceCream size={18} />;
      case "mail":
        return <Mail size={18} />;
      default:
        return <Heart size={18} />;
    }
  };

  return (
    <section id="sec-coupon-book" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-rose-100 text-rose-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2">
          Special Vouchers 🎟️
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
          {config.headline || "Apology Coupon Book"}
        </h2>
        <p className="text-sm sm:text-base opacity-80 mt-2 max-w-md mx-auto font-sans">
          {config.subtext || "Non-expiring vouchers redeemable anytime. Just tap to redeem!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {coupons.map((coupon, index) => {
          const isRedeemed = Boolean(redeemedMap[coupon.id]);
          const redeemDate = redeemedMap[coupon.id];

          return (
            <div
              key={coupon.id || index}
              className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300 flex flex-col justify-between p-6 ${
                isRedeemed
                  ? "bg-stone-50/70 dark:bg-stone-900/60 border-stone-300 opacity-80"
                  : `${themeConfig.cardBgClass} border-rose-300 dark:border-pink-800 shadow-lg hover:shadow-xl hover:scale-[1.01]`
              }`}
            >
              {/* Cutout notch on sides for ticket look */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-50 dark:bg-slate-950 border-r border-rose-300/70" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-50 dark:bg-slate-950 border-l border-rose-300/70" />

              <div>
                {/* Coupon Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-300">
                      {getIcon(coupon.iconName)}
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-400 tracking-wider">
                      {coupon.code || `COUPON-${index + 1}`}
                    </span>
                  </div>

                  <span className="text-[11px] font-serif italic text-stone-500">
                    {coupon.expiryText || "Never Expires"}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-rose-950 dark:text-pink-100 mb-1">
                  {coupon.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              {/* Redeem Status / Action */}
              <div className="mt-6 pt-4 border-t border-dashed border-rose-200 dark:border-pink-900 flex items-center justify-between">
                {isRedeemed ? (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-pink-400 text-xs font-serif font-bold">
                    <CheckCircle2 size={16} />
                    <span>REDEEMED ON {redeemDate}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRedeem(coupon.id)}
                    className={`px-4 py-2 rounded-full font-serif text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95 ${themeConfig.primaryButtonClass}`}
                  >
                    <Scissors size={13} />
                    <span>Redeem Voucher</span>
                  </button>
                )}

                <span className="text-[10px] text-stone-400 font-mono">100% Guaranteed</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

