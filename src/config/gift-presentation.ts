import { CATALOGUE_TEMPLATES, CatalogueTemplate } from "./catalog";

export type GiftCategoryFilter =
  | "all"
  | "anniversary"
  | "birthday"
  | "romantic"
  | "apology"
  | "wedding";

export interface GiftPresentationMetadata {
  templateId: string;
  occasionLabel: string; // e.g. "ANNIVERSARY GIFT", "BIRTHDAY SURPRISE"
  occasionCategory: GiftCategoryFilter;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
    iconName: "Calendar" | "Heart" | "Cake" | "Mail" | "Crown" | "Sparkles";
  };
  perfectFor: string;
  experienceSummary: string;
  interactiveHighlights: string[];
  demoUrl: string;
  createUrl: string;
  displayOrder: number;
}

export interface EnrichedGiftTemplate extends CatalogueTemplate {
  presentation: GiftPresentationMetadata;
}

/**
 * Rich Presentation Metadata mapped to every gift template in ExpertoMemories.
 * Clarifies occasion, intended recipient, experiential delivery, and interactive highlights.
 */
export const GIFT_PRESENTATION_MAP: Record<string, GiftPresentationMetadata> = {
  // 1. ANNIVERSARY
  "template-anniversary-forever": {
    templateId: "template-anniversary-forever",
    occasionLabel: "ANNIVERSARY GIFT",
    occasionCategory: "anniversary",
    badgeStyle: {
      bg: "bg-amber-500/10",
      text: "text-amber-900",
      border: "border-amber-400/30",
      iconName: "Calendar",
    },
    perfectFor:
      "Celebrating relationship milestones, dating anniversaries, and wedding anniversaries with your partner.",
    experienceSummary:
      "An interactive digital love museum featuring a real-time relationship countdown, interactive 'Then vs Now' photo slider, milestone memory timeline, and celebration fireworks.",
    interactiveHighlights: [
      "Live Relationship Heartbeat Counter (Years, Months, Days, Secs)",
      "Interactive 'Then vs Now' couple photo slider",
      "Milestone love timeline with polaroid scrapbook & captions",
      "Scratch-to-reveal memories & celebration fireworks modal",
    ],
    demoUrl: "/demo/anniversary",
    createUrl: "/dashboard/create?occasion=anniversary",
    displayOrder: 1,
  },

  // 2. ROMANTIC / LOVE
  "template-love-secret-world": {
    templateId: "template-love-secret-world",
    occasionLabel: "ROMANTIC GIFT",
    occasionCategory: "romantic",
    badgeStyle: {
      bg: "bg-rose-500/10",
      text: "text-[#541D2B]",
      border: "border-rose-500/25",
      iconName: "Heart",
    },
    perfectFor:
      "Surprising your boyfriend, girlfriend, or partner on special dates, anniversaries, or Valentine's Day.",
    experienceSummary:
      "An intimate starlit universe featuring an animated wax seal invitation, heartbeat questions, expanding reason cards, glowing memory stars, and playable love puzzle.",
    interactiveHighlights: [
      "Animated 3D wax-sealed invitation reveal",
      "Interactive 'Will You Be My Forever?' heartbeat questions",
      "Expandable 'Reasons Why I Love You' 3D cards",
      "Playable love puzzle minigame with secret love reward",
    ],
    demoUrl: "/demo/love",
    createUrl: "/dashboard/create?occasion=love",
    displayOrder: 2,
  },

  // 3. BIRTHDAY WONDERLAND (FLAGSHIP)
  "template-birthday-wonderland": {
    templateId: "template-birthday-wonderland",
    occasionLabel: "BIRTHDAY SURPRISE",
    occasionCategory: "birthday",
    badgeStyle: {
      bg: "bg-purple-500/10",
      text: "text-purple-900",
      border: "border-purple-400/30",
      iconName: "Cake",
    },
    perfectFor:
      "Celebrating anyone's birthday with interactive 3D cakes, tap-to-blow candles, wish balloons, and party games.",
    experienceSummary:
      "A joyful, interactive birthday party website with tap-to-blow animated candle flames, pop-up wish balloons, scratch card surprise games, polaroid scrapbooks, and confetti explosions.",
    interactiveHighlights: [
      "Interactive 3D birthday cake with tap-to-blow glowing candles",
      "Pop-able wish balloons revealing hidden heartfelt messages",
      "Personalized scratch-to-reveal card with redeemable birthday treat",
      "Wax-sealed birthday letter with celebratory confetti explosion",
    ],
    demoUrl: "/demo/birthday",
    createUrl: "/dashboard/create?occasion=birthday",
    displayOrder: 3,
  },

  // 4. APOLOGY & RECONCILIATION
  "template-apology-letter": {
    templateId: "template-apology-letter",
    occasionLabel: "APOLOGY GIFT",
    occasionCategory: "apology",
    badgeStyle: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-900",
      border: "border-emerald-500/25",
      iconName: "Mail",
    },
    perfectFor:
      "Expressing sincere apologies, healing misunderstandings, and rebuilding emotional trust with respect.",
    experienceSummary:
      "A gentle, respectful digital letter experience featuring redeemable apology coupons, scratch card, forgiveness minigames, and sincere promises.",
    interactiveHighlights: [
      "3D wax-sealed opening envelope with gentle personal teaser",
      "Redeemable apology coupon book & secret heart whisper",
      "Interactive forgiveness garden & catch-my-love minigame",
      "Wax-sealed promises with heartfelt handwritten letter & audio",
    ],
    demoUrl: "/demo/apology",
    createUrl: "/dashboard/create?occasion=apology",
    displayOrder: 3,
  },

  // 5. ROYAL INDIAN WEDDING (FLAGSHIP WEDDING)
  "template-wedding-royal-indian": {
    templateId: "template-wedding-royal-indian",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Couples and families inviting loved ones to a royal, multi-day Indian wedding celebration.",
    experienceSummary:
      "A palatial digital wedding invitation featuring animated royal jharokha doors, multi-event agendas with Google Maps, couple love story, and instant guest RSVP.",
    interactiveHighlights: [
      "Animated royal palace jharokha door opening ceremony",
      "Multi-event royal agenda (Roka, Haldi, Mehendi, Sangeet, Pheras)",
      "One-click Google Maps venue directions for every event",
      "Interactive guest RSVP system with instant WhatsApp sharing",
    ],
    demoUrl: "/demo/wedding/royal",
    createUrl: "/dashboard/create?occasion=wedding&template=royal-indian-wedding",
    displayOrder: 5,
  },

  // 6. BIRTHDAY FOR MOTHER
  "template-birthday-mother": {
    templateId: "template-birthday-mother",
    occasionLabel: "BIRTHDAY SURPRISE",
    occasionCategory: "birthday",
    badgeStyle: {
      bg: "bg-rose-500/10",
      text: "text-rose-900",
      border: "border-rose-400/30",
      iconName: "Heart",
    },
    perfectFor:
      "Making Mom feel deeply cherished with childhood memories, maternal gratitude, and family blessings.",
    experienceSummary:
      "A touching nostalgic scrapbook tribute featuring an animated vintage locket, maternal wisdom cards, childhood polaroids, and family blessings.",
    interactiveHighlights: [
      "Animated vintage locket unboxing reveal",
      "'Things You Taught Me' interactive gratitude flip cards",
      "Childhood memory scrapbook polaroid wall with zoom lightbox",
      "Tap-to-blow birthday cake with family blessing audio",
    ],
    demoUrl: "/demo/birthday?for=mother",
    createUrl: "/dashboard/create?occasion=birthday&recipient=mother",
    displayOrder: 6,
  },

  // 7. BIRTHDAY FOR FATHER
  "template-birthday-father": {
    templateId: "template-birthday-father",
    occasionLabel: "BIRTHDAY SURPRISE",
    occasionCategory: "birthday",
    badgeStyle: {
      bg: "bg-blue-500/10",
      text: "text-blue-900",
      border: "border-blue-400/30",
      iconName: "Sparkles",
    },
    perfectFor:
      "Honoring Dad with respect, lifetime milestone adventures, father wisdom quotes, and meaningful words.",
    experienceSummary:
      "A dignified tribute website featuring a vintage watchbox opening, family adventure timeline, wisdom quotes, and quiet piano melody.",
    interactiveHighlights: [
      "Distinguished vintage watchbox opening animation",
      "Timeline of family adventures & milestone accomplishments",
      "Favorite Dad jokes & wisdom quotes interactive cards",
      "High-resolution polaroid memory wall & quiet piano tribute",
    ],
    demoUrl: "/demo/birthday?for=father",
    createUrl: "/dashboard/create?occasion=birthday&recipient=father",
    displayOrder: 7,
  },

  // 8. BIRTHDAY FOR BEST FRIEND
  "template-birthday-best-friend": {
    templateId: "template-birthday-best-friend",
    occasionLabel: "BIRTHDAY SURPRISE",
    occasionCategory: "birthday",
    badgeStyle: {
      bg: "bg-amber-500/10",
      text: "text-amber-900",
      border: "border-amber-400/30",
      iconName: "Sparkles",
    },
    perfectFor:
      "Celebrating your bestie with hilarious inside jokes, unfiltered memories, and party banter.",
    experienceSummary:
      "A high-energy celebratory website packed with inside jokes, hilarious memory polaroids, playable trivia games, and party playlist.",
    interactiveHighlights: [
      "Prank mystery gift box & confetti popper opening",
      "Inside joke vault & 'Remember that time...' polaroids",
      "Playable trivia game: 'Who is More Likely To...'",
      "Upbeat party playlist with bestie promise & toast",
    ],
    demoUrl: "/demo/birthday?for=best-friend",
    createUrl: "/dashboard/create?occasion=birthday&recipient=best_friend",
    displayOrder: 8,
  },

  // 9. TRADITIONAL HINDU WEDDING
  "template-wedding-traditional-hindu": {
    templateId: "template-wedding-traditional-hindu",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Couples honoring sacred Vedic rituals, mandap traditions, auspicious kalash, and family blessings.",
    experienceSummary:
      "A sacred Vedic invitation featuring auspicious kalash unboxings, mangal sutra timings, shloka chants, and digital RSVP.",
    interactiveHighlights: [
      "Vedic kalash & floral unboxing entrance reveal",
      "Sacred seven vows (Saat Phere) illustrated story",
      "Multi-ceremony event agenda with venue map coordinates",
      "Family blessings gallery with instant guest RSVP",
    ],
    demoUrl: "/demo/wedding/traditional-hindu",
    createUrl: "/dashboard/create?occasion=wedding&template=traditional-hindu-wedding",
    displayOrder: 9,
  },

  // 10. PUNJABI WEDDING
  "template-wedding-punjabi": {
    templateId: "template-wedding-punjabi",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "High-energy families celebrating with lively dhol beats, jaggo, sangeet, and joyous Anand Karaj.",
    experienceSummary:
      "A vibrant celebration website featuring animated dhol beats, jaggo timings, Bhangra playlist, and wedding venue maps.",
    interactiveHighlights: [
      "Animated dhol drumbeat entrance with festive energy",
      "Complete Punjabi itinerary: Roka, Jaggo, Sangeet, Anand Karaj",
      "Bhangra celebration soundtrack with high-fidelity audio",
      "Interactive venue navigation & WhatsApp guest confirmations",
    ],
    demoUrl: "/demo/wedding/punjabi",
    createUrl: "/dashboard/create?occasion=wedding&template=punjabi-wedding",
    displayOrder: 10,
  },

  // 11. SIKH WEDDING
  "template-wedding-sikh": {
    templateId: "template-wedding-sikh",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Couples celebrating Anand Karaj with spiritual serenity, golden lotus aesthetics, and sacred dignity.",
    experienceSummary:
      "A peaceful spiritual invitation featuring golden lotus opening, Gurdwara location maps, and Laavan timings.",
    interactiveHighlights: [
      "Serene golden lotus unfolding entrance",
      "The Four Sacred Laavan explanation & hymn guide",
      "Gurdwara location maps with protocol etiquette tips",
      "Family reception details with graceful RSVP confirmation",
    ],
    demoUrl: "/demo/wedding/sikh",
    createUrl: "/dashboard/create?occasion=wedding&template=sikh-wedding-anand-karaj",
    displayOrder: 11,
  },

  // 12. MUSLIM WEDDING (NIKAH)
  "template-wedding-muslim": {
    templateId: "template-wedding-muslim",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Families announcing Nikah and Walima with regal Mughal calligraphy and timeless Islamic grace.",
    experienceSummary:
      "A stately Mughal-inspired invitation featuring crescent starlit parchment reveal, Nikah schedule, and Walima banquet directions.",
    interactiveHighlights: [
      "Mughal calligraphy & crescent starlit silk parchment reveal",
      "Dedicated Nikah, Manjha, and Grand Walima ceremony schedules",
      "Bismillah blessing typography and couple tribute",
      "Banquet venue navigation and guest attendance RSVP",
    ],
    demoUrl: "/demo/wedding/muslim",
    createUrl: "/dashboard/create?occasion=wedding&template=muslim-wedding-nikah",
    displayOrder: 12,
  },

  // 13. CHRISTIAN WEDDING
  "template-wedding-christian": {
    templateId: "template-wedding-christian",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Couples celebrating traditional church vows, choir music, and elegant ballroom dinner receptions.",
    experienceSummary:
      "A classic cathedral-style website with stained-glass arch reveals, hymn soundtrack, reception agenda, and RSVP.",
    interactiveHighlights: [
      "Cathedral stained-glass archway entrance animation",
      "Vows ceremony guide with choral hymn soundtrack",
      "Evening reception agenda, dress code, and table directions",
      "Instant digital RSVP with dietary preference collection",
    ],
    demoUrl: "/demo/wedding/christian",
    createUrl: "/dashboard/create?occasion=wedding&template=christian-wedding",
    displayOrder: 13,
  },

  // 14. MODERN MINIMAL WEDDING
  "template-wedding-modern-minimal": {
    templateId: "template-wedding-modern-minimal",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Couples who appreciate clean modern typography, understated luxury, and intimate gatherings.",
    experienceSummary:
      "A modern typographic gatefold invitation with editorial layout, sleek couple portrait gallery, and streamlined RSVP.",
    interactiveHighlights: [
      "Architectural gatefold opening with editorial serif typography",
      "Minimalist photo gallery with couple love story",
      "Multi-destination wedding schedule and travel notes",
      "One-click modern RSVP with guest registry links",
    ],
    demoUrl: "/demo/wedding/modern-minimal",
    createUrl: "/dashboard/create?occasion=wedding&template=modern-minimal-wedding",
    displayOrder: 14,
  },

  // 15. FLORAL GARDEN WEDDING
  "template-wedding-floral-garden": {
    templateId: "template-wedding-floral-garden",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Outdoor, botanical, lawn, and spring or summer garden wedding celebrations.",
    experienceSummary:
      "A romantic botanical invitation with watercolor wildflower blooms, petal-unveil animations, and lawn party map.",
    interactiveHighlights: [
      "Watercolor floral petal unveil entrance animation",
      "Open-air lawn ceremony timeline & cocktail hour details",
      "Botanical color palette dress code recommendations",
      "Digital RSVP with guest transportation directions",
    ],
    demoUrl: "/demo/wedding/floral-garden",
    createUrl: "/dashboard/create?occasion=wedding&template=floral-garden-wedding",
    displayOrder: 15,
  },

  // 16. LUXURY DESTINATION WEDDING
  "template-wedding-luxury-destination": {
    templateId: "template-wedding-luxury-destination",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Couples hosting destination beach, resort, or palace celebrations across multiple days.",
    experienceSummary:
      "A resort-style luxury invitation with passport-style itinerary, flight and hotel travel guides, and seaside sundowner timings.",
    interactiveHighlights: [
      "Passport boarding pass opening animation",
      "3-day destination itinerary: Welcome Sundowner, Vows, Gala",
      "Curated flight, airport shuttle, and resort accommodation guide",
      "Interactive RSVP with stay dates and guest room booking",
    ],
    demoUrl: "/demo/wedding/luxury-destination",
    createUrl: "/dashboard/create?occasion=wedding&template=luxury-destination-wedding",
    displayOrder: 16,
  },

  // 17. ELEGANT CONTEMPORARY WEDDING
  "template-wedding-elegant-contemporary": {
    templateId: "template-wedding-elegant-contemporary",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Black-tie affairs, glamorous evening receptions, and champagne midnight toasts.",
    experienceSummary:
      "A black-tie digital invitation featuring wax-sealed envelope reveals, dress code guide, cocktail hours, and guestbook.",
    interactiveHighlights: [
      "Velvet wax-sealed envelope reveal with gold foil accents",
      "Black-tie gala itinerary: Red Carpet, Vows, Dinner & Midnight Party",
      "Formal attire dress code guide and photo inspiration",
      "Digital guestbook and instant RSVP attendance confirmation",
    ],
    demoUrl: "/demo/wedding/elegant-contemporary",
    createUrl: "/dashboard/create?occasion=wedding&template=elegant-contemporary-wedding",
    displayOrder: 17,
  },

  // 18. LUXURY WEDDING (HAUTE COUTURE)
  "template-wedding-luxury": {
    templateId: "template-wedding-luxury",
    occasionLabel: "WEDDING INVITATION",
    occasionCategory: "wedding",
    badgeStyle: {
      bg: "bg-[#D4AF37]/15",
      text: "text-[#8E641D]",
      border: "border-[#D4AF37]/40",
      iconName: "Crown",
    },
    perfectFor:
      "Couples seeking ultra-luxury stationery aesthetics, bespoke destination folios, champagne gold accents, and haute couture editorial typography.",
    experienceSummary:
      "An opulent haute couture invitation featuring an unboxing folio opening ceremony, multi-ceremony itinerary, live countdown, and concierge RSVP.",
    interactiveHighlights: [
      "Haute couture gilded folio unboxing with wax-seal reveal",
      "Full-screen editorial photography & couple love story timeline",
      "Multi-ceremony schedule with interactive Google Maps & attire guides",
      "VIP concierge guest RSVP tracking with attendance preferences",
    ],
    demoUrl: "/demo/wedding/luxury",
    createUrl: "/dashboard/create?occasion=wedding&collection=luxury",
    displayOrder: 10,
  },
};

