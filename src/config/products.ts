export interface ProductThemeOption {
  id: string;
  name: string;
  description: string;
  previewColor: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  occasionType: "apology" | "anniversary" | "birthday" | "love" | "wedding";
  category: "apology" | "anniversary" | "birthday" | "love" | "wedding";
  price: number; // in INR
  originalPrice?: number;
  badge?: string;
  description: string;
  features: string[];
  themes: ProductThemeOption[];
  defaultTheme: string;
  demoUrl: string;
  heroImage?: string;
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "prod-anniversary",
    slug: "anniversary",
    title: "Our Forever Story",
    subtitle: "A Timeless Journey Through Every Chapter of Your Love",
    occasionType: "anniversary",
    category: "anniversary",
    price: 999,
    originalPrice: 1999,
    badge: "Bestseller",
    description:
      "An unforgettable, bespoke interactive website celebrating your relationship milestones, couple trivia quizzes, glowing star constellation memories, and a vintage turntable vinyl lounge.",
    features: [
      "Relationship Timeline with milestone photos & chapter badges",
      "Interactive 'How Well Do You Know Us?' couple quiz",
      "Celestial Constellation with tap-to-reveal glowing memories",
      "Vinyl Turntable Lounge with manual needle scrubber",
      "Wax-sealed Future Love Letter & Adventure Bucket List",
      "Grand Finale Fireworks with private celebratory modal",
    ],
    defaultTheme: "pink-paradise",
    themes: [
      {
        id: "pink-paradise",
        name: "Pink Paradise",
        description: "Soft rose quartz with luminous gold highlights",
        previewColor: "#f43f5e",
      },
      {
        id: "golden-forever",
        name: "Golden Forever",
        description: "Regal warm champagne with radiant gold gradients",
        previewColor: "#d97706",
      },
      {
        id: "our-universe",
        name: "Our Universe",
        description: "Cosmic deep space navy with glowing indigo stars",
        previewColor: "#6366f1",
      },
      {
        id: "sunset-love",
        name: "Sunset Love",
        description: "Romantic twilight coral blending into warm amber",
        previewColor: "#f97316",
      },
    ],
    demoUrl: "/demo/anniversary",
  },
  {
    id: "prod-apology",
    slug: "apology",
    title: "A Little Sorry, A Lot of Love",
    subtitle: "When Simple Words Aren't Enough — An Honest Path to Healing",
    occasionType: "apology",
    category: "apology",
    price: 999,
    originalPrice: 1999,
    badge: "Most Heartfelt",
    description:
      "A tender, respectful, non-coercive interactive website designed to rebuild trust, share earnest promises, revisit cherished memories, and give your partner room to feel truly heard.",
    features: [
      "3D Wax-Sealed Opening Envelope with personal teaser",
      "Interactive Memory Scrapbook with polaroids & captions",
      "Forgiveness Garden & Catch My Love interactive minigames",
      "Redeemable Apology Coupon Book & Secret Heart whisper",
      "Wax-Sealed Promises & heartfelt handwritten letter",
      "Gentle dual-choice finale respecting their emotional boundary",
    ],
    defaultTheme: "cotton-candy",
    themes: [
      {
        id: "cotton-candy",
        name: "Cotton Candy",
        description: "Gentle pastel blush and airy cloud pink",
        previewColor: "#ec4899",
      },
      {
        id: "lavender-dreams",
        name: "Lavender Dreams",
        description: "Calming lilac, soothing purple, and serene tones",
        previewColor: "#a855f7",
      },
      {
        id: "peachy-love",
        name: "Peachy Love",
        description: "Warm sunset apricot and tender peach glow",
        previewColor: "#fb923c",
      },
      {
        id: "midnight-hearts",
        name: "Midnight Hearts",
        description: "Intimate dark charcoal with glowing crimson ruby accents",
        previewColor: "#e11d48",
      },
    ],
    demoUrl: "/demo/apology",
  },
  {
    id: "prod-birthday",
    slug: "birthday",
    title: "The Birthday Chronicle",
    subtitle: "An Immersive Digital Celebration Made Exclusively for Them",
    occasionType: "birthday",
    category: "birthday",
    price: 999,
    originalPrice: 1799,
    badge: "Celebration",
    description:
      "A joyous celebration of their journey so far. Features birthday milestone highlights, heartfelt tributes from loved ones, interactive gift box unboxings, and confetti explosions.",
    features: [
      "Animated Birthday Cake with interactive candle blowout",
      "Year-by-Year Memory Photo Wall",
      "Wishes & Voice Notes from close family and friends",
      "Interactive Mystery Gift Box unboxer",
      "Custom Birthday Playlist with audio visualizer",
    ],
    defaultTheme: "golden-forever",
    themes: [
      {
        id: "golden-forever",
        name: "Golden Sparkles",
        description: "Festive radiant gold and sparkling champagne",
        previewColor: "#eab308",
      },
      {
        id: "pink-paradise",
        name: "Pastel Pop",
        description: "Vibrant celebratory confetti tones",
        previewColor: "#ec4899",
      },
      {
        id: "our-universe",
        name: "Midnight Disco",
        description: "Electrifying cosmic birthday party atmosphere",
        previewColor: "#8b5cf6",
      },
    ],
    demoUrl: "/demo/birthday",
  },
  {
    id: "prod-love",
    slug: "love",
    title: "The Secret World of Us",
    subtitle: "An Intimate Romantic Universe Created Exclusively for One Person",
    occasionType: "love",
    category: "love",
    price: 999,
    originalPrice: 1799,
    badge: "Pure Romance",
    description:
      "For Valentine's Day, anniversaries, or 'just because'. A luxurious romantic experience featuring an animated sealed envelope, interactive heart questions, reasons why I love you cards, a celestial starlit universe, a playable love puzzle, memory gallery, wax-sealed love letter, and grand final surprise.",
    features: [
      "Interactive Sealed Invitation with wax-seal opening",
      "Question from the Heart with personalized branch reveals",
      "Reasons Why I Love You interactive collection cards",
      "Our Little Universe celestial night sky with glowing memory stars",
      "The Love Puzzle interactive mini-game with secret reward",
      "Wax-Sealed Love Letter with long-form handwritten typography",
      "Ambient Vinyl Soundtrack Player with preview mode",
      "Customizable Grand Finale with WhatsApp love reply",
    ],
    defaultTheme: "burgundy-velvet",
    themes: [
      {
        id: "burgundy-velvet",
        name: "Burgundy Velvet",
        description: "Deep royal wine, velvet romance & warm gold",
        previewColor: "#722f37",
      },
      {
        id: "rose-blush",
        name: "Rose Blush",
        description: "Delicate blush pink & poetic romantic warmth",
        previewColor: "#f43f5e",
      },
      {
        id: "midnight-starlight",
        name: "Midnight Starlight",
        description: "Obsidian night sky & glowing constellations",
        previewColor: "#111326",
      },
      {
        id: "champagne-romance",
        name: "Champagne Romance",
        description: "Timeless ivory elegance & bespoke luxury",
        previewColor: "#d97706",
      },
    ],
    demoUrl: "/demo/love",
  },
  {
    id: "prod-wedding",
    slug: "wedding",
    title: "The Royal Wedding Invitation",
    subtitle: "A Grand Multi-Event Digital Invitation & Guest RSVP Experience",
    occasionType: "wedding",
    category: "wedding",
    price: 1499,
    originalPrice: 2999,
    badge: "Royal Luxury",
    description:
      "A majestic, culturally authentic digital wedding invitation featuring royal double-door unboxing, shehnai melodies, multi-event itineraries with Google Maps, couple love stories, and interactive guest RSVP tracking.",
    features: [
      "Royal Palace Double Doors or Wax Seal unboxing ceremony",
      "Live Wedding Countdown with Google Calendar sync",
      "Multi-Event Itineraries (Haldi, Mehendi, Sangeet, Wedding, Reception) with Google Maps",
      "Interactive Guest RSVP engine with attendance headcount & event checkboxes",
      "Couple Love Story chapters & High-Resolution Photo Gallery",
      "Travel, Airport, Accommodations & Concierge desk info",
      "Family Blessings & WhatsApp one-click invite sharing",
    ],
    defaultTheme: "royal-crimson",
    themes: [
      {
        id: "royal-crimson",
        name: "Royal Crimson & Gold",
        description: "Regal Indian palace crimson with warm bullion gold",
        previewColor: "#7a121d",
      },
      {
        id: "marigold-sindoor",
        name: "Marigold & Sindoor",
        description: "Festive auspicious yellow, raw vermilion & brass",
        previewColor: "#d97706",
      },
      {
        id: "shahi-emerald",
        name: "Shahi Emerald",
        description: "Regal Punjabi royal green & shimmering champagne",
        previewColor: "#047857",
      },
      {
        id: "cathedral-rose",
        name: "Cathedral Rose & Pearl",
        description: "Timeless Christian stained glass rose & satin cream",
        previewColor: "#be185d",
      },
      {
        id: "minimal-linen",
        name: "Minimal Warm Linen",
        description: "Understated modern architectural taupe & warm ivory",
        previewColor: "#78716c",
      },
    ],
    demoUrl: "/demo/wedding",
  },
  {
    id: "prod-wedding-luxury",
    slug: "luxury-wedding",
    title: "The Luxury Wedding Collection",
    subtitle: "Haute Couture Folio Unboxing, Champagne Romance & Bespoke Elegance",
    occasionType: "wedding",
    category: "wedding",
    price: 1999,
    originalPrice: 3999,
    badge: "Haute Couture",
    description:
      "An ultra-luxury wedding invitation inspired by haute couture stationery, featuring rich ivory, champagne gold, deep burgundy wine accents, and editorial typography.",
    features: [
      "3D Gilded Unboxing Folio & Wax Seal Opening Ceremony",
      "Live Luxury Wedding Countdown Counter",
      "Multi-Ceremony Schedule with interactive Google Maps & attire guides",
      "Editorial Love Story Timeline & High-Res Portrait Carousel",
      "Real-Time VIP Guest RSVP with Multi-Event Attendance & Dietary Intelligence",
      "Travel Concierge, Accommodations & WhatsApp Sharing",
    ],
    defaultTheme: "champagne-gold",
    themes: [
      {
        id: "champagne-gold",
        name: "Champagne & Warm Ivory",
        description: "Bespoke warm ivory, delicate gold foil & linen",
        previewColor: "#D4AF37",
      },
      {
        id: "burgundy-wine",
        name: "Deep Burgundy Wine & Gold",
        description: "Deep royal wine, velvet gold & black tie accents",
        previewColor: "#58111A",
      },
      {
        id: "onyx-noir",
        name: "Onyx Noir & Champagne",
        description: "Timeless black tie glamour, dark obsidian & bullion gold",
        previewColor: "#1A1A1A",
      },
      {
        id: "emerald-monogram",
        name: "Imperial Emerald",
        description: "Regal jewel emerald with antique champagne borders",
        previewColor: "#0F281E",
      },
    ],
    demoUrl: "/demo/wedding/luxury",
  },
];

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export function getProductsByCategory(
  category: "all" | "apology" | "anniversary" | "birthday" | "love" | "wedding"
): CatalogProduct[] {
  if (category === "all") return CATALOG_PRODUCTS;
  return CATALOG_PRODUCTS.filter((p) => p.category === category);
}
