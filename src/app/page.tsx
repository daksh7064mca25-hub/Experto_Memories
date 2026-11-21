"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Music,
  Calendar,
  Smartphone,
  ChevronDown,
  Gift,
  Disc,
  Play,
  Mail,
  Camera,
  Star,
  Layers,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { CATALOG_PRODUCTS } from "@/config/products";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { KeepsakeAtelierSection } from "@/components/home/KeepsakeAtelierSection";

export default function ExpertoMemoriesStorefront() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<
    "letters" | "polaroids" | "soundtrack" | "scratch" | "timeline" | "games" | "vault" | "security"
  >("letters");

  // Dynamic Storefront Pricing from Authoritative Engine
  const [pricing, setPricing] = useState<{
    basePrice: number;
    occasionPrices: Record<string, number>;
    products: Array<{ slug: string; occasionType: string; price: number; originalPrice?: number }>;
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

  // Track window scroll for sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: "What is ExpertoMemories?",
      a: "ExpertoMemories is a digital gifting studio that enables you to create personalized, interactive gift websites for your loved ones. Rather than sending a fleeting text or a static card, you build a private, cinematic web experience complete with handwritten love letters, polaroid photo memories, background acoustic music, couple games, and interactive surprises.",
    },
    {
      q: "Can I customize my gift website myself?",
      a: "Yes, completely! Our self-service Visual Studio Editor requires no technical knowledge or coding skills. You can write your own personal notes, upload photographs, choose background music, adjust color themes, and reorder sections with simple visual controls.",
    },
    {
      q: "Is customization free?",
      a: "Yes, 100%. You can create an account, start a project, write your letters, upload photos, and preview the entire live experience across mobile, tablet, and desktop viewports without paying a single rupee.",
    },
    {
      q: "Do I have to pay before editing?",
      a: "No. You never pay upfront. You only pay when you are completely satisfied with your preview and ready to publish your website live to share with your recipient.",
    },
    {
      q: "What happens after payment?",
      a: "Immediately upon payment confirmation, your gift website is published to its permanent, private live link (e.g. expertomemories.in/gift/your-story). You receive a 1-click WhatsApp sharing link and a high-resolution printable QR gift card to include in physical gift boxes or flowers.",
    },
    {
      q: "Can I add my own photographs and music?",
      a: "Yes! You can upload high-resolution photographs directly into your memory gallery and upload custom MP3/WAV audio tracks, or choose from our pre-cleared collection of romantic acoustic soundtracks.",
    },
    {
      q: "Can I password-protect my gift?",
      a: "Yes. In the editor's Access & Security tab, you can enable password protection and set a personal passphrase along with a secret hint. Only someone who enters the correct password will be able to unlock and view your personal letters and memories.",
    },
    {
      q: "How long will my gift website remain accessible?",
      a: "Every published gift website includes 12 full months of high-speed cloud hosting on secure global CDN infrastructure. You can extend or renew your hosting at any time directly from your customer dashboard.",
    },
    {
      q: "Can I share my gift through WhatsApp?",
      a: "Yes! Your published website includes a pre-formatted WhatsApp share button that generates an elegant message and your private link, designed specifically for a magical mobile viewing experience.",
    },
    {
      q: "Can I request a custom domain?",
      a: "Yes. During checkout or from your customer dashboard, you can connect your own custom domain (e.g. www.elenaandmarcus.love). We provide simple CNAME instructions to connect your custom web address directly to your gift website.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211715] flex flex-col font-sans selection:bg-[#541D2B]/15 selection:text-[#541D2B]">
      {/* 1. TOP ANNOUNCEMENT RIBBON */}
      <div className="bg-[#211715] text-[#FAF7F2] text-[11px] py-2 px-4 text-center font-sans tracking-wider border-b border-[#3A2D2A]">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span className="text-[#C5A36A]">✦</span>
          <span>
            Bespoke Interactive Digital Gifts • Free to Customize &amp; Preview • 12 Months Cloud Hosting Included
          </span>
          <span className="text-[#C5A36A]">✦</span>
        </div>
      </div>

      {/* 2. REFINED EDITORIAL HEADER & NAVIGATION (ZERO ADMIN LINKS) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-sm py-3.5"
            : "bg-[#FAF7F2] border-b border-[#EFE9DF] py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Identity / Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#541D2B] text-[#FAF7F2] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Heart size={16} className="fill-current text-[#FAF7F2]" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#211715] block leading-none">
                ExpertoMemories
              </span>
              <span className="text-[9px] font-sans tracking-[0.22em] text-[#541D2B] font-semibold uppercase block mt-1">
                Digital Gifting Studio
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-sans font-medium text-[#292524] tracking-wide">
            <Link
              href="/gifts"
              className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
            >
              Digital Gifts
            </Link>
            <Link
              href="/weddings"
              className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all flex items-center gap-1.5"
            >
              <span>Wedding Invitations</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C5A36A]/20 text-[#541D2B] px-1.5 py-0.5 rounded-full">
                Royal
              </span>
            </Link>
            <Link
              href="/birthdays"
              className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
            >
              Birthdays
            </Link>
            <a
              href="#how-it-works"
              className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
            >
              How It Works
            </a>
            <Link
              href="/faq"
              className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
            >
              FAQ
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/customer/login"
              className="text-xs font-sans font-semibold text-[#292524] hover:text-[#541D2B] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-semibold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#431622] shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <span>Create Celebration</span>
              <ArrowRight size={13} className="text-[#C5A36A]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#211715] hover:bg-[#F2EDE5] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8E2D8] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-3 text-sm font-sans font-medium text-[#292524]">
              <a
                href="#experiences"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#541D2B]"
              >
                Explore Gifts
              </a>
              <a
                href="#interactive"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#541D2B]"
              >
                Experiences
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#541D2B]"
              >
                How It Works
              </a>
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#541D2B]"
              >
                Our Story
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#541D2B]"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-col gap-3">
              <Link
                href="/customer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full text-xs font-semibold text-[#211715] border border-[#E8E2D8] bg-white"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard/create"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full text-xs font-semibold bg-[#541D2B] text-[#FAF7F2]"
              >
                Create Your Gift
              </Link>
            </div>
          </div>
        )}
      </header>

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
                href="/gifts"
                className="px-8 py-4 rounded-full font-sans font-semibold text-sm bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-md transition-all hover:shadow-lg active:scale-98 flex items-center justify-center gap-2.5 group"
              >
                <span>Explore Digital Gifts</span>
                <ArrowRight size={15} className="text-[#C5A36A] transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/weddings"
                className="px-7 py-4 rounded-full font-sans font-semibold text-sm bg-white hover:bg-[#F2EDE5] text-[#211715] border border-[#E0D8CB] transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <Sparkles size={14} className="text-[#C5A36A]" />
                <span>Discover Wedding Invitations</span>
              </Link>
            </div>

            {/* Supporting Microcopy */}
            <div className="pt-2">
              <p className="text-xs font-sans text-[#78716C] tracking-wide">
                Create for free. Preview everything. Pay only when you&rsquo;re ready to publish.
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

      {/* 4. MASTER PRODUCT DIVISIONS & SIGNATURE EXPERIENCES */}
      <section id="experiences" className="py-20 sm:py-28 px-6 sm:px-10 max-w-7xl mx-auto w-full scroll-mt-20">
        <KeepsakeAtelierSection />

        {/* Featured Signature Occasions Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EAE3D9]">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#211715]">
            Featured Signature Experiences
          </h3>
          <span className="text-xs font-serif text-stone-500">
            Free to customize &bull; Preview live
          </span>
        </div>

        {/* Occasion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* 1. APOLOGY */}
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

          {/* 2. ANNIVERSARY */}
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

          {/* 3. BIRTHDAY */}
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

          {/* 4. LOVE */}
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
                  Letters Across Time
                </h3>
                <p className="text-xs font-sans font-medium text-[#B82D4F] mt-1">
                  Turn your feelings into an experience.
                </p>
                <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                  For romantic milestones, anniversaries, or long-distance partners. A digital keepsake filled with handwritten love letters, starry constellation maps, and secret scratch cards.
                </p>
              </div>

              {/* Included Elements */}
              <div className="pt-4 border-t border-[#F2EDE5] space-y-2 text-xs text-[#292524]">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Stargazer Night Sky Map of when you first met</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Interactive Polaroid Scrapbook with love notes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Scratch-to-Reveal Card with shimmering gold coating</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82D4F]" />
                  <span>Secret encrypted love note unlocked with personal passcode</span>
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

          {/* 5. ROYAL WEDDING INVITATION */}
          <div className="bg-gradient-to-br from-[#2E0B14] via-[#48111E] to-[#1F070E] text-[#FAF7F2] rounded-3xl border border-[#D4AF37]/50 p-8 sm:p-10 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all group md:col-span-2 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  Royal Wedding Collection &bull; 10 Traditions
                </span>
                <span className="font-serif font-bold text-base text-[#FAF7F2]">
                  ₹{weddingPricing.price}
                  {weddingPricing.originalPrice && weddingPricing.originalPrice > weddingPricing.price && (
                    <span className="text-xs text-stone-400 line-through font-normal ml-1.5">
                      ₹{weddingPricing.originalPrice}
                    </span>
                  )}
                </span>
              </div>

              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors">
                  The Royal Wedding Experience
                </h3>
                <p className="text-xs font-serif italic text-[#D4AF37] mt-1">
                  Grand Jharokha Door Reveal, Palatial Splendor &amp; Vedic Traditions
                </p>
                <p className="text-sm text-[#E6D9C8] mt-3 leading-relaxed">
                  A royal invitation website with animated double doors, Shehnai melodies, multi-event agendas (Haldi, Sangeet, Pheras &amp; Reception), Google Maps navigation, couple portrait gallery, and integrated guest RSVP tracking engine.
                </p>
              </div>

              {/* Included Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-[#D4AF37]/30 text-xs text-[#E6D9C8]">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Animated Royal Door / Monogram Reveal Ceremony</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Multi-Event Agenda with Google Maps Navigation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Guest RSVP Attendance Tracking &amp; Meal Preferences</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>One-Click WhatsApp Sharing &amp; Printable QR Card</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 mt-6 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center gap-3 relative z-10">
              <Link
                href="/demo/wedding?collection=royal-indian"
                className="w-full sm:flex-1 py-3.5 px-4 rounded-full text-xs font-serif font-semibold text-center bg-black/50 hover:bg-black/70 text-[#FAF7F2] border border-[#D4AF37]/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye size={14} className="text-[#D4AF37]" />
                <span>Experience Live Royal Demo</span>
              </Link>
              <Link
                href="/weddings"
                className="w-full sm:flex-1 py-3.5 px-4 rounded-full text-xs font-serif font-semibold text-center bg-gradient-to-r from-[#C5A36A] via-[#D4AF37] to-[#B8924B] text-[#2E0B14] shadow-md transition-all hover:brightness-110 flex items-center justify-center gap-1.5"
              >
                <span>Explore All 10 Collections</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE EXPERIENCE SHOWCASE (PART 6) */}
      <section id="interactive" className="py-20 sm:py-28 bg-[#F2EDE5] border-y border-[#EAE3D9] px-6 sm:px-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#C5A36A]" />
              <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
                Crafted Features
              </span>
              <span className="w-4 h-[1px] bg-[#C5A36A]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
              Not Just a Gift. An Experience.
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
              Ordinary cards are discarded in days. An ExpertoMemories website is an immersive, private world designed to be reopened and cherished forever.
            </p>
          </div>

          {/* Bento-style Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Heartfelt Letters */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center mb-4">
                  <Mail size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Heartfelt Letters
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Typewriter animations, personalized salutations, and authentic handwritten styling that reveals your thoughts paragraph by paragraph.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C] italic font-handwriting text-base">
                &ldquo;Every word, exactly as you felt it.&rdquo;
              </div>
            </div>

            {/* 2. Polaroid Photo Memories */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#C5A36A]/15 text-[#8C6D3B] flex items-center justify-center mb-4">
                  <Camera size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Polaroid Scrapbooks
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Authentic photo cards with realistic rotations (-3° to 4°), washi tape details, handwritten dates, and full-screen lightbox viewing.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C]">
                Tap any photo to view in high resolution
              </div>
            </div>

            {/* 3. Background Music */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#D94B70]/10 text-[#D94B70] flex items-center justify-center mb-4">
                  <Music size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Acoustic Soundtracks
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  A tender vinyl player with acoustic melodies that play gently as your recipient reads through memories on their phone.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C]">
                Upload your song or choose curated tracks
              </div>
            </div>

            {/* 4. Interactive Surprises */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center mb-4">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Scratch &amp; Reveal
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Touch and cursor-friendly HTML5 Canvas scratch cards with shimmering metallic coating hiding secret promises and coupons.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C]">
                Realistic scratch-off foil feedback
              </div>
            </div>

            {/* 5. Couple Trivia & Minigames */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#C5A36A]/15 text-[#8C6D3B] flex items-center justify-center mb-4">
                  <Heart size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Couple Trivia &amp; Games
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Playful relationship quizzes and 20-second mini-games that make your gift joyful, conversational, and fun to explore.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C]">
                Customizable questions &amp; funny hints
              </div>
            </div>

            {/* 6. Secret Whispers */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#D94B70]/10 text-[#D94B70] flex items-center justify-center mb-4">
                  <Star size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Secret Whispers
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Press and hold the glowing heart for 3 seconds with circular progress animation to unlock an intimate secret thought.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C]">
                Hold-to-unlock haptic interaction
              </div>
            </div>

            {/* 7. Milestone Timelines */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center mb-4">
                  <Calendar size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Milestone Timelines
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Chronological chapters tracing where your journey started, key anniversaries, funny memories, and upcoming adventures.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C]">
                Day counters &amp; chapter badges
              </div>
            </div>

            {/* 8. Password Protected Experiences */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#C5A36A]/15 text-[#8C6D3B] flex items-center justify-center mb-4">
                  <Lock size={18} />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#211715] mb-2">
                  Password Protection
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Keep your memories strictly between the two of you with cryptographic bcrypt password protection and secret hint reminders.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#F2EDE5] text-[11px] font-sans text-[#78716C]">
                Signed, tamper-resistant security
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (PART 7) */}
      <section id="how-it-works" className="py-20 sm:py-28 px-6 sm:px-10 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
            <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
              Simple &amp; Effortless
            </span>
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
            From your heartfelt thoughts to an unforgettable live website in four effortless steps.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-4">
            <span className="font-serif text-3xl font-bold text-[#C5A36A]">
              01
            </span>
            <h3 className="font-serif font-bold text-lg text-[#211715]">
              Choose Your Experience
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Select from our 4 signature formats — Apology, Anniversary, Birthday, or Love — and choose a starting aesthetic color palette.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-4">
            <span className="font-serif text-3xl font-bold text-[#C5A36A]">
              02
            </span>
            <h3 className="font-serif font-bold text-lg text-[#211715]">
              Make It Yours
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Add your personal photographs, heartfelt letters, songs, shared memories, trivia, and secret surprises in the Visual Studio Editor.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-4">
            <span className="font-serif text-3xl font-bold text-[#C5A36A]">
              03
            </span>
            <h3 className="font-serif font-bold text-lg text-[#211715]">
              Preview It for Free
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Test your entire website on mobile, tablet, and desktop frames. Read through your letters and listen to the music completely free before paying.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-4">
            <span className="font-serif text-3xl font-bold text-[#C5A36A]">
              04
            </span>
            <h3 className="font-serif font-bold text-lg text-[#211715]">
              Publish &amp; Share
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Complete your one-time publishing payment securely (from ₹{minPrice}) and receive your permanent link with 1-click WhatsApp delivery and a printable gift QR card.
            </p>
          </div>
        </div>

        {/* How it works CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-sans font-semibold text-xs bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-sm transition-all hover:shadow-md"
          >
            <span>See How It Works</span>
            <ArrowRight size={13} className="text-[#C5A36A]" />
          </Link>
        </div>
      </section>

      {/* 7. SHOWCASE THE ACTUAL GIFT EXPERIENCE (PART 8) */}
      <section className="py-20 sm:py-28 bg-[#FAF7F2] border-t border-[#EAE3D9] px-6 sm:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#C5A36A]" />
              <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
                The Recipient Experience
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715] leading-tight">
              Imagine Their Reaction.
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
              Picture them opening your link on WhatsApp while having coffee, or scanning a gold QR code tucked inside a bouquet of roses.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#541D2B]/10 text-[#541D2B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <p className="text-xs text-[#292524] leading-relaxed">
                  <strong>A personalized opening greeting:</strong> A bespoke 3D wax envelope with their name unfolds in slow motion with delicate confetti.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#541D2B]/10 text-[#541D2B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <p className="text-xs text-[#292524] leading-relaxed">
                  <strong>Background acoustic music:</strong> Your shared song begins playing as they scroll through Polaroid photos of your best memories together.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#541D2B]/10 text-[#541D2B] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <p className="text-xs text-[#292524] leading-relaxed">
                  <strong>Deeply emotional letters:</strong> Handcrafted typewriter typography that shares what words alone could never say in a simple text message.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/demo/anniversary"
                className="px-7 py-3.5 rounded-full font-sans font-semibold text-xs bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-sm transition-all flex items-center gap-2"
              >
                <Eye size={14} className="text-[#C5A36A]" />
                <span>Experience a Live Demo</span>
              </Link>
              <Link
                href="/demo/apology"
                className="text-xs font-sans font-semibold text-[#541D2B] hover:underline"
              >
                Or try Apology Demo →
              </Link>
            </div>
          </div>

          {/* Right: Realistic Visual Snapshot */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#F2EDE5] pb-4">
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#78716C] uppercase">
                Interactive Preview Snapshot
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Demo Ready
              </span>
            </div>

            {/* Simulated Live Section Previews */}
            <div className="space-y-4">
              {/* Envelope Component Preview */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#541D2B] text-[#C5A36A] flex items-center justify-center font-serif font-bold text-xs">
                    💌
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#211715]">
                      The Mysterious Wax Envelope
                    </h4>
                    <p className="text-[10px] text-[#78716C]">
                      &ldquo;A Little Sorry, A Lot of Love — Tap seal to break open&rdquo;
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-sans font-semibold text-[#541D2B]">
                  Unfolds 3D
                </span>
              </div>

              {/* Photo Scrapbook Preview */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A36A]/20 text-[#8C6D3B] flex items-center justify-center text-sm">
                    📸
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#211715]">
                      Scrapbook Polaroids
                    </h4>
                    <p className="text-[10px] text-[#78716C]">
                      Washi tape, handwritten captions, and full-screen lightbox
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-sans font-semibold text-[#541D2B]">
                  Interactive
                </span>
              </div>

              {/* Secret Whisper Heart */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D94B70]/15 text-[#D94B70] flex items-center justify-center text-sm">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#211715]">
                      Secret Passcode Vault
                    </h4>
                    <p className="text-[10px] text-[#78716C]">
                      Protected memories unlocked with your personal passphrase
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-sans font-semibold text-[#541D2B]">
                  Bcrypt Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRUST AND TRANSPARENCY (PART 9) */}
      <section className="py-20 sm:py-28 bg-[#F2EDE5] border-t border-[#EAE3D9] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#C5A36A]" />
              <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
                Honest Policies
              </span>
              <span className="w-4 h-[1px] bg-[#C5A36A]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
              Crafted with Care. Transparent by Design.
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
              We believe meaningful gifting requires absolute honesty. No fine print, no unexpected renewals, and zero fabricated claims.
            </p>
          </div>

          {/* 4 Pillars of Transparency */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#211715]">
                Free to Customize &amp; Preview
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Take as long as you need to edit your letters, upload photos, and preview across all devices without paying a single rupee.
              </p>
            </div>

            <div className="p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C5A36A]/15 text-[#8C6D3B] flex items-center justify-center">
                <Gift size={18} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#211715]">
                Single All-Inclusive Fee
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Starting from ₹{minPrice} when you choose to publish. Never any hidden recurring subscriptions or unexpected add-on costs.
              </p>
            </div>

            <div className="p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D94B70]/10 text-[#D94B70] flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#211715]">
                12 Months Cloud Hosting Included
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Includes 12 full months of secure high-speed cloud hosting on global Cloudflare infrastructure, subject to our renewal policy.
              </p>
            </div>

            <div className="p-7 bg-white rounded-3xl border border-[#EAE3D9] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center">
                <Lock size={18} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#211715]">
                Private &amp; In Your Control
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                You retain full control over your project. Optional cryptographic password protection keeps your intimate words strictly confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BRAND STORY (ANCHOR #story) */}
      <section id="story" className="py-20 sm:py-28 bg-[#FAF7F2] border-t border-[#EAE3D9] px-6 sm:px-10 scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
            <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
              Our Philosophy
            </span>
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
            Why We Created ExpertoMemories
          </h2>

          <div className="space-y-5 text-sm sm:text-base text-[#57534E] leading-relaxed font-normal max-w-2xl mx-auto">
            <p>
              In a digital world dominated by 2-second WhatsApp messages and disappearing stories, heartfelt moments risk losing their intentionality.
            </p>
            <p>
              We founded ExpertoMemories to combine the permanence and poetry of old-fashioned love letters with the magic of modern interactive design. Whether you are asking for forgiveness, celebrating five years of marriage, or making a birthday unforgettable, your feelings deserve a dedicated, beautiful home.
            </p>
          </div>

          <div className="pt-4">
            <span className="font-serif italic text-lg text-[#541D2B]">
              — The ExpertoMemories Studio Team
            </span>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION (PART 10) */}
      <section id="faq" className="py-20 sm:py-28 bg-[#FAF7F2] border-t border-[#EAE3D9] px-6 sm:px-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#EAE3D9] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.22em] uppercase text-[#541D2B]">
                Here To Help
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A36A] animate-pulse" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#211715]">
              Everything You&apos;d Love to Know
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
              Clear, transparent answers about creating, personalizing, previewing, and publishing your private digital gift website.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Reassurance & Support Panel */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#EAE3D9] shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#C5A36A] font-semibold mb-2">
                    <Sparkles size={12} className="text-[#C5A36A]" />
                    <span>Thoughtful &amp; Transparent</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#211715] leading-snug">
                    A little clarity before the magic begins
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed mt-2.5">
                    From your first draft to the moment your recipient breaks the wax seal, we&apos;ve designed every step to be effortless, transparent, and completely in your control.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2EDE5] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#541D2B]/8 text-[#541D2B] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#211715]">
                        100% Free Live Preview
                      </h4>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        Customize letters, photos, and music without any upfront payment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#C5A36A]/15 text-[#8C6D3B] flex items-center justify-center shrink-0 mt-0.5">
                      <Gift size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#211715]">
                        Starting from ₹{minPrice} When Publishing
                      </h4>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        One single fee with zero recurring subscriptions or hidden costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#D94B70]/10 text-[#D94B70] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#211715]">
                        12 Months Cloud Hosting Included
                      </h4>
                      <p className="text-[11px] text-[#78716C] leading-relaxed">
                        Secure high-speed delivery with optional dashboard renewal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/faq"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold bg-[#541D2B] hover:bg-[#682435] text-white shadow-md shadow-[#541D2B]/15 transition-all hover:scale-[1.01]"
                  >
                    <span>View Full FAQ Hub &amp; Support</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: FAQ Accordion */}
            <div className="lg:col-span-7">
              <FaqAccordion initialOpenIndex={0} showCategoryFilter={true} />
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CONVERSION SECTION (PART 11) */}
      <section className="py-20 sm:py-28 bg-[#FAF7F2] border-t border-[#EAE3D9] px-6 sm:px-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
            <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase text-[#541D2B]">
              Start For Free
            </span>
            <span className="w-4 h-[1px] bg-[#C5A36A]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#211715] leading-tight">
            Make Something They&rsquo;ll Remember.
          </h2>

          <p className="text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
            Your memories deserve more than a simple message. Create a personalized experience they&rsquo;ll want to open again and again.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/create"
              className="w-full sm:w-auto px-9 py-4 rounded-full font-sans font-semibold text-sm bg-[#541D2B] hover:bg-[#431622] text-[#FAF7F2] shadow-md transition-all hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 group"
            >
              <span>Start Creating for Free</span>
              <ArrowRight size={15} className="text-[#C5A36A] transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#experiences"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-sans font-semibold text-sm bg-white hover:bg-[#F2EDE5] text-[#211715] border border-[#E0D8CB] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Gift Experiences</span>
            </a>
          </div>

          <div className="pt-3">
            <p className="text-xs font-sans text-[#78716C]">
              No credit card required to start • Free preview across all devices
            </p>
          </div>
        </div>
      </section>

      {/* 12. FOOTER (PART 12) (ZERO ADMIN ROUTES) */}
      <footer className="w-full bg-[#211715] text-[#A8A29E] py-16 px-6 sm:px-10 border-t border-[#3A2D2A] text-xs font-sans">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#541D2B] text-[#FAF7F2] flex items-center justify-center">
                  <Heart size={14} className="fill-current text-[#FAF7F2]" />
                </div>
                <div>
                  <span className="font-serif font-bold text-lg text-[#FAF7F2] block leading-none">
                    ExpertoMemories
                  </span>
                  <span className="text-[9px] font-sans tracking-[0.2em] text-[#C5A36A] uppercase block mt-1">
                    Digital Gifting Studio
                  </span>
                </div>
              </div>
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
                  <a href="#experiences" className="hover:text-white transition-colors">
                    Explore Gifts
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#story" className="hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="mailto:support@expertomemories.in" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
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
                  <a href="#faq" className="hover:text-white transition-colors">
                    Help &amp; Support
                  </a>
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
                    Refund Policy
                  </Link>
                </li>
              </ul>
              <div className="pt-2">
                <p className="text-[10px] text-[#78716C] leading-relaxed">
                  Support concierge:{" "}
                  <a href="mailto:support@expertomemories.in" className="text-[#C5A36A] hover:underline">
                    support@expertomemories.in
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