/**
 * Returns all active catalogue templates enriched with presentation metadata,
 * ordered by curated flagship prominence.
 */
export function getEnrichedCatalogueTemplates(): EnrichedGiftTemplate[] {
  const activeTemplates = CATALOGUE_TEMPLATES.filter((t) => t.isActive);

  const enriched = activeTemplates.map((template) => {
    const meta = GIFT_PRESENTATION_MAP[template.id] || {
      templateId: template.id,
      occasionLabel: `${template.occasionType.toUpperCase()} GIFT`,
      occasionCategory: (template.occasionType === "love"
        ? "romantic"
        : template.occasionType) as GiftCategoryFilter,
      badgeStyle: {
        bg: "bg-[#541D2B]/10",
        text: "text-[#541D2B]",
        border: "border-[#541D2B]/20",
        iconName: "Sparkles",
      },
      perfectFor: `Perfect for celebrating special moments with your loved ones.`,
      experienceSummary: template.description,
      interactiveHighlights: template.features.slice(0, 4),
      demoUrl: template.demoUrl,
      createUrl: `/dashboard/create?occasion=${template.occasionType}`,
      displayOrder: 99,
    };

    return {
      ...template,
      presentation: meta,
    };
  });

  // Sort by displayOrder so flagship experiences appear first
  return enriched.sort(
    (a, b) => a.presentation.displayOrder - b.presentation.displayOrder
  );
}

