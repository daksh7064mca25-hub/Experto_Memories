import { BirthdayThemeId, ThemeId } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

export const BIRTHDAY_THEMES: Record<BirthdayThemeId, ThemeConfig> = {
  "golden-champagne": {
    id: "golden-champagne" as ThemeId,
    name: "Golden Champagne",
    tagline: "Warm champagne gold, soft ivory, and festive candlelight elegance",
    previewGradient: "from-amber-200 via-amber-100 to-yellow-300",
    bgClass: "bg-gradient-to-b from-[#fdfbf7] via-[#faf5e8] to-[#f5eddb] text-[#332616]",
    cardBgClass: "bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-xl shadow-amber-900/10",
    textColor: "text-[#332616]",
    accentColor: "text-amber-600",
    primaryButtonClass:
      "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-amber-50 text-amber-900 border border-amber-200 shadow-sm",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
    paperBgClass: "bg-[#fffef9] border border-[#f0e7d5] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🥂",
    particles: {
      color: "rgba(245, 158, 11, 0.4)",
      shapes: ["sparkle", "star"],
    },
  },
  "blush-wonderland": {
    id: "blush-wonderland" as ThemeId,
    name: "Blush Wonderland",
    tagline: "Delicate blush pink, celebratory confetti, and fairytale magic",
    previewGradient: "from-rose-200 via-pink-100 to-rose-300",
    bgClass: "bg-gradient-to-b from-[#fdf6f7] via-[#fceede] to-[#fce4ec] text-[#3b1928]",
    cardBgClass: "bg-white/90 backdrop-blur-md border border-rose-200 shadow-xl shadow-rose-400/10",
    textColor: "text-[#3b1928]",
    accentColor: "text-rose-500",
    primaryButtonClass:
      "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-400/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-rose-50 text-rose-800 border border-rose-200 shadow-sm",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    paperBgClass: "bg-[#fffafb] border border-[#fbe1e7] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🎀",
    particles: {
      color: "rgba(244, 63, 94, 0.4)",
      shapes: ["heart", "sparkle"],
    },
  },
  "peachy-celebration": {
    id: "peachy-celebration" as ThemeId,
    name: "Peachy Celebration",
    tagline: "Sweet apricot, golden sunset glow, and warm heartfelt joy",
    previewGradient: "from-orange-200 via-rose-100 to-amber-200",
    bgClass: "bg-gradient-to-b from-[#fffaf5] via-[#fff1e6] to-[#ffe5d3] text-[#442316]",
    cardBgClass: "bg-white/90 backdrop-blur-md border border-orange-200 shadow-xl shadow-orange-500/10",
    textColor: "text-[#442316]",
    accentColor: "text-orange-500",
    primaryButtonClass:
      "bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 hover:from-orange-500 hover:to-rose-500 text-white shadow-lg shadow-orange-400/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-orange-50 text-orange-900 border border-orange-200 shadow-sm",
    badgeClass: "bg-orange-100 text-orange-900 border-orange-200",
    paperBgClass: "bg-[#fffbf8] border border-[#fde2cf] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🍑",
    particles: {
      color: "rgba(249, 115, 22, 0.4)",
      shapes: ["sparkle", "star"],
    },
  },
  "midnight-sparkle": {
    id: "midnight-sparkle" as ThemeId,
    name: "Midnight Sparkle",
    tagline: "Velvet midnight sky, glowing gold fireworks, and starlight confetti",
    previewGradient: "from-[#110f24] via-[#1a173b] to-[#0c0919]",
    bgClass: "bg-gradient-to-b from-[#0e0c1f] via-[#181433] to-[#080612] text-amber-50",
    cardBgClass: "bg-[#181433]/80 backdrop-blur-md border border-amber-400/30 shadow-2xl shadow-purple-950/80",
    textColor: "text-amber-50",
    accentColor: "text-amber-400",
    primaryButtonClass:
      "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-stone-950 font-bold shadow-lg shadow-amber-500/40",
    secondaryButtonClass:
      "bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-400/40 shadow-sm",
    badgeClass: "bg-amber-950/80 text-amber-300 border-amber-500/40",
    paperBgClass: "bg-[#1e193d] border border-[#3b326d] shadow-md text-amber-100",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🎆",
    particles: {
      color: "rgba(251, 191, 36, 0.5)",
      shapes: ["star", "sparkle"],
    },
  },
};

export function getBirthdayThemeConfig(themeId?: string): ThemeConfig {
  if (themeId && themeId in BIRTHDAY_THEMES) {
    return BIRTHDAY_THEMES[themeId as BirthdayThemeId];
  }
  return BIRTHDAY_THEMES["golden-champagne"];
}
