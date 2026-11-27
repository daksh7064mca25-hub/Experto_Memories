/**
 * EXPERTOMEMORIES PRODUCT CATALOG & TAXONOMY
 * Defines the core business divisions, subcategories, design templates, and pricing presets.
 */

export interface ProductThemeOption {
  id: string;
  name: string;
  description: string;
  previewColor: string;
}

export interface CatalogueTemplate {
  id: string;
  slug: string;
  categoryId: "digital-gifts" | "wedding-invitations" | "birthday-celebrations" | "future-celebrations";
  subcategoryId: string;
  occasionType: "apology" | "anniversary" | "birthday" | "love" | "wedding";
  title: string;
  designName: string;
  tagline: string;
  description: string;
  badge?: string;
  price: number;
  originalPrice: number;
  demoUrl: string;
  previewImage?: string;
  features: string[];
  defaultTheme: string;
  themes: ProductThemeOption[];
  isActive: boolean;
  recipientType?: string;
  culturalTag?: string;
  shortSlug?: string;
  collectionLabel?: string;
  editorialSubtitle?: string;
  cardColorway?: {
    cardBg: string;
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
    accentGold: string;
    ornament: string;
  };
}

export interface CatalogueSubcategory {
  id: string;
  slug: string;
  categoryId: "digital-gifts" | "wedding-invitations" | "birthday-celebrations" | "future-celebrations";
  title: string;
  description: string;
  badge?: string;
  iconName: string;
  displayOrder: number;
}

export interface CatalogueCategory {
  id: "digital-gifts" | "wedding-invitations" | "birthday-celebrations" | "future-celebrations";
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  headline: string;
  description: string;
  accentColor: string;
  badge: string;
  displayOrder: number;
  isActive: boolean;
}

// -------------------------------------------------------------
// 1. MASTER DIVISIONS / MAIN CATEGORIES
// -------------------------------------------------------------
export const CATALOGUE_CATEGORIES: CatalogueCategory[] = [
  {
    id: "digital-gifts",
    slug: "digital-gifts",
    title: "Love & Relationship Gifts",
    shortTitle: "Love & Relationships",
    eyebrow: "EMOTIONAL & MEMORABLE",
    headline: "Gifts That Speak What Words Alone Cannot",
    description:
      "Heartfelt apology letters, cinematic love stories, and romantic anniversary museums personalized with your music, polaroids, and private surprises.",
    accentColor: "#541D2B",
    badge: "Most Cherished",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "wedding-invitations",
    slug: "wedding-invitations",
    title: "Digital Wedding Invitations",
    shortTitle: "Weddings",
    eyebrow: "ROYAL & CONTEMPORARY INVITATIONS",
    headline: "An Invitation Experience Guests Will Cherish Forever",
    description:
      "Bespoke wedding websites with animated door and envelope reveals, multi-event agendas with Google Maps, RSVP tracking, couple stories, and WhatsApp sharing.",
    accentColor: "#9C2D41",
    badge: "Luxury Edition",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "birthday-celebrations",
    slug: "birthday-celebrations",
    title: "Birthday Wonderlands",
    shortTitle: "Birthdays",
    eyebrow: "JOYFUL & IMMERSIVE",
    headline: "Celebrate Their Special Day Like Never Before",
    description:
      "Curated birthday websites organized for Her, Him, and Milestone celebrations with interactive cakes, candle blowouts, balloon wishes, and memory scrapbooks.",
    accentColor: "#8E641D",
    badge: "New Collections",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "future-celebrations",
    slug: "future-celebrations",
    title: "Special Celebrations & Milestones",
    shortTitle: "More Occasions",
    eyebrow: "COMING SOON",
    headline: "Expanding Every Way We Celebrate Life",
    description:
      "Upcoming collections for Engagements, Baby Showers, Housewarmings, Retirements, and Religious Ceremonies.",
    accentColor: "#4A3E3D",
    badge: "Coming Soon",
    displayOrder: 4,
    isActive: true,
  },
];

