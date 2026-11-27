"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  ChevronDown,
  Gift,
  Disc,
  Play,
  Camera,
  Star,
  Menu,
  X,
} from "lucide-react";
import { KeepsakeAtelierSection } from "@/components/home/KeepsakeAtelierSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { PublicHeader } from "@/components/navigation/PublicHeader";

export default function ExpertoMemoriesStorefront() {

  // Dynamic Storefront Pricing and Visibility from Authoritative Engine
  const [pricing, setPricing] = useState<{
    basePrice: number;
    occasionPrices: Record<string, number>;
    products: Array<{ slug: string; occasionType: string; price: number; originalPrice?: number; isActive?: boolean }>;
  }>({
    basePrice: 999,
    occasionPrices: {
      anniversary: 299,
      apology: 349,
      birthday: 351,
      love: 349,
      wedding: 999,
    },
    products: [],
  });

  useEffect(() => {
    fetch("/api/settings/pricing", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing) setPricing(d.pricing);
      })
      .catch(() => {});
  }, []);

  const isProductVisible = (occasionOrSlug: string) => {
    const key = occasionOrSlug.toLowerCase();
    const prodMatch = pricing.products?.find(
      (p) => p.slug.toLowerCase() === key || p.occasionType.toLowerCase() === key
    );
    return prodMatch ? prodMatch.isActive !== false : true;
  };

  const getOccasionPricing = (occasionOrSlug: string, fallbackPrice = 999, fallbackOriginal = 1999) => {
    const key = occasionOrSlug.toLowerCase();
    const activePrice = pricing.occasionPrices?.[key] ?? fallbackPrice;
    const prodMatch = pricing.products?.find(
      (p) => p.slug.toLowerCase() === key || p.occasionType.toLowerCase() === key
    );
    const originalPrice = prodMatch?.originalPrice ?? fallbackOriginal;
    return {
      price: activePrice,
      originalPrice: originalPrice > activePrice ? originalPrice : null,
    };
  };

  const activePrices = Object.values(pricing.occasionPrices || {}).filter((p) => typeof p === "number" && p > 0);
  const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : 299;

  const apologyPricing = getOccasionPricing("apology", 349, 1999);
  const anniversaryPricing = getOccasionPricing("anniversary", 299, 1999);
  const birthdayPricing = getOccasionPricing("birthday", 351, 1799);
  const lovePricing = getOccasionPricing("love", 349, 1799);
  const weddingPricing = getOccasionPricing("wedding", 999, 2999);

  const handleViewLiveDemosClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow standard browser modifier behavior (open in new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    const targetElement = document.getElementById("experiences");
    if (targetElement) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      // Update URL hash without causing page reload or duplicate history entries
      if (typeof window !== "undefined" && window.location.hash !== "#experiences") {
        window.history.pushState(null, "", "#experiences");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211715] flex flex-col font-sans selection:bg-[#541D2B]/15 selection:text-[#541D2B]">
      {/* UNIVERSAL PUBLIC NAVBAR */}
      <PublicHeader />

      {/* 3. HERO SECTION (PART 4) */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 px-6 sm:px-10 border-b border-[#EAE3D9]">
        {/* Subtle decorative background tint */}
        <div className="absolute inset-0 bg-radial from-[#FAF7F2] via-[#FAF7F2] to-[#F5EFE6] -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2.5">
              <span className="w-5 h-[1px] bg-[#C5A36A]" />
              <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
                Luxury Digital Celebration Studio
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-[#211715] leading-[1.12]">
              Every Celebration Deserves <br />
              <span className="text-[#541D2B] italic font-serif">a Beautiful Story.</span>
            </h1>

            {/* Supporting Text */}
            <p className="font-sans text-base sm:text-lg text-[#57534E] max-w-xl leading-relaxed font-normal">
              Transform your deepest emotions, relationship milestones, and wedding announcements into bespoke interactive websites with acoustic music, polaroids, multi-event agendas, and real-time guest RSVPs.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/dashboard/create"
                className="px-8 py-4 rounded-full font-sans font-semibold text-sm bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-md transition-all hover:shadow-lg active:scale-98 flex items-center justify-center gap-2.5 group"
              >
                <span>Create a Gift for Free</span>
                <ArrowRight size={15} className="text-[#C5A36A] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#experiences"
                onClick={handleViewLiveDemosClick}
                className="px-7 py-4 rounded-full font-sans font-semibold text-sm bg-white hover:bg-[#F2EDE5] text-[#211715] border border-[#E0D8CB] transition-all flex items-center justify-center gap-2 shadow-2xs group"
              >
                <Eye size={15} className="text-[#C5A36A] transition-transform group-hover:scale-110" />
                <span>View Live Demos</span>
              </Link>
            </div>

            {/* Supporting Microcopy */}
            <div className="pt-2">
              <p className="text-xs font-sans text-[#78716C] tracking-wide">
                Create and preview your gift for free. Pay only when you&rsquo;re ready to publish.
              </p>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-6 border-t border-[#EAE3D9] flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-[#57534E] font-sans">
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-[#541D2B]" />
                <span>Mobile, Tablet &amp; Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#C5A36A]" />
                <span>Private &amp; Password Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700" />
                <span>12 Months Cloud Hosting</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Composition Preview of a Gift Website */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Decorative subtle frame glow */}
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
              {/* Background tilted Polaroid Card (Decorative Touch) */}
              <div className="absolute -top-6 -right-4 sm:-right-6 w-44 sm:w-52 p-3 bg-white rounded-xl shadow-lg border border-[#EAE3D9] rotate-6 z-10 hidden sm:block">
                <div className="aspect-[4/3] bg-gradient-to-tr from-[#F4E3D7] to-[#FCEEE6] rounded flex items-center justify-center text-stone-400">
                  <Camera size={24} className="text-[#C5A36A]/60" />
                </div>
                <div className="pt-2 text-center">
                  <p className="font-handwriting text-base text-[#211715] leading-tight">
                    Our sunset in Udaipur • 2024
                  </p>
                </div>
              </div>

              {/* Background Wax Envelope Badge (Decorative Touch) */}
              <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white py-2.5 px-4 rounded-2xl shadow-lg border border-[#EAE3D9] -rotate-3 z-30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#541D2B] text-[#C5A36A] flex items-center justify-center font-serif text-xs font-bold shadow-xs">
                  EM
                </div>
                <div>
                  <p className="text-[11px] font-sans font-bold text-[#211715] leading-none">
                    Wax-Sealed Promises
                  </p>
                  <p className="text-[9px] font-sans text-[#78716C] mt-0.5">
                    Tap to open letter
                  </p>
                </div>
              </div>

              {/* Main Device Mockup Frame */}
              <div className="relative bg-[#211715] p-3 rounded-[38px] shadow-2xl border-4 border-[#3A2D2A] z-20 overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#140E0D] rounded-full z-40" />

                {/* Inner Screen Display */}
                <div className="bg-[#FAF7F2] rounded-[30px] overflow-hidden border border-[#EAE3D9] aspect-[9/16] max-h-[520px] flex flex-col justify-between text-left p-5 relative select-none">
                  {/* Gift Header */}
                  <div className="pt-6 text-center space-y-1">
                    <span className="text-[9px] font-sans font-bold tracking-widest uppercase text-[#541D2B] block">
                      OUR FOREVER STORY
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#211715]">
                      Elena &amp; Marcus
                    </h3>
                    <p className="text-[10px] text-[#78716C]">
                      Chapter 5: Five Years of Magic
                    </p>
                  </div>

                  {/* Visual Gift Content Vignette */}
                  <div className="space-y-3.5 my-auto">
                    {/* Floating Audio Player pill */}
                    <div className="bg-white/90 backdrop-blur-xs border border-[#EAE3D9] rounded-xl p-2.5 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#541D2B] text-white flex items-center justify-center">
                          <Play size={10} className="fill-current" />
                        </div>
                        <div>
                          <p className="text-[10px] font-sans font-bold text-[#211715] leading-none">
                            Can&rsquo;t Help Falling in Love
                          </p>
                          <p className="text-[8px] text-[#78716C]">Acoustic Guitar Soundtrack</p>
                        </div>
                      </div>
                      <Disc size={14} className="text-[#C5A36A] animate-spin" />
                    </div>

                    {/* Letter excerpt card */}
                    <div className="bg-[#F2EDE5] p-3 rounded-xl border border-[#E0D8CB] space-y-1">
                      <p className="text-[9px] font-sans font-semibold text-[#541D2B] uppercase tracking-wider">
                        A Letter For You
                      </p>
                      <p className="font-handwriting text-sm text-[#211715] leading-snug">
                        &ldquo;From that quiet cafe corner to every adventure since, every moment with you has felt like home...&rdquo;
                      </p>
                    </div>

                    {/* Milestones bar */}
                    <div className="bg-white p-2.5 rounded-xl border border-[#EAE3D9] flex items-center justify-around text-center">
                      <div>
                        <p className="font-serif text-xs font-bold text-[#541D2B]">1,826</p>
                        <p className="text-[8px] text-[#78716C]">Days Together</p>
                      </div>
                      <div className="w-[1px] h-6 bg-[#EAE3D9]" />
                      <div>
                        <p className="font-serif text-xs font-bold text-[#541D2B]">14</p>
                        <p className="text-[8px] text-[#78716C]">Cities Visited</p>
                      </div>
                      <div className="w-[1px] h-6 bg-[#EAE3D9]" />
                      <div>
                        <p className="font-serif text-xs font-bold text-[#541D2B]">∞</p>
                        <p className="text-[8px] text-[#78716C]">Memories Made</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Hint */}
                  <div className="text-center pb-2">
                    <span className="inline-flex items-center gap-1 text-[9px] font-sans font-semibold text-[#541D2B] bg-[#541D2B]/5 px-3 py-1 rounded-full border border-[#541D2B]/10">
                      <span>Swipe up to open memories</span>
                      <ChevronDown size={10} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GIFT CATEGORIES — ATELIER COLLECTIONS */}
      <section id="categories" className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto w-full scroll-mt-20 border-b border-[#EAE3D9]">
        <KeepsakeAtelierSection />
      </section>

      {/* 3. FEATURED EXPERIENCES — SIGNATURE TEMPLATES */}
      <section id="experiences" className="py-16 sm:py-24 px-6 sm:px-10 max-w-7xl mx-auto w-full scroll-mt-20 border-b border-[#EAE3D9]">
        {/* Featured Signature Occasions Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
            <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
              Interactive Keepsakes
            </span>
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
            Featured Signature Experiences
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
            Every template is a complete, interactive world. Preview a live sample or start personalizing yours for free.
          </p>
        </div>

        {/* Occasion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* 1. APOLOGY */}
          {isProductVisible("apology") && (
          <div className="bg-white rounded-3xl border border-[#EAE3D9] p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#F9ECEF] text-[#541D2B] border border-[#F0D5DC]">
                  Apology Experience
                </span>
                <span className="font-serif font-bold text-base text-[#211715]">
                  ₹{apologyPricing.price.toLocaleString("en-IN")}{" "}
                  {apologyPricing.originalPrice && (
                    <span className="text-xs text-stone-400 line-through font-normal">
                      ₹{apologyPricing.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors">
                  A Little Sorry, A Lot of Love
                </h3>
                <p className="text-xs font-sans font-medium text-[#D94B70] mt-1">
                  Say what words alone cannot.
                </p>
                <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                  A tender, respectful, non-coercive experience designed to rebuild trust, share earnest promises, revisit cherished memories, and give your partner space to feel heard.
                </p>
              </div>

              {/* Included Elements */}
              <div className="pt-4 border-t border-[#F2EDE5] space-y-2 text-xs text-[#292524]">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D94B70]" />
                  <span>3D Wax-Sealed Opening Envelope with heart reveal</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D94B70]" />
                  <span>Interactive Memory Scrapbook with polaroid photos &amp; captions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D94B70]" />
                  <span>Interactive Forgiveness Garden &amp; Catch My Love minigame</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D94B70]" />
                  <span>Apology Coupon Book &amp; gentle dual-choice emotional finale</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 mt-6 border-t border-[#F2EDE5] flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/demo/apology"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#FAF7F2] hover:bg-[#F2EDE5] text-[#211715] border border-[#E0D8CB] transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} className="text-[#541D2B]" />
                <span>Experience a Live Demo</span>
              </Link>
              <Link
                href="/dashboard/create?occasion=apology"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Create This Gift</span>
                <ArrowRight size={13} className="text-[#C5A36A]" />
              </Link>
            </div>
          </div>
          )}

          {/* 2. ANNIVERSARY */}
          {isProductVisible("anniversary") && (
          <div className="bg-white rounded-3xl border border-[#EAE3D9] p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#F5EFE6] text-[#8C6D3B] border border-[#E8DCBF]">
                  Anniversary Experience
                </span>
                <span className="font-serif font-bold text-base text-[#211715]">
                  ₹{anniversaryPricing.price.toLocaleString("en-IN")}{" "}
                  {anniversaryPricing.originalPrice && (
                    <span className="text-xs text-stone-400 line-through font-normal">
                      ₹{anniversaryPricing.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors">
                  Our Forever Story
                </h3>
                <p className="text-xs font-sans font-medium text-[#C5A36A] mt-1">
                  Celebrate every chapter together.
                </p>
                <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                  A bespoke celebration of your journey together. Features milestone timelines, couple trivia quizzes, glowing constellation memories, and an interactive vinyl turntable lounge.
                </p>
              </div>

              {/* Included Elements */}
              <div className="pt-4 border-t border-[#F2EDE5] space-y-2 text-xs text-[#292524]">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A]" />
                  <span>Relationship Milestones Timeline with chapter badges</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A]" />
                  <span>Interactive &ldquo;How Well Do You Know Us?&rdquo; Couple Quiz</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A]" />
                  <span>Celestial Constellation with tap-to-reveal glowing memories</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A]" />
                  <span>Turntable Vinyl Lounge with manual needle scrubber</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 mt-6 border-t border-[#F2EDE5] flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/demo/anniversary"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#FAF7F2] hover:bg-[#F2EDE5] text-[#211715] border border-[#E0D8CB] transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} className="text-[#541D2B]" />
                <span>Experience a Live Demo</span>
              </Link>
              <Link
                href="/dashboard/create?occasion=anniversary"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Create This Gift</span>
                <ArrowRight size={13} className="text-[#C5A36A]" />
              </Link>
            </div>
          </div>
          )}

          {/* 3. BIRTHDAY */}
          {isProductVisible("birthday") && (
          <div className="bg-white rounded-3xl border border-[#EAE3D9] p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#F3EEF9] text-[#6B3FA0] border border-[#E0D2F0]">
                  Birthday Experience
                </span>
                <span className="font-serif font-bold text-base text-[#211715]">
                  ₹{birthdayPricing.price.toLocaleString("en-IN")}{" "}
                  {birthdayPricing.originalPrice && (
                    <span className="text-xs text-stone-400 line-through font-normal">
                      ₹{birthdayPricing.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors">
                  The Birthday Chronicle
                </h3>
                <p className="text-xs font-sans font-medium text-[#6B3FA0] mt-1">
                  Make their special day unforgettable.
                </p>
                <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                  An immersive birthday celebration made exclusively for them. Features an interactive cake candle blowout, milestone photo memory wall, tributes, and celebratory confetti.
                </p>
              </div>

              {/* Included Elements */}
              <div className="pt-4 border-t border-[#F2EDE5] space-y-2 text-xs text-[#292524]">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B3FA0]" />
                  <span>Interactive Birthday Cake with tap-to-blow candle animation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B3FA0]" />
                  <span>Year-by-Year Memory Photo Wall with custom messages</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B3FA0]" />
                  <span>Mystery Gift Box unboxing interaction with celebratory confetti</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B3FA0]" />
                  <span>Custom Birthday Soundtrack with atmospheric background music</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 mt-6 border-t border-[#F2EDE5] flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/demo/birthday"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#FAF7F2] hover:bg-[#F2EDE5] text-[#211715] border border-[#E0D8CB] transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} className="text-[#541D2B]" />
                <span>Experience a Live Demo</span>
              </Link>
              <Link
                href="/dashboard/create?occasion=birthday"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Create This Gift</span>
                <ArrowRight size={13} className="text-[#C5A36A]" />
              </Link>
            </div>
          </div>
          )}

          {/* 4. LOVE */}
          {isProductVisible("love") && (
          <div className="bg-white rounded-3xl border border-[#EAE3D9] p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#FBEBED] text-[#B82D4F] border border-[#F4CCD3]">
                  Love &amp; Romance
                </span>
                <span className="font-serif font-bold text-base text-[#211715]">
                  ₹{lovePricing.price.toLocaleString("en-IN")}{" "}
                  {lovePricing.originalPrice && (
                    <span className="text-xs text-stone-400 line-through font-normal">
                      ₹{lovePricing.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors">
                  Our Little Love Story
                </h3>
                <p className="text-xs font-sans font-medium text-[#B82D4F] mt-1">
                  An interactive digital romantic love storybook.
                </p>
                <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                  For boyfriends, girlfriends, and partners. An authentic digital keepsake book with realistic turning pages, wax-sealed love letters, polaroid memories, love coupons, and acoustic melodies.
                </p>
              </div>

              {/* Included Elements */}
              <div className="pt-4 border-t border-[#F2EDE5] space-y-2 text-xs text-[#292524]">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Realistic turning pages with physical book cover &amp; paper physics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Wax-sealed love letters with typewriter animation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Interactive Polaroid scrapbook with personal photo album</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Scratch-to-reveal love coupons &amp; romantic minigame surprises</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 mt-6 border-t border-[#F2EDE5] flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/demo/love"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#FAF7F2] hover:bg-[#F2EDE5] text-[#211715] border border-[#E0D8CB] transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} className="text-[#541D2B]" />
                <span>Experience a Live Demo</span>
              </Link>
              <Link
                href="/dashboard/create?occasion=love"
                className="w-full sm:flex-1 py-3 px-4 rounded-full text-xs font-sans font-semibold text-center bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Create This Gift</span>
                <ArrowRight size={13} className="text-[#C5A36A]" />
              </Link>
            </div>
          </div>
          )}

          {/* 5. ROYAL WEDDING INVITATION — THE ROYAL INVITATION REVEAL */}
          {isProductVisible("wedding") && (
          <div className="bg-gradient-to-br from-[#24060E] via-[#380D18] to-[#180309] text-[#FAF7F2] rounded-3xl border border-[#D4AF37]/45 hover:border-[#D4AF37] p-8 sm:p-10 shadow-xl hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.25)] transition-all duration-500 group md:col-span-2 relative overflow-hidden ring-1 ring-[#D4AF37]/20 hover:ring-[#D4AF37]/40">
            {/* Ambient Antique Gold Lighting Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_70%_20%,rgba(212,175,55,0.18),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-3 rounded-[1.3rem] border border-dashed border-[#D4AF37]/20 group-hover:border-[#D4AF37]/35 transition-colors duration-500 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Editorial Invitation Presentation */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#D4AF37]/15 text-[#E6C687] border border-[#D4AF37]/30 shadow-xs">
                    <Sparkles size={11} className="text-[#D4AF37]" />
                    <span>The Wedding Atelier &bull; 7 Traditions</span>
                  </div>
                  <span className="font-serif font-bold text-base text-[#FAF7F2]">
                    ₹{weddingPricing.price}{" "}
                    {weddingPricing.originalPrice && weddingPricing.originalPrice > weddingPricing.price && (
                      <span className="text-xs text-stone-400 line-through font-normal ml-1">
                        ₹{weddingPricing.originalPrice}
                      </span>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF7F2] group-hover:text-[#F6E6C8] transition-colors leading-tight">
                    The Royal Wedding Collection
                  </h3>
                  <p className="text-xs sm:text-sm font-serif italic text-[#D4AF37] mt-1.5">
                    Where sacred traditions meet unforgettable digital storytelling.
                  </p>
                  <p className="text-xs sm:text-sm text-[#E6D9C8]/90 mt-3 leading-relaxed max-w-xl font-normal">
                    Invite your loved ones through a bespoke ceremonial website featuring animated palace doors, Shehnai melodies, multi-event agendas with Google Maps navigation, and effortless real-time RSVP guest tracking.
                  </p>
                </div>

                {/* Cultural Heritage Highlights */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-serif text-[#D4AF37]">
                  <span className="px-2.5 py-1 rounded-full bg-black/30 border border-[#D4AF37]/30">Royal Indian</span>
                  <span className="px-2.5 py-1 rounded-full bg-black/30 border border-[#D4AF37]/30">Traditional Hindu</span>
                  <span className="px-2.5 py-1 rounded-full bg-black/30 border border-[#D4AF37]/30">Punjabi</span>
                  <span className="px-2.5 py-1 rounded-full bg-black/30 border border-[#D4AF37]/30">Luxury Couture</span>
                  <span className="px-2.5 py-1 rounded-full bg-black/30 border border-[#D4AF37]/30">Nikahnama</span>
                </div>

                {/* Single Strong Action & Secondary Live Preview */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/weddings"
                    className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-serif font-bold bg-gradient-to-r from-[#C5A36A] via-[#D4AF37] to-[#B8924B] text-[#24060E] shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore 7 Wedding Collections</span>
                    <ArrowRight size={13} />
                  </Link>
                  <Link
                    href="/demo/wedding?collection=royal-indian"
                    className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-serif font-semibold text-[#E6C687] hover:text-white bg-black/40 hover:bg-black/60 border border-[#D4AF37]/35 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye size={13} className="text-[#D4AF37]" />
                    <span>Experience Live Royal Demo</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Illustrated Royal Doorway Artwork with Gentle Opening Hover */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div
                  className="relative w-[210px] h-[190px] sm:w-[230px] sm:h-[210px] rounded-t-full bg-gradient-to-b from-[#1C040B] to-[#120207] border-2 border-[#D4AF37]/50 shadow-2xl p-2.5 flex items-center justify-center overflow-hidden"
                  style={{ perspective: "800px" }}
                >
                  {/* Inner Warm Candlelight Glow & Palatial Arch */}
                  <div className="absolute inset-0 bg-radial from-[#D4AF37]/25 via-transparent to-transparent pointer-events-none" />

                  {/* Inner Invitation Leaf Revealed on Hover */}
                  <div className="absolute inset-3 rounded-t-full bg-gradient-to-b from-[#2E0B14] to-[#180309] border border-[#D4AF37]/30 flex flex-col items-center justify-center text-center p-3 z-0">
                    <Sparkles size={16} className="text-[#D4AF37] mb-1 animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase">Auspicious Union</span>
                    <span className="font-serif text-lg font-bold text-white tracking-tight mt-0.5">Aanya &amp; Kabir</span>
                    <span className="text-[8px] font-serif italic text-stone-300 mt-1">Grand Palace Udaipur</span>
                  </div>

                  {/* Left Palace Door */}
                  <div
                    className="absolute inset-y-0 left-0 w-1/2 rounded-tl-full bg-gradient-to-r from-[#3D0F1B] via-[#2F0B15] to-[#250810] border-r border-[#D4AF37]/60 shadow-md transition-transform duration-700 ease-out z-10 flex items-center justify-end pr-1 origin-left group-hover:-rotate-y-45"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Royal Door Gold Filigree Inset */}
                    <div className="w-8 h-16 rounded-l-full border border-dashed border-[#D4AF37]/40 flex items-center justify-end pr-0.5">
                      <span className="text-[10px] text-[#D4AF37]">✦</span>
                    </div>
                  </div>

                  {/* Right Palace Door */}
                  <div
                    className="absolute inset-y-0 right-0 w-1/2 rounded-tr-full bg-gradient-to-l from-[#3D0F1B] via-[#2F0B15] to-[#250810] border-l border-[#D4AF37]/60 shadow-md transition-transform duration-700 ease-out z-10 flex items-center justify-start pl-1 origin-right group-hover:rotate-y-45"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Royal Door Gold Filigree Inset */}
                    <div className="w-8 h-16 rounded-r-full border border-dashed border-[#D4AF37]/40 flex items-center justify-start pl-0.5">
                      <span className="text-[10px] text-[#D4AF37]">✦</span>
                    </div>
                  </div>

                  {/* Center Monogram Seal at Door Join */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E6C687] via-[#D4AF37] to-[#99772B] border border-[#FFF0BA] shadow-lg flex items-center justify-center text-[#24060E] font-serif font-bold text-xs z-20 group-hover:scale-110 transition-transform duration-500">
                    EM
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Defensive fallback when all experiences are hidden */}
          {!isProductVisible("apology") &&
            !isProductVisible("anniversary") &&
            !isProductVisible("birthday") &&
            !isProductVisible("love") &&
            !isProductVisible("wedding") && (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-[#EAE3D9] p-8 max-w-md mx-auto">
                <Sparkles size={32} className="mx-auto text-[#C5A36A] mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#211715] mb-1">
                  Signature Experiences Updating
                </h4>
                <p className="text-xs text-[#57534E]">
                  Our bespoke celebration experiences are currently being updated with new designs. Please check back shortly.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* 4. HOW IT WORKS — THREE CLEAR VISUAL STEPS */}
      <HowItWorksSection minPrice={minPrice} />

      {/* 5. CUSTOMER REVIEWS & TESTIMONIALS */}
      <CustomerReviewsSection />

      {/* 6. MINIMAL FOOTER */}
      <footer className="w-full bg-[#211715] text-[#A8A29E] py-16 px-6 sm:px-10 border-t border-[#3A2D2A] text-xs font-sans">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-5 space-y-4">
              <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group" aria-label="ExpertoMemories Home">
                <div className="relative h-8 sm:h-9 w-auto shrink-0 flex items-center">
                  <Image
                    src="/branding/expertomemories-monogram.png"
                    alt="ExpertoMemories EM Monogram"
                    width={505}
                    height={321}
                    loading="eager"
                    className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#FAF7F2] block leading-none">
                  ExpertoMemories
                </span>
              </Link>
              <p className="text-xs text-[#A8A29E] leading-relaxed max-w-sm font-normal">
                Crafting bespoke interactive digital gift websites that turn feelings, photographs, and memories into unforgettable keepsakes.
              </p>
              <div className="text-[11px] text-[#78716C]">
                From ₹{minPrice} per published website. Includes 12 months cloud hosting.
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-[11px] font-sans font-bold tracking-widest text-[#FAF7F2] uppercase">
                Explore
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/gifts" className="hover:text-white transition-colors">
                    Love &amp; Relationship Gifts
                  </Link>
                </li>
                <li>
                  <Link href="/weddings" className="hover:text-white transition-colors">
                    Wedding Invitations
                  </Link>
                </li>
                <li>
                  <Link href="/birthdays" className="hover:text-white transition-colors">
                    Birthdays
                  </Link>
                </li>
                <li>
                  <a href="#experiences" className="hover:text-white transition-colors">
                    Featured Experiences
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Workspace Links */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-[11px] font-sans font-bold tracking-widest text-[#FAF7F2] uppercase">
                Customer Studio
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/customer/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    My Websites
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/create" className="hover:text-white transition-colors">
                    Create Celebration
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    Help &amp; Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="lg:col-span-3 space-y-3">
              <p className="text-[11px] font-sans font-bold tracking-widest text-[#FAF7F2] uppercase">
                Legal &amp; Trust
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-white transition-colors">
                    Refund &amp; Cancellation
                  </Link>
                </li>
              </ul>
              <div className="pt-2">
                <p className="text-[10px] text-[#78716C] leading-relaxed">
                  Support concierge:{" "}
                  <a href="mailto:support@expertomemories.shop" className="text-[#C5A36A] hover:underline">
                    support@expertomemories.shop
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#3A2D2A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716C]">
            <p>&copy; {new Date().getFullYear()} ExpertoMemories Studio. All rights reserved.</p>
            <p className="font-serif italic text-xs text-[#A8A29E]">
              &ldquo;Some moments deserve more than a message.&rdquo;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
