"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  List,
  BookOpen,
  Sparkles,
  Heart,
  X,
  RotateCcw,
} from "lucide-react";
import { ThemeConfig } from "@/config/themes";
import { WebsiteProjectData } from "@/types/website";
import { playPageTurnSound, playBookOpenSound } from "./utils/sound";
import { LoveBookCover } from "./chapters/LoveBookCover";
import { LoveBookChapterBegan } from "./chapters/LoveBookChapterBegan";
import { LoveBookChapterMemories } from "./chapters/LoveBookChapterMemories";
import { LoveBookChapterLetter } from "./chapters/LoveBookChapterLetter";
import { LoveBookChapterReasons } from "./chapters/LoveBookChapterReasons";
import { LoveBookChapterGame } from "./chapters/LoveBookChapterGame";
import { LoveBookChapterSurprise } from "./chapters/LoveBookChapterSurprise";
import { LoveBookChapterSong } from "./chapters/LoveBookChapterSong";
import { LoveBookChapterEnding } from "./chapters/LoveBookChapterEnding";
import { LoveBookBackCover } from "./chapters/LoveBookBackCover";

export interface LoveBookEngineProps {
  project: WebsiteProjectData;
  theme: ThemeConfig;
  previewMode?: boolean;
  viewport?: "mobile" | "desktop";
}

