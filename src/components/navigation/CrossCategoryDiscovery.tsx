"use client";

import React from "react";
import Link from "next/link";
import { Heart, Sparkles, Cake, ArrowRight, Compass } from "lucide-react";

interface CategoryMeta {
  id: "relationship" | "wedding" | "birthday";
  title: string;
  tagline: string;
  description: string;
  href: string;
  badge: string;
  icon: React.ElementType;
  themeColor: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  cardBorder: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "relationship",
    title: "Love & Relationship Gifts",
    tagline: "Romantic Keepsakes",
    description:
      "Interactive love storybooks, anniversary museums & wax-sealed apology letters.",
    href: "/gifts",
    badge: "3 Occasions",
    icon: Heart,
    themeColor: "from-[#541D2B]/10 to-[#541D2B]/5",
    textColor: "text-[#541D2B]",
    badgeBg: "bg-[#541D2B]/10 text-[#541D2B]",
    badgeBorder: "border-[#541D2B]/20",
    cardBorder: "hover:border-[#541D2B]/40",
  },
  {
    id: "wedding",
    title: "Wedding Invitations",
    tagline: "Royal Vivah & Cultural Suites",
    description:
      "7 bespoke wedding collections with ceremonial reveals, event itineraries & live RSVP.",
    href: "/weddings",
    badge: "7 Collections",
    icon: Sparkles,
    themeColor: "from-amber-500/10 to-amber-500/5",
    textColor: "text-[#8E641D]",
    badgeBg: "bg-[#D4AF37]/15 text-[#8E641D]",
    badgeBorder: "border-[#D4AF37]/30",
    cardBorder: "hover:border-[#D4AF37]/50",
  },
  {
    id: "birthday",
    title: "Birthday Gifts",
    tagline: "Interactive Wonderlands",
    description:
      "Immersive celebrations featuring interactive 3D cake, candle blowout & memory walls.",
    href: "/birthdays",
    badge: "Celebration Keepsakes",
    icon: Cake,
    themeColor: "from-amber-500/10 to-amber-500/5",
    textColor: "text-amber-800",
    badgeBg: "bg-amber-500/10 text-amber-800",
    badgeBorder: "border-amber-500/20",
    cardBorder: "hover:border-amber-500/40",
  },
];

interface CrossCategoryDiscoveryProps {
  currentCategory: "relationship" | "wedding" | "birthday";
}

export function CrossCategoryDiscovery({
  currentCategory,
}: CrossCategoryDiscoveryProps) {
  const otherCategories = CATEGORIES.filter((c) => c.id !== currentCategory);

  return (
    <section
      aria-label="Explore other celebration categories"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
    >
      <div className="rounded-3xl bg-white border border-[#EAE3D9] p-6 sm:p-10 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 pb-6 border-b border-[#F2EDE5]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold tracking-widest uppercase text-[#8C7E75]">
              <Compass size={13} className="text-[#C5A36A]" />
              <span>Explore More Celebrations</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211715]">
              Looking for a Different Moment?
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] font-normal">
              ExpertoMemories crafts bespoke digital keepsakes across three distinct celebration verticals.
            </p>
          </div>

          <Link
            href="/"
            className="self-start sm:self-auto text-xs font-sans font-semibold text-[#541D2B] hover:text-[#3B111D] flex items-center gap-1.5 transition-colors group shrink-0"
          >
            <span>View All at Studio Home</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2 Other Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`group relative rounded-2xl p-6 bg-[#FCFAF7] border border-[#EAE3D9] ${cat.cardBorder} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cat.badgeBg} ${cat.badgeBorder}`}
                    >
                      <Icon size={11} />
                      <span>{cat.badge}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#8C7E75]">
                      {cat.tagline}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#211715] group-hover:text-[#541D2B] transition-colors mb-2">
                    {cat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F2EDE5] flex items-center justify-between text-xs font-serif font-bold text-[#541D2B]">
                  <span className="group-hover:underline underline-offset-4">
                    Explore Collection
                  </span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
