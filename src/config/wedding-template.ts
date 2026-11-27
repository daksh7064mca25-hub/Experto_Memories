import { WebsiteProjectData, WebsiteSectionData, WeddingRevealStyle } from "@/types/website";

export const CANONICAL_WEDDING_COLLECTIONS = [
  "royal-indian",
  "traditional-hindu",
  "punjabi",
  "sikh",
  "muslim",
  "christian",
  "modern-minimal",
  "floral-garden",
  "luxury-destination",
  "elegant-contemporary",
  "luxury-wedding",
] as const;

export type CanonicalWeddingCollection = (typeof CANONICAL_WEDDING_COLLECTIONS)[number];

export const VALID_WEDDING_COLLECTIONS = CANONICAL_WEDDING_COLLECTIONS;

/**
 * Normalizes any collection slug, alias, or label into one of the 10 canonical collection IDs.
 * Returns null if the collection is unknown, allowing callers to handle not-found gracefully.
 */
export function normalizeWeddingCollection(collectionSlug?: string | null): CanonicalWeddingCollection | null {
  if (!collectionSlug || typeof collectionSlug !== "string") {
    return null;
  }

  // Clean the input: lowercase, trim, replace underscores/spaces with hyphens
  const c = collectionSlug
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (!c) return null;

  // 1. Exact canonical matches
  if (CANONICAL_WEDDING_COLLECTIONS.includes(c as CanonicalWeddingCollection)) {
    return c as CanonicalWeddingCollection;
  }

  // 2. Royal Indian aliases
  if (
    c === "royal" ||
    c.includes("rajwada") ||
    c.includes("palace") ||
    c === "royal-wedding" ||
    c === "royal-indian-wedding"
  ) {
    return "royal-indian";
  }

  // 3. Traditional Hindu aliases
  if (
    c === "hindu" ||
    c.includes("vivah") ||
    c.includes("vedic") ||
    c.includes("mandap") ||
    c === "traditional-hindu-wedding" ||
    c === "hindu-wedding"
  ) {
    return "traditional-hindu";
  }

  // 4. Punjabi aliases
  if (
    c === "punjabi" ||
    c.includes("shahi") ||
    c.includes("phulkari") ||
    c.includes("dhol") ||
    c === "punjabi-wedding"
  ) {
    return "punjabi";
  }

  // 5. Sikh / Anand Karaj aliases
  if (
    c === "sikh" ||
    c === "anand" ||
    c === "anand-karaj" ||
    c === "karaj" ||
    c === "sikh-wedding" ||
    c.includes("anandkaraj")
  ) {
    return "sikh";
  }

  // 6. Muslim / Nikah aliases
  if (
    c === "muslim" ||
    c === "nikah" ||
    c === "walima" ||
    c.includes("noor") ||
    c === "muslim-wedding" ||
    c === "nikah-wedding"
  ) {
    return "muslim";
  }

  // 7. Christian aliases
  if (
    c === "christian" ||
    c.includes("cathedral") ||
    c.includes("church") ||
    c.includes("matrimony") ||
    c === "christian-wedding"
  ) {
    return "christian";
  }

  // 8. Modern Minimal aliases
  if (
    c === "minimal" ||
    c === "modern" ||
    c.includes("gatefold") ||
    c.includes("editorial") ||
    c === "modern-minimal-wedding" ||
    c === "minimal-wedding"
  ) {
    return "modern-minimal";
  }

  // 9. Floral Garden aliases
  if (
    c === "floral" ||
    c === "garden" ||
    c.includes("botanical") ||
    c.includes("wildflower") ||
    c === "floral-garden-wedding" ||
    c === "garden-wedding"
  ) {
    return "floral-garden";
  }

  // 10. Luxury Destination aliases
  if (
    c === "destination" ||
    c.includes("coastal") ||
    c.includes("beach") ||
    c.includes("resort") ||
    c === "luxury-destination-wedding" ||
    c === "destination-wedding"
  ) {
    return "luxury-destination";
  }

  // 11. Elegant Contemporary aliases
  if (
    c === "contemporary" ||
    c.includes("black-tie") ||
    c.includes("velvet") ||
    c.includes("gala") ||
    c === "elegant-contemporary-wedding" ||
    c === "contemporary-wedding"
  ) {
    return "elegant-contemporary";
  }

  // 12. Luxury Wedding (Haute Couture) aliases
  if (
    c === "luxury" ||
    c === "luxury-wedding" ||
    c.includes("couture") ||
    c.includes("folio") ||
    c.includes("haute")
  ) {
    return "luxury-wedding";
  }

  // Unknown collection
  return null;
}

