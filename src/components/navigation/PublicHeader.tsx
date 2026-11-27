"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Crown,
  Cake,
  Gift,
} from "lucide-react";

interface PublicHeaderProps {
  showAnnouncement?: boolean;
}

export function PublicHeader({ showAnnouncement = true }: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track window scroll for sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExploreDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExploreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Active state calculations
  const isGiftsCategory =
    pathname.startsWith("/gifts") ||
    pathname.startsWith("/weddings") ||
    pathname.startsWith("/birthdays");

  const isLoveGiftsActive = pathname === "/gifts" || pathname.startsWith("/gifts/");
  const isWeddingsActive = pathname === "/weddings" || pathname.startsWith("/weddings/");
  const isBirthdaysActive = pathname === "/birthdays" || pathname.startsWith("/birthdays/");
  const isFaqActive = pathname === "/faq" || pathname.startsWith("/faq/");
  const isSignInActive = pathname === "/customer/login";

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT RIBBON */}
      {showAnnouncement && (
        <div className="bg-[#211715] text-[#FAF7F2] text-[11px] sm:text-xs py-2 px-3 sm:px-4 text-center font-serif tracking-wider sm:tracking-widest border-b border-[#3A2D2A] select-none">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-2.5">
            <span className="text-[#C5A36A] text-[9px] sm:text-[11px] shrink-0" aria-hidden="true">✦</span>
            <span className="leading-tight font-medium">
              Turn Your Beautiful Memories Into Something Extraordinary
            </span>
            <span className="text-[#C5A36A] text-[9px] sm:text-[11px] shrink-0" aria-hidden="true">✦</span>
          </div>
        </div>
      )}

      {/* 2. UNIVERSAL EDITORIAL HEADER */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-sm py-3.5"
            : "bg-[#FAF7F2] border-b border-[#EFE9DF] py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* BRAND IDENTITY / LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
            aria-label="ExpertoMemories Home"
          >
            <div className="relative h-8 sm:h-9 w-auto shrink-0 flex items-center">
              <Image
                src="/branding/expertomemories-monogram.png"
                alt="ExpertoMemories EM Monogram"
                width={505}
                height={321}
                priority
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#211715] block leading-none select-none">
              ExpertoMemories
            </span>
          </Link>

          {/* DESKTOP PRIMARY NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-sans font-medium text-[#292524] tracking-wide">
            {/* 1. EXPLORE GIFTS (WITH COMPACT DROPDOWN) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setExploreDropdownOpen(true)}
              onMouseLeave={() => setExploreDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setExploreDropdownOpen(true)}
                className={`py-1 inline-flex items-center gap-1.5 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-[#541D2B] after:transition-all ${
                  isGiftsCategory
                    ? "text-[#541D2B] font-bold after:w-full"
                    : "text-[#292524] hover:text-[#541D2B] after:w-0 hover:after:w-full"
                }`}
                aria-expanded={exploreDropdownOpen}
                aria-haspopup="true"
              >
                <span>Explore Gifts</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 text-[#541D2B] ${
                    exploreDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN MENU */}
              {exploreDropdownOpen && (
                <div
                  className="absolute top-full left-0 pt-2 z-50 w-64 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8E2D8] shadow-xl p-2 space-y-1">
                    <Link
                      href="/gifts"
                      role="menuitem"
                      onClick={() => setExploreDropdownOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                        isLoveGiftsActive
                          ? "bg-[#541D2B]/10 text-[#541D2B] font-bold"
                          : "text-[#292524] hover:bg-[#F2EDE5] hover:text-[#541D2B]"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#541D2B]/10 text-[#541D2B] flex items-center justify-center shrink-0">
                        <Heart size={14} className="fill-[#541D2B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">Love &amp; Relationship Gifts</span>
                      </div>
                    </Link>

                    <Link
                      href="/weddings"
                      role="menuitem"
                      onClick={() => setExploreDropdownOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                        isWeddingsActive
                          ? "bg-[#D4AF37]/20 text-[#8E641D] font-bold"
                          : "text-[#292524] hover:bg-[#F2EDE5] hover:text-[#8E641D]"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/15 text-[#8E641D] flex items-center justify-center shrink-0">
                        <Crown size={14} />
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="block truncate">Wedding Invitations</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C5A36A]/20 text-[#541D2B] px-1.5 py-0.5 rounded-full shrink-0">
                          Royal
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/birthdays"
                      role="menuitem"
                      onClick={() => setExploreDropdownOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                        isBirthdaysActive
                          ? "bg-amber-500/15 text-amber-900 font-bold"
                          : "text-[#292524] hover:bg-[#F2EDE5] hover:text-amber-900"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                        <Cake size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">Birthday Gifts</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. HOW IT WORKS */}
            <Link
              href="/#how-it-works"
              className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
            >
              How It Works
            </Link>

            {/* 3. FAQ */}
            <Link
              href="/faq"
              className={`py-1 relative transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-[#541D2B] after:transition-all ${
                isFaqActive
                  ? "text-[#541D2B] font-bold after:w-full"
                  : "text-[#292524] hover:text-[#541D2B] after:w-0 hover:after:w-full"
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* RIGHT ACTION CTAS */}
          <div className="hidden sm:flex items-center gap-4">
            {/* 4. SIGN IN */}
            <Link
              href="/customer/login"
              className={`text-xs font-sans font-semibold px-3 py-2 transition-colors ${
                isSignInActive
                  ? "text-[#541D2B] font-bold underline underline-offset-4"
                  : "text-[#292524] hover:text-[#541D2B]"
              }`}
            >
              Sign In
            </Link>

            {/* 5. CREATE A GIFT FOR FREE (PRIMARY CTA) */}
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-semibold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#431622] shadow-sm transition-all hover:shadow-md active:scale-95 group shrink-0"
            >
              <span>Create a Gift for Free</span>
              <ArrowRight
                size={13}
                className="text-[#C5A36A] transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#211715] hover:bg-[#F2EDE5] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8E2D8] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1 text-sm font-sans font-medium text-[#292524]">
              {/* Explore Gifts Accordion in Mobile */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileExploreOpen((prev) => !prev)}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-[#F2EDE5] flex items-center justify-between text-left font-semibold text-[#541D2B]"
                >
                  <span className="flex items-center gap-2">
                    <Gift size={16} className="text-[#541D2B]" />
                    <span>Explore Gifts</span>
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      mobileExploreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileExploreOpen && (
                  <div className="pl-4 pr-1 py-1 space-y-1">
                    <Link
                      href="/gifts"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        isLoveGiftsActive
                          ? "bg-[#541D2B]/10 text-[#541D2B] font-bold"
                          : "hover:bg-[#F2EDE5] text-[#292524]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Heart size={13} className="text-[#541D2B]" />
                        <span>Love &amp; Relationship Gifts</span>
                      </span>
                    </Link>

                    <Link
                      href="/weddings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        isWeddingsActive
                          ? "bg-[#D4AF37]/20 text-[#8E641D] font-bold"
                          : "hover:bg-[#F2EDE5] text-[#292524]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Crown size={13} className="text-[#8E641D]" />
                        <span>Wedding Invitations</span>
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C5A36A]/20 text-[#541D2B] px-1.5 py-0.5 rounded-full">
                        Royal
                      </span>
                    </Link>

                    <Link
                      href="/birthdays"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-2 px-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                        isBirthdaysActive
                          ? "bg-amber-500/15 text-amber-900 font-bold"
                          : "hover:bg-[#F2EDE5] text-[#292524]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Cake size={13} className="text-amber-700" />
                        <span>Birthday Gifts</span>
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-[#E8E2D8] my-1" />

              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-[#F2EDE5]"
              >
                How It Works
              </Link>

              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl hover:bg-[#F2EDE5] ${
                  isFaqActive ? "text-[#541D2B] font-bold bg-[#541D2B]/5" : ""
                }`}
              >
                FAQ
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-col gap-3">
              <Link
                href="/customer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full text-xs font-semibold text-[#211715] border border-[#E8E2D8] bg-white hover:bg-stone-50 transition-colors shadow-2xs"
              >
                Sign In
              </Link>

              <Link
                href="/dashboard/create"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full text-xs font-semibold bg-[#541D2B] text-[#FAF7F2] hover:bg-[#431622] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Create a Gift for Free</span>
                <ArrowRight size={13} className="text-[#C5A36A]" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default PublicHeader;
