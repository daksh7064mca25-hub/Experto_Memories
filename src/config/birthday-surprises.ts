import { BirthdaySurpriseItem, BirthdaySurpriseCategory, BirthdayScratchReward } from "@/types/website";

export interface RelationshipOption {
  id: string;
  label: string;
  group: "family" | "romance" | "friends" | "general";
  description: string;
  iconName: string;
}

export const BIRTHDAY_RELATIONSHIPS: RelationshipOption[] = [
  { id: "mother", label: "Mother / Mom", group: "family", description: "Maternal gratitude, relaxation, and pampering", iconName: "Heart" },
  { id: "father", label: "Father / Dad", group: "family", description: "Respect, leisure, and all-star appreciation", iconName: "Trophy" },
  { id: "best-friend", label: "Best Friend", group: "friends", description: "Inside jokes, banter, and wild adventures", iconName: "Sparkles" },
  { id: "other-friends", label: "Friend / Circle", group: "friends", description: "Warm celebration, outings, and treats", iconName: "Smile" },
  { id: "girlfriend-boyfriend", label: "Girlfriend / Boyfriend", group: "romance", description: "Romantic dates, love coupons, and sweet promises", iconName: "Heart" },
  { id: "husband-wife", label: "Husband / Wife", group: "romance", description: "Deep devotion, chore relief, and cozy getaways", iconName: "Star" },
  { id: "sister", label: "Sister", group: "family", description: "Sisterly love, closet borrowing passes, and boba dates", iconName: "Coffee" },
  { id: "brother", label: "Brother", group: "family", description: "Gaming rights, pizza treats, and brotherly camaraderie", iconName: "Trophy" },
  { id: "kids", label: "Son / Daughter / Kids", group: "family", description: "Theme parks, toy surprises, and extra treats", iconName: "Cake" },
  { id: "general", label: "Other / General", group: "general", description: "Versatile, thoughtful birthday treats and hugs", iconName: "Gift" },
];

