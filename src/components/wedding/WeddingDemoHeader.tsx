"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";

interface Props {
  currentCollection: string;
}

const WEDDING_DEMO_LINKS = [
  { slug: "luxury", label: "Luxury Wedding" },
  { slug: "royal", label: "Royal Indian" },
  { slug: "hindu", label: "Traditional Hindu" },
  { slug: "punjabi", label: "Punjabi" },
  { slug: "muslim", label: "Muslim (Nikah)" },
  { slug: "christian", label: "Christian" },
  { slug: "destination", label: "Destination" },
];

export const WeddingDemoHeader: React.FC<Props> = ({ currentCollection }) => {
  const norm = (currentCollection || "royal").toLowerCase();
  const activeSlug = norm.includes("luxury")
    ? "luxury"
    : norm.includes("royal")
    ? "royal"
    : norm.includes("hindu") || norm.includes("vivah")
    ? "hindu"
    : norm.includes("punjabi")
    ? "punjabi"
    : norm.includes("muslim") || norm.includes("nikah")
    ? "muslim"
    : norm.includes("christian")
    ? "christian"
    : norm.includes("destination") || norm.includes("coastal")
    ? "destination"
    : "royal";

  return (
    <>
      {/* Floating Top Bar */}
      <div className="fixed top-4 left-3 right-3 sm:left-4 sm:right-4 z-50 flex items-center justify-between gap-3 pointer-events-none">
        {/* Back Link */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <Link
            href="/weddings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-bold bg-black/85 backdrop-blur-md text-[#FAF7F2] border border-[#D4AF37]/50 shadow-lg hover:bg-black transition-all"
          >
            <ArrowLeft size={13} className="text-[#D4AF37]" />
            <span className="hidden sm:inline">Wedding Atelier</span>
            <span className="sm:hidden">All</span>
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-sans font-semibold bg-[#D4AF37] text-[#2E0B14] shadow-md">
            <Sparkles size={11} />
            <span>Interactive Demo</span>
          </span>
        </div>

        {/* 7 Cultural Switcher Pills */}
        <div className="pointer-events-auto flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-xl overflow-x-auto max-w-[calc(100vw-110px)] sm:max-w-[70vw]">
          {WEDDING_DEMO_LINKS.map((item) => {
            const isActive = activeSlug === item.slug;
            return (
              <Link
                key={item.slug}
                href={`/demo/wedding/${item.slug}`}
                className={`px-3 py-1 rounded-full text-[11px] font-serif font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#D4AF37] text-[#2E0B14] shadow-sm font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom CTA */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
        <Link
          href={`/dashboard/create?occasion=wedding&collection=${activeSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-serif font-bold bg-gradient-to-r from-[#C5A36A] via-[#D4AF37] to-[#B8924B] text-[#2E0B14] shadow-2xl hover:brightness-110 transition-all hover:scale-105"
        >
          <Heart size={14} className="fill-current text-[#2E0B14]" />
          <span>Customize This Invitation</span>
        </Link>
      </div>
    </>
  );
};
