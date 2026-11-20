import { LoveThemeId, ThemeId } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

export const LOVE_THEMES: Record<LoveThemeId, ThemeConfig> = {
  "burgundy-velvet": {
    id: "burgundy-velvet" as ThemeId,
    name: "Burgundy Velvet",
    tagline: "Deep royal wine, velvet romance, and opulent warm champagne gold",
    previewGradient: "from-[#4a0e17] via-[#722f37] to-[#2d080e]",
    bgClass: "bg-gradient-to-b from-[#1f050a] via-[#330810] to-[#140206] text-rose-50",
    cardBgClass: "bg-[#2c0810]/85 backdrop-blur-md border border-amber-400/30 shadow-2xl shadow-rose-950/60",
    textColor: "text-rose-50",
    accentColor: "text-amber-300",
    primaryButtonClass:
      "bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-500 hover:to-rose-600 text-stone-950 font-bold shadow-xl shadow-rose-900/40",
    secondaryButtonClass:
      "bg-[#3d0d17]/80 hover:bg-[#4d131f] text-rose-200 border border-amber-400/30 shadow-sm",
    badgeClass: "bg-rose-950/80 text-amber-300 border-amber-400/30",
    paperBgClass: "bg-[#2e0912] border border-[#521321] shadow-lg text-rose-100",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🍷",
    particles: {
      color: "rgba(244, 63, 94, 0.45)",
      shapes: ["heart", "sparkle"],
    },
  },
  "rose-blush": {
    id: "rose-blush" as ThemeId,
    name: "Rose Blush",
    tagline: "Delicate soft blush, poetic rose petals, and intimate romantic warmth",
    previewGradient: "from-rose-200 via-pink-100 to-rose-300",
    bgClass: "bg-gradient-to-b from-[#fff5f6] via-[#fdf0f2] to-[#fae6e9] text-[#3d121c]",
    cardBgClass: "bg-white/92 backdrop-blur-md border border-rose-200/90 shadow-xl shadow-rose-900/10",
    textColor: "text-[#3d121c]",
    accentColor: "text-rose-600",
    primaryButtonClass:
      "bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-lg shadow-rose-500/25",
    secondaryButtonClass:
      "bg-white/90 hover:bg-rose-50 text-rose-900 border border-rose-200 shadow-sm",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
    paperBgClass: "bg-[#fffafb] border border-[#fbd4dd] shadow-md text-[#3d121c]",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🌹",
    particles: {
      color: "rgba(244, 63, 94, 0.4)",
      shapes: ["heart", "sparkle"],
    },
  },
  "midnight-starlight": {
    id: "midnight-starlight" as ThemeId,
    name: "Midnight Starlight",
    tagline: "Endless obsidian galaxy, luminous glowing constellations, and timeless devotion",
    previewGradient: "from-[#080914] via-[#12132e] to-[#04040a]",
    bgClass: "bg-gradient-to-b from-[#060710] via-[#0f1124] to-[#030308] text-amber-50",
    cardBgClass: "bg-[#111326]/85 backdrop-blur-md border border-amber-300/30 shadow-2xl shadow-indigo-950/80",
    textColor: "text-amber-50",
    accentColor: "text-amber-300",
    primaryButtonClass:
      "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-bold shadow-xl shadow-amber-400/30",
    secondaryButtonClass:
      "bg-[#181a33]/80 hover:bg-[#202345] text-amber-200 border border-amber-300/30 shadow-sm",
    badgeClass: "bg-indigo-950/80 text-amber-300 border-amber-400/30",
    paperBgClass: "bg-[#14162e] border border-[#2a2d59] shadow-lg text-amber-100",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "✨",
    particles: {
      color: "rgba(251, 191, 36, 0.5)",
      shapes: ["star", "sparkle"],
    },
  },
  "champagne-romance": {
    id: "champagne-romance" as ThemeId,
    name: "Champagne Romance",
    tagline: "Timeless ivory elegance, bespoke editorial typography, and quiet luxury",
    previewGradient: "from-[#fbf8f3] via-[#f5ede1] to-[#ebe0ce]",
    bgClass: "bg-gradient-to-b from-[#fdfbf7] via-[#f7f1e6] to-[#efe5d4] text-[#2e2319]",
    cardBgClass: "bg-white/92 backdrop-blur-md border border-amber-200/80 shadow-xl shadow-stone-800/10",
    textColor: "text-[#2e2319]",
    accentColor: "text-amber-700",
    primaryButtonClass:
      "bg-gradient-to-r from-[#8c6b45] via-[#a68054] to-[#7d5e3c] hover:from-[#7d5e3c] hover:to-[#684d30] text-amber-50 font-medium shadow-lg shadow-amber-900/20",
    secondaryButtonClass:
      "bg-white/90 hover:bg-amber-50 text-[#423325] border border-amber-200 shadow-sm",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
    paperBgClass: "bg-[#fffdf9] border border-[#e8ddcb] shadow-md text-[#2e2319]",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🥂",
    particles: {
      color: "rgba(217, 119, 6, 0.35)",
      shapes: ["sparkle", "star"],
    },
  },
};

export function getLoveThemeConfig(themeId?: string): ThemeConfig {
  if (themeId && themeId in LOVE_THEMES) {
    return LOVE_THEMES[themeId as LoveThemeId];
  }
  // Safe fallbacks for older legacy projects
  if (themeId === "sunset-love" || themeId === "cotton-candy" || themeId === "pink-paradise") {
    return LOVE_THEMES["rose-blush"];
  }
  return LOVE_THEMES["burgundy-velvet"];
}