export const RELATIONSHIP_SURPRISE_PRESETS: Record<string, BirthdaySurpriseItem[]> = {
  mother: [
    {
      id: "mom-spa-day",
      title: "Full Day Spa & Relaxation Pass 💆‍♀️✨",
      description: "A complete day off from all cooking, chores, and household worries. Just pure pampering and peaceful rest!",
      badge: "Pampering Voucher",
      icon: "sparkles",
      category: "voucher",
      enabled: true,
      order: 0,
    },
    {
      id: "mom-feast-dinner",
      title: "Royal Family Feast in Your Honor 🍽️👑",
      description: "Your favorite restaurant or a home-cooked banquet where you don't lift a single finger — except to eat dessert!",
      badge: "Dinner Treat",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 1,
    },
    {
      id: "mom-memory-album",
      title: "Handmade Keepsake Photo Album 📸💖",
      description: "A customized printed book of our favorite family memories, handwritten memories, and milestones.",
      badge: "Heartfelt Keepsake",
      icon: "heart",
      category: "heartfelt",
      enabled: true,
      order: 2,
    },
    {
      id: "mom-unlimited-hugs",
      title: "Unlimited Lifetime Hugs & Warm Tea On Demand ☕🌸",
      description: "Whenever you need a warm cup of chai/coffee, foot massage, or warm embrace, this coupon is always valid.",
      badge: "Evergreen Promise",
      icon: "coffee",
      category: "promise",
      enabled: true,
      order: 3,
    },
    {
      id: "mom-shopping-spree",
      title: "Guilt-Free Birthday Shopping Spree 🛍️💐",
      description: "Pick whatever caught your eye in that boutique or online cart — this one is fully sponsored by me!",
      badge: "Gift Voucher",
      icon: "gift",
      category: "voucher",
      enabled: true,
      order: 4,
    },
  ],

  father: [
    {
      id: "dad-remote-monopoly",
      title: "Total TV Remote Monopoly for the Weekend 📺🏆",
      description: "Absolute control of the living room television. Zero complaints, zero channel switches during the big game!",
      badge: "VIP Privilege",
      icon: "trophy",
      category: "favor",
      enabled: true,
      order: 0,
    },
    {
      id: "dad-favorite-restaurant",
      title: "Grand Dinner at Your Favorite Spot 🥩🥂",
      description: "The best table, your favorite specialty dishes, and dessert — sender picks up the entire bill with pride.",
      badge: "All-Inclusive Feast",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 1,
    },
    {
      id: "dad-zero-tech-support",
      title: "Zero-Nagging Tech Support Lifetime Warranty 📱🛠️",
      description: "I will happily fix your Wi-Fi, update your phone, and organize your apps without a single sigh or eye roll!",
      badge: "Heartfelt Favor",
      icon: "sparkles",
      category: "promise",
      enabled: true,
      order: 2,
    },
    {
      id: "dad-road-trip",
      title: "Scenic Weekend Getaway / Road Trip 🚗⛰️",
      description: "A weekend drive to the hills, resort, or coastal drive where you can just relax and enjoy the fresh air.",
      badge: "Adventure Pass",
      icon: "compass",
      category: "activity",
      enabled: true,
      order: 3,
    },
    {
      id: "dad-gratitude-letter",
      title: "Framed Gratitude Tribute to the Best Dad 📜🌟",
      description: "A written tribute honoring everything you sacrificed, taught, and built for our family over the years.",
      badge: "Keepsake Tribute",
      icon: "heart",
      category: "heartfelt",
      enabled: true,
      order: 4,
    },
  ],

  "best-friend": [
    {
      id: "bestie-food-crawl",
      title: "Midnight Street Food & Dessert Crawl 🍕🍦",
      description: "All the street food, cheesy bites, midnight waffles, and ice cream you can eat — my treat entirely!",
      badge: "Foodie Voucher",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 0,
    },
    {
      id: "bestie-vent-pass",
      title: "Zero-Judgment 3:00 AM Venting Pass 📞✨",
      description: "Whenever drama strikes or life gets heavy, call me anytime. Free advice, hype-person support, and zero judgment.",
      badge: "Forever Friend Pass",
      icon: "smile",
      category: "promise",
      enabled: true,
      order: 1,
    },
    {
      id: "bestie-aux-cord",
      title: "Sole Car DJ & Aux Cord Supremacy 🎵🚗",
      description: "Next road trip or car ride, you pick every single track without interruption or skipping.",
      badge: "Music Pass",
      icon: "music",
      category: "comedy",
      enabled: true,
      order: 2,
    },
    {
      id: "bestie-spontaneous-trip",
      title: "A Spontaneous Weekend Road Trip Plan 🎒🌊",
      description: "We pick a destination on Friday afternoon and take off for laughs, epic photos, and chaos memories.",
      badge: "Adventure Pass",
      icon: "compass",
      category: "activity",
      enabled: true,
      order: 3,
    },
    {
      id: "bestie-wishlist-gift",
      title: "That Thing You've Kept in Your Wishlist Forever 🎁👀",
      description: "You thought I wasn't paying attention when you pointed it out — check your package soon!",
      badge: "Secret Surprise",
      icon: "gift",
      category: "voucher",
      enabled: true,
      order: 4,
    },
  ],

  "other-friends": [
    {
      id: "friend-dinner-celebration",
      title: "Celebratory Birthday Dinner & Drinks 🥂🍕",
      description: "A fun evening out with good food, endless laughs, and a birthday dessert with candles!",
      badge: "Treat Voucher",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 0,
    },
    {
      id: "friend-coffee-catchup",
      title: "Artisan Coffee & Pastry Catch-Up Date ☕🥐",
      description: "An afternoon dedicated to catching up on everything new in your life over gourmet coffee.",
      badge: "Cafe Pass",
      icon: "coffee",
      category: "activity",
      enabled: true,
      order: 1,
    },
    {
      id: "friend-game-night",
      title: "Epic Board Game & Movie Marathon Night 🎲🍿",
      description: "Popcorn, favorite films, competitive board games, and all the snacks you love.",
      badge: "Hangout Pass",
      icon: "smile",
      category: "activity",
      enabled: true,
      order: 2,
    },
    {
      id: "friend-cheering-squad",
      title: "A Year of Unconditional Hype & Encouragement 🌟🙌",
      description: "Whatever goal you chase this year, consider me your permanent cheerleader and supporter.",
      badge: "Heartfelt Pledge",
      icon: "star",
      category: "promise",
      enabled: true,
      order: 3,
    },
  ],

  "girlfriend-boyfriend": [
    {
      id: "partner-candlelit-dinner",
      title: "Private Candlelit Dinner Under the Stars 🍷🕯️",
      description: "A dreamy evening reserved exclusively for the two of us with your favorite cuisine and soft music.",
      badge: "Romantic Date",
      icon: "heart",
      category: "experience",
      enabled: true,
      order: 0,
    },
    {
      id: "partner-sunset-drive",
      title: "Scenic Sunset Drive & Stargazing Picnic 🌅🧺",
      description: "Driving out to a scenic overlook with warm blankets, snacks, and stargazing together.",
      badge: "Cozy Experience",
      icon: "compass",
      category: "activity",
      enabled: true,
      order: 1,
    },
    {
      id: "partner-love-letter-jar",
      title: "A Handwritten Jar of 50 Reasons I Love You 💌✨",
      description: "50 folded notes celebrating the little things that make you the most breathtaking person in my world.",
      badge: "Heartfelt Keepsake",
      icon: "sparkles",
      category: "heartfelt",
      enabled: true,
      order: 2,
    },
    {
      id: "partner-breakfast-bed",
      title: "Lazy Sunday Breakfast in Bed 🥞☕",
      description: "Fresh fluffy pancakes, fresh juice, warm coffee, and zero rush to get out of bed all morning.",
      badge: "Sweet Favor",
      icon: "coffee",
      category: "favor",
      enabled: true,
      order: 3,
    },
    {
      id: "partner-wildcard-date",
      title: "Wildcard Date — You Choose Anything in the World 🎡💖",
      description: "Wherever you want to go, whatever you want to try, I say YES with a happy smile!",
      badge: "Golden Ticket",
      icon: "ticket",
      category: "voucher",
      enabled: true,
      order: 4,
    },
  ],

  "husband-wife": [
    {
      id: "spouse-weekend-getaway",
      title: "Weekend Luxury Resort Escape for Two 🏖️🥂",
      description: "Just you and me escaping the daily routine. Luxurious rooms, delicious food, and quality time.",
      badge: "Getaway Pass",
      icon: "plane",
      category: "experience",
      enabled: true,
      order: 0,
    },
    {
      id: "spouse-chore-immunity",
      title: "One Full Week of Zero Household Duties 🧹✨",
      description: "No dishes, no grocery runs, no laundry, no cleanup. I will handle everything while you relax.",
      badge: "Household Immunity",
      icon: "sparkles",
      category: "favor",
      enabled: true,
      order: 1,
    },
    {
      id: "spouse-couples-massage",
      title: "Restorative Aromatherapy Couples Massage 💆‍♂️💆‍♀️",
      description: "A calming spa appointment to melt away all tension and recharge together in serenity.",
      badge: "Wellness Voucher",
      icon: "heart",
      category: "voucher",
      enabled: true,
      order: 2,
    },
    {
      id: "spouse-chef-banquet",
      title: "Four-Course Gourmet Dinner Cooked by Sender 👨‍🍳🕯️",
      description: "I will curate a full multi-course dinner paired with your favorite dessert right at home.",
      badge: "Gourmet Date",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 3,
    },
    {
      id: "spouse-unwavering-promise",
      title: "A Lifetime Promise of Standing by Your Side 💍🤍",
      description: "In every victory and every challenge, my hand is in yours forever. Happy birthday, my life partner.",
      badge: "Sacred Vow",
      icon: "star",
      category: "promise",
      enabled: true,
      order: 4,
    },
  ],

  sister: [
    {
      id: "sister-wardrobe-pass",
      title: "One Week of Borrowing My Outfits No Questions Asked 👗👜",
      description: "Full access to my closet, bags, and jackets without needing permission or getting side-eyed!",
      badge: "Closet Immunity",
      icon: "sparkles",
      category: "comedy",
      enabled: true,
      order: 0,
    },
    {
      id: "sister-boba-dessert",
      title: "All-You-Can-Drink Boba & Sweet Pastry Date 🧋🍰",
      description: "Your favorite bubble tea order plus cake slices at that aesthetic cafe you love — on me!",
      badge: "Sweet Voucher",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 1,
    },
    {
      id: "sister-secret-keeper",
      title: "Vault-Grade Emergency Secret-Keeper Pass 🤫🔒",
      description: "You can tell me anything. It goes straight to the grave, strictly safe from parents and everyone else.",
      badge: "Sisterly Bond",
      icon: "heart",
      category: "promise",
      enabled: true,
      order: 2,
    },
    {
      id: "sister-pamper-kit",
      title: "Luxury Skincare & Self-Care Gift Basket 🧴✨",
      description: "Sheet masks, scented candles, soothing bath salts, and treats curated just for you.",
      badge: "Pamper Gift",
      icon: "gift",
      category: "voucher",
      enabled: true,
      order: 3,
    },
  ],

  brother: [
    {
      id: "brother-pizza-feast",
      title: "Extra Large Stuffed-Crust Pizza & Wings Feast 🍕🍗",
      description: "Your dream pizza order with all the extra toppings, cold sodas, and garlic bread on my tab.",
      badge: "Feast Pass",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 0,
    },
    {
      id: "brother-gaming-rights",
      title: "24 Hours of Gaming Bragging Rights & Victory Pass 🎮🏆",
      description: "Whatever game we play, you hold the championship title for a full day without counterarguments.",
      badge: "Gamer Voucher",
      icon: "trophy",
      category: "comedy",
      enabled: true,
      order: 1,
    },
    {
      id: "brother-borrow-gadgets",
      title: "Tech / Gear Borrowing Permission Slip 🎧🔌",
      description: "Permission to borrow my high-end headphones, consoles, or gear without the usual interrogation.",
      badge: "VIP Pass",
      icon: "star",
      category: "favor",
      enabled: true,
      order: 2,
    },
    {
      id: "brother-always-got-your-back",
      title: "Bro Code Guarantee: I Always Got Your Back 👊🔥",
      description: "No matter how much we roast each other, if anyone ever bothers you, you have a permanent protector.",
      badge: "Brotherly Pledge",
      icon: "heart",
      category: "promise",
      enabled: true,
      order: 3,
    },
  ],

  kids: [
    {
      id: "kids-ice-cream-spree",
      title: "Triple Scoop Ice Cream Extravaganza 🍦🍨🍭",
      description: "Triple scoops, rainbow sprinkles, waffle cones, and gummy toppings with zero limits!",
      badge: "Sweet Treat",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 0,
    },
    {
      id: "kids-amusement-park",
      title: "Full Day at the Theme Park / Arcade Fun Center 🎡🎟️",
      description: "Rollercoasters, water slides, arcade tokens, and cotton candy until you're completely tuckered out!",
      badge: "Adventure Pass",
      icon: "ticket",
      category: "activity",
      enabled: true,
      order: 1,
    },
    {
      id: "kids-toy-hunt",
      title: "One Giant Mystery Toy Store Shopping Spree 🧸🎁",
      description: "Walk into the toy store and pick that one special toy you've been dreaming about all month!",
      badge: "Dream Toy Pass",
      icon: "gift",
      category: "voucher",
      enabled: true,
      order: 2,
    },
    {
      id: "kids-stay-up-late",
      title: "Stay Up 1 Hour Past Bedtime Movie Night 🍿🎬",
      description: "Official permission to stay up an extra hour, build a cozy blanket fort, and watch your favorite movie.",
      badge: "Super Privilege",
      icon: "smile",
      category: "favor",
      enabled: true,
      order: 3,
    },
  ],

  general: [
    {
      id: "gen-birthday-feast",
      title: "A Grand Birthday Celebration Dinner On Me 🍽️🥂",
      description: "Delicious food, celebratory toasts, and your favorite dessert — because you deserve to be spoiled today!",
      badge: "Dinner Treat",
      icon: "cake",
      category: "experience",
      enabled: true,
      order: 0,
    },
    {
      id: "gen-warm-hugs",
      title: "100 Warm Birthday Hugs & Endless Good Energy 🤗✨",
      description: "May your upcoming year be packed with spontaneous wins, radiant health, and boundless happiness.",
      badge: "Heartfelt Wishes",
      icon: "heart",
      category: "heartfelt",
      enabled: true,
      order: 1,
    },
    {
      id: "gen-special-gift",
      title: "A Specially Handpicked Surprise Gift 🎁💐",
      description: "Something meaningful chosen with care to remind you how deeply loved and appreciated you are.",
      badge: "Surprise Package",
      icon: "gift",
      category: "voucher",
      enabled: true,
      order: 2,
    },
    {
      id: "gen-adventure-day",
      title: "A Fun Day Out Doing Whatever Makes You Smile 🎢☕",
      description: "Whether it's cozy cafe hopping, shopping, or exploring new sights, today is all about your happiness.",
      badge: "Celebration Pass",
      icon: "compass",
      category: "activity",
      enabled: true,
      order: 3,
    },
  ],
};

