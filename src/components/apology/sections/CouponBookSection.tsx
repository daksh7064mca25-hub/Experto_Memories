"use client";

import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Heart,
  Utensils,
  Film,
  IceCream,
  Mail,
  CheckCircle2,
  Scissors,
  Sparkles,
  Lock,
  AlertCircle,
} from "lucide-react";
import { CouponBookConfig, ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Props {
  config: CouponBookConfig;
  theme: ThemeId;
  projectSlug?: string;
  initialRedemptions?: Record<string, string>;
}

export function CouponBookSection({
  config,
  theme,
  projectSlug = "default",
  initialRedemptions = {},
}: Props) {
  const [redeemedMap, setRedeemedMap] = useState<Record<string, string>>(initialRedemptions);
  const [confirmingCouponId, setConfirmingCouponId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];
  const coupons = config.coupons || [];

  // 1. Configurable redemption limit (default 2)
  const maxRedemptions = typeof config.maxRedemptions === "number" ? config.maxRedemptions : 2;
  const redeemedCount = Object.keys(redeemedMap).length;
  const remainingCount = Math.max(0, maxRedemptions - redeemedCount);
  const isLimitReached = remainingCount <= 0;

  const storageKey = `em_redeemed_coupons_${projectSlug || "default"}`;

  // 5. Load and sync persistent state
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const saved =
          localStorage.getItem(storageKey) || localStorage.getItem("em_redeemed_coupons");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            setRedeemedMap((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {}
    });

    // If viewing a published gift, fetch authoritative server redemptions
    if (projectSlug && projectSlug !== "default" && !projectSlug.startsWith("demo-")) {
      fetch(`/api/gift/${projectSlug}/redeem-coupon`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.redemptions) {
            setRedeemedMap((prev) => {
              const merged = { ...prev, ...data.redemptions };
              try {
                localStorage.setItem(storageKey, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        })
        .catch(() => {});
    }
  }, [projectSlug, storageKey]);

  // Execute redemption after confirmation
  const handleExecuteRedeem = useCallback(
    async (couponId: string) => {
      if (isSubmitting || redeemedMap[couponId] || remainingCount <= 0) {
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      const dateStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const updated = {
        ...redeemedMap,
        [couponId]: dateStr,
      };

      // Optimistic client update & local storage cache
      setRedeemedMap(updated);
      setConfirmingCouponId(null);

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}

      // Play joyful romantic celebration confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.68 },
        colors: ["#f43f5e", "#fda4af", "#fbbf24", "#e11d48", "#fbcfe8"],
      });

      // Server persistence for published gifts
      if (projectSlug && projectSlug !== "default" && !projectSlug.startsWith("demo-")) {
        try {
          const res = await fetch(`/api/gift/${projectSlug}/redeem-coupon`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ couponId }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            // If server rejected (e.g. limit was already reached or coupon redeemed)
            if (data?.redemptions) {
              setRedeemedMap(data.redemptions);
            }
            if (data?.error) {
              setErrorMessage(data.error);
            }
          } else {
            const data = await res.json();
            if (data?.redemptions) {
              setRedeemedMap(data.redemptions);
              try {
                localStorage.setItem(storageKey, JSON.stringify(data.redemptions));
              } catch {}
            }
          }
        } catch {
          // Network failure: optimistic local redemption remains intact
        }
      }

      setIsSubmitting(false);
    },
    [isSubmitting, redeemedMap, remainingCount, storageKey, projectSlug]
  );

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
      {/* 2. SECTION HEADER & DYNAMIC RECIPIENT MESSAGES */}
      <div className="text-center mb-8">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-medium bg-rose-100 text-rose-700 dark:bg-pink-900/40 dark:text-pink-300 mb-2">
          Special Vouchers 🎟️
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-rose-950 dark:text-pink-100">
          {config.headline || "Apology Coupon Book"}
        </h2>
        <p className="text-sm sm:text-base opacity-80 mt-2 max-w-md mx-auto font-sans">
          {config.subtext || "Non-expiring vouchers redeemable anytime. Just tap to redeem!"}
        </p>

        {/* Dynamic Instruction Message */}
        <p
          data-testid="coupon-instruction-message"
          className="font-serif italic text-sm sm:text-base text-rose-700 dark:text-pink-300 mt-3"
        >
          You have {maxRedemptions} special {maxRedemptions === 1 ? "wish" : "wishes"} to redeem.
          Choose {maxRedemptions === 1 ? "it" : "them"} wisely!
        </p>

        {/* Dynamic Counter Pill */}
        <div className="mt-4 flex items-center justify-center">
          <div
            data-testid="coupon-wishes-counter"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 dark:bg-rose-950/60 border border-rose-200/80 text-rose-900 dark:text-pink-200 text-xs sm:text-sm font-serif font-bold shadow-xs"
          >
            <Sparkles size={14} className="text-amber-500 fill-amber-400" />
            <span>
              {remainingCount} of {maxRedemptions} {maxRedemptions === 1 ? "wish" : "wishes"} remaining
            </span>
          </div>
        </div>

        {/* 4. Limit Reached Thoughtful Message */}
        {isLimitReached && (
          <div
            data-testid="coupon-limit-reached-banner"
            className="mt-5 p-4 rounded-2xl bg-rose-50/95 dark:bg-rose-950/40 border border-rose-200/90 text-center max-w-lg mx-auto shadow-xs animate-in fade-in duration-300"
          >
            <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-pink-300 font-serif font-semibold text-sm mb-1">
              <Heart size={16} className="fill-rose-500 text-rose-500 animate-pulse" />
              <span>Special Wishes Complete</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-900/90 dark:text-pink-200/90 leading-relaxed font-sans">
              All your special wishes have been used. Every one was chosen with love.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            <AlertCircle size={14} className="text-amber-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 3 & 4. COUPON TICKETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        {coupons.map((coupon, index) => {
          const isRedeemed = Boolean(redeemedMap[coupon.id]);
          const redeemDate = redeemedMap[coupon.id];
          const isConfirming = confirmingCouponId === coupon.id;

          return (
            <div
              key={coupon.id || index}
              data-testid={`coupon-card-${coupon.id}`}
              data-redeemed={isRedeemed ? "true" : "false"}
              className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300 flex flex-col justify-between p-6 ${
                isRedeemed
                  ? "bg-rose-50/40 dark:bg-stone-900/70 border-rose-300/80 shadow-xs"
                  : isLimitReached
                  ? "bg-stone-50/60 dark:bg-stone-900/50 border-stone-300 dark:border-stone-800 opacity-80"
                  : `${themeConfig.cardBgClass} border-rose-300 dark:border-pink-800 shadow-md hover:shadow-lg hover:scale-[1.01]`
              }`}
            >
              {/* Cutout notch on sides for vintage ticket look */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-50 dark:bg-slate-950 border-r border-rose-300/70 pointer-events-none" />
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-pink-50 dark:bg-slate-950 border-l border-rose-300/70 pointer-events-none" />

              {/* 3. ROMANTIC REDEEMED STAMP EFFECT */}
              {isRedeemed && (
                <div
                  data-testid={`coupon-stamp-${coupon.id}`}
                  className="absolute top-4 right-4 sm:top-5 sm:right-6 pointer-events-none select-none z-10 rotate-[-12deg] animate-in zoom-in-75 duration-300"
                >
                  <div className="px-3 py-1 rounded-md border-2 border-dashed border-rose-600 bg-rose-50/95 dark:bg-rose-950/90 text-rose-600 dark:text-rose-400 font-mono font-black text-xs tracking-widest shadow-sm flex items-center gap-1">
                    <Heart size={11} className="fill-rose-500 text-rose-500" />
                    <span>REDEEMED</span>
                  </div>
                </div>
              )}

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

                  {!isRedeemed && (
                    <span className="text-[11px] font-serif italic text-stone-500">
                      {coupon.expiryText || "Never Expires"}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-rose-950 dark:text-pink-100 mb-1">
                  {coupon.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              {/* Redeem Status / Action Area */}
              <div className="mt-6 pt-4 border-t border-dashed border-rose-200 dark:border-pink-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {isRedeemed ? (
                  <div
                    data-testid={`coupon-redeemed-status-${coupon.id}`}
                    className="flex items-center gap-2 text-rose-700 dark:text-pink-300 text-xs font-serif font-bold"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>REDEEMED ON {redeemDate}</span>
                  </div>
                ) : isConfirming ? (
                  /* 3. CONFIRMATION INTERACTION */
                  <div
                    data-testid={`coupon-confirm-box-${coupon.id}`}
                    className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full p-2.5 rounded-xl bg-pink-100/90 dark:bg-pink-950/70 border border-pink-300/80 animate-in fade-in duration-200"
                  >
                    <span className="text-xs font-serif font-semibold text-rose-900 dark:text-pink-200">
                      Redeem this special wish?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-testid={`confirm-redeem-btn-${coupon.id}`}
                        disabled={isSubmitting}
                        onClick={() => handleExecuteRedeem(coupon.id)}
                        className="px-3.5 py-1.5 rounded-full font-serif text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? "Redeeming..." : "Yes, Redeem ❤️"}
                      </button>
                      <button
                        type="button"
                        data-testid={`cancel-redeem-btn-${coupon.id}`}
                        disabled={isSubmitting}
                        onClick={() => setConfirmingCouponId(null)}
                        className="px-2.5 py-1.5 rounded-full font-serif text-xs text-stone-600 hover:text-stone-900 dark:text-stone-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : isLimitReached ? (
                  /* 4. DISABLED STATE WHEN LIMIT IS REACHED */
                  <div
                    data-testid={`coupon-disabled-limit-${coupon.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-serif italic select-none"
                  >
                    <Lock size={13} className="text-stone-400" />
                    <span>Wish limit reached</span>
                  </div>
                ) : (
                  /* INITIAL UNREDEEMED ACTIVE BUTTON */
                  <button
                    type="button"
                    data-testid={`redeem-voucher-btn-${coupon.id}`}
                    onClick={() => setConfirmingCouponId(coupon.id)}
                    className={`px-4 py-2 rounded-full font-serif text-xs font-semibold flex items-center justify-center gap-1.5 transition-transform active:scale-95 ${themeConfig.primaryButtonClass}`}
                  >
                    <Scissors size={13} />
                    <span>Redeem Voucher</span>
                  </button>
                )}

                <span className="text-[10px] text-stone-400 font-mono text-right select-none">
                  100% Guaranteed
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