export function LoveBookEngine({
  project,
  theme,
  previewMode = false,
  viewport,
}: LoveBookEngineProps) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover, 1..8 = Chapters, 9 = Back Cover
  const [resetKey, setResetKey] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const bookContainerRef = useRef<HTMLDivElement | null>(null);
  const pageFlipInstanceRef = useRef<any>(null);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const recipient = project.recipientName || "My Love";
  const sender = project.senderName || "Forever Yours";

  // Section config finders with fallback
  const getSectionConfig = (type: string) => {
    return (
      project.sections?.find((s) => s.type === type && s.enabled !== false)
        ?.config || {}
    );
  };

  // Chapter table-of-contents definitions
  const chapterList = [
    { page: 0, title: "Book Cover", label: "Front Cover" },
    { page: 1, title: "Chapter I • Where It All Began", label: "Prologue" },
    { page: 2, title: "Chapter II • Our Little Memories", label: "Memories" },
    { page: 3, title: "Chapter III • A Letter For You", label: "Love Letter" },
    { page: 4, title: "Chapter IV • Things I Love About You", label: "Reasons" },
    { page: 5, title: "Chapter V • Our Fun Side", label: "Love Puzzle" },
    { page: 6, title: "Chapter VI • A Little Surprise", label: "Love Vouchers" },
    { page: 7, title: "Chapter VII • Our Song", label: "Soundtrack" },
    { page: 8, title: "Chapter VIII • Our Story Continues", label: "Ending" },
    { page: 9, title: "Back Cover", label: "Back Cover" },
  ];

  // Initialize PageFlip instance
  useEffect(() => {
    let isCancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let lastWidth = 0;

    const setupBook = async () => {
      if (typeof window === "undefined" || !bookContainerRef.current) return;

      const containerEl =
        (bookContainerRef.current.closest(".is-mobile-preview") as HTMLElement) ||
        bookContainerRef.current.parentElement ||
        bookContainerRef.current;
      const isContainerInMobilePreview = Boolean(
        bookContainerRef.current.closest(".is-mobile-preview")
      );
      const containerWidth = containerEl ? containerEl.clientWidth : window.innerWidth;
      lastWidth = containerWidth;

      const isMobileView =
        viewport === "mobile" ||
        isContainerInMobilePreview ||
        (viewport !== "desktop" && (containerWidth < 768 || window.innerWidth < 768));

      setIsMobile(isMobileView);

      // Clean up previous instance if exists
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch (e) {}
        pageFlipInstanceRef.current = null;
      }

      try {
        const { PageFlip } = await import("page-flip");
        if (isCancelled || !bookContainerRef.current) return;

        // Calculate responsive page dimensions
        let pageW: number;
        let pageH: number;

        if (isMobileView) {
          // Single-page portrait mode: must fit naturally inside available container width
          const safePadding = 24;
          const availableW = Math.max(containerWidth - safePadding, 260);
          pageW = Math.min(availableW, 356);
          // Keep natural ~1:1.5 portrait book aspect ratio while fitting within mobile viewport height
          pageH = Math.min(Math.round(pageW * 1.5), 540);
        } else {
          // Desktop two-page spread mode
          pageW = 440;
          pageH = 600;
        }

        // Set explicit wrapper size so PageFlip establishes correct aspect ratio
        bookContainerRef.current.style.width = isMobileView ? `${pageW}px` : `${pageW * 2}px`;
        bookContainerRef.current.style.height = `${pageH}px`;
        bookContainerRef.current.style.maxWidth = "100%";

        const pageFlip = new PageFlip(bookContainerRef.current, {
          width: pageW,
          height: pageH,
          size: "fixed",
          minWidth: 260,
          maxWidth: 480,
          minHeight: 380,
          maxHeight: 680,
          showCover: true,
          drawShadow: true,
          maxShadowOpacity: 0.65,
          useMouseEvents: true,
          flippingTime: 700,
          swipeDistance: 25,
          disableFlipByClick: true, // Only flip on corner drag/click or button actions!
          clickEventForward: true,
          usePortrait: isMobileView, // Mobile = single page portrait, Desktop = two-page spread landscape!
          mobileScrollSupport: false,
        });

        const pages = bookContainerRef.current.querySelectorAll(".love-book-page");
        if (!pages || pages.length === 0) return;

        pageFlip.loadFromHTML(pages as any);

        pageFlip.on("flip", (e: any) => {
          const newIdx = typeof e.data === "number" ? e.data : e;
          setCurrentPage(newIdx);
          playPageTurnSound(isMutedRef.current);
        });

        pageFlipInstanceRef.current = pageFlip;
        setIsReady(true);
      } catch (err) {
        console.error("Failed to initialize PageFlip:", err);
      }
    };

    // Delay slightly to ensure DOM nodes and styles are ready
    const timer = setTimeout(setupBook, 60);

    const handleResize = () => {
      const containerEl =
        (bookContainerRef.current?.closest(".is-mobile-preview") as HTMLElement) ||
        bookContainerRef.current?.parentElement ||
        bookContainerRef.current;
      const currentW = containerEl ? containerEl.clientWidth : window.innerWidth;
      const crossedThreshold =
        (lastWidth < 768 && currentW >= 768) || (lastWidth >= 768 && currentW < 768);
      if (crossedThreshold || Math.abs(currentW - lastWidth) > 25) {
        setupBook();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch (e) {}
        pageFlipInstanceRef.current = null;
      }
    };
  }, [viewport]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pageFlipInstanceRef.current) return;
      if (e.key === "ArrowRight") {
        pageFlipInstanceRef.current.flipNext();
      } else if (e.key === "ArrowLeft") {
        pageFlipInstanceRef.current.flipPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Navigation handlers
  const handleOpenCover = useCallback(() => {
    if (!pageFlipInstanceRef.current) return;
    playBookOpenSound(isMutedRef.current);
    pageFlipInstanceRef.current.flipNext();
  }, []);

  const handleNextPage = useCallback(() => {
    if (!pageFlipInstanceRef.current) return;
    pageFlipInstanceRef.current.flipNext();
  }, []);

  const handlePrevPage = useCallback(() => {
    if (!pageFlipInstanceRef.current) return;
    pageFlipInstanceRef.current.flipPrev();
  }, []);

  const handleTurnToPage = useCallback((targetPage: number) => {
    if (!pageFlipInstanceRef.current) return;
    try {
      pageFlipInstanceRef.current.turnToPage(targetPage);
    } catch (err) {
      console.warn("turnToPage error:", err);
    }
    setCurrentPage(targetPage);
    setShowToc(false);
  }, []);

  const handleRestartBook = useCallback(() => {
    if (!pageFlipInstanceRef.current) return;
    try {
      // Direct jump to front cover (Page 0) - robust across desktop spreads & single-page mobile
      pageFlipInstanceRef.current.turnToPage(0);
    } catch (err) {
      console.warn("turnToPage fallback to flip:", err);
      try {
        pageFlipInstanceRef.current.flip(0);
      } catch (e) {}
    }
    setCurrentPage(0);
    setShowToc(false);
    playPageTurnSound(isMutedRef.current);
    // Reset chapter inner interactive states for a fresh replay
    setResetKey((prev) => prev + 1);
  }, []);

  const handleCloseBook = handleRestartBook;

  const isCover = currentPage === 0;
  const isBackCover = currentPage === 9;

  // Active spread title for HUD
  const getSpreadTitle = () => {
    if (isCover) return "Book Cover";
    if (isBackCover) return "Back Cover";
    if (isMobile) {
      const ch = chapterList[currentPage];
      return ch ? ch.title : `Page ${currentPage}`;
    }
    const leftCh = chapterList[currentPage];
    const rightCh = chapterList[currentPage + 1];
    if (leftCh && rightCh) {
      return `${leftCh.label} & ${rightCh.label}`;
    }
    return leftCh ? leftCh.title : `Pages ${currentPage}`;
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-2 sm:py-6 px-2 sm:px-4 select-none">
      {/* 3D BOOK DESK WORKSPACE ON LIGHT ROMANTIC SURFACE */}
      <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center">
        {/* DESK FLOATING ARROW NAVIGATION (Desktop Left Arrow) */}
        {!isCover && !isMobile && (
          <button
            type="button"
            onClick={handlePrevPage}
            className="hidden md:flex absolute -left-12 lg:-left-16 z-30 w-11 h-11 items-center justify-center rounded-full bg-white/95 hover:bg-white text-stone-800 border border-[#E0CFBD] shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
            title="Previous Page (←)"
            aria-label="Previous Page"
          >
            <ChevronLeft size={22} className="text-[#3a0d15]" />
          </button>
        )}

        {/* DESK FLOATING ARROW NAVIGATION (Desktop Right Arrow) */}
        {!isBackCover && !isMobile && (
          <button
            type="button"
            onClick={handleNextPage}
            className="hidden md:flex absolute -right-12 lg:-right-16 z-30 w-11 h-11 items-center justify-center rounded-full bg-white/95 hover:bg-white text-stone-800 border border-[#E0CFBD] shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
            title="Next Page (→)"
            aria-label="Next Page"
          >
            <ChevronRight size={22} className="text-[#3a0d15]" />
          </button>
        )}

        {/* PHYSICAL HARDCOVER BOOK CASING SHELL (Beneath the pages) */}
        <div
          className="relative transition-all duration-500 ease-out"
          style={{
            filter: "drop-shadow(0 25px 45px rgba(90, 25, 40, 0.22)) drop-shadow(0 10px 20px rgba(60, 15, 25, 0.15))",
          }}
        >
          {/* SILK RIBBON BOOKMARK PROTRUDING FROM BOTTOM ONTO LIGHT DESK */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-12 sm:-bottom-16 w-5 sm:w-6 h-14 sm:h-18 bg-gradient-to-r from-[#800d1e] via-[#b81d34] to-[#690715] z-10 pointer-events-none"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)",
              filter: "drop-shadow(0 6px 12px rgba(80, 20, 30, 0.35))",
            }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-white/25 blur-[0.5px]" />
          </div>

          {/* PAGEFLIP MOUNTING ROOT ELEMENT */}
          <div
            ref={bookContainerRef}
            className="love-book-mount relative mx-auto"
            style={{ perspective: "2200px" }}
          >
            {/* PAGE 0: FRONT HARDCOVER */}
            <div className="love-book-page page-hard" data-density="hard">
              <LoveBookCover
                key={`cover-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_invitation")}
                theme={theme}
                onOpenBook={handleOpenCover}
              />
            </div>

            {/* PAGE 1: CHAPTER I • WHERE IT ALL BEGAN (PROLOGUE) */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterBegan
                key={`ch1-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_timeline")}
                theme={theme}
              />
            </div>

            {/* PAGE 2: CHAPTER II • OUR LITTLE MEMORIES (SCRAPBOOK PHOTO ALBUM) */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterMemories
                key={`ch2-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_gallery")}
                theme={theme}
              />
            </div>

            {/* PAGE 3: CHAPTER III • A LETTER FOR YOU */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterLetter
                key={`ch3-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_letter")}
                theme={theme}
              />
            </div>

            {/* PAGE 4: CHAPTER IV • THINGS I LOVE ABOUT YOU */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterReasons
                key={`ch4-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_reasons")}
                theme={theme}
              />
            </div>

            {/* PAGE 5: CHAPTER V • OUR FUN SIDE (PUZZLE GAME) */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterGame
                key={`ch5-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_puzzle")}
                theme={theme}
              />
            </div>

            {/* PAGE 6: CHAPTER VI • A LITTLE SURPRISE (COUPONS / GIFT) */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterSurprise
                key={`ch6-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_surprise_gift")}
                theme={theme}
              />
            </div>

            {/* PAGE 7: CHAPTER VII • OUR SONG (SOUNDTRACK PLAYLIST) */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterSong
                key={`ch7-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_playlist")}
                theme={theme}
              />
            </div>

            {/* PAGE 8: CHAPTER VIII • OUR STORY CONTINUES (FINALE) */}
            <div className="love-book-page page-soft" data-density="soft">
              <LoveBookChapterEnding
                key={`ch8-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                config={getSectionConfig("love_surprise")}
                theme={theme}
                onCloseBook={handleRestartBook}
              />
            </div>

            {/* PAGE 9: BACK HARDCOVER (CLOSING) */}
            <div className="love-book-page page-hard" data-density="hard">
              <LoveBookBackCover
                key={`ch9-${resetKey}`}
                recipientName={recipient}
                senderName={sender}
                theme={theme}
                onReplay={handleRestartBook}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING BOOK HUD & CONTROLS BAR (LIGHT ROMANTIC THEME) */}
      <div className="relative z-40 mt-4 sm:mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-4 px-3 sm:px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#E5D2C2] text-stone-800 shadow-xl shadow-rose-950/8 max-w-[96%] sm:max-w-max mx-auto">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={isCover}
          className="p-1.5 sm:p-2 rounded-full hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent text-stone-700 hover:text-rose-900 transition-colors"
          title="Previous Page (←)"
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Current Page Indicator Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3EC] border border-[#E2CEBC] text-xs font-mono text-stone-800">
          <BookOpen size={12} className="text-[#8b3a4a]" />
          <span className="font-semibold">
            {isCover
              ? "Book Cover"
              : isBackCover
              ? "Back Cover"
              : isMobile
              ? `Page ${currentPage} of 8`
              : `Pages ${currentPage} & ${currentPage + 1}`}
          </span>
          <span className="hidden sm:inline-block text-stone-400">•</span>
          <span className="hidden sm:inline-block text-[#3a0d15] font-serif font-bold max-w-[150px] truncate">
            {getSpreadTitle()}
          </span>
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={isBackCover}
          className="p-1.5 sm:p-2 rounded-full hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent text-stone-700 hover:text-rose-900 transition-colors"
          title="Next Page (→)"
          aria-label="Next Page"
        >
          <ChevronRight size={16} />
        </button>

        <div className="w-px h-4 bg-stone-300 hidden sm:block" />

        {/* Table of Contents Trigger */}
        <button
          type="button"
          onClick={() => setShowToc(!showToc)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif transition-colors ${
            showToc
              ? "bg-rose-100 text-[#3a0d15] border border-rose-300"
              : "hover:bg-rose-50 text-stone-700"
          }`}
          title="Table of Contents"
        >
          <List size={13} />
          <span className="hidden sm:inline">Chapters</span>
        </button>

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 sm:p-2 rounded-full hover:bg-rose-50 text-stone-600 hover:text-stone-900 transition-colors"
          title={isMuted ? "Unmute Paper Audio" : "Mute Paper Audio"}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Close Book Button (Return to Cover) */}
        {!isCover && (
          <button
            type="button"
            onClick={handleCloseBook}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-serif text-[#8b3a4a] hover:text-[#5c1b27] hover:bg-rose-50 border border-rose-200 transition-colors"
            title="Return to Front Cover"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Close Book</span>
          </button>
        )}
      </div>

      {/* TABLE OF CONTENTS MODAL */}
      {showToc && (
        <div
          onClick={() => setShowToc(false)}
          className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF9] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 text-stone-900 font-serif"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#8b3a4a]" />
                <h3 className="font-bold text-base text-[#3a0d15]">
                  Chapters of Our Story
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowToc(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {chapterList.map((ch) => (
                <button
                  key={ch.page}
                  type="button"
                  onClick={() => handleTurnToPage(ch.page)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                    currentPage === ch.page
                      ? "bg-[#3a0d15] text-amber-100 font-bold"
                      : "hover:bg-rose-50/80 text-stone-700"
                  }`}
                >
                  <span className="truncate pr-2">{ch.title}</span>
                  <span className="font-mono text-[10px] opacity-60 shrink-0">
                    {ch.page === 0 ? "Cover" : ch.page === 9 ? "Back" : `Page ${ch.page}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED STPAGEFLIP CORE CSS */}
      <style jsx global>{`
        .stf__parent {
          position: relative;
          display: block;
          box-sizing: border-box;
          transform: translateZ(0);
          touch-action: pan-y;
        }
        .stf__wrapper {
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }
        .stf__parent canvas {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
        .stf__block {
          position: absolute;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          perspective: 2000px;
        }
        .stf__item {
          display: none;
          position: absolute;
          transform-style: preserve-3d;
        }
        .stf__outerShadow,
        .stf__innerShadow,
        .stf__hardShadow,
        .stf__hardInnerShadow {
          position: absolute;
          left: 0;
          top: 0;
          pointer-events: none;
        }
        .love-book-page {
          width: 100%;
          height: 100%;
          background: #fffdf8;
          border: 1px solid #e8ddcc;
          box-sizing: border-box;
          overflow: hidden;
          box-shadow: inset 0 0 35px rgba(180, 140, 100, 0.08);
        }
        .love-book-page.page-hard {
          background: #2e060f;
          border: none;
        }
      `}</style>
    </div>
  );
}