// -------------------------------------------------------------
// 2. SUBCATEGORIES
// -------------------------------------------------------------
export const CATALOGUE_SUBCATEGORIES: CatalogueSubcategory[] = [
  // Digital Gifts
  {
    id: "sub-love",
    slug: "love-romance",
    categoryId: "digital-gifts",
    title: "Love & Romance",
    description: "Deep romantic worlds, heartfelt questions, starlit skies, and wax-sealed letters.",
    badge: "Popular",
    iconName: "Heart",
    displayOrder: 1,
  },
  {
    id: "sub-anniversary",
    slug: "anniversary",
    categoryId: "digital-gifts",
    title: "Anniversary Milestones",
    description: "Milestone relationship timelines, polaroid scrapbooks, and vintage turntable records.",
    badge: "Bestseller",
    iconName: "Calendar",
    displayOrder: 2,
  },
  {
    id: "sub-apology",
    slug: "apology",
    categoryId: "digital-gifts",
    title: "Apology & Reconciliation",
    description: "Tender letters, forgiveness games, redeemable coupon books, and sincere promises.",
    badge: "Most Heartfelt",
    iconName: "Mail",
    displayOrder: 3,
  },

  // Wedding Collections (Active Bespoke Collections & Archived Records)
  {
    id: "sub-royal-indian",
    slug: "royal-indian",
    categoryId: "wedding-invitations",
    title: "Royal Indian Wedding",
    description: "Palatial heritage, gold jharokha door reveal, crimson velvet, and majestic grand entrances.",
    badge: "Heritage Signature",
    iconName: "Crown",
    displayOrder: 10,
  },
  {
    id: "sub-traditional-hindu",
    slug: "traditional-hindu",
    categoryId: "wedding-invitations",
    title: "Traditional Hindu Wedding",
    description: "Sacred Vedic rituals, kalash & mandap floral reveal, marigold yellow, and holy pheras.",
    badge: "Vedic Traditions",
    iconName: "Sparkles",
    displayOrder: 11,
  },
  {
    id: "sub-punjabi",
    slug: "punjabi",
    categoryId: "wedding-invitations",
    title: "Punjabi Wedding",
    description: "Vibrant drumbeats, dhol & shahi chaddar reveal, jaggo, sangeet, and joyous celebration.",
    badge: "Vibrant Celebration",
    iconName: "Music",
    displayOrder: 12,
  },
  {
    id: "sub-luxury-wedding",
    slug: "luxury-wedding",
    categoryId: "wedding-invitations",
    title: "Luxury Wedding",
    description: "Haute couture stationery, gilded folio unboxing, champagne gold, and luxury destination grandeur.",
    badge: "Haute Couture",
    iconName: "Sparkles",
    displayOrder: 13,
  },
  {
    id: "sub-muslim",
    slug: "muslim",
    categoryId: "wedding-invitations",
    title: "Muslim Wedding (Nikah)",
    description: "Mughal calligraphy, crescent starlit silk parchment, emerald green, and majestic Walima.",
    badge: "Noor & Elegance",
    iconName: "Moon",
    displayOrder: 14,
  },
  {
    id: "sub-christian",
    slug: "christian",
    categoryId: "wedding-invitations",
    title: "Christian Wedding",
    description: "Cathedral stained glass arches, delicate silk ribbon bow, ivory cream, and sacred vows.",
    badge: "Timeless Cathedral",
    iconName: "Church",
    displayOrder: 15,
  },
  {
    id: "sub-luxury-destination",
    slug: "luxury-destination",
    categoryId: "wedding-invitations",
    title: "Luxury Destination Wedding",
    description: "Tropical coastal sunsets, ocean breeze passport reveal, beach sundowner, and gala night.",
    badge: "Resort Destination",
    iconName: "Compass",
    displayOrder: 16,
  },
  {
    id: "sub-sikh",
    slug: "sikh",
    categoryId: "wedding-invitations",
    title: "Sikh Wedding (Anand Karaj)",
    description: "Spiritual serenity, golden sunrise lotus unfold, pastel peach, and sacred Gurdwara hymns.",
    badge: "Spiritual Grace",
    iconName: "Sun",
    displayOrder: 90,
  },
  {
    id: "sub-modern-minimal",
    slug: "modern-minimal",
    categoryId: "wedding-invitations",
    title: "Modern Minimal Wedding",
    description: "Architectural gatefold, crisp linen typography, understated taupe, and chic intimate vibes.",
    badge: "Chic Minimal",
    iconName: "Layers",
    displayOrder: 91,
  },
  {
    id: "sub-floral-garden",
    slug: "floral-garden",
    categoryId: "wedding-invitations",
    title: "Floral Garden Wedding",
    description: "Botanical wildflower blooms, watercolor petal unveil, sage green, and starlit open lawn toasts.",
    badge: "Botanical Whimsy",
    iconName: "Flower",
    displayOrder: 92,
  },
  {
    id: "sub-elegant-contemporary",
    slug: "elegant-contemporary",
    categoryId: "wedding-invitations",
    title: "Elegant Contemporary Wedding",
    description: "Black-tie glamour, velvet wax-sealed envelope, champagne sparkle, and midnight after-party.",
    badge: "Black Tie Glamour",
    iconName: "GlassWater",
    displayOrder: 93,
  },

  // Birthday Subcategories (Organized by Relationship)
  {
    id: "sub-bday-her",
    slug: "for-her",
    categoryId: "birthday-celebrations",
    title: "Birthday For Her",
    description: "Curated tributes for Mother, Sister, Girlfriend, Wife, Daughter, or Best Friend.",
    badge: "Cherished Moments",
    iconName: "Heart",
    displayOrder: 20,
  },
  {
    id: "sub-bday-him",
    slug: "for-him",
    categoryId: "birthday-celebrations",
    title: "Birthday For Him",
    description: "Thoughtful designs for Father, Brother, Boyfriend, Husband, Son, or Best Friend.",
    badge: "Memorable Tributes",
    iconName: "Smile",
    displayOrder: 21,
  },
  {
    id: "sub-bday-milestones",
    slug: "milestones",
    categoryId: "birthday-celebrations",
    title: "Milestone & Kids Celebrations",
    description: "Interactive games, confetti balloons, and 3D cakes for Kids, 18th, 21st, 50th, and surprise birthdays.",
    badge: "Grand Celebrations",
    iconName: "Cake",
    displayOrder: 22,
  },
];

