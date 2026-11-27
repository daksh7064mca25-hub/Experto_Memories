"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Play,
  Disc,
  Camera,
  QrCode,
  Send,
  CheckCircle2,
  Gift,
} from "lucide-react";

export function HowItWorksSection({ minPrice = 299 }: { minPrice?: number }) {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 px-6 sm:px-10 max-w-7xl mx-auto w-full scroll-mt-20"
      aria-label="How ExpertoMemories Works"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#C5A36A]" />
          <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
            Three Simple Steps
          </span>
          <span className="w-4 h-[1px] bg-[#C5A36A]" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
          How It Works
        </h2>
        <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
          From your heartfelt thoughts to an unforgettable live web experience in three effortless steps.
        </p>
      </div>

      {/* 3 VISUAL STEPS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
        {/* =========================================================================
            STEP 1: CHOOSE YOUR GIFT
        ========================================================================= */}
        <div className="group relative rounded-3xl bg-white border border-[#EAE3D9] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#541D2B]/30 transition-all duration-300">
          <div className="space-y-6">
            {/* Step Number & Category Accent */}
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#C5A36A] tracking-tight">
                01
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#F9ECEF] text-[#541D2B] border border-[#F0D5DC]">
                <Gift size={12} className="text-[#541D2B]" />
                <span>Step One</span>
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors">
                Choose Your Gift
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-2 leading-relaxed font-normal">
                Select the perfect format for your celebration — romantic relationship keepsakes, royal wedding invitations, or birthday wonderlands.
              </p>
            </div>

            {/* Visual Miniature Illustration: Curated Occasion Pills */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE3D9] space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs group-hover:border-[#541D2B]/20 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#541D2B]/10 text-[#541D2B] flex items-center justify-center text-xs">
                    💌
                  </div>
                  <span className="text-xs font-serif font-bold text-[#211715]">
                    Love &amp; Relationship Gifts
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#541D2B] font-semibold">
                  Romantic
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 text-[#8E641D] flex items-center justify-center text-xs">
                    👑
                  </div>
                  <span className="text-xs font-serif font-bold text-[#211715]">
                    Royal Wedding Invitations
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8E641D] font-semibold">
                  Ceremonial
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center text-xs">
                    🎂
                  </div>
                  <span className="text-xs font-serif font-bold text-[#211715]">
                    Birthday Wonderlands
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-700 font-semibold">
                  Celebration
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#F2EDE5] flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-serif italic">Signature formats</span>
            <span className="font-mono text-[11px] text-[#541D2B] font-semibold">
              Explore catalog &rarr;
            </span>
          </div>
        </div>

        {/* =========================================================================
            STEP 2: PERSONALIZE YOUR EXPERIENCE
        ========================================================================= */}
        <div className="group relative rounded-3xl bg-white border border-[#EAE3D9] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#541D2B]/30 transition-all duration-300">
          <div className="space-y-6">
            {/* Step Number & Category Accent */}
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#C5A36A] tracking-tight">
                02
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#F5EFE6] text-[#8C6D3B] border border-[#E8DCBF]">
                <Sparkles size={12} className="text-[#8C6D3B]" />
                <span>Step Two</span>
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors">
                Personalize Your Experience
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-2 leading-relaxed font-normal">
                Add your handwritten letters, polaroid memories, shared songs, and secret surprises in our intuitive editor — completely free to preview.
              </p>
            </div>

            {/* Visual Miniature Illustration: Editor Preview Snippet */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE3D9] space-y-2.5">
              {/* Typewriter letter excerpt */}
              <div className="p-3 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-[9px] font-sans font-bold uppercase text-[#541D2B]">
                  <span>Heartfelt Letter</span>
                  <span className="text-[#C5A36A]">✦ Visual Editor</span>
                </div>
                <p className="font-serif italic text-xs text-[#211715] leading-snug">
                  &ldquo;Every day with you is my favorite memory...&rdquo;
                </p>
              </div>

              {/* Memory Polaroid & Soundtrack Preview */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] flex items-center gap-2 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-[#C5A36A]/15 text-[#8C6D3B] flex items-center justify-center shrink-0">
                    <Camera size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#211715] truncate">Polaroids</p>
                    <p className="text-[8px] text-[#78716C]">Upload Photos</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] flex items-center gap-2 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-[#541D2B]/10 text-[#541D2B] flex items-center justify-center shrink-0">
                    <Disc size={13} className="text-[#541D2B] animate-spin" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#211715] truncate">Soundtrack</p>
                    <p className="text-[8px] text-[#78716C]">Acoustic Music</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#F2EDE5] flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-serif italic">No coding required</span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 size={11} />
              100% Free Live Preview
            </span>
          </div>
        </div>

        {/* =========================================================================
            STEP 3: SHARE YOUR SPECIAL CREATION
        ========================================================================= */}
        <div className="group relative rounded-3xl bg-white border border-[#EAE3D9] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#541D2B]/30 transition-all duration-300">
          <div className="space-y-6">
            {/* Step Number & Category Accent */}
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#C5A36A] tracking-tight">
                03
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Send size={11} className="text-emerald-700" />
                <span>Step Three</span>
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors">
                Share Your Special Creation
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] mt-2 leading-relaxed font-normal">
                Publish securely with a single tap to receive your permanent private link, 1-click WhatsApp delivery, and a printable gold QR gift card.
              </p>
            </div>

            {/* Visual Miniature Illustration: Sharing & QR Mockup */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE3D9] space-y-2.5">
              {/* WhatsApp 1-Click delivery pill */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center font-bold text-xs">
                    💬
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#211715]">1-Click WhatsApp Share</p>
                    <p className="text-[8px] text-[#78716C]">Instant mobile opening</p>
                  </div>
                </div>
                <span className="text-[9px] font-sans font-bold text-[#128C7E] bg-emerald-50 px-2 py-0.5 rounded-md">
                  Delivered
                </span>
              </div>

              {/* Printable Gold QR Card */}
              <div className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#C5A36A]/20 text-[#8C6D3B] flex items-center justify-center">
                    <QrCode size={13} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#211715]">Printable QR Gift Card</p>
                    <p className="text-[8px] text-[#78716C]">Slip into gift box or flowers</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#C5A36A] font-bold">
                  High-Res
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#F2EDE5] flex items-center justify-between text-xs text-[#78716C]">
            <span className="font-serif italic">Single fee from ₹{minPrice}</span>
            <span className="font-mono text-[10px] text-[#541D2B] font-semibold">
              12 Mo Hosting Included
            </span>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS BOTTOM ACTION */}
      <div className="mt-14 sm:mt-16 text-center space-y-3">
        <Link
          href="/dashboard/create"
          className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-sans font-semibold text-sm bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-md transition-all hover:shadow-lg active:scale-98 group"
        >
          <span>Start Creating Your Story</span>
          <ArrowRight
            size={15}
            className="text-[#C5A36A] transition-transform group-hover:translate-x-1"
          />
        </Link>
        <p className="text-xs font-sans text-[#78716C]">
          100% Free to personalize and preview • Pay only when satisfied and ready to publish
        </p>
      </div>
    </section>
  );
}
