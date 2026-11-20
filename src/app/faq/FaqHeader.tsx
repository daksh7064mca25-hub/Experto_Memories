"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Menu, X, ArrowRight } from "lucide-react";

export default function FaqHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-sans font-medium text-[#292524] tracking-wide">
          <Link
            href="/#experiences"
            className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
          >
            Explore Gifts
          </Link>
          <Link
            href="/#interactive-features"
            className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
          >
            Why ExpertoMemories
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
          >
            How It Works
          </Link>
          <Link
            href="/#story"
            className="hover:text-[#541D2B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#541D2B] hover:after:w-full after:transition-all"
          >
            Our Story
          </Link>
          <Link
            href="/faq"
            className="text-[#541D2B] font-bold py-1 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#541D2B]"
          >
            FAQ
          </Link>
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/customer/login"
            className="text-xs font-sans font-semibold text-[#541D2B] hover:text-[#211715] transition-colors px-3 py-2"
          >
            Customer Login
          </Link>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-semibold bg-[#541D2B] hover:bg-[#682435] text-white shadow-sm shadow-[#541D2B]/20 transition-all hover:scale-105"
          >
            <span>Start A Gift</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-[#211715] hover:bg-[#EFE9DF] transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E2D8] bg-[#FAF7F2] px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col gap-3 text-sm font-sans font-medium text-[#292524]">
            <Link
              href="/#experiences"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#541D2B]"
            >
              Explore Gifts
            </Link>
            <Link
              href="/#interactive-features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#541D2B]"
            >
              Why ExpertoMemories
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#541D2B]"
            >
              How It Works
            </Link>
            <Link
              href="/#story"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#541D2B]"
            >
              Our Story
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 font-bold text-[#541D2B]"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-4 border-t border-[#E8E2D8] flex flex-col gap-3">
            <Link
              href="/customer/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full border border-[#541D2B] text-xs font-semibold text-[#541D2B]"
            >
              Customer Login
            </Link>
            <Link
              href="/dashboard/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-[#541D2B] text-xs font-semibold text-white shadow-sm"
            >
              Start A Gift &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
