"use client";

import React, { useState, useMemo } from "react";
import { CatalogueTemplate } from "@/config/catalog";
import { WeddingStationeryCard } from "./WeddingStationeryCard";
import { Sparkles, Filter, Check } from "lucide-react";

interface Props {
  templates: CatalogueTemplate[];
}

type CulturalFilter =
  | "all"
  | "luxury"
  | "royal"
  | "hindu"
  | "punjabi"
  | "muslim"
  | "christian"
  | "destination";

const FILTER_TABS: { id: CulturalFilter; label: string; count?: number }[] = [
  { id: "all", label: "All Collections" },
  { id: "luxury", label: "Luxury Wedding" },
  { id: "royal", label: "Royal Rajwada" },
  { id: "hindu", label: "Traditional Hindu & Vedic" },
  { id: "punjabi", label: "Punjabi Shahi" },
  { id: "muslim", label: "Muslim Noor-e-Nikah" },
  { id: "christian", label: "Christian Matrimony" },
  { id: "destination", label: "Destination & Coastal" },
];

export function WeddingCollectionsGrid({ templates }: Props) {
  const [activeFilter, setActiveFilter] = useState<CulturalFilter>("all");

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "all") return templates;

    return templates.filter((t) => {
      const slug = t.slug.toLowerCase();
      const title = t.title.toLowerCase();

      switch (activeFilter) {
        case "luxury":
          return (
            (slug.includes("luxury-wedding") ||
              slug === "luxury" ||
              slug.includes("couture") ||
              title.toLowerCase().includes("luxury wedding")) &&
            !slug.includes("destination")
          );
        case "royal":
          return slug.includes("royal") || slug.includes("rajwada") || title.includes("royal");
        case "hindu":
          return slug.includes("hindu") || slug.includes("vivah") || slug.includes("vedic") || title.includes("hindu");
        case "punjabi":
          return slug.includes("punjabi") || title.includes("punjabi");
        case "muslim":
          return slug.includes("muslim") || slug.includes("nikah") || title.includes("muslim") || title.includes("nikah");
        case "christian":
          return slug.includes("christian") || title.includes("christian");
        case "destination":
          return slug.includes("destination") || slug.includes("coastal") || title.includes("destination");
        default:
          return true;
      }
    });
  }, [templates, activeFilter]);

  return (
    <div className="w-full">
      {/* Cultural Filter Tabs Bar */}
      <div className="w-full max-w-full overflow-x-auto pb-3 scrollbar-none px-2 mb-10">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D9] shadow-xs w-max min-w-full justify-start sm:justify-center">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-serif font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#541D2B] text-[#FAF7F2] shadow-xs scale-102"
                    : "text-stone-600 hover:text-[#541D2B] hover:bg-white/80"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Result Counter */}
      <div className="flex items-center justify-between max-w-7xl mx-auto mb-8 px-2 text-xs font-serif text-stone-500">
        <span>
          Showing <strong className="text-stone-900">{filteredTemplates.length}</strong> bespoke invitation {filteredTemplates.length === 1 ? "suite" : "suites"}
        </span>
        <span className="italic flex items-center gap-1 text-[#C5A36A]">
          <Sparkles size={12} />
          <span>Interactive Opening Ceremony Included</span>
        </span>
      </div>

      {/* Luxury Stationery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {filteredTemplates.map((template) => (
          <WeddingStationeryCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
