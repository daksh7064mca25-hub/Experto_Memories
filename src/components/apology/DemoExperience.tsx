"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createDemoProject } from "@/config/demo-project";
import { ApologyRenderer } from "@/components/apology/ApologyRenderer";
import { ApologyThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";
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
  initialTheme?: ApologyThemeId;
  isEmbedded?: boolean;
}

export function DemoExperience({ initialTheme = "cotton-candy", isEmbedded = false }: Props) {
  const [theme, setTheme] = useState<ApologyThemeId>(initialTheme);
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

    // Reset demo coupons on new session mount so experience is always fresh
    try {
      localStorage.removeItem("em_redeemed_coupons");
    } catch {}
  }, [isEmbedded]);

  const handleResetDemo = () => {
    try {
      localStorage.removeItem("em_redeemed_coupons");
    } catch {}
    setDemoKey((prev) => prev + 1);
  };

  const projectData = createDemoProject(theme);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-sans">
      {/* 1. CLEARLY IDENTIFIABLE DEMO MODE HEADER / FLOATING PILL */}
      <aside
        aria-label="ExpertoMemories Sample Demo Mode"
        className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-200/80 shadow-md transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Demo Identity Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-serif font-bold text-xs bg-rose-500 text-white shadow-sm">
              <Sparkles size={13} className="text-amber-200" />
              <span>SAMPLE DEMO</span>
            </span>

            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-rose-950 text-xs">
                ExpertoMemories Preview Experience
              </span>
              <span className="text-[11px] text-rose-700/80">
                Fictional sample: Maya &amp; Daniel • Product: &ldquo;A Little Sorry, A Lot of Love&rdquo;
              </span>
            </div>
          </div>

          {/* Controls: Theme Switcher, Reset, Popout & Customize */}
          <div className="flex items-center gap-2">
            {/* Back to Store Link */}
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
              <label htmlFor="demo-theme-select" className="sr-only">Choose Theme</label>
              <select
                id="demo-theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value as ApologyThemeId)}
                className="bg-transparent text-rose-900 font-serif font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="cotton-candy">Cotton Candy</option>
                <option value="lavender-dreams">Lavender Dreams</option>
                <option value="peachy-love">Peachy Love</option>
                <option value="midnight-hearts">Midnight Hearts</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors shadow-sm active:scale-95"
              title="Reset envelope, coupons, and interactive choices to initial state"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Customize Call to Action */}
            <Link
              href="/dashboard/create?occasion=apology"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-transform hover:scale-105"
            >
              <Gift size={12} />
              <span>Customize</span>
            </Link>
          </div>
        </div>

        {/* Fallback & Reassurance banner for embedded viewers & shoppers */}
        <div className="bg-pink-100/70 border-t border-pink-200 px-4 py-1 text-[11px] text-rose-800 text-center flex items-center justify-center gap-2">
          <Info size={12} className="text-rose-600 shrink-0" />
          <span>
            Trouble viewing or interacting with the embedded preview?{" "}
            <Link
              href="/demo/apology"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-rose-900 hover:text-rose-950"
            >
              Open interactive demo in a new tab ↗
            </Link>
          </span>
        </div>
      </aside>

      {/* 2. REUSABLE WEBSITE RENDERER ENGINE */}
      <main className="flex-1 w-full" key={demoKey}>
        <ApologyRenderer project={projectData} previewMode={false} />
      </main>

      {/* 3. FLOATING ACTION PILL (BOTTOM-RIGHT) */}
      <div className="fixed bottom-4 right-4 z-40">
        <Link
          href="/dashboard/create?occasion=apology"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 transition-all hover:scale-105"
        >
          <Gift size={14} />
          <span>Customize This Apology Gift</span>
        </Link>
      </div>

      {/* 4. NOSCRIPT & FALLBACK IF BROWSERS BLOCK EMBEDDED IFRAMES */}
      <noscript>
        <div className="p-6 bg-pink-50 border-t border-rose-300 text-center text-rose-900">
          <p className="font-serif font-bold text-lg mb-2">ExpertoMemories Interactive Apology Demo</p>
          <p className="text-sm mb-4">
            If your browser does not support interactive scripts inside embedded views, please open the full demo directly:
          </p>
          <a
            href="/demo/apology"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-full font-bold text-sm bg-rose-500 text-white"
          >
            Open Interactive Demo in New Tab
          </a>
        </div>
      </noscript>

      {/* 5. FOOTER NOTE FOR DEMO VISITORS */}
      <footer className="w-full bg-white/80 backdrop-blur-sm border-t border-rose-200/60 py-6 px-4 text-center text-xs text-rose-800/70 select-none">
        <p className="font-serif font-bold text-sm text-rose-950 mb-1">
          ExpertoMemories &mdash; &ldquo;A Little Sorry, A Lot of Love&rdquo;
        </p>
        <p className="max-w-md mx-auto text-[11px] leading-relaxed opacity-80 mb-3">
          This is an interactive public demo featuring sample photographs and fictional characters.
          Every gift website commissioned through our store is fully customized with personal letters,
          private photographs, custom music, and bespoke promises.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-rose-600">
          <button type="button" onClick={handleResetDemo} className="hover:underline flex items-center gap-1">
            <RotateCcw size={11} /> Reset Sample
          </button>
          <span>•</span>
          <Link href="/dashboard/create?occasion=apology" className="hover:underline flex items-center gap-1">
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

