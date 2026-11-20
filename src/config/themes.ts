import { ApologyThemeId, ThemeId } from "@/types/website";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  previewGradient: string;
  bgClass: string;
  cardBgClass: string;
  textColor: string;
  accentColor: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
  badgeClass: string;
  paperBgClass: string;
  fontHeading: string;
  fontBody: string;
  accentEmoji: string;
  particles: {
    color: string;
    shapes: ("heart" | "star" | "sparkle")[];
  };
}

export const THEMES: Record<string, ThemeConfig> = {
  "cotton-candy": {
    id: "cotton-candy",
    name: "Cotton Candy",
    tagline: "Soft blush pinks, warm cream, and sweet bows",
    previewGradient: "from-pink-100 via-rose-50 to-pink-200",
    bgClass: "bg-gradient-to-b from-pink-50 via-rose-50/50 to-pink-100/60 text-rose-950",
    cardBgClass: "bg-white/85 backdrop-blur-md border border-pink-200 shadow-xl shadow-pink-100/40",
    textColor: "text-rose-950",
    accentColor: "text-pink-500",
    primaryButtonClass:
      "bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-lg shadow-pink-400/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-pink-50 text-rose-700 border border-pink-200 shadow-sm",
    badgeClass: "bg-pink-100 text-pink-700 border-pink-200",
    paperBgClass: "bg-[#fffaf6] border border-[#f3e7df] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🎀",
    particles: {
      color: "rgba(244, 114, 182, 0.4)",
      shapes: ["heart", "sparkle"],
    },
  },
  "lavender-dreams": {
    id: "lavender-dreams",
    name: "Lavender Dreams",
    tagline: "Ethereal lilacs, soft purples, and midnight starlight",
    previewGradient: "from-purple-100 via-indigo-50 to-purple-200",
    bgClass: "bg-gradient-to-b from-purple-50 via-indigo-50/40 to-purple-100/70 text-purple-950",
    cardBgClass: "bg-white/85 backdrop-blur-md border border-purple-200 shadow-xl shadow-purple-100/40",
    textColor: "text-purple-950",
    accentColor: "text-purple-600",
    primaryButtonClass:
      "bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 text-white shadow-lg shadow-purple-400/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-purple-50 text-purple-700 border border-purple-200 shadow-sm",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    paperBgClass: "bg-[#fbf9fe] border border-[#eee8f7] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "✨",
    particles: {
      color: "rgba(168, 85, 247, 0.4)",
      shapes: ["star", "sparkle"],
    },
  },
  "peachy-love": {
    id: "peachy-love",
    name: "Peachy Love",
    tagline: "Warm sunset peaches, golden honey light, and soft nostalgia",
    previewGradient: "from-amber-100 via-orange-50 to-rose-100",
    bgClass: "bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-rose-50/60 text-amber-950",
    cardBgClass: "bg-white/85 backdrop-blur-md border border-orange-200/70 shadow-xl shadow-orange-100/40",
    textColor: "text-amber-950",
    accentColor: "text-orange-500",
    primaryButtonClass:
      "bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white shadow-lg shadow-orange-400/30",
    secondaryButtonClass:
      "bg-white/90 hover:bg-orange-50 text-amber-800 border border-orange-200 shadow-sm",
    badgeClass: "bg-amber-100 text-amber-800 border-orange-200",
    paperBgClass: "bg-[#fffcf7] border border-[#faeeda] shadow-md",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🍑",
    particles: {
      color: "rgba(251, 146, 60, 0.4)",
      shapes: ["heart", "sparkle"],
    },
  },
  "midnight-hearts": {
    id: "midnight-hearts",
    name: "Midnight Hearts",
    tagline: "Deep plum night, neon pink glow, and candlelit whispers",
    previewGradient: "from-slate-900 via-purple-950 to-pink-950",
    bgClass: "bg-gradient-to-b from-slate-950 via-purple-950 to-[#12071a] text-pink-50",
    cardBgClass: "bg-black/60 backdrop-blur-md border border-pink-500/30 shadow-2xl shadow-pink-950/60",
    textColor: "text-pink-50",
    accentColor: "text-pink-400",
    primaryButtonClass:
      "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg shadow-pink-500/40 border border-pink-400/30",
    secondaryButtonClass:
      "bg-purple-950/70 hover:bg-purple-900/80 text-pink-200 border border-pink-500/30 shadow-sm",
    badgeClass: "bg-pink-950/80 text-pink-300 border-pink-500/40",
    paperBgClass: "bg-[#180e22] border border-pink-900/50 shadow-md text-pink-100",
    fontHeading: "font-serif",
    fontBody: "font-sans",
    accentEmoji: "🌙",
    particles: {
      color: "rgba(236, 72, 153, 0.5)",
      shapes: ["heart", "star"],
    },
  },
};