// -------------------------------------------------------------
// 3. MASTER CATALOG TEMPLATES
// -------------------------------------------------------------
export const CATALOGUE_TEMPLATES: CatalogueTemplate[] = [
  // --- DIGITAL GIFTS ---
  {
    id: "template-love-secret-world",
    slug: "the-secret-world-of-us",
    categoryId: "digital-gifts",
    subcategoryId: "sub-love",
    occasionType: "love",
    title: "The Secret World of Us",
    designName: "Celestial Burgundy Velvet",
    tagline: "An Intimate Romantic Universe Created Exclusively for One Person",
    description:
      "A luxurious romantic journey with an animated wax seal invitation, heartbeat questions, expanding reason cards, starlit constellation, love puzzle minigame, and grand WhatsApp finale.",
    badge: "Pure Romance",
    price: 999,
    originalPrice: 1999,
    demoUrl: "/demo/love",
    previewImage: "/images/templates/love-preview.jpg",
    features: [
      "Animated Wax-Sealed Invitation reveal",
      "Interactive 'Will You Be My Forever?' Heart Question",
      "Reasons Why I Love You expandable cards",
      "Our Little Universe celestial night sky with glowing memory stars",
      "Playable Love Puzzle with secret love reward",
      "Memory Scrapbook polaroid wall with zoom lightbox",
      "Wax-Sealed Love Letter with long-form handwritten typography",
      "Docked Vinyl Soundtrack player with audio preview",
      "Customizable Grand Finale with WhatsApp love reply",
    ],
    defaultTheme: "burgundy-velvet",
    themes: [
      { id: "burgundy-velvet", name: "Burgundy Velvet", description: "Deep royal wine & gold", previewColor: "#722f37" },
      { id: "rose-blush", name: "Rose Blush", description: "Delicate blush pink warmth", previewColor: "#f43f5e" },
      { id: "midnight-starlight", name: "Midnight Starlight", description: "Obsidian starry night", previewColor: "#111326" },
      { id: "champagne-romance", name: "Champagne Romance", description: "Timeless ivory elegance", previewColor: "#d97706" },
    ],
    isActive: true,
  },
  {
    id: "template-anniversary-forever",
    slug: "our-forever-story",
    categoryId: "digital-gifts",
    subcategoryId: "sub-anniversary",
    occasionType: "anniversary",
    title: "Our Forever Story",
    designName: "The Love Museum & Timeline",
    tagline: "A Timeless Journey Through Every Chapter of Your Love",
    description:
      "An interactive love museum featuring live relationship heartbeat counters, milestone memory cards, interactive Then vs Now slider, reasons I choose you, and vintage turntable lounge.",
    badge: "Bestseller",
    price: 999,
    originalPrice: 1999,
    demoUrl: "/demo/anniversary",
    previewImage: "/images/templates/anniversary-preview.jpg",
    features: [
      "Secret Invitation opening card",
      "Live Relationship Counter (Years, Months, Days, Secs)",
      "Where It All Began meeting story",
      "Milestone Journey Timeline with polaroid memories",
      "Interactive Then vs Now photo slider",
      "Reasons I Choose You 3D flip cards",
      "The Love Museum curated memory exhibit with plaques",
      "Couple Adventure Bucket List & future love letter",
      "Grand Finale Fireworks celebration modal",
    ],
    defaultTheme: "pink-paradise",
    themes: [
      { id: "pink-paradise", name: "Pink Paradise", description: "Rose quartz with luminous gold highlights", previewColor: "#f43f5e" },
      { id: "golden-forever", name: "Golden Forever", description: "Regal warm champagne with gold gradients", previewColor: "#d97706" },
      { id: "our-universe", name: "Our Universe", description: "Cosmic deep space navy & indigo stars", previewColor: "#6366f1" },
      { id: "sunset-love", name: "Sunset Love", description: "Romantic twilight coral into warm amber", previewColor: "#f97316" },
    ],
    isActive: true,
  },
  {
    id: "template-apology-letter",
    slug: "a-little-sorry-a-lot-of-love",
    categoryId: "digital-gifts",
    subcategoryId: "sub-apology",
    occasionType: "apology",
    title: "A Little Sorry, A Lot of Love",
    designName: "Gentle Heartfelt Healing",
    tagline: "When Simple Words Aren't Enough — An Honest Path to Healing",
    description:
      "A tender, respectful, non-coercive interactive website designed to rebuild trust, share earnest promises, revisit cherished memories, and give your partner room to feel truly heard.",
    badge: "Most Heartfelt",
    price: 999,
    originalPrice: 1999,
    demoUrl: "/demo/apology",
    previewImage: "/images/templates/apology-preview.jpg",
    features: [
      "3D Wax-Sealed Opening Envelope with personal teaser",
      "Heartfelt Letter with gentle typography",
      "Interactive Memory Scrapbook with polaroids & captions",
      "Forgiveness Garden & Catch My Love interactive minigames",
      "Redeemable Apology Coupon Book & Secret Heart whisper",
      "Wax-Sealed Promises & heartfelt handwritten letter",
      "Gentle dual-choice finale respecting emotional boundaries",
    ],
    defaultTheme: "cotton-candy",
    themes: [
      { id: "cotton-candy", name: "Cotton Candy", description: "Gentle pastel blush and airy cloud pink", previewColor: "#ec4899" },
      { id: "lavender-dreams", name: "Lavender Dreams", description: "Calming lilac and serene tones", previewColor: "#a855f7" },
      { id: "peachy-love", name: "Peachy Love", description: "Warm sunset apricot glow", previewColor: "#fb923c" },
      { id: "midnight-hearts", name: "Midnight Hearts", description: "Intimate dark charcoal with crimson ruby", previewColor: "#e11d48" },
    ],
    isActive: true,
  },

  // --- WEDDING COLLECTIONS (ACTIVE BESPOKE SUITES & ARCHIVED PRESETS) ---
  {
    id: "template-wedding-royal-indian",
    slug: "royal-indian-wedding",
    shortSlug: "royal",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-royal-indian",
    occasionType: "wedding",
    title: "Royal Indian Wedding",
    designName: "The Rajwada Collection",
    collectionLabel: "The Rajwada Collection",
    editorialSubtitle: "An invitation inspired by the grandeur of Indian royal celebrations.",
    tagline: "Grand Jharokha Door Reveal, Palatial Splendor & Regal Opulence",
    description:
      "An invitation inspired by the grandeur of Indian royal celebrations with palatial jharokha doors, royal shehnai, and regal heritage.",
    badge: "Heritage Royal",
    culturalTag: "Royal Indian / Heritage",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/royal",
    previewImage: "/images/templates/wedding-royal-indian.jpg",
    cardColorway: {
      cardBg: "from-[#2A0812] via-[#3D0C1A] to-[#1A040A]",
      cardBorder: "border-[#D4AF37]/40",
      badgeBg: "bg-[#D4AF37]/15",
      badgeText: "text-[#D4AF37]",
      accentGold: "#D4AF37",
      ornament: "jharokha",
    },
    features: [
      "Animated Royal Palace Jharokha Door Opening Ceremony",
      "Couple Details & Royal Family Blessings",
      "Live Wedding Countdown Counter (Days, Hours, Mins, Secs)",
      "Multi-Event Royal Agenda (Roka, Haldi, Mehendi, Sangeet, Pheras, Reception)",
      "Interactive Venue Navigation with Google Maps links",
      "Royal Love Story Timeline & Curated Portrait Gallery",
      "Integrated Guest RSVP Engine with multi-function attendance selection",
      "Accommodations, Travel Logistics & Concierge Contacts",
      "One-Click WhatsApp Guest Sharing & High-Resolution QR Card",
    ],
    defaultTheme: "royal-crimson",
    themes: [
      { id: "royal-crimson", name: "Royal Crimson & Gold", description: "Palatial deep maroon with metallic gold foil", previewColor: "#7a1c2d" },
      { id: "marigold-sindoor", name: "Marigold & Sindoor", description: "Vibrant auspicious saffron and vermilion", previewColor: "#d97706" },
      { id: "shahi-emerald", name: "Shahi Emerald", description: "Regal jewel emerald with antique gold filigree", previewColor: "#065f46" },
      { id: "golden-anand", name: "Golden Sunset", description: "Warm royal amber and luminous ivory", previewColor: "#b45309" },
    ],
    isActive: true,
  },
  {
    id: "template-wedding-traditional-hindu",
    slug: "traditional-hindu-wedding",
    shortSlug: "hindu",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-traditional-hindu",
    occasionType: "wedding",
    title: "Traditional Hindu Wedding",
    designName: "The Sacred Vivah Collection",
    collectionLabel: "The Sacred Vivah Collection",
    editorialSubtitle: "Celebrate your union with timeless Vedic-inspired elegance.",
    tagline: "Sacred Shlokas, Mandap Floral Unveil & Auspicious Traditions",
    description:
      "Celebrate your union with timeless Vedic-inspired elegance, auspicious floral mandap reveals, and sacred rituals.",
    badge: "Vedic Auspicious",
    culturalTag: "Hindu / Vedic",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/hindu",
    previewImage: "/images/templates/wedding-traditional-hindu.jpg",
    cardColorway: {
      cardBg: "from-[#421708] via-[#5C230C] to-[#2B0E05]",
      cardBorder: "border-[#F59E0B]/40",
      badgeBg: "bg-[#F59E0B]/15",
      badgeText: "text-[#FBBF24]",
      accentGold: "#F59E0B",
      ornament: "kalash",
    },
    features: [
      "Sacred Kalash & Floral Garland Opening Unveil",
      "Auspicious Shlokas & Family Details",
      "Vedic Rituals Itinerary (Tilak, Haldi, Sangeet, Pheras, Vidai)",
      "Venue Maps, Directions & Traditional Dress Codes",
      "Couple Journey & Sacred Moments Photo Album",
      "Guest RSVP with Multi-Ceremony RSVP tracking",
      "WhatsApp Invitation Sharing with Auspicious Blessing text",
    ],
    defaultTheme: "marigold-sindoor",
    themes: [
      { id: "marigold-sindoor", name: "Auspicious Marigold", description: "Traditional haldi yellow & sacred sindoor", previewColor: "#f59e0b" },
      { id: "royal-crimson", name: "Shubh Crimson", description: "Classic bridal scarlet & pure gold", previewColor: "#991b1b" },
      { id: "shahi-emerald", name: "Sacred Peepal Emerald", description: "Traditional leaf green & ivory white", previewColor: "#047857" },
    ],
    isActive: true,
  },
  {
    id: "template-wedding-punjabi",
    slug: "punjabi-wedding",
    shortSlug: "punjabi",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-punjabi",
    occasionType: "wedding",
    title: "Punjabi Wedding",
    designName: "The Shahi Celebration Collection",
    collectionLabel: "The Shahi Celebration Collection",
    editorialSubtitle: "An invitation filled with Punjabi warmth, colour, and celebration.",
    tagline: "Vibrant Phulkari Colors, Dhol Drumbeat Reveal & High-Energy Celebrations",
    description:
      "An invitation filled with Punjabi warmth, colour, and celebration, featuring festive dhol reveals and lively energy.",
    badge: "Festive Energy",
    culturalTag: "Punjabi",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/punjabi",
    previewImage: "/images/templates/wedding-punjabi.jpg",
    cardColorway: {
      cardBg: "from-[#3B0715] via-[#4F0D1C] to-[#25030C]",
      cardBorder: "border-[#EC4899]/40",
      badgeBg: "bg-[#EC4899]/15",
      badgeText: "text-[#F472B6]",
      accentGold: "#F59E0B",
      ornament: "dhol",
    },
    features: [
      "Animated Dhol & Shahi Chaddar celebratory opening",
      "Enthusiastic Family Welcome & Couple Story",
      "Complete Event Lineup (Roka, Jaggo, Chooda, Sangeet, Baraat, Reception)",
      "Bhangra Beats background music toggle",
      "Venue Google Maps & Dress Code Badges",
      "Guest RSVP with meal & party preferences",
      "1-Click WhatsApp group sharing",
    ],
    defaultTheme: "marigold-sindoor",
    themes: [
      { id: "marigold-sindoor", name: "Phulkari Fusion", description: "Vibrant mustard, fuchsia rose & gold", previewColor: "#ec4899" },
      { id: "shahi-emerald", name: "Shahi Punjab", description: "Rich emerald green with brass gold", previewColor: "#059669" },
      { id: "royal-crimson", name: "Bhangra Crimson", description: "Passionate crimson with celebratory amber", previewColor: "#b91c1c" },
    ],
    isActive: true,
  },
  {
    id: "template-wedding-luxury",
    slug: "luxury-wedding",
    shortSlug: "luxury",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-luxury-wedding",
    occasionType: "wedding",
    title: "The Luxury Wedding",
    designName: "The Haute Couture Folio Collection",
    collectionLabel: "The Haute Couture Folio Collection",
    editorialSubtitle: "An ultra-luxury invitation inspired by haute couture stationery, gilded folios, and champagne romance.",
    tagline: "Gilded Folio Unboxing, Champagne Romance & Haute Couture Opulence",
    description:
      "An ultra-luxury wedding invitation inspired by haute couture stationery, featuring rich ivory, champagne gold, deep burgundy wine accents, and editorial typography.",
    badge: "Haute Couture",
    culturalTag: "Luxury / Haute Couture",
    price: 1999,
    originalPrice: 3999,
    demoUrl: "/demo/wedding/luxury",
    previewImage: "/images/templates/wedding-luxury.jpg",
    cardColorway: {
      cardBg: "from-[#1C1612] via-[#2A1F18] to-[#120E0B]",
      cardBorder: "border-[#D4AF37]/50",
      badgeBg: "bg-[#D4AF37]/15",
      badgeText: "text-[#D4AF37]",
      accentGold: "#D4AF37",
      ornament: "monogram",
    },
    features: [
      "3D Gilded Unboxing Folio & Wax Seal Opening Ceremony",
      "Couple Monogram & Parents' Family Blessings",
      "Live Luxury Wedding Countdown Counter",
      "Multi-Ceremony Schedule with interactive Google Maps & attire guides",
      "Interactive Venue GPS Navigation & Travel Concierge",
      "Editorial Love Story Timeline & High-Res Portrait Carousel",
      "Real-Time VIP Guest RSVP with Multi-Event Attendance & Dietary Intelligence",
      "Dress Code Guides, Accommodations & WhatsApp Sharing",
    ],
    defaultTheme: "champagne-gold",
    themes: [
      { id: "champagne-gold", name: "Champagne & Warm Ivory", description: "Bespoke warm ivory, delicate gold foil & linen", previewColor: "#D4AF37" },
      { id: "burgundy-wine", name: "Deep Burgundy Wine & Gold", description: "Deep royal wine, velvet gold & black tie accents", previewColor: "#58111A" },
      { id: "onyx-noir", name: "Onyx Noir & Champagne", description: "Timeless black tie glamour, dark obsidian & bullion gold", previewColor: "#1A1A1A" },
      { id: "emerald-monogram", name: "Imperial Emerald", description: "Regal jewel emerald with antique champagne borders", previewColor: "#0F281E" },
    ],
    isActive: true,
  },
  {
    id: "template-wedding-sikh",
    slug: "sikh-wedding-anand-karaj",
    shortSlug: "sikh",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-sikh",
    occasionType: "wedding",
    title: "Sikh Wedding (Anand Karaj)",
    designName: "The Golden Anand Collection",
    collectionLabel: "The Golden Anand Collection",
    editorialSubtitle: "An invitation celebrating Anand Karaj with serenity, floral grace, and timeless reverence.",
    tagline: "Spiritual Serenity, Golden Sunrise Lotus & Sacred Laavan",
    description:
      "A serene, graceful invitation honoring the sacred Anand Karaj ceremony with golden sunrise lotus unfoldings and spiritual reverence.",
    badge: "Spiritual Grace",
    culturalTag: "Sikh / Anand Karaj",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/sikh",
    previewImage: "/images/templates/wedding-sikh.jpg",
    cardColorway: {
      cardBg: "from-[#2C1810] via-[#3D2216] to-[#1C0F0A]",
      cardBorder: "border-[#D97706]/40",
      badgeBg: "bg-[#D97706]/15",
      badgeText: "text-[#FBBF24]",
      accentGold: "#D97706",
      ornament: "lotus",
    },
    features: [
      "Golden Lotus & Sunrise Gentle Fold Reveal",
      "Sacred Gurbani Quotes & Blessings",
      "Detailed Gurdwara Etiquette & Head Covering notes",
      "Event Sequence (Kurmai, Maiyan, Anand Karaj, Doli, Reception)",
      "Gurdwara location maps & parking directions",
      "Guest RSVP for Langar & Reception headcounts",
    ],
    defaultTheme: "golden-anand",
    themes: [
      { id: "golden-anand", name: "Golden Sunrise", description: "Pastel peach, pure ivory & warm sunlight gold", previewColor: "#d97706" },
      { id: "royal-crimson", name: "Deep Ruby Bliss", description: "Subtle royal ruby with champagne highlights", previewColor: "#881337" },
    ],
    isActive: false,
  },
  {
    id: "template-wedding-muslim",
    slug: "muslim-wedding-nikah",
    shortSlug: "muslim",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-muslim",
    occasionType: "wedding",
    title: "Muslim Wedding (Nikah)",
    designName: "The Noor-e-Nikah Collection",
    collectionLabel: "The Noor-e-Nikah Collection",
    editorialSubtitle: "An elegant invitation inspired by Islamic geometric artistry and timeless calligraphy.",
    tagline: "Mughal Jaali Arches, Bismillah Calligraphy & Majestic Walima",
    description:
      "An elegant invitation inspired by Islamic geometric artistry and timeless calligraphy, unfolding like a silk royal parchment.",
    badge: "Noor & Splendor",
    culturalTag: "Muslim / Nikah",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/muslim",
    previewImage: "/images/templates/wedding-muslim.jpg",
    cardColorway: {
      cardBg: "from-[#08231A] via-[#0E3528] to-[#041610]",
      cardBorder: "border-[#10B981]/40",
      badgeBg: "bg-[#10B981]/15",
      badgeText: "text-[#34D399]",
      accentGold: "#D4AF37",
      ornament: "arch",
    },
    features: [
      "Calligraphy & Jaali Arch Opening Animation",
      "Bismillah & Quranic verses of love and mercy",
      "Functions (Manjha, Nikah Ceremony, Rukhsati, Walima Feast)",
      "Banquet & Banquet Hall Maps",
      "Couple Gallery with elegant modesty-friendly layouts",
      "Guest RSVP with halal dietary notes & guest counts",
    ],
    defaultTheme: "noor-emerald",
    themes: [
      { id: "noor-emerald", name: "Noor Emerald & Pearl", description: "Deep Islamic emerald with pearl white & gold", previewColor: "#064e3b" },
      { id: "royal-crimson", name: "Mughal Burgundy", description: "Royal wine with antique gold foil", previewColor: "#4c0519" },
    ],
    isActive: true,
  },
  {
    id: "template-wedding-christian",
    slug: "christian-wedding",
    shortSlug: "christian",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-christian",
    occasionType: "wedding",
    title: "Christian Wedding",
    designName: "The Cathedral Romance Collection",
    collectionLabel: "The Cathedral Romance Collection",
    editorialSubtitle: "A timeless romantic invitation with delicate satin ribbon, floral arches, and cathedral grace.",
    tagline: "Cathedral Arches, Delicate Silk Bow & Timeless Nuptials",
    description:
      "A timeless romantic invitation with delicate satin ribbon, floral arches, and cathedral grace for sacred church vows.",
    badge: "Cathedral Grace",
    culturalTag: "Christian / Contemporary",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/christian",
    previewImage: "/images/templates/wedding-christian.jpg",
    cardColorway: {
      cardBg: "from-[#2A1520] via-[#3D1E2F] to-[#1A0B14]",
      cardBorder: "border-[#F472B6]/40",
      badgeBg: "bg-[#F472B6]/15",
      badgeText: "text-[#F9A8D4]",
      accentGold: "#C5A36A",
      ornament: "cathedral",
    },
    features: [
      "Silk Ribbon & Cathedral Arch Opening",
      "Scripture Verses & Couple Vows Intro",
      "Event Sequence (Rehearsal, Church Nuptials, Toast, Banquet)",
      "Church Google Maps & Reception Venue directions",
      "Guest RSVP with meal selection (Veg / Non-Veg)",
      "Downloadable Calendar Invite for guests",
    ],
    defaultTheme: "cathedral-rose",
    themes: [
      { id: "cathedral-rose", name: "Dusty Rose & Cream", description: "Romantic blush, warm cream & champagne", previewColor: "#be185d" },
      { id: "minimal-linen", name: "Classic Pure Linen", description: "Timeless pearl ivory & soft slate", previewColor: "#475569" },
    ],
    isActive: true,
  },
  {
    id: "template-wedding-modern-minimal",
    slug: "modern-minimal-wedding",
    shortSlug: "minimal",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-modern-minimal",
    occasionType: "wedding",
    title: "Modern Minimal Wedding",
    designName: "The Editorial Gatefold Collection",
    collectionLabel: "The Editorial Gatefold Collection",
    editorialSubtitle: "Understated architecture, clean typography, and contemporary luxury for the modern couple.",
    tagline: "Understated Architecture, Clean Typography & Modern Chic",
    description:
      "Understated architecture, clean typography, and contemporary luxury with a sleek editorial monogram gatefold reveal.",
    badge: "Chic Minimal",
    culturalTag: "Modern / Contemporary",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/minimal",
    previewImage: "/images/templates/wedding-modern-minimal.jpg",
    cardColorway: {
      cardBg: "from-[#1E232A] via-[#282F38] to-[#14171C]",
      cardBorder: "border-stone-400/40",
      badgeBg: "bg-stone-500/15",
      badgeText: "text-stone-300",
      accentGold: "#94A3B8",
      ornament: "gatefold",
    },
    features: [
      "Smooth Monogram Gatefold Opening Reveal",
      "High-fashion editorial typography & couple portraits",
      "Intimate event schedule with dress codes",
      "Interactive venue Google Maps links",
      "Mobile-first RSVP with instant attendee count",
      "Clean WhatsApp sharing without clutter",
    ],
    defaultTheme: "minimal-linen",
    themes: [
      { id: "minimal-linen", name: "Warm Linen & Slate", description: "Architectural taupe, clean off-white & charcoal", previewColor: "#334155" },
      { id: "velvet-onyx", name: "Monochrome Obsidian", description: "Sharp black, crisp white & champagne", previewColor: "#0f172a" },
    ],
    isActive: false,
  },
  {
    id: "template-wedding-floral-garden",
    slug: "floral-garden-wedding",
    shortSlug: "floral",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-floral-garden",
    occasionType: "wedding",
    title: "Floral Garden Wedding",
    designName: "The Botanical Bloom Collection",
    collectionLabel: "The Botanical Bloom Collection",
    editorialSubtitle: "A romantic garden celebration with blooming wildflower watercolors and sunlit lawn toasts.",
    tagline: "Wildflower Watercolor Reveal, Open Lawn Soirees & Sunlit Toasts",
    description:
      "A romantic garden celebration with blooming wildflower watercolors, lawn ceremonies, and sunlit outdoor toasts.",
    badge: "Botanical Romance",
    culturalTag: "Garden / Destination",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/floral",
    previewImage: "/images/templates/wedding-floral-garden.jpg",
    cardColorway: {
      cardBg: "from-[#192B19] via-[#233A23] to-[#101C10]",
      cardBorder: "border-[#84CC16]/40",
      badgeBg: "bg-[#84CC16]/15",
      badgeText: "text-[#A3E635]",
      accentGold: "#FCD34D",
      ornament: "floral",
    },
    features: [
      "Watercolor Botanical Petal Opening Animation",
      "Pastel flora accents & couple outdoor photography",
      "Garden Ceremony, Sundowner Drinks & Lawn Dinner agenda",
      "Interactive venue map & weather/attire advisory",
      "Full RSVP tracking with dietary options",
    ],
    defaultTheme: "botanical-sage",
    themes: [
      { id: "botanical-sage", name: "Sage Green & Lavender", description: "Organic botanical eucalyptus & lilac", previewColor: "#4d7c0f" },
      { id: "cathedral-rose", name: "Peony Blush & Cream", description: "Romantic peony pink & soft vanilla", previewColor: "#db2777" },
    ],
    isActive: false,
  },
  {
    id: "template-wedding-luxury-destination",
    slug: "luxury-destination-wedding",
    shortSlug: "destination",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-luxury-destination",
    occasionType: "wedding",
    title: "Luxury Destination Wedding",
    designName: "The Coastal Horizon Collection",
    collectionLabel: "The Coastal Horizon Collection",
    editorialSubtitle: "An international resort invitation with sunset ocean breezes, passport reveal, and travel concierge.",
    tagline: "Sunset Breezes, Beach Mehendi, Resort Logistics & Gala Soirees",
    description:
      "An international resort invitation with sunset ocean breezes, passport reveals, flight transfers, and coastal gala nights.",
    badge: "Destination Luxury",
    culturalTag: "Destination / Resort",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/destination",
    previewImage: "/images/templates/wedding-luxury-destination.jpg",
    cardColorway: {
      cardBg: "from-[#0C243C] via-[#123354] to-[#071626]",
      cardBorder: "border-[#38BDF8]/40",
      badgeBg: "bg-[#38BDF8]/15",
      badgeText: "text-[#7DD3FC]",
      accentGold: "#F59E0B",
      ornament: "compass",
    },
    features: [
      "Sunset Ocean Breeze & Boarding Pass Opening Reveal",
      "Multi-Day Resort Itinerary (Welcome Sundowner, Beach Mehendi, Sunset Vows, Gala Night)",
      "Travel Logistics: Flight recommendations, Airport Shuttle, Resort Check-in times",
      "Packing Tips & Resort Dress Codes",
      "Interactive Google Maps to Resort & Private Beaches",
      "RSVP with arrival dates and guest room requirements",
    ],
    defaultTheme: "coastal-azure",
    themes: [
      { id: "coastal-azure", name: "Coastal Azure & Sand", description: "Mediterranean blue, sand beige & coral gold", previewColor: "#0284c7" },
      { id: "marigold-sindoor", name: "Sunset Horizon", description: "Vibrant sunset terracotta & warm peach", previewColor: "#ea580c" },
    ],
    isActive: true,
  },
  {
    id: "template-wedding-elegant-contemporary",
    slug: "elegant-contemporary-wedding",
    shortSlug: "contemporary",
    categoryId: "wedding-invitations",
    subcategoryId: "sub-elegant-contemporary",
    occasionType: "wedding",
    title: "Elegant Contemporary Wedding",
    designName: "The Black-Tie Velvet Collection",
    collectionLabel: "The Black-Tie Velvet Collection",
    editorialSubtitle: "Black-tie cosmopolitan glamour, champagne wax-seal unboxing, and twilight cocktail elegance.",
    tagline: "Champagne Sparkle, Velvet Wax Seal & Cosmopolitan Glamour",
    description:
      "Black-tie cosmopolitan glamour with champagne wax-seal unboxing, velvet elegance, cocktail hours, and late-night toasts.",
    badge: "Black Tie Glamour",
    culturalTag: "Cosmopolitan / Black Tie",
    price: 999,
    originalPrice: 2499,
    demoUrl: "/demo/wedding/contemporary",
    previewImage: "/images/templates/wedding-elegant-contemporary.jpg",
    cardColorway: {
      cardBg: "from-[#111113] via-[#1A1A1E] to-[#0A0A0C]",
      cardBorder: "border-[#D4AF37]/50",
      badgeBg: "bg-[#D4AF37]/15",
      badgeText: "text-[#E6C665]",
      accentGold: "#D4AF37",
      ornament: "velvet",
    },
    features: [
      "Velvet Wax-Sealed Monogram Envelope Reveal",
      "Cosmopolitan Evening Schedule (Cocktails, Modern Vows, Black-Tie Dinner, Dance Floor)",
      "Strict Black-Tie & Evening Gown Dress Code Guide",
      "Audio Lounge with curated jazz or lounge background music",
      "VIP Guest RSVP with table seating notes",
    ],
    defaultTheme: "velvet-onyx",
    themes: [
      { id: "velvet-onyx", name: "Midnight Onyx & Prosecco", description: "Velvet black, champagne gold & silver foil", previewColor: "#1e293b" },
      { id: "royal-crimson", name: "Cabernet Velvet", description: "Rich wine velvet & rose gold", previewColor: "#831843" },
    ],
    isActive: false,
  },

  // --- BIRTHDAY EXPERIENCES (ORGANIZED BY RECIPIENT) ---
  {
    id: "template-birthday-wonderland",
    slug: "the-birthday-wonderland",
    categoryId: "birthday-celebrations",
    subcategoryId: "sub-bday-milestones",
    occasionType: "birthday",
    title: "The Birthday Wonderland",
    designName: "Interactive 3D Cake & Balloon Extravaganza",
    tagline: "Blow Real Candles, Pop Wish Balloons & Unbox 3D Presents",
    description:
      "A joyful, interactive birthday world with tap-to-blow animated candle flames, pop-up wish balloons, scratch card games, polaroid scrapbooks, and confetti explosions.",
    badge: "Most Popular",
    price: 999,
    originalPrice: 1799,
    demoUrl: "/demo/birthday",
    previewImage: "/images/templates/birthday-preview.jpg",
    features: [
      "3D Gift Box unboxing surprise reveal",
      "Interactive 3D Birthday Cake with tap-to-blow glowing candles",
      "Pop-able Wish Balloons with hidden secret messages",
      "Interactive Polaroid Scrapbook with zoomable photos",
      "Playable Scratch Card Game with redeemable birthday treat",
      "Wax-Sealed Birthday Letter with celebratory confetti",
      "Customizable Grand Finale with replay fireworks",
    ],
    defaultTheme: "golden-champagne",
    themes: [
      { id: "golden-champagne", name: "Golden Champagne", description: "Festive radiant gold & shimmering confetti", previewColor: "#eab308" },
      { id: "blush-wonderland", name: "Blush Wonderland", description: "Playful berry pink & cotton candy violet", previewColor: "#ec4899" },
      { id: "peachy-celebration", name: "Peachy Celebration", description: "Warm apricot glow & festive peach", previewColor: "#fb923c" },
      { id: "midnight-sparkle", name: "Midnight Sparkle", description: "Cosmic disco navy & neon stars", previewColor: "#8b5cf6" },
    ],
    isActive: true,
  },
  {
    id: "template-birthday-mother",
    slug: "birthday-for-mother",
    categoryId: "birthday-celebrations",
    subcategoryId: "sub-bday-her",
    occasionType: "birthday",
    recipientType: "mother",
    title: "A Mother's Golden Heart",
    designName: "Nostalgic Gratitude & Scrapbook",
    tagline: "A Heartfelt Tribute to the Woman Who Gave You Everything",
    description:
      "Specially written for mothers. Replaces romantic couple content with maternal gratitude, childhood memory scrapbooks, 'Things You Taught Me', and family video messages.",
    badge: "Maternal Tribute",
    price: 999,
    originalPrice: 1799,
    demoUrl: "/demo/birthday?for=mother",
    previewImage: "/images/templates/birthday-mother.jpg",
    features: [
      "Gentle Floral Unboxing Reveal",
      "Maternal Tribute: 'To The Best Mom in the World'",
      "'Things You Taught Me' interactive wisdom cards",
      "Childhood-to-Now Memory Scrapbook with family captions",
      "Handwritten Gratitude Letter with soft acoustic soundtrack",
      "Family Wishes wall with audio notes and messages",
    ],
    defaultTheme: "golden-champagne",
    themes: [
      { id: "golden-champagne", name: "Warm Gold & Ivory", description: "Warm loving champagne tones", previewColor: "#ca8a04" },
      { id: "blush-wonderland", name: "Soft Rose Garden", description: "Tender rose petal and morning light", previewColor: "#f43f5e" },
    ],
    isActive: true,
  },
  {
    id: "template-birthday-father",
    slug: "birthday-for-father",
    categoryId: "birthday-celebrations",
    subcategoryId: "sub-bday-him",
    occasionType: "birthday",
    recipientType: "father",
    title: "Guiding Light & Pillar of Strength",
    designName: "Distinguished Father Tribute",
    tagline: "Honoring Dad with Respect, Cherished Memories & Lifelong Gratitude",
    description:
      "Crafted specifically for fathers. Features dignified milestone timelines, life lessons, vintage photo gallery, and heartfelt words of respect and love.",
    badge: "Father Edition",
    price: 999,
    originalPrice: 1799,
    demoUrl: "/demo/birthday?for=father",
    previewImage: "/images/templates/birthday-father.jpg",
    features: [
      "Distinguished Vintage Watchbox opening animation",
      "Tribute: 'To My Hero, My Guide, My Dad'",
      "Timeline of Family Adventures & Milestones",
      "Favorite Dad Jokes & Wisdom Quotes flip cards",
      "High-resolution polaroid memory wall",
      "Family Gratitude Letter with quiet piano background audio",
    ],
    defaultTheme: "golden-champagne",
    themes: [
      { id: "golden-champagne", name: "Classic Navy & Champagne", description: "Dignified dark navy & gold", previewColor: "#1e3a8a" },
      { id: "midnight-sparkle", name: "Warm Chestnut & Amber", description: "Rich leather, amber & cream", previewColor: "#78350f" },
    ],
    isActive: true,
  },
  {
    id: "template-birthday-best-friend",
    slug: "birthday-for-best-friend",
    categoryId: "birthday-celebrations",
    subcategoryId: "sub-bday-her",
    occasionType: "birthday",
    recipientType: "best_friend",
    title: "Partners in Crime & Forever Friends",
    designName: "The Best Friend Banter & Memory Blast",
    tagline: "Inside Jokes, Wildest Adventures & Unbreakable Bonds",
    description:
      "The ultimate birthday website for your best friend. Loaded with funny inside joke cards, wild memory polaroids, funny quiz ('How Well Do You Know My Shenanigans?'), and celebratory music.",
    badge: "Friendship Edition",
    price: 999,
    originalPrice: 1799,
    demoUrl: "/demo/birthday?for=best-friend",
    previewImage: "/images/templates/birthday-friend.jpg",
    features: [
      "Prank Mystery Box / Confetti Popper Opening",
      "Inside Joke Vault & 'Remember That Time...' cards",
      "Unfiltered Friendship Memory Wall",
      "Playable Trivia Game: 'Who is More Likely To...'",
      "Party Playlist with upbeat soundtrack",
      "Heartfelt Bestie Promise & Toast",
    ],
    defaultTheme: "blush-wonderland",
    themes: [
      { id: "blush-wonderland", name: "Neon Party Pop", description: "Vibrant neon pink, electric violet & turquoise", previewColor: "#d946ef" },
      { id: "golden-champagne", name: "Sunset Festival", description: "Warm festival amber & party gold", previewColor: "#f59e0b" },
    ],
    isActive: true,
  },
];

