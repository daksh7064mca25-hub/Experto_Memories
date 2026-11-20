import { AnniversaryThemeId, ThemeId, OccasionType } from "@/types/website";
import { ThemeConfig, THEMES as APOLOGY_THEMES } from "@/config/themes";

export const ANNIVERSARY_THEMES: Record<AnniversaryThemeId, ThemeConfig> = {
  "pink-paradise": {
    id: "pink-paradise" as ThemeId,
    name: "Pink Paradise",
    tagline: "Pastel blush, sweet bows, and tender scrapbook nostalgia",
    previewGradient: "from-pink-200 via-rose-100 to-pink-300",
    bgClass: "bg-gradient-to-b from-pink-50 via-rose-50/60 to-pink-100/70 text-rose-950",
    cardBgClass: "bg-white/85 backdrop-blur-md border border-pink-200 shadow-xl shadow-pink-200/40",
    textColor: "text-rose-950",
    accentColor: "text-rose-500",
    primaryButtonClass:
      "bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-lg shadow-pink-400/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-pink-50 text-rose-700 border border-pink-200 shadow-sm",
    badgeClass: "bg-pink-100 text-pink-700 border-pink-200",
    paperBgClass: "bg-[#fffaf7] border border-[#f5e6de] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🎀",
    particles: {
      color: "rgba(244, 114, 182, 0.45)",
      shapes: ["heart", "sparkle"],
    },
  },
  "golden-forever": {
    id: "golden-forever" as ThemeId,
    name: "Golden Forever",
    tagline: "Champagne gold, ivory silk, and timeless editorial romance",
    previewGradient: "from-amber-100 via-stone-50 to-amber-200",
    bgClass: "bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#f4ebe1] text-[#2c221a]",
    cardBgClass: "bg-[#fffdfa]/90 backdrop-blur-md border border-amber-200/70 shadow-xl shadow-amber-900/5",
    textColor: "text-[#2c221a]",
    accentColor: "text-amber-600",
    primaryButtonClass:
      "bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-lg shadow-amber-600/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-amber-50/60 text-amber-900 border border-amber-300/80 shadow-sm",
    badgeClass: "bg-amber-100/70 text-amber-900 border-amber-200",
    paperBgClass: "bg-[#faf7f2] border border-[#ebe2d3] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "✨",
    particles: {
      color: "rgba(217, 119, 6, 0.4)",
      shapes: ["sparkle", "star"],
    },
  },
  "our-universe": {
    id: "our-universe" as ThemeId,
    name: "Our Universe",
    tagline: "Deep violet cosmos, glowing stardust, and infinite constellations",
    previewGradient: "from-[#1a102f] via-[#2d1b4e] to-[#0d0718]",
    bgClass: "bg-gradient-to-b from-[#0f091c] via-[#1b1031] to-[#0a0513] text-purple-100",
    cardBgClass: "bg-purple-950/60 backdrop-blur-md border border-purple-500/30 shadow-2xl shadow-purple-950/80",
    textColor: "text-purple-100",
    accentColor: "text-purple-300",
    primaryButtonClass:
      "bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/40 border border-purple-400/30",
    secondaryButtonClass:
      "bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-400/30 shadow-sm",
    badgeClass: "bg-purple-950/80 text-purple-200 border-purple-500/40",
    paperBgClass: "bg-[#180f2a] border border-purple-900/60 shadow-md text-purple-100",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🌌",
    particles: {
      color: "rgba(192, 132, 252, 0.45)",
      shapes: ["star", "sparkle"],
    },
  },
  "sunset-love": {
    id: "sunset-love" as ThemeId,
    name: "Sunset Love",
    tagline: "Warm amber sunsets, golden glow, and soft twilight whispers",
    previewGradient: "from-orange-200 via-rose-100 to-amber-200",
    bgClass: "bg-gradient-to-b from-orange-50/90 via-rose-50/50 to-amber-100/60 text-stone-900",
    cardBgClass: "bg-white/85 backdrop-blur-md border border-orange-200/80 shadow-xl shadow-orange-200/30",
    textColor: "text-stone-900",
    accentColor: "text-orange-600",
    primaryButtonClass:
      "bg-gradient-to-r from-orange-500 via-rose-400 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-400/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-orange-50 text-stone-800 border border-orange-200 shadow-sm",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
    paperBgClass: "bg-[#fffaf5] border border-[#f6e9dd] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🌅",
    particles: {
      color: "rgba(249, 115, 22, 0.4)",
      shapes: ["heart", "sparkle"],
    },
  },
};

/**
 * Universal theme resolver for both Apology and Anniversary products
 */
export function getThemeConfig(themeId?: string, occasionType?: OccasionType): ThemeConfig {
  if (themeId && themeId in ANNIVERSARY_THEMES) {
    return ANNIVERSARY_THEMES[themeId as AnniversaryThemeId];
  }
  if (themeId && themeId in APOLOGY_THEMES) {
    return APOLOGY_THEMES[themeId as keyof typeof APOLOGY_THEMES];
  }

  // Fallback by occasion type
  if (occasionType === "anniversary") {
    return ANNIVERSARY_THEMES["pink-paradise"];
  }
  return APOLOGY_THEMES["cotton-candy"];
}