export function createDefaultWeddingProject(
  slug: string,
  brideName?: string,
  groomName?: string,
  collectionSlug = "royal-indian"
): WebsiteProjectData {
  const collectionKey = normalizeWeddingCollection(collectionSlug) || "royal-indian";

  // Default culturally authentic names if not provided
  let defaultBride = "Roshni";
  let defaultGroom = "Aarav";
  let defaultTheme = "royal-crimson";
  let revealStyle: WeddingRevealStyle = "palace_doors";
  let eyebrow = "With the divine blessings of our families & the Almighty";
  let headline = "Two Hearts, One Royal Union";
  let weddingDateText = "December 14 – 15, 2026 • Jaipur, Rajasthan";
  let actionButtonText = "Open Royal Invitation ✨";
  let audioNotice = "Turn up your volume for royal shehnai";
  let backgroundMusicUrl = "https://assets.mixkit.co/music/preview/mixkit-celebration-happiness-565.mp3";
  let targetDate = "2026-12-14T17:30:00+05:30";
  let venueCity = "Jaipur, Rajasthan, India";
  let religiousBlessingText: string | undefined = undefined;
  let culturalSymbol = "monogram";

  // Couple titles and bios
  let groomTitle = "Son of Smt. Sunita & Shri Rajesh Kapoor";
  let groomBio = "An architect who found his anchor, his laughter, and his forever in Roshni's smile.";
  let brideTitle = "Daughter of Smt. Kavita & Shri Mahendra Sharma";
  let brideBio = "A classical vocalist and designer who found her home in Aarav's gentle warmth.";
  let parentsBlessing = "“May their path together be paved with patience, laughter, respect, and unconditional love.” — With love from both families.";

  // Events agenda
  let events = [
    {
      id: "evt-haldi",
      title: "Haldi & Phoolon Ki Holi",
      date: "Sunday, December 14, 2026",
      time: "10:30 AM onwards",
      venueName: "The Sunlit Courtyard, Fairmont Jaipur",
      address: "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028",
      googleMapsUrl: "https://maps.google.com/?q=Fairmont+Jaipur",
      dressCode: "Sunshine Yellow & Floral Pastels",
      description: "A joyful morning filled with auspicious turmeric, fragrant flower petals, dhol beats, and refreshing thandai.",
      icon: "sparkles",
    },
    {
      id: "evt-mehendi",
      title: "Royal Mehendi & Henna Soiree",
      date: "Sunday, December 14, 2026",
      time: "03:00 PM onwards",
      venueName: "The Heritage Verandah, Fairmont Jaipur",
      address: "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028",
      googleMapsUrl: "https://maps.google.com/?q=Fairmont+Jaipur",
      dressCode: "Emerald Green & Traditional Festive",
      description: "Intricate Rajasthani bridal henna artistry, festive folk melodies, bangle favors, and afternoon royal high tea.",
      icon: "sparkles",
    },
    {
      id: "evt-sangeet",
      title: "Grand Sangeet & Cocktail Night",
      date: "Sunday, December 14, 2026",
      time: "07:00 PM onwards",
      venueName: "The Royal Ballroom, Fairmont Jaipur",
      address: "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028",
      googleMapsUrl: "https://maps.google.com/?q=Fairmont+Jaipur",
      dressCode: "Royal Glamour & Indowestern",
      description: "An evening of choreographed family dance battles, soul-stirring music, signature cocktails, and midnight celebrations.",
      icon: "music",
    },
    {
      id: "evt-wedding",
      title: "The Royal Wedding & Pheras",
      date: "Monday, December 15, 2026",
      time: "04:30 PM (Baraat) • 06:00 PM (Pheras)",
      venueName: "The Heritage Mandap Lawn, Fairmont Jaipur",
      address: "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028",
      googleMapsUrl: "https://maps.google.com/?q=Fairmont+Jaipur",
      dressCode: "Regal Indian Traditional",
      description: "The royal procession followed by sacred Vedic vows as two families unite under the starry Jaipur sky.",
      icon: "ring",
    },
    {
      id: "evt-reception",
      title: "Royal Gala Dinner & Reception",
      date: "Monday, December 15, 2026",
      time: "08:30 PM onwards",
      venueName: "The Palatial Amphitheatre, Fairmont Jaipur",
      address: "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028",
      googleMapsUrl: "https://maps.google.com/?q=Fairmont+Jaipur",
      dressCode: "Black-Tie or Heavy Traditional",
      description: "A grand feast celebrating the newly married couple with live acoustic sitar, gourmet banquet, and toasts.",
      icon: "party",
    },
  ];

  // Tailor details for each distinct cultural collection
  if (collectionKey === "traditional-hindu") {
    defaultBride = "Priya";
    defaultGroom = "Vikram";
    defaultTheme = "marigold-sindoor";
    revealStyle = "mandap_garland";
    culturalSymbol = "kalash";
    eyebrow = "|| श्री गणेशाय नमः ||";
    headline = "The Sacred Vivah Celebration";
    weddingDateText = "November 28 – 29, 2026 • Varanasi, Uttar Pradesh";
    actionButtonText = "Enter The Sacred Mandap 🪷";
    audioNotice = "Turn on sound for sacred nadaswaram flute";
    targetDate = "2026-11-28T18:00:00+05:30";
    venueCity = "Varanasi, Uttar Pradesh, India";
    religiousBlessingText = "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥";
    groomTitle = "Son of Smt. Gayatri & Shri Narayana Iyer";
    groomBio = "A classical violinist with deep reverence for family roots, who found his melody in Priya's laughter.";
    brideTitle = "Daughter of Smt. Uma & Shri Ramaswamy Sharma";
    brideBio = "A Sanskrit educator and textile artist who brings boundless grace and warmth wherever she goes.";
    parentsBlessing = "“May Agni Deva and all the devatas shower your life together with health, wisdom, and eternal harmony.”";
    events = [
      {
        id: "evt-tilak",
        title: "Tilak & Sagai Ceremony",
        date: "Saturday, November 28, 2026",
        time: "10:00 AM onwards",
        venueName: "The Temple Courtyard, BrijRama Palace",
        address: "Darbhanga Ghat, Varanasi, Uttar Pradesh 221001",
        googleMapsUrl: "https://maps.google.com/?q=BrijRama+Palace+Varanasi",
        dressCode: "Panchakacham & Pure Silk Dhotis / Pattu Sarees",
        description: "Auspicious exchange of rings, family blessings, and traditional Vedic chanting by the holy ghats.",
        icon: "sparkles",
      },
      {
        id: "evt-haldi",
        title: "Mangala Snanam & Haldi",
        date: "Saturday, November 28, 2026",
        time: "03:30 PM onwards",
        venueName: "The Marigold Riverside Terrace, Varanasi",
        address: "Darbhanga Ghat, Varanasi, Uttar Pradesh 221001",
        googleMapsUrl: "https://maps.google.com/?q=BrijRama+Palace+Varanasi",
        dressCode: "Auspicious Marigold Yellow & Sandalwood Gold",
        description: "Sacred turmeric paste application by family elders, shower of rose petals, and auspicious folk songs.",
        icon: "sparkles",
      },
      {
        id: "evt-wedding",
        title: "Shubh Vivah & Saptapadi",
        date: "Sunday, November 29, 2026",
        time: "05:30 PM (Kalyana Muhurtham)",
        venueName: "The Mandap Hall, BrijRama Palace",
        address: "Darbhanga Ghat, Varanasi, Uttar Pradesh 221001",
        googleMapsUrl: "https://maps.google.com/?q=BrijRama+Palace+Varanasi",
        dressCode: "Kanjeevaram Silk & Traditional Attire",
        description: "The sacred seven pheras around the holy fire, tying of the Mangalsutra, and eternal vows under Vedic mantras.",
        icon: "ring",
      },
      {
        id: "evt-reception",
        title: "Kalyana Virundhu (Gala Feast)",
        date: "Sunday, November 29, 2026",
        time: "08:00 PM onwards",
        venueName: "The Ganga View Pavilion, Varanasi",
        address: "Darbhanga Ghat, Varanasi, Uttar Pradesh 221001",
        googleMapsUrl: "https://maps.google.com/?q=BrijRama+Palace+Varanasi",
        dressCode: "Festive Traditional",
        description: "An authentic royal satvik feast served on plantain leaves with live Carnatic and sitar recitals.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "punjabi") {
    defaultBride = "Simran";
    defaultGroom = "Harpreet";
    defaultTheme = "marigold-sindoor";
    revealStyle = "phulkari_dhol";
    culturalSymbol = "dhol";
    eyebrow = "Lakh Lakh Vadhaiyan & Heartfelt Blessings";
    headline = "The Shahi Punjabi Celebration";
    weddingDateText = "December 20 – 21, 2026 • Amritsar, Punjab";
    actionButtonText = "Join The Celebrations 🥁";
    audioNotice = "Turn up your volume for high-energy Dhol beats";
    targetDate = "2026-12-20T18:00:00+05:30";
    venueCity = "Amritsar, Punjab, India";
    groomTitle = "Son of Smt. Jaspreet & Sardar Gurdeep Singh Dhillon";
    groomBio = "A passionate pilot and foodie whose booming laughter and generosity light up every single room.";
    brideTitle = "Daughter of Smt. Manjit & Sardar Balwinder Singh Sandhu";
    brideBio = "An interior designer with an infectious smile, sparkling eyes, and the warmest hospitable heart.";
    parentsBlessing = "“May our children be blessed with lifelong laughter, robust health, immense joy, and unwavering warmth in every step of their journey together.”";
    events = [
      {
        id: "evt-roka",
        title: "Roka & Shagan Ceremony",
        date: "Saturday, December 20, 2026",
        time: "11:00 AM onwards",
        venueName: "The Royal Orchid Farms, Amritsar",
        address: "Airport Road, Rajasansi, Amritsar, Punjab 143101",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Bright Phulkari & Kurta Pajama",
        description: "Official blessings, exchange of dry fruits and sweets, followed by loud family congratulations and dhol beats.",
        icon: "sparkles",
      },
      {
        id: "evt-jaggo",
        title: "Jaggo Night & Grand Sangeet",
        date: "Saturday, December 20, 2026",
        time: "07:30 PM onwards",
        venueName: "The Grand Heritage Lawn, Amritsar",
        address: "Airport Road, Rajasansi, Amritsar, Punjab 143101",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Heavy Patiala Shahi & Mirror-work Kurtas",
        description: "Carrying the illuminated brass Jaggo pots on heads, non-stop Bhangra beats, Giddha boliya, and open tandoor feast.",
        icon: "music",
      },
      {
        id: "evt-chooda",
        title: "Chooda & Haldi Vatna Ceremony",
        date: "Sunday, December 21, 2026",
        time: "09:30 AM onwards",
        venueName: "The Dhillon Courtyard, Amritsar",
        address: "Airport Road, Rajasansi, Amritsar, Punjab 143101",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Yellow & Festive Pastels",
        description: "Maternal uncles blessing the bride with red and white ivory bangles, accompanied by Kalire and joyful blessings.",
        icon: "sparkles",
      },
      {
        id: "evt-baraat",
        title: "The Grand Shahi Viah & Baraat",
        date: "Sunday, December 21, 2026",
        time: "11:30 AM (Baraat) • 01:00 PM (Wedding Ceremony & Feast)",
        venueName: "The Heritage Haveli Resort, Amritsar",
        address: "GT Road, Amritsar, Punjab 143001",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Royal Turban / Sherwani & Designer Lehengas",
        description: "The grand Baraat procession with live dholis, garland exchange, sacred wedding ceremony, and an authentic royal afternoon feast.",
        icon: "ring",
      },
      {
        id: "evt-reception",
        title: "Grand Reception & Shahi Dawat",
        date: "Sunday, December 21, 2026",
        time: "07:30 PM onwards",
        venueName: "The Grand Ballroom, Hyatt Regency Amritsar",
        address: "MBM Farms, GT Road, Amritsar, Punjab 143001",
        googleMapsUrl: "https://maps.google.com/?q=Hyatt+Regency+Amritsar",
        dressCode: "Evening Formal / Velvet & Brocade",
        description: "A magnificent evening of celebratory toasts, cake cutting, live Punjabi folk music, and an exquisite royal feast.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "sikh") {
    defaultBride = "Gurleen";
    defaultGroom = "Manpreet";
    defaultTheme = "golden-anand";
    revealStyle = "sunrise_lotus";
    culturalSymbol = "lotus";
    eyebrow = "Dhan Dhan Sri Guru Ram Das Ji & With Family Blessings";
    headline = "The Sacred Anand Karaj Ceremony";
    weddingDateText = "October 24 – 25, 2026 • New Delhi, India";
    actionButtonText = "View Sacred Invitation 🌸";
    audioNotice = "Turn on audio for serene Gurbani Raag flute";
    targetDate = "2026-10-25T10:00:00+05:30";
    venueCity = "New Delhi, India";
    religiousBlessingText = "“They are not said to be husband and wife, who merely sit together. Rather, they alone are called husband and wife, who have one soul in two bodies.”";
    groomTitle = "Son of Smt. Harpreet & Sardar Jagjit Singh Bindra";
    groomBio = "A researcher and endurance runner with a gentle spirit, who found his soulmate in Gurleen.";
    brideTitle = "Daughter of Smt. Ravinder & Sardar Amrik Singh Sethi";
    brideBio = "An environmental educator whose quiet dignity, creative mind, and warm hospitality touch every heart.";
    parentsBlessing = "“May the blessings of the Akal Purakh guide their union towards eternal love, mutual seva, and unwavering peace.”";
    events = [
      {
        id: "evt-kurmai",
        title: "Kurmai & Family Welcome",
        date: "Saturday, October 24, 2026",
        time: "11:00 AM onwards",
        venueName: "The Bindra Family Residence, Greater Kailash",
        address: "Greater Kailash II, New Delhi 110048",
        googleMapsUrl: "https://maps.google.com/?q=Greater+Kailash+New+Delhi",
        dressCode: "Pastel Kurta Pajama & Elegant Salwar Suits",
        description: "Exchange of kirpan, dry fruits, and family blessings in the presence of beloved elders.",
        icon: "sparkles",
      },
      {
        id: "evt-maiyan",
        title: "Maiyan & Sangeet Soirée",
        date: "Saturday, October 24, 2026",
        time: "06:30 PM onwards",
        venueName: "The Roseate Greens, New Delhi",
        address: "NH-8, D Block, Samalkha, New Delhi 110037",
        googleMapsUrl: "https://maps.google.com/?q=The+Roseate+New+Delhi",
        dressCode: "Peach, Ivory & Subtle Gold",
        description: "Traditional mustard rangoli, turmeric cleansing ceremony, followed by serene acoustic folk melodies.",
        icon: "music",
      },
      {
        id: "evt-anand-karaj",
        title: "The Sacred Anand Karaj (Four Laavan)",
        date: "Sunday, October 25, 2026",
        time: "09:30 AM (Asa Di Var) • 10:30 AM (Laavan)",
        venueName: "Gurdwara Sri Guru Singh Sabha",
        address: "Defence Colony, New Delhi 110024",
        googleMapsUrl: "https://maps.google.com/?q=Gurdwara+Defence+Colony+Delhi",
        dressCode: "Modest Formal Attire (Heads must be covered)",
        description: "The blissful four circumambulations of Sri Guru Granth Sahib Ji binding two souls into one, followed by Guru Ka Langar.",
        icon: "ring",
      },
      {
        id: "evt-reception",
        title: "Evening Wedding Banquet",
        date: "Sunday, October 25, 2026",
        time: "07:30 PM onwards",
        venueName: "The Ballroom, The Roseate New Delhi",
        address: "NH-8, D Block, Samalkha, New Delhi 110037",
        googleMapsUrl: "https://maps.google.com/?q=The+Roseate+New+Delhi",
        dressCode: "Evening Formal / Black-Tie Optional",
        description: "Dinner, celebratory toasts, and heartfelt family blessings for Gurleen and Manpreet.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "muslim") {
    defaultBride = "Ayesha";
    defaultGroom = "Zayan";
    defaultTheme = "noor-emerald";
    revealStyle = "silk_parchment";
    culturalSymbol = "arch";
    eyebrow = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    headline = "The Nikah & Walima Celebration";
    weddingDateText = "December 05 – 06, 2026 • Hyderabad, Telangana";
    actionButtonText = "Unfold Royal Parchment 📜";
    audioNotice = "Turn on sound for traditional Arabian Oud & Santur";
    targetDate = "2026-12-05T19:00:00+05:30";
    venueCity = "Hyderabad, Telangana, India";
    religiousBlessingText = "“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.”";
    groomTitle = "Son of Begum Sultana & Nawabzada Farhan Ahmed";
    groomBio = "A software architect and calligrapher whose patience, wit, and generosity are revered by all.";
    brideTitle = "Daughter of Begum Niloufer & Dr. Tariq Mansoor";
    brideBio = "A pediatrician whose compassionate spirit, graceful poetry, and quiet strength illuminate every room.";
    parentsBlessing = "“May Allah Ta'ala bless this marriage with boundless barakah, deep affection, and lifelong happiness.”";
    events = [
      {
        id: "evt-manjha",
        title: "Manjha & Mehendi Celebration",
        date: "Saturday, December 05, 2026",
        time: "04:30 PM onwards",
        venueName: "The Jasmine Courtyard, Taj Falaknuma Palace",
        address: "Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad 500053",
        googleMapsUrl: "https://maps.google.com/?q=Taj+Falaknuma+Palace+Hyderabad",
        dressCode: "Emerald Green, Lemon Yellow & Shimmering Gold",
        description: "Intricate floral mehendi application, folk tappa melodies, fragrant motia garlands, and evening sweets.",
        icon: "sparkles",
      },
      {
        id: "evt-nikah",
        title: "The Sacred Nikah Ceremony & Ijab-e-Qubool",
        date: "Saturday, December 05, 2026",
        time: "08:00 PM onwards",
        venueName: "The Durbar Hall, Taj Falaknuma Palace",
        address: "Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad 500053",
        googleMapsUrl: "https://maps.google.com/?q=Taj+Falaknuma+Palace+Hyderabad",
        dressCode: "Traditional Hyderabadi Khada Dupatta / Sherwani",
        description: "Solemn recitation of the Nikah Khutbah, signing of the Nikahnama, followed by Rukhsati and traditional feasts.",
        icon: "ring",
      },
      {
        id: "evt-walima",
        title: "Grand Walima Feast & Reception",
        date: "Sunday, December 06, 2026",
        time: "08:00 PM onwards",
        venueName: "The Grand Royal Banquets, Hyderabad",
        address: "Road No. 1, Banjara Hills, Hyderabad 500034",
        googleMapsUrl: "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
        dressCode: "Royal Evening Wear / Velvet & Brocade",
        description: "A lavish banquet hosted by the groom's family featuring authentic Hyderabadi Dum Biryani, Shahi Tukda, and celebrations.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "christian") {
    defaultBride = "Sarah";
    defaultGroom = "Daniel";
    defaultTheme = "cathedral-rose";
    revealStyle = "ribbon_arch";
    culturalSymbol = "cathedral";
    eyebrow = "With The Grace & Love of God Almighty";
    headline = "The Holy Matrimony Celebration";
    weddingDateText = "November 14 – 15, 2026 • Goa, India";
    actionButtonText = "Untie Ribbon & Enter 🕊️";
    audioNotice = "Turn on sound for classical cathedral choir & organ";
    targetDate = "2026-11-14T16:00:00+05:30";
    venueCity = "Goa, India";
    religiousBlessingText = "“Love is patient, love is kind. It does not envy, it does not boast, it is not proud. Love never fails.” — 1 Corinthians 13:4-8";
    groomTitle = "Son of Mrs. Martha & Mr. Joseph D'Souza";
    groomBio = "A marine engineer with an adventurous spirit and a deep devotion to family, who found his anchor in Sarah.";
    brideTitle = "Daughter of Mrs. Elizabeth & Dr. Anthony Fernandes";
    brideBio = "A concert pianist and teacher whose warmth, radiant smile, and gentle grace captivate everyone around her.";
    parentsBlessing = "“May God's infinite peace guide your marriage through every storm and every joy. What God has joined together, let no one separate.”";
    events = [
      {
        id: "evt-rehearsal",
        title: "Rehearsal Dinner & Sundowner Toasts",
        date: "Friday, November 13, 2026",
        time: "06:30 PM onwards",
        venueName: "The Seaside Verandah, Heritage Villa",
        address: "Candolim Beach Road, North Goa 403515",
        googleMapsUrl: "https://maps.google.com/?q=Candolim+Goa",
        dressCode: "Smart Resort Casual",
        description: "An intimate gathering of the bridal party, close family toasts, and candlelit seafood dinner by the ocean.",
        icon: "sparkles",
      },
      {
        id: "evt-nuptials",
        title: "The Holy Nuptials & Exchange of Vows",
        date: "Saturday, November 14, 2026",
        time: "04:00 PM onwards",
        venueName: "Church of Our Lady of the Mount",
        address: "Old Goa Heritage Complex, Goa 403402",
        googleMapsUrl: "https://maps.google.com/?q=Old+Goa+Churches",
        dressCode: "Formal Suits & Elegant Day Gowns",
        description: "Processional organ music, sacred exchange of wedding rings, holy communion, and signing of the parish register.",
        icon: "ring",
      },
      {
        id: "evt-reception",
        title: "Banquet Reception, Toast & First Dance",
        date: "Saturday, November 14, 2026",
        time: "07:00 PM onwards",
        venueName: "The Starlit Lawn, Taj Fort Aguada",
        address: "Sinquerim, Candolim, Goa 403515",
        googleMapsUrl: "https://maps.google.com/?q=Taj+Fort+Aguada+Goa",
        dressCode: "Black-Tie Optional / Evening Elegance",
        description: "Cutting of the wedding cake, champagne toasts, traditional bridal waltz, and dancing under the stars.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "modern-minimal") {
    defaultBride = "Maya";
    defaultGroom = "Julian";
    defaultTheme = "minimal-linen";
    revealStyle = "architectural_gatefold";
    culturalSymbol = "gatefold";
    eyebrow = "Together with their families";
    headline = "The Wedding of Julian & Maya";
    weddingDateText = "October 10, 2026 • Alibaug, Maharashtra";
    actionButtonText = "Open Editorial Suite 🏛️";
    audioNotice = "Turn on sound for contemporary ambient piano";
    targetDate = "2026-10-10T17:00:00+05:30";
    venueCity = "Alibaug, Maharashtra, India";
    groomTitle = "Son of Smt. Anita & Mr. David Miller";
    groomBio = "An industrial designer drawn to clean lines, good coffee, and the quiet brilliance of Maya.";
    brideTitle = "Daughter of Smt. Radhika & Mr. Rajiv Sen";
    brideBio = "A contemporary gallery curator with a discerning eye, an easy laugh, and boundless creativity.";
    parentsBlessing = "“May your partnership be grounded in deep mutual respect, gentle space to grow, and honest love.”";
    events = [
      {
        id: "evt-welcome",
        title: "Welcome Cocktails & Grazing Table",
        date: "Saturday, October 10, 2026",
        time: "04:00 PM onwards",
        venueName: "The Glass Villa Pavilion, Alibaug",
        address: "Zirad, Alibaug, Maharashtra 402201",
        googleMapsUrl: "https://maps.google.com/?q=Alibaug+Maharashtra",
        dressCode: "Minimalist Earth Tones & Monochrome",
        description: "Natural wines, artisan cheeses, and warm reunions overlooking the sunlit coastal grove.",
        icon: "sparkles",
      },
      {
        id: "evt-vows",
        title: "The Ceremony & Exchange of Vows",
        date: "Saturday, October 10, 2026",
        time: "05:30 PM (At Sunset)",
        venueName: "The Reflection Pool Terrace, Alibaug",
        address: "Zirad, Alibaug, Maharashtra 402201",
        googleMapsUrl: "https://maps.google.com/?q=Alibaug+Maharashtra",
        dressCode: "Modern Tailoring & Architectural Silhouettes",
        description: "Personal handwritten vows exchanged at dusk in an intimate circle of our closest friends and family.",
        icon: "ring",
      },
      {
        id: "evt-dinner",
        title: "Curated Dinner Soirée & Dancing",
        date: "Saturday, October 10, 2026",
        time: "07:30 PM onwards",
        venueName: "The Courtyard Amphitheatre, Alibaug",
        address: "Zirad, Alibaug, Maharashtra 402201",
        googleMapsUrl: "https://maps.google.com/?q=Alibaug+Maharashtra",
        dressCode: "Modern Cocktail",
        description: "Farm-to-table five course tasting menu, heartfelt toasts, and vinyl DJ sets until late.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "floral-garden") {
    defaultBride = "Chloe";
    defaultGroom = "Lucas";
    defaultTheme = "botanical-sage";
    revealStyle = "blooming_petals";
    culturalSymbol = "floral";
    eyebrow = "Under the open sky and among the blossoms";
    headline = "A Botanical Garden Celebration";
    weddingDateText = "September 19 – 20, 2026 • Coorg, Karnataka";
    actionButtonText = "Bloom Invitation 🌿";
    audioNotice = "Turn on sound for acoustic guitar and birdsong";
    targetDate = "2026-09-19T16:30:00+05:30";
    venueCity = "Coorg, Karnataka, India";
    groomTitle = "Son of Smt. Nalini & Mr. Thomas Wood";
    groomBio = "A landscape architect and naturalist who fell in love with Chloe's vibrant warmth and free spirit.";
    brideTitle = "Daughter of Smt. Sunita & Mr. Arvind Rao";
    brideBio = "A botanical artist and botanist whose laughter feels like a sunny afternoon in the hills.";
    parentsBlessing = "“May your love grow like a perennial garden — deep in roots, rich in color, and resilient through every season.”";
    events = [
      {
        id: "evt-garden-welcome",
        title: "Botanical High Tea & Mimosas",
        date: "Saturday, September 19, 2026",
        time: "03:30 PM onwards",
        venueName: "The Glasshouse Conservatory, Coorg",
        address: "Madikeri Estate Road, Coorg, Karnataka 571201",
        googleMapsUrl: "https://maps.google.com/?q=Coorg+Karnataka",
        dressCode: "Wildflower Pastels & Floral Prints",
        description: "Freshly brewed Coorg coffee, sparkling herbal mimosas, and floral crown workshop for guests.",
        icon: "sparkles",
      },
      {
        id: "evt-vows",
        title: "The Open Lawn Ceremony & Vows",
        date: "Saturday, September 19, 2026",
        time: "05:00 PM (Golden Hour)",
        venueName: "The Wildflower Meadow, Coorg",
        address: "Madikeri Estate Road, Coorg, Karnataka 571201",
        googleMapsUrl: "https://maps.google.com/?q=Coorg+Karnataka",
        dressCode: "Romantic Garden Semi-Formal",
        description: "Vows exchanged under an arbor of eucalyptus, wild roses, and jasmine with acoustic guitar accompaniment.",
        icon: "ring",
      },
      {
        id: "evt-starlit-dinner",
        title: "Starlit Long-Table Feast & Bonfire",
        date: "Saturday, September 19, 2026",
        time: "07:30 PM onwards",
        venueName: "The Canopy Lawn & Coffee Grove",
        address: "Madikeri Estate Road, Coorg, Karnataka 571201",
        googleMapsUrl: "https://maps.google.com/?q=Coorg+Karnataka",
        dressCode: "Garden Elegance",
        description: "Candlelit feast under fairy-lit canopies, toasted s'mores by the stone fireplace, and folk acoustic sets.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "luxury-destination") {
    defaultBride = "Natasha";
    defaultGroom = "Kabir";
    defaultTheme = "coastal-azure";
    revealStyle = "passport_boarding";
    culturalSymbol = "compass";
    eyebrow = "Your First Class Invitation & Boarding Pass";
    headline = "The Destination Wedding of Kabir & Natasha";
    weddingDateText = "November 06 – 08, 2026 • South Goa, India";
    actionButtonText = "Open Boarding Pass ✈️";
    audioNotice = "Turn on sound for sunset beach lounge beats";
    targetDate = "2026-11-07T17:00:00+05:30";
    venueCity = "South Goa, India";
    groomTitle = "Son of Smt. Ritu & Mr. Sanjeev Mehra";
    groomBio = "A venture investor and avid surfer who found his greatest adventure and true home in Natasha.";
    brideTitle = "Daughter of Smt. Poonam & Mr. Deepak Singhal";
    brideBio = "A fashion brand founder whose adventurous heart and radiant energy make every destination unforgettable.";
    parentsBlessing = "“May your voyage through life together be blessed with calm seas, joyful discoveries, and infinite love.”";
    events = [
      {
        id: "evt-sundowner",
        title: "Sunset Beach Welcome & Coconut Bar",
        date: "Friday, November 06, 2026",
        time: "05:00 PM onwards",
        venueName: "The Beach Shack, The Leela Goa",
        address: "Mobor Beach, Cavelossim, Goa 403731",
        googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
        dressCode: "Tropical White & Linen Chic",
        description: "Barefoot beach welcome with fresh coconuts, tropical sundowners, live saxophone, and seaside bonfire.",
        icon: "sparkles",
      },
      {
        id: "evt-beach-mehendi",
        title: "Coastal Mehendi & Pool Party",
        date: "Saturday, November 07, 2026",
        time: "11:00 AM onwards",
        venueName: "The Lagoon Pavilion, The Leela Goa",
        address: "Mobor Beach, Cavelossim, Goa 403731",
        googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
        dressCode: "Aqua, Turquoise & Sunshine Yellow",
        description: "Mehendi artists, tropical fruit platters, poolside acoustic beats, and refreshing handcrafted cocktails.",
        icon: "music",
      },
      {
        id: "evt-vows",
        title: "Oceanfront Sunset Vows & Pheras",
        date: "Saturday, November 07, 2026",
        time: "05:15 PM (At Sunset)",
        venueName: "The Ocean View Mandap, The Leela Goa",
        address: "Mobor Beach, Cavelossim, Goa 403731",
        googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
        dressCode: "Pastel Resort Formal",
        description: "Exchanging eternal vows on the white sands of Mobor beach as the sun dips into the Arabian Sea.",
        icon: "ring",
      },
      {
        id: "evt-gala",
        title: "The Coastal Gala Night & Fire Dancers",
        date: "Saturday, November 07, 2026",
        time: "08:30 PM onwards",
        venueName: "The Grand Coconut Grove, The Leela Goa",
        address: "Mobor Beach, Cavelossim, Goa 403731",
        googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
        dressCode: "Boho Luxe / Resort Glamour",
        description: "Gourmet coastal seafood feast, signature cocktails, international fire acrobatics, and dancing under the stars.",
        icon: "party",
      },
      {
        id: "evt-brunch",
        title: "Farewell Champagne & Sunshine Brunch",
        date: "Sunday, November 08, 2026",
        time: "10:30 AM onwards",
        venueName: "The Riverside Terrace, The Leela Goa",
        address: "Mobor Beach, Cavelossim, Goa 403731",
        googleMapsUrl: "https://maps.google.com/?q=The+Leela+Goa",
        dressCode: "Breezy Casual Resort Wear",
        description: "A lazy morning by the river Sal featuring fresh pastries, mimosas, heartfelt hugs, and safe travel wishes.",
        icon: "sun",
      },
    ];
  } else if (collectionKey === "elegant-contemporary") {
    defaultBride = "Tara";
    defaultGroom = "Siddharth";
    defaultTheme = "velvet-onyx";
    revealStyle = "velvet_wax_seal";
    culturalSymbol = "velvet";
    eyebrow = "Cordially request the pleasure of your company";
    headline = "A Black-Tie Wedding Gala";
    weddingDateText = "December 30, 2026 • New Delhi, India";
    actionButtonText = "Break The Wax Seal 🕯️";
    audioNotice = "Turn on sound for smooth jazz saxophone";
    targetDate = "2026-12-30T19:00:00+05:30";
    venueCity = "New Delhi, India";
    groomTitle = "Son of Smt. Shobha & Mr. Arvind Nambiar";
    groomBio = "A criminal defense barrister whose sharp intellect is matched only by his deep devotion to Tara.";
    brideTitle = "Daughter of Smt. Preeti & Mr. Vikramaditya Oberoi";
    brideBio = "A luxury brand director whose effortless poise, quick wit, and generous heart light up every room.";
    parentsBlessing = "“May your union be blessed with enduring friendship, profound laughter, and timeless grace.”";
    events = [
      {
        id: "evt-champagne",
        title: "Champagne Reception & Jazz Hour",
        date: "Wednesday, December 30, 2026",
        time: "07:00 PM onwards",
        venueName: "The Grand Ballroom Foyer, The Imperial New Delhi",
        address: "Janpath, Connaught Place, New Delhi 110001",
        googleMapsUrl: "https://maps.google.com/?q=The+Imperial+New+Delhi",
        dressCode: "Black-Tie (Tuxedos & Evening Gowns)",
        description: "Vintage vintage champagne flutes, live jazz trio, caviar blinis, and greeting of honored guests.",
        icon: "sparkles",
      },
      {
        id: "evt-vows",
        title: "The Twilight Vows & Ceremony",
        date: "Wednesday, December 30, 2026",
        time: "08:15 PM onwards",
        venueName: "The Glass Palm Court, The Imperial New Delhi",
        address: "Janpath, Connaught Place, New Delhi 110001",
        googleMapsUrl: "https://maps.google.com/?q=The+Imperial+New+Delhi",
        dressCode: "Black-Tie",
        description: "Exchange of rings and solemn vows surrounded by towering palms and hundreds of glowing pillar candles.",
        icon: "ring",
      },
      {
        id: "evt-dinner",
        title: "Candlelit Gala Dinner & Midnight Toasts",
        date: "Wednesday, December 30, 2026",
        time: "09:30 PM onwards",
        venueName: "The Royal Ballroom, The Imperial New Delhi",
        address: "Janpath, Connaught Place, New Delhi 110001",
        googleMapsUrl: "https://maps.google.com/?q=The+Imperial+New+Delhi",
        dressCode: "Black-Tie",
        description: "Four-course silver service banquet, heartfelt speeches, midnight countdown, and private DJ lounge until late.",
        icon: "party",
      },
    ];
  } else if (collectionKey === "luxury-wedding") {
    defaultBride = "Seraphina";
    defaultGroom = "Alexander";
    defaultTheme = "champagne-gold";
    revealStyle = "wax_seal";
    culturalSymbol = "monogram";
    eyebrow = "Together with their families";
    headline = "A Celebration of Love & Destiny";
    weddingDateText = "Saturday, September 19, 2026 • Lake Como, Italy";
    actionButtonText = "Unfold Invitation Folio ✨";
    audioNotice = "Turn on sound for classical piano & strings";
    targetDate = "2026-09-19T16:30:00+02:00";
    venueCity = "Villa Balbiano, Lake Como, Italy";
    religiousBlessingText = "“Two souls with but a single thought, two hearts that beat as one.” — John Keats";
    groomTitle = "Son of Lady Eleanor & Lord Arthur Sterling";
    groomBio = "An architectural visionary whose devotion, warmth, and steady grace found their ultimate muse in Seraphina.";
    brideTitle = "Daughter of Dr. Victoria & Ambassador Charles Montgomery";
    brideBio = "A classical pianist and curator whose radiant elegance, boundless empathy, and joyful laughter illuminate every room.";
    parentsBlessing = "“May your union be blessed with deep affection, timeless grace, unwavering courage, and boundless laughter through every season of life.”";
    events = [
      {
        id: "evt-welcome-soiree",
        title: "Sunset Welcome Soirée & Bellini Toast",
        date: "Friday, September 18, 2026",
        time: "06:00 PM onwards",
        venueName: "The Terrace Gardens, Villa Balbiano",
        address: "Piazza Carducci, Ossuccio, Lake Como, Italy",
        googleMapsUrl: "https://maps.google.com/?q=Villa+Balbiano+Lake+Como",
        dressCode: "Cocktail Chic (Linen & Summer Pastels)",
        description: "Crisp prosecco, acoustic strings by the water, artisan antipasti, and welcoming toasts under the Alpine twilight.",
        icon: "sparkles",
      },
      {
        id: "evt-vows",
        title: "The Sacred Vows & Exchange of Rings",
        date: "Saturday, September 19, 2026",
        time: "04:30 PM (At Golden Hour)",
        venueName: "The Lakeside Cypress Lawn, Villa Balbiano",
        address: "Piazza Carducci, Ossuccio, Lake Como, Italy",
        googleMapsUrl: "https://maps.google.com/?q=Villa+Balbiano+Lake+Como",
        dressCode: "Black-Tie (Tuxedos & Evening Gowns)",
        description: "Processional harp accompaniment, solemn exchange of vows, and golden rose petals by the calm waters of Lake Como.",
        icon: "ring",
      },
      {
        id: "evt-gala-dinner",
        title: "Grand Gala Dinner & Midnight Dance",
        date: "Saturday, September 19, 2026",
        time: "07:30 PM onwards",
        venueName: "The Grand Marquee & Salone, Villa Balbiano",
        address: "Piazza Carducci, Ossuccio, Lake Como, Italy",
        googleMapsUrl: "https://maps.google.com/?q=Villa+Balbiano+Lake+Como",
        dressCode: "Black-Tie Formal",
        description: "Four-course Michelin-inspired Italian banquet, vintage champagne toasts, cutting of the millefoglie, and dancing under the stars.",
        icon: "party",
      },
      {
        id: "evt-brunch",
        title: "Farewell Champagne Brunch",
        date: "Sunday, September 20, 2026",
        time: "11:00 AM onwards",
        venueName: "The Lakefront Pergola, Grand Hotel Tremezzo",
        address: "Via Regina 8, Tremezzo, Lake Como, Italy",
        googleMapsUrl: "https://maps.google.com/?q=Grand+Hotel+Tremezzo",
        dressCode: "Resort Casual / Riviera Whites",
        description: "Freshly brewed espresso, artisan pastries, bellinis, and warm farewell embraces before departure.",
        icon: "sparkles",
      },
    ];
  }

  // Use customer passed names if present, otherwise authentic defaults
  const finalBride = brideName && brideName.trim() ? brideName.trim() : defaultBride;
  const finalGroom = groomName && groomName.trim() ? groomName.trim() : defaultGroom;
  const brideInitial = finalBride.charAt(0).toUpperCase() || "B";
  const groomInitial = finalGroom.charAt(0).toUpperCase() || "G";
  const monogram = `${groomInitial} & ${brideInitial}`;
  const coupleTitle = `${finalGroom} & ${finalBride}`;

  const sections: WebsiteSectionData[] = [
    {
      id: "sec-wedding-opening",
      type: "wedding_opening",
      title: "1. Invitation Unboxing Reveal",
      enabled: true,
      order: 0,
      config: {
        revealStyle,
        eyebrow,
        monogram,
        headline,
        coupleNames: coupleTitle,
        weddingDateText,
        actionButtonText,
        skipButtonText: "Enter Directly",
        audioNotice,
        religiousBlessingText,
        culturalSymbol,
      },
    },
    {
      id: "sec-wedding-couple",
      type: "wedding_couple",
      title: "2. The Couple & Families",
      enabled: true,
      order: 1,
      config: {
        headline: "The Bride & Groom 💍",
        subtext: "Surrounded by the warmth of family, sacred traditions, and eternal love.",
        groomName: finalGroom,
        groomTitle,
        groomBio,
        groomPhotoUrl: "/images/royal/groom_portrait.jpg",
        brideName: finalBride,
        brideTitle,
        brideBio,
        bridePhotoUrl: "/images/royal/bride_portrait.jpg",
        parentsBlessing,
      },
    },
    {
      id: "sec-wedding-countdown",
      type: "wedding_countdown",
      title: "3. Auspicious Countdown",
      enabled: true,
      order: 2,
      config: {
        headline: "Counting The Moments To Forever ⏳",
        subtext: `Until the auspicious hour when ${finalGroom} and ${finalBride} unite their lives in sacred marriage.`,
        targetDate,
        venueCity,
        calendarAddToGoogleUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+Celebration+of+${encodeURIComponent(finalGroom)}+and+${encodeURIComponent(finalBride)}&location=${encodeURIComponent(venueCity)}`,
      },
    },
    {
      id: "sec-wedding-events",
      type: "wedding_events",
      title: "4. Celebrations & Itinerary",
      enabled: true,
      order: 3,
      config: {
        headline: "Celebration Itinerary & Agenda 🎊",
        subtext: "We eagerly anticipate your gracious presence at each of our sacred ceremonies and celebratory gatherings.",
        events,
        ...(collectionKey === "punjabi"
          ? {
              ceremonyType: "sikh",
              ceremonyVenueName: "The Heritage Haveli Gurdwara, Amritsar",
              ceremonyAddress: "GT Road, Amritsar, Punjab 143001",
              ceremonyTime: "10:30 AM (Baraat & Swagat) • 11:30 AM (Anand Karaj)",
              ceremonyDate: "Sunday, December 21, 2026",
              ceremonyMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
              ceremonyReligiousQuote: "ਧਨੁ ਪਿਰੁ ਏਹਿ ਨ ਆਖੀਅਨਿ ਬਹਨਿ ਇਕਠੇ ਹੋਇ ॥ ਏਕ ਜੋਤਿ ਦੁਇ ਮੂਰਤੀ ਧਨੁ ਪਿਰੁ ਕਹੀਐ ਸੋਇ ॥",
              ceremonyDescription: "The sacred Four Laavan uniting two souls into one light in the divine presence of Sri Guru Granth Sahib Ji.",
              showLaavanExplanation: true,
              jaggoConfig: {
                enabled: true,
                title: "Raat Jaggo Di • Courtyard Celebration",
                description: "Carry the glowing brass Jaggo on your head, sing boliya, and ignite the night with vibrant dhol beats!",
              },
              baraatConfig: {
                enabled: true,
                title: "Shahi Baraat & Swagat",
                time: "10:30 AM onwards",
                description: "The royal procession on the adorned steed with live dholis, bhangra dance, and warm Milni garland ceremony.",
              },
            }
          : collectionKey === "sikh"
          ? {
              ceremonyType: "sikh",
              ceremonyVenueName: "Gurdwara Sri Guru Singh Sabha",
              ceremonyAddress: "Defence Colony, New Delhi 110024",
              ceremonyTime: "09:30 AM (Asa Di Var) • 10:30 AM (Anand Karaj)",
              ceremonyDate: "Sunday, October 25, 2026",
              ceremonyMapsUrl: "https://maps.google.com/?q=Gurdwara+Defence+Colony+Delhi",
              ceremonyReligiousQuote: "ਧਨੁ ਪਿਰੁ ਏਹਿ ਨ ਆਖੀਅਨਿ ਬਹਨਿ ਇਕਠੇ ਹੋਇ ॥ ਏਕ ਜੋਤਿ ਦੁਇ ਮੂਰਤੀ ਧਨੁ ਪਿਰੁ ਕਹੀਐ ਸੋਇ ॥",
              ceremonyDescription: "The sacred Anand Karaj ceremony with Four Laavan uniting two souls in eternal spiritual devotion.",
              showLaavanExplanation: true,
              jaggoConfig: {
                enabled: true,
                title: "Sangeet & Jaggo Night",
                description: "Joyful Punjabi folk singing, giddha boliya, and traditional glowing brass pots.",
              },
              baraatConfig: {
                enabled: true,
                title: "Baraat Arrival & Milni",
                time: "09:30 AM onwards",
                description: "Assembly of the groom's procession followed by the dignified Milni garland exchange between elders.",
              },
            }
          : {}),
      },
    },
    {
      id: "sec-wedding-story",
      type: "wedding_story",
      title: "5. Our Love Story",
      enabled: true,
      order: 4,
      config: {
        headline: "Our Journey to Forever 💫",
        romanticQuote: "“From an unplanned first coffee in the rain to this sacred promise — every chapter was worth the wait.”",
        chapters: [
          {
            id: "chap-1",
            year: "Winter 2021",
            title: "The First Serendipitous Hello",
            story: "Introduced by mutual friends during a cozy December evening, our conversation flowed effortlessly until closing time.",
            photoUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "chap-2",
            year: "Spring 2023",
            title: "When Two Worlds Became One",
            story: "Spontaneous weekend road trips, sharing deep dreams, and learning each other's quiet quirks and family traditions.",
            photoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          },
          {
            id: "chap-3",
            year: "Autumn 2025",
            title: "The Starlit Promise",
            story: "On a quiet cliffside overlooking the ocean, under a canopy of stars, he whispered the question she had long carried in her heart.",
            photoUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    },
    {
      id: "sec-wedding-gallery",
      type: "wedding_gallery",
      title: "6. Portrait Gallery",
      enabled: true,
      order: 5,
      config: {
        headline: "Captured Moments of Love 📸",
        subtext: "Glimpses of quiet smiles, grand milestones, and cherished memories leading to this day.",
        photos: [
          {
            id: "gal-1",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
            caption: "The engagement glow under sunset lights",
            category: "Engagement",
          },
          {
            id: "gal-2",
            url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
            caption: "Laughter in the quiet streets of the old city",
            category: "Portraits",
          },
          {
            id: "gal-3",
            url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80",
            caption: "Sunset promises and gentle glances",
            category: "Candid",
          },
          {
            id: "gal-4",
            url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=900&q=80",
            caption: "Surrounded by the green hills of our dreams",
            category: "Pre-Wedding",
          },
        ],
      },
    },
    {
      id: "sec-wedding-rsvp",
      type: "wedding_rsvp",
      title: "7. Guest RSVP Engine",
      enabled: true,
      order: 6,
      config: {
        headline: "Will You Celebrate With Us? 💌",
        subtext: "Your gracious presence and blessings will make our celebrations truly unforgettable. Please confirm your attendance below.",
        rsvpDeadlineText: "Kindly RSVP by November 15, 2026",
        enableMealPreferences: true,
        enablePlusOnes: true,
        enableBlessings: true,
        confirmationMessage: "Thank you for confirming your presence. Our families eagerly await the joy of celebrating this sacred union with you!",
      },
    },
    {
      id: "sec-wedding-travel",
      type: "wedding_travel",
      title: "8. Accommodations & Travel Logistics",
      enabled: true,
      order: 7,
      config: {
        headline: "Hospitality, Travel & Accommodations ✈️",
        subtext: "We want your journey to be effortless, comfortable, and celebratory from the moment you arrive.",
        nearestAirport: "Nearest Airport: 30 minutes direct drive with dedicated family shuttles available.",
        nearestRailway: "Nearest Central Railway Station: 25 minutes by taxi.",
        hotelAccommodations: "Complimentary luxury guest rooms have been reserved for out-of-town guests.",
        shuttleNotes: "Airport shuttles will operate hourly on celebration days.",
        conciergeName: "Hospitality Help Desk",
        conciergePhone: "+91 98765 43210",
      },
    },
    {
      id: "sec-wedding-wishes",
      type: "wedding_wishes",
      title: "9. Family Blessings & WhatsApp Sharing",
      enabled: true,
      order: 8,
      config: {
        headline: "With Love & Family Blessings 🤍",
        subtext: "Our journey begins with the love, warmth, and prayers of all our cherished elders and dear friends.",
        closingNote: "We look forward to welcoming you with folded hands, warm hugs, and festive feasts.",
        familySignoff: "With Warm Regards & Best Compliments:\nBoth Families & Relatives",
        whatsappShareText: `You are cordially invited to celebrate the wedding of ${finalGroom} & ${finalBride}. Please view our interactive digital invitation here:`,
      },
    },
  ];

  return {
    slug,
    title: `The Wedding of ${finalGroom} & ${finalBride} 💍`,
    recipientName: `${finalGroom} & ${finalBride}`,
    senderName: "The Families",
    partner1Name: finalBride,
    partner2Name: finalGroom,
    occasionType: "wedding",
    categoryId: "wedding-invitations",
    subcategoryId: `sub-${collectionKey}`,
    templateId: `template-wedding-${collectionKey}`,
    weddingDetails: {
      brideName: finalBride,
      groomName: finalGroom,
      weddingDate: weddingDateText,
      venueCity,
      collection: collectionKey,
      rsvpDeadline: "November 15, 2026",
      guestCountEstimate: 250,
    },
    theme: defaultTheme as any,
    status: "draft",
    sections,
    audioSettings: {
      enabled: true,
      backgroundMusicUrl,
      title: "Wedding Heritage Melody",
      artist: "ExpertoMemories Soundtrack",
      autoplay: false,
    },
  };
}

const weddingTemplate = {
  normalizeWeddingCollection,
  createDefaultWeddingProject,
  CANONICAL_WEDDING_COLLECTIONS,
  VALID_WEDDING_COLLECTIONS,
};

export default weddingTemplate;