// -------------------------------------------------------------
// 4. CONVENIENCE QUERY HELPERS
// -------------------------------------------------------------
export function getAllCategories(): CatalogueCategory[] {
  return CATALOGUE_CATEGORIES.filter((c) => c.isActive);
}

export function getCategoryBySlug(slug: string): CatalogueCategory | undefined {
  return CATALOGUE_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
}

export function getSubcategoriesByCategory(
  categoryId: "digital-gifts" | "wedding-invitations" | "birthday-celebrations" | "future-celebrations"
): CatalogueSubcategory[] {
  return CATALOGUE_SUBCATEGORIES.filter((s) => s.categoryId === categoryId);
}

export function getTemplatesByCategory(
  categoryId: "digital-gifts" | "wedding-invitations" | "birthday-celebrations"
): CatalogueTemplate[] {
  return CATALOGUE_TEMPLATES.filter((t) => t.categoryId === categoryId && t.isActive);
}

export function getTemplatesBySubcategory(subcategoryId: string): CatalogueTemplate[] {
  return CATALOGUE_TEMPLATES.filter((t) => t.subcategoryId === subcategoryId && t.isActive);
}

export function getTemplateBySlug(slug: string): CatalogueTemplate | undefined {
  return CATALOGUE_TEMPLATES.find((t) => t.slug === slug || t.id === slug);
}

export function getTemplateById(id: string): CatalogueTemplate | undefined {
  return CATALOGUE_TEMPLATES.find((t) => t.id === id || t.slug === id);
}

export function getFeaturedTemplates(): CatalogueTemplate[] {
  const featuredIds = [
    "template-love-secret-world",
    "template-wedding-royal-indian",
    "template-anniversary-forever",
    "template-birthday-wonderland",
  ];
  return featuredIds
    .map((id) => getTemplateById(id))
    .filter((t): t is CatalogueTemplate => Boolean(t && t.isActive));
}