/**
 * Returns ONLY Love & Relationship catalogue templates (Love & Romance, Anniversary, Apology).
 * Strictly excludes any Birthday, Wedding, or other unrelated categories.
 */
export function getEnrichedRelationshipTemplates(): EnrichedGiftTemplate[] {
  // Use reliable category and occasion identifiers:
  // Must be active AND in "digital-gifts" category OR matching relationship occasion types
  // Explicitly excludes "birthday" and "wedding"
  const relationshipTemplates = CATALOGUE_TEMPLATES.filter(
    (t) =>
      t.isActive &&
      (t.categoryId === "digital-gifts" ||
        ["love", "anniversary", "apology"].includes(t.occasionType)) &&
      !["birthday", "wedding"].includes(t.occasionType)
  );

  const enriched = relationshipTemplates.map((template) => {
    const meta = GIFT_PRESENTATION_MAP[template.id] || {
      templateId: template.id,
      occasionLabel: `${template.occasionType.toUpperCase()} GIFT`,
      occasionCategory: (template.occasionType === "love"
        ? "romantic"
        : template.occasionType) as GiftCategoryFilter,
      badgeStyle: {
        bg: "bg-[#541D2B]/10",
        text: "text-[#541D2B]",
        border: "border-[#541D2B]/20",
        iconName: "Heart" as const,
      },
      perfectFor: `Perfect for celebrating special moments with your loved ones.`,
      experienceSummary: template.description,
      interactiveHighlights: template.features.slice(0, 4),
      demoUrl: template.demoUrl,
      createUrl: `/dashboard/create?occasion=${template.occasionType}`,
      displayOrder: 99,
    };

    return {
      ...template,
      presentation: meta,
    };
  });

  return enriched.sort(
    (a, b) => a.presentation.displayOrder - b.presentation.displayOrder
  );
}
