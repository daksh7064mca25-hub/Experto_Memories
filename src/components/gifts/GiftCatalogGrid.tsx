"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Heart,
  CheckCircle2,
  Calendar,
  Cake,
  Mail,
  Crown,
  Users,
  Eye,
  Gift,
} from "lucide-react";
import { EnrichedGiftTemplate, GiftCategoryFilter } from "@/config/gift-presentation";

export type RelationshipCategoryFilter =
  | "all"
  | "anniversary"
  | "romantic"
  | "apology";

interface GiftCatalogGridProps {
  templates: EnrichedGiftTemplate[];
  occasionPrices?: Record<string, number>;
  productsPricing?: any[];
  initialCategory?: RelationshipCategoryFilter;
}

interface FilterTab {
  id: RelationshipCategoryFilter;
  label: string;
  icon: React.ElementType;
}

const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "All Relationship Gifts", icon: Gift },
  { id: "anniversary", label: "Anniversary", icon: Calendar },
  { id: "romantic", label: "Love & Romance", icon: Heart },
  { id: "apology", label: "Apology", icon: Mail },
];

export function GiftCatalogGrid({
  templates,
  occasionPrices = {},
  productsPricing = [],
  initialCategory = "all",
}: GiftCatalogGridProps) {
  const [activeCategory, setActiveCategory] = useState<RelationshipCategoryFilter>(initialCategory);

  // Compute category counts dynamically
  const categoryCounts = useMemo(() => {
    const counts: Record<RelationshipCategoryFilter, number> = {
      all: templates.length,
      anniversary: 0,
      romantic: 0,
      apology: 0,
    };

    templates.forEach((t) => {
      const cat = t.presentation.occasionCategory as RelationshipCategoryFilter;
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    return counts;
  }, [templates]);

  // Filter templates based on active category
  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") {
      return templates;
    }
    return templates.filter((t) => t.presentation.occasionCategory === activeCategory);
  }, [templates, activeCategory]);

  // Occasion icon resolver
  const renderOccasionIcon = (iconName: string) => {
    switch (iconName) {
      case "Calendar":
        return <Calendar size={12} className="shrink-0" />;
      case "Heart":
        return <Heart size={12} className="shrink-0 fill-current" />;
      case "Cake":
        return <Cake size={12} className="shrink-0" />;
      case "Mail":
        return <Mail size={12} className="shrink-0" />;
      case "Crown":
        return <Crown size={12} className="shrink-0" />;
      default:
        return <Sparkles size={12} className="shrink-0" />;
    }
  };

  return (
    <div className="w-full">
      {/* 1. CATEGORY FILTER NAVIGATION TABS */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-center justify-start sm:justify-center">
          <div
            role="tablist"
            aria-label="Filter gifts by occasion"
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-stone-200/60 backdrop-blur-md rounded-2xl border border-stone-300/70 max-w-full overflow-x-auto no-scrollbar scroll-smooth shadow-inner"
          >
            {FILTER_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeCategory === tab.id;
              const count = categoryCounts[tab.id] || 0;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 select-none ${
                    isActive
                      ? "bg-[#541D2B] text-white shadow-md shadow-[#541D2B]/20 font-semibold ring-1 ring-[#541D2B]"
                      : "bg-white/80 text-stone-700 hover:text-stone-900 hover:bg-white border border-transparent hover:border-stone-200"
                  }`}
                >
                  <TabIcon
                    size={14}
                    className={`shrink-0 ${
                      isActive ? "text-amber-300" : "text-stone-500"
                    }`}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-stone-200/80 text-stone-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current filter summary for accessibility & scanability */}
        <div className="mt-4 text-center">
          <p className="text-xs text-stone-500">
            Showing{" "}
            <span className="font-semibold text-stone-800">
              {filteredTemplates.length}
            </span>{" "}
            {activeCategory === "all"
              ? "curated relationship gift experiences"
              : `${FILTER_TABS.find((t) => t.id === activeCategory)?.label} experiences`}
          </p>
        </div>
      </div>

      {/* 2. GIFTS GRID */}
      <div
        id={`panel-${activeCategory}`}
        role="tabpanel"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {filteredTemplates.map((template) => {
          const { presentation } = template;
          const { badgeStyle } = presentation;

          // Pricing calculation
          const pricingInfo = productsPricing.find(
            (p) => p.slug === template.slug || p.occasionType === template.occasionType
          );
          const displayPrice =
            pricingInfo?.price ??
            occasionPrices[template.occasionType] ??
            template.price;
          const originalPrice =
            pricingInfo?.originalPrice ?? template.originalPrice;

          return (
            <article
              key={template.id}
              className="group bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 relative"
            >
              {/* CARD TOP SECTION: OCCASION BADGE, TITLE, THEME & RECIPIENT */}
              <div className="p-6 pb-4">
                {/* 1. OCCASION BADGE */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                  >
                    {renderOccasionIcon(badgeStyle.iconName)}
                    <span>{presentation.occasionLabel}</span>
                  </div>

                  {template.badge && (
                    <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/60">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* 2. GIFT TITLE */}
                <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-[#541D2B] transition-colors leading-snug mb-1">
                  {template.title}
                </h3>

                {/* 3. THEME / DESIGN NAME */}
                <p className="text-xs font-serif italic text-rose-800 font-semibold mb-3.5">
                  {template.designName}
                </p>

                {/* 4. "PERFECT FOR" RECIPIENT DESCRIPTION (Visually distinct & easy to scan) */}
                <div className="bg-[#FAF7F2] border border-[#541D2B]/15 rounded-xl p-3 mb-4 flex items-start gap-2.5 shadow-2xs">
                  <div className="p-1 rounded-md bg-[#541D2B]/10 text-[#541D2B] shrink-0 mt-0.5">
                    <Users size={13} />
                  </div>
                  <p className="text-xs text-stone-700 leading-snug">
                    <strong className="font-semibold text-stone-900">
                      Perfect for:{" "}
                    </strong>
                    {presentation.perfectFor}
                  </p>
                </div>

                {/* 5. SHORT EXPERIENCE SUMMARY (What the customer gets upon opening) */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-stone-500 block mb-1">
                    The Experience:
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {presentation.experienceSummary}
                  </p>
                </div>

                {/* Colorways Preview */}
                {template.themes && template.themes.length > 0 && (
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      Curated Colorways:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {template.themes.map((th) => (
                        <div
                          key={th.id}
                          className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs transition-transform hover:scale-125"
                          style={{ backgroundColor: th.previewColor }}
                          title={th.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. INCLUDED INTERACTIVE FEATURES LIST */}
              <div className="px-6 py-4 bg-stone-50/80 border-t border-b border-stone-100 space-y-2 text-xs text-stone-700">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-stone-500 block mb-1">
                  Interactive Surprises Included:
                </span>
                {presentation.interactiveHighlights.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2
                      size={13}
                      className="text-[#541D2B] shrink-0 mt-0.5"
                    />
                    <span className="leading-tight text-stone-700">{feat}</span>
                  </div>
                ))}
              </div>

              {/* CARD FOOTER: 7. PRICING & 8. ACTION BUTTONS */}
              <div className="p-6 pt-4 bg-white flex flex-col gap-3">
                {/* 7. PRICE & HOSTING BADGE */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-bold text-stone-900">
                      ₹{displayPrice}
                    </span>
                    {originalPrice && originalPrice > displayPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    <span>1 Year Free Hosting</span>
                  </span>
                </div>

                {/* 8. ACTION BUTTONS (Preview Experience & Create Gift) */}
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  {/* Secondary CTA: Preview Demo */}
                  <Link
                    href={presentation.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl text-xs font-serif font-bold text-stone-700 bg-stone-100/90 hover:bg-stone-200/90 border border-stone-300/80 hover:border-stone-400 transition flex items-center justify-center gap-1.5 group/preview"
                    title={`Preview live demo for ${template.title}`}
                  >
                    <Eye
                      size={13}
                      className="text-[#541D2B] group-hover/preview:scale-110 transition-transform"
                    />
                    <span>Preview Demo</span>
                  </Link>

                  {/* Primary CTA: Create Gift */}
                  <Link
                    href={presentation.createUrl}
                    className="px-3 py-2.5 rounded-xl text-xs font-serif font-bold bg-[#541D2B] text-white hover:bg-[#3E131E] transition shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 group/create"
                    title={`Create your ${template.title}`}
                  >
                    <span>Create Gift</span>
                    <ArrowRight
                      size={13}
                      className="group-hover/create:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Empty State Fallback (Defensive) */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto">
          <Gift size={36} className="mx-auto text-stone-400 mb-3" />
          <h4 className="font-serif text-lg font-bold text-stone-800 mb-1">
            No gifts found in this category
          </h4>
          <p className="text-xs text-stone-500 mb-4">
            Try switching to another category or explore all our curated experiences.
          </p>
          <button
            onClick={() => setActiveCategory("all")}
            className="px-4 py-2 bg-[#541D2B] text-white text-xs font-serif font-bold rounded-xl"
          >
            Show All Gifts
          </button>
        </div>
      )}
    </div>
  );
}