/**
 * Normalizes input string to one of the canonical relationship keys
 */
export function normalizeBirthdayRelationship(rel?: string): string {
  if (!rel) return "general";
  const r = rel.toLowerCase().trim().replace(/_/g, "-");

  if (r.includes("mom") || r.includes("mother")) return "mother";
  if (r.includes("dad") || r.includes("father")) return "father";
  if (r.includes("best") || r.includes("bff")) return "best-friend";
  if (r.includes("girl") || r.includes("boy") || r.includes("partner") || r.includes("date")) return "girlfriend-boyfriend";
  if (r.includes("wife") || r.includes("husband") || r.includes("spouse")) return "husband-wife";
  if (r.includes("sis")) return "sister";
  if (r.includes("bro")) return "brother";
  if (r.includes("kid") || r.includes("child") || r.includes("son") || r.includes("daughter")) return "kids";
  if (r.includes("friend")) return "other-friends";

  return "general";
}

/**
 * Returns suggested surprises for the chosen relationship
 */
export function getBirthdaySurprisePresets(rel?: string): BirthdaySurpriseItem[] {
  const key = normalizeBirthdayRelationship(rel);
  return RELATIONSHIP_SURPRISE_PRESETS[key] || RELATIONSHIP_SURPRISE_PRESETS.general;
}

