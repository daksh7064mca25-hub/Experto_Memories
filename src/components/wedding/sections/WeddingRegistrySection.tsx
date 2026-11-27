"use client";

import React, { useState } from "react";
import { WeddingRegistryConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Gift, Heart, Copy, Check, QrCode, CreditCard, Sparkles } from "lucide-react";

interface Props {
  config?: WeddingRegistryConfig;
  theme: WeddingThemeStyles;
}

export const WeddingRegistrySection: React.FC<Props> = ({ config, theme }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const headline = config?.headline || "Registry & Auspicious Shagun";
  const subtext =
    config?.subtext ||
    "Your presence and heartfelt blessings are the greatest gifts we could ever ask for.";
  const message =
    config?.message ||
    "Having you celebrate our sacred union is our greatest blessing. For guests who have graciously enquired about gifting or traditional shagun, details are provided below.";

  const hasBankDetails = Boolean(
    config?.bankName || config?.accountNumber || config?.upiId
  );

  const handleCopy = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center" id="registry-section">
      {/* Header */}
      <div className="mb-12">
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-3 ${theme.accentBadge}`}>
          <Gift size={13} className="text-[#D4AF37]" />
          <span>Shagun &amp; Blessings</span>
        </div>
        <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 ${theme.textPrimary}`}>
          {headline}
        </h2>
        <p className={`text-sm sm:text-base max-w-xl mx-auto font-serif italic ${theme.textSecondary}`}>
          {subtext}
        </p>
      </div>

      {/* Main Gift & Shagun Card */}
      <div className={`rounded-3xl p-6 sm:p-10 border shadow-xl max-w-2xl mx-auto ${theme.cardBg} ${theme.cardBorder}`}>
        {/* Sacred Shagun Motif */}
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto mb-6 shadow-md">
          <Heart size={26} className="fill-[#D4AF37]/30" />
        </div>

        <p className="font-serif text-sm sm:text-base italic leading-relaxed text-[#FAF7F2] mb-6 max-w-lg mx-auto">
          {message}
        </p>

        {/* BANK & UPI DETAILS (Only if host provided them) */}
        {hasBankDetails ? (
          <div className="mt-8 space-y-4 text-left max-w-md mx-auto">
            {/* UPI ID Card */}
            {config?.upiId && (
              <div className="p-4 rounded-2xl bg-black/30 border border-[#D4AF37]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-wider text-[#D4AF37] font-semibold">
                      UPI ID
                    </span>
                    <p className="font-mono text-xs sm:text-sm text-white font-bold break-all">
                      {config.upiId}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(config.upiId!, "upi")}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-serif text-[#FDE68A] flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copiedField === "upi" ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Bank Transfer Details */}
            {(config?.bankName || config?.accountNumber) && (
              <div className="p-5 rounded-2xl bg-black/30 border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                  <CreditCard size={16} className="text-[#D4AF37]" />
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#D4AF37]">
                    Bank Transfer Details
                  </span>
                </div>

                {config.accountHolder && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">Account Holder:</span>
                    <span className="text-white font-semibold">{config.accountHolder}</span>
                  </div>
                )}

                {config.bankName && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">Bank:</span>
                    <span className="text-white font-semibold">{config.bankName}</span>
                  </div>
                )}

                {config.accountNumber && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-semibold">{config.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(config.accountNumber!, "acc")}
                        className="p-1 rounded text-stone-300 hover:text-white"
                        title="Copy Account Number"
                      >
                        {copiedField === "acc" ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {config.ifscCode && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-400">IFSC Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-semibold">{config.ifscCode}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(config.ifscCode!, "ifsc")}
                        className="p-1 rounded text-stone-300 hover:text-white"
                        title="Copy IFSC"
                      >
                        {copiedField === "ifsc" ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Graceful Traditional Etiquette Note when no bank/UPI is configured */
          <div className="mt-4 p-4 rounded-2xl bg-black/20 border border-[#D4AF37]/20 max-w-md mx-auto">
            <p className="text-xs sm:text-sm font-serif text-[#FDE68A] italic">
              “Your love, laughter, and presence at our celebrations are the only gifts we request. No boxed gifts, please.”
            </p>
          </div>
        )}

        {/* Custom Registry Note */}
        {config?.registryNote && (
          <p className="mt-6 text-xs text-[#E6D9C8]/80 font-serif italic max-w-md mx-auto">
            {config.registryNote}
          </p>
        )}
      </div>
    </section>
  );
};
