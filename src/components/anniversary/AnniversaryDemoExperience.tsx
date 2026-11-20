"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createAnniversaryDemoProject } from "@/config/anniversary-demo-data";
import { AnniversaryRenderer } from "@/components/anniversary/AnniversaryRenderer";
import { AnniversaryThemeId } from "@/types/website";
import {
  Sparkles,
  RotateCcw,
  ExternalLink,
  Palette,
  Heart,
  Info,
  Maximize2,
  ChevronDown,
  ArrowLeft,
  Gift,
} from "lucide-react";

interface Props {
  initialTheme?: AnniversaryThemeId;
  isEmbedded?: boolean;
}

export function AnniversaryDemoExperience({
  initialTheme = "pink-paradise",
  isEmbedded = false,
}: Props) {
  const [theme, setTheme] = useState<AnniversaryThemeId>(initialTheme);
  const [demoKey, setDemoKey] = useState<number>(0);
  const [isInIframe, setIsInIframe] = useState<boolean>(isEmbedded);
  const [isBannerMinimized, setIsBannerMinimized] = useState<boolean>(false);

  // Detect iframe embedding on mount & reset demo session storage
  useEffect(() => {
    try {
      const inIframe = window.self !== window.top;
      setIsInIframe(inIframe || isEmbedded);
    } catch {
      setIsInIframe(true);
    }

    // Reset demo quiz and bucket list state on fresh demo mount
    try {
      localStorage.removeItem("anniversary_bucket_list_demo-anniversary");
      localStorage.removeItem("anniv_quiz_completed_demo-anniversary");
    } catch {}
  }, [isEmbedded]);

  const handleResetDemo = () => {
    try {
      localStorage.removeItem("anniversary_bucket_list_demo-anniversary");
      localStorage.removeItem("anniv_quiz_completed_demo-anniversary");
    } catch {}
    setDemoKey((prev) => prev + 1);
  };

  const projectData = createAnniversaryDemoProject(theme);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans">
      {/* 1. CLEARLY IDENTIFIABLE DEMO MODE HEADER */}
      <aside
        aria-label="ExpertoMemories Sample Demo Mode"
        className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-200/80 shadow-md transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Demo Identity Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-serif font-bold text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
              <Sparkles size={13} className="text-amber-200" />
              <span>LIVE DEMO</span>
            </span>

            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-rose-950 text-xs">
                ExpertoMemories Preview Experience
              </span>
              <span className="text-[11px] text-rose-700/80">
                Fictional sample: Sophia &amp; Lucas • Product: &ldquo;Our Forever Story&rdquo;
              </span>
            </div>
          </div>

          {/* Controls: Theme Switcher, Reset, Popout & Customize */}
          <div className="flex items-center gap-2">
            {/* Back to Gifts */}
            <Link
              href="/#products"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-white border border-rose-200 text-stone-700 hover:bg-rose-50 transition-colors shadow-sm"
              title="Return to Gifts Catalog"
            >
              <ArrowLeft size={12} />
              <span className="hidden md:inline">Back to Gifts</span>
            </Link>

            {/* Theme selector */}
            <div className="flex items-center gap-1.5 bg-rose-50/80 border border-rose-200/80 px-2.5 py-1 rounded-xl">
              <Palette size={13} className="text-rose-500" />
              <label htmlFor="anniv-demo-theme-select" className="sr-only">Choose Theme</label>
              <select
                id="anniv-demo-theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value as AnniversaryThemeId)}
                className="bg-transparent text-rose-900 font-serif font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="pink-paradise">Pink Paradise 🎀</option>
                <option value="golden-forever">Golden Forever ✨</option>
                <option value="our-universe">Our Universe 🌌</option>
                <option value="sunset-love">Sunset Love 🌅</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetDemo}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
              title="Reset Demo Experience"
            >
              <RotateCcw size={13} />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            {/* Customize Button */}
            <Link
              href="/dashboard/create?occasion=anniversary"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-transform hover:scale-105"
            >
              <Gift size={12} />
              <span>Customize</span>
            </Link>

            {/* Minimize Banner Button */}
            <button
              type="button"
              onClick={() => setIsBannerMinimized(!isBannerMinimized)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 sm:hidden"
              title="Toggle banner details"
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isBannerMinimized ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Informational Sub-banner (Mobile collapsible) */}
        {!isBannerMinimized && (
          <div className="bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-pink-50/90 border-t border-rose-100 px-4 py-1.5 text-[11px] text-rose-800 text-center flex items-center justify-center gap-2">
            <Info size={12} className="text-rose-500 shrink-0" />
            <span>
              This is a demonstration for ExpertoMemories customers. All 10 interactive sections are active. Audio requires manual play tap.
            </span>
          </div>
        )}
      </aside>

      {/* 2. REUSABLE ANNIVERSARY RENDERER (Cleanly isolated, uses sample project data) */}
      <main className="flex-1 w-full bg-[#fdfaf8]">
        <AnniversaryRenderer key={demoKey} project={projectData} previewMode={false} />
      </main>

      {/* 3. FLOATING ACTION PILL (BOTTOM-RIGHT) */}
      <div className="fixed bottom-4 right-4 z-40">
        <Link
          href="/dashboard/create?occasion=anniversary"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 transition-all hover:scale-105"
        >
          <Gift size={14} />
          <span>Customize This Anniversary Gift</span>
        </Link>
      </div>

      {/* 4. SHOPIFY IFRAME FALLBACK / EMBED NOTICE */}
      <noscript>
        <div className="p-6 bg-rose-50 text-rose-900 text-center font-serif text-sm">
          Please enable JavaScript in your browser to view the interactive ExpertoMemories Anniversary Demo.
        </div>
      </noscript>

      {/* Embedded Iframe Helper Overlay Button (Mobile) */}
      {isInIframe && (
        <aside
          aria-label="Full screen popout helper"
          className="fixed bottom-16 right-4 z-40 bg-stone-900/90 hover:bg-stone-900 text-white px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-1.5 text-xs font-serif transition-transform hover:scale-105"
        >
          <a
            href={`/demo/anniversary?theme=${theme}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5"
          >
            <Maximize2 size={13} className="text-amber-300" />
            <span>View Fullscreen</span>
          </a>
        </aside>
      )}

      {/* 5. FOOTER NOTE */}
      <footer className="w-full bg-white border-t border-rose-100 py-6 px-4 text-center text-xs text-stone-500 font-sans">
        <p className="font-serif font-bold text-rose-900 mb-1">
          ExpertoMemories — Our Forever Story
        </p>
        <p className="text-[11px] text-stone-400 mb-2">
          Personalized Interactive Digital Anniversary Websites • Fictional Demo Experience
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-rose-600">
          <button type="button" onClick={handleResetDemo} className="hover:underline flex items-center gap-1">
            <RotateCcw size={11} /> Reset Sample
          </button>
          <span>•</span>
          <Link href="/dashboard/create?occasion=anniversary" className="hover:underline flex items-center gap-1">
            <Gift size={11} /> Customize Now
          </Link>
          <span>•</span>
          <Link href="/#products" className="hover:underline flex items-center gap-1">
            <ArrowLeft size={11} /> Back to Catalog
          </Link>
        </div>
      </footer>
    </div>
  );
}