/**
 * Returns a high-quality default single reward for Custom Surprise mode (Mode A)
 */
export function getDefaultCustomReward(rel?: string): BirthdayScratchReward {
  const key = normalizeBirthdayRelationship(rel);
  const presets = RELATIONSHIP_SURPRISE_PRESETS[key] || RELATIONSHIP_SURPRISE_PRESETS.general;
  const first = presets[0];

  return {
    id: `custom-reward-${Date.now()}`,
    title: first?.title || "One Full Day Together ❤️",
    description:
      first?.description ||
      "A complete day planned just for you, with your favourite food, activities and unlimited hugs.",
    redemptionInstructions: "Tell me your preferred date and I'll plan everything.",
    icon: first?.icon || "heart",
    badge: first?.badge || "Birthday Surprise",
    enabled: true,
  };
}

/**
 * Returns suggested rewards for Random Surprise mode (Mode B)
 */
export function getDefaultRandomRewards(rel?: string): BirthdayScratchReward[] {
  const key = normalizeBirthdayRelationship(rel);
  const presets = RELATIONSHIP_SURPRISE_PRESETS[key] || RELATIONSHIP_SURPRISE_PRESETS.general;

  return presets.map((p, idx) => ({
    id: p.id || `random-reward-${idx + 1}`,
    title: p.title,
    description: p.description || "A wonderful birthday treat planned just for you!",
    redemptionInstructions: "Tell me your preferred date and time to claim!",
    icon: p.icon || "gift",
    badge: p.badge || "Birthday Surprise",
    enabled: p.enabled !== false,
  }));
}
