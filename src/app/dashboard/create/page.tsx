"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Loader2,
  Calendar,
  Gift,
  ChevronLeft,
  Check,
  Cake,
  Mail,
  Disc,
  Star,
  Ticket,
  Smile,
  Flame,
  AlertCircle,
} from "lucide-react";
import { ALL_THEME_IDS } from "@/lib/validations/project.schema";
import { normalizeWeddingCollection } from "@/config/wedding-template";

export const WEDDING_COLLECTION_OPTIONS = [
  {
    id: "luxury-wedding",
    label: "The Luxury Atelier",
    subtitle: "Haute Couture Folio",
    theme: "champagne-gold" as const,
    defaultBride: "Seraphina",
    defaultGroom: "Alexander",
    defaultDate: "September 18 – 20, 2026 • Lake Como",
    defaultTitle: "The Luxury Wedding Celebration 🥂✨",
    emblem: "🥂",
  },
  {
    id: "royal-indian",
    label: "The Rajwada",
    subtitle: "Royal Indian Palace",
    theme: "royal-crimson" as const,
    defaultBride: "Roshni",
    defaultGroom: "Aarav",
    defaultDate: "December 14 – 15, 2026 • Jaipur, Rajasthan",
    defaultTitle: "The Royal Wedding Celebration 💍✨",
    emblem: "👑",
  },
  {
    id: "traditional-hindu",
    label: "The Sacred Vivah",
    subtitle: "Traditional Hindu",
    theme: "marigold-sindoor" as const,
    defaultBride: "Priya",
    defaultGroom: "Vikram",
    defaultDate: "November 28 – 29, 2026 • Varanasi, UP",
    defaultTitle: "The Sacred Vivah Celebration 🪷",
    emblem: "🪷",
  },
  {
    id: "punjabi",
    label: "The Shahi Celebration",
    subtitle: "Vibrant Punjabi",
    theme: "marigold-sindoor" as const,
    defaultBride: "Simran",
    defaultGroom: "Harpreet",
    defaultDate: "December 20 – 21, 2026 • Amritsar, Punjab",
    defaultTitle: "The Shahi Punjabi Celebration 🥁",
    emblem: "🥁",
  },
  {
    id: "muslim",
    label: "The Noor-e-Nikah",
    subtitle: "Mughal Nikah & Walima",
    theme: "noor-emerald" as const,
    defaultBride: "Zoya",
    defaultGroom: "Farhan",
    defaultDate: "January 16 – 17, 2027 • Hyderabad",
    defaultTitle: "The Noor-e-Nikah Celebration 🌙",
    emblem: "🌙",
  },
  {
    id: "christian",
    label: "The Cathedral Romance",
    subtitle: "Timeless Cathedral",
    theme: "cathedral-rose" as const,
    defaultBride: "Hannah",
    defaultGroom: "Julian",
    defaultDate: "December 05 – 06, 2026 • Goa",
    defaultTitle: "The Cathedral Romance Celebration 🕊️",
    emblem: "🕊️",
  },
  {
    id: "luxury-destination",
    label: "The Coastal Horizon",
    subtitle: "Luxury Seaside Resort",
    theme: "coastal-azure" as const,
    defaultBride: "Ananya",
    defaultGroom: "Rohan",
    defaultDate: "January 08 – 10, 2027 • Udaipur",
    defaultTitle: "The Coastal Destination Celebration 🌊",
    emblem: "🌊",
  },
];

interface OccasionMeta {
  type: "apology" | "anniversary" | "birthday" | "love" | "wedding";
  occasionBadge: "APOLOGY" | "ANNIVERSARY" | "BIRTHDAY" | "LOVE & ROMANCE" | "ROYAL WEDDING";
  occasionTitle: string;
  experienceName: string;
  description: string;
  defaultTheme: (typeof ALL_THEME_IDS)[number];
  defaultTitle: string;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
  };
  features: string[];
}

const OCCASIONS: OccasionMeta[] = [
  {
    type: "wedding",
    occasionBadge: "ROYAL WEDDING",
    occasionTitle: "Digital Wedding Invitation",
    experienceName: "The Royal Wedding Collection",
    description:
      "A grand bespoke wedding website with animated palace doors, multi-event agendas, Google Maps, guest RSVP tracking, and royal music.",
    defaultTheme: "royal-crimson",
    defaultTitle: "The Royal Wedding Celebration 💍✨",
    badgeStyle: {
      bg: "bg-amber-100",
      text: "text-amber-950",
      border: "border-amber-400",
    },
    features: ["Palace Door Reveal Ceremony", "Multi-Event Agenda & Maps", "Guest RSVP Attendance Tracker", "Love Story & Portraits"],
  },
  {
    type: "love",
    occasionBadge: "LOVE & ROMANCE",
    occasionTitle: "Love & Romance Website",
    experienceName: "The Secret World of Us",
    description:
      "Create a romantic experience filled with love letters, interactive questions, secret messages, romantic puzzles, and beautiful surprises.",
    defaultTheme: "burgundy-velvet",
    defaultTitle: "The Secret World of Us ❤️",
    badgeStyle: {
      bg: "bg-[#541D2B]/10",
      text: "text-[#541D2B]",
      border: "border-[#541D2B]/25",
    },
    features: ["Interactive Romantic Choices", "Starlit Love Constellation", "Wax-Sealed Secret Letters", "Romantic Love Puzzle"],
  },
  {
    type: "anniversary",
    occasionBadge: "ANNIVERSARY",
    occasionTitle: "Anniversary Website",
    experienceName: "Our Forever Story",
    description:
      "Celebrate your journey with romantic timelines, milestone memories, interactive experiences, and your soundtrack.",
    defaultTheme: "pink-paradise",
    defaultTitle: "Our Forever Story ❤️",
    badgeStyle: {
      bg: "bg-amber-100",
      text: "text-amber-900",
      border: "border-amber-300",
    },
    features: ["Romantic Journey Timeline", "Milestone Polaroid Gallery", "Vinyl Soundtrack Player", "Our Future Bucket List"],
  },
  {
    type: "birthday",
    occasionBadge: "BIRTHDAY",
    occasionTitle: "Birthday Website",
    experienceName: "The Birthday Wonderland",
    description:
      "Create a magical birthday surprise with interactive cakes, candle celebrations, wishes, photo memories, and fun games.",
    defaultTheme: "golden-champagne",
    defaultTitle: "The Birthday Wonderland 🎂✨",
    badgeStyle: {
      bg: "bg-purple-100",
      text: "text-purple-900",
      border: "border-purple-300",
    },
    features: ["Interactive 3D Cake & Candle", "Blow Candles Celebration", "Floating Wish Balloons", "Memory Scrapbook"],
  },
  {
    type: "apology",
    occasionBadge: "APOLOGY",
    occasionTitle: "Apology Website",
    experienceName: "A Little Sorry, A Lot of Love",
    description:
      "Make things right with heartfelt apology letters, forgiveness games, cute coupon books, and emotional surprises.",
    defaultTheme: "cotton-candy",
    defaultTitle: "A Little Sorry, A Lot of Love 💌",
    badgeStyle: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      border: "border-rose-300",
    },
    features: ["Heartfelt Letters", "Forgiveness Mini-Game", "Cute Love Coupons", "Apology Photo Wall"],
  },
];

function CreateCustomerWebsiteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const occasionParam = searchParams.get("occasion") as any;
  const relationshipParam = searchParams.get("relationship") as any;
  const collectionParam = searchParams.get("collection") as string | null;

  const validOccasion: "apology" | "anniversary" | "birthday" | "love" | "wedding" =
    occasionParam && ["apology", "anniversary", "birthday", "love", "wedding"].includes(occasionParam)
      ? occasionParam
      : "wedding";

  const initialMeta = OCCASIONS.find((o) => o.type === validOccasion) || OCCASIONS[0];
  const initialCollectionKey = (collectionParam && normalizeWeddingCollection(collectionParam)) || "royal-indian";
  const initialWeddingOption =
    WEDDING_COLLECTION_OPTIONS.find((c) => c.id === initialCollectionKey) ||
    WEDDING_COLLECTION_OPTIONS[0];

  const [occasionType, setOccasionType] = useState<"apology" | "anniversary" | "birthday" | "love" | "wedding">(validOccasion);
  const [recipientType, setRecipientType] = useState<string>(relationshipParam || "general");
  const [weddingCollection, setWeddingCollection] = useState<string>(initialCollectionKey);
  const [title, setTitle] = useState(
    validOccasion === "wedding" ? initialWeddingOption.defaultTitle : initialMeta.defaultTitle
  );
  const [recipientName, setRecipientName] = useState(
    validOccasion === "wedding"
      ? `${initialWeddingOption.defaultBride} & ${initialWeddingOption.defaultGroom}`
      : ""
  );
  const [senderName, setSenderName] = useState("");
  const [partner1Name, setPartner1Name] = useState(
    validOccasion === "wedding" ? initialWeddingOption.defaultBride : ""
  );
  const [partner2Name, setPartner2Name] = useState(
    validOccasion === "wedding" ? initialWeddingOption.defaultGroom : ""
  );
  const [anniversaryDate, setAnniversaryDate] = useState(
    validOccasion === "wedding" ? initialWeddingOption.defaultDate : ""
  );
  const [birthdayDate, setBirthdayDate] = useState("");
  const [theme, setTheme] = useState(
    validOccasion === "wedding" ? initialWeddingOption.theme : initialMeta.defaultTheme
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [productVisibility, setProductVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/settings/pricing", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.pricing?.products) {
          const map: Record<string, boolean> = {};
          d.pricing.products.forEach((p: any) => {
            map[p.slug.toLowerCase()] = p.isActive !== false;
            map[p.occasionType.toLowerCase()] = p.isActive !== false;
          });
          setProductVisibility(map);
        }
      })
      .catch(() => {});
  }, []);

  const isCurrentOccasionHidden = productVisibility[occasionType.toLowerCase()] === false;

  const activeOccasion = OCCASIONS.find((o) => o.type === occasionType) || OCCASIONS[0];

  const handleSelectOccasion = (type: "apology" | "anniversary" | "birthday" | "love" | "wedding") => {
    if (productVisibility[type.toLowerCase()] === false) {
      setErrorMsg("This experience is currently unavailable for new creations.");
      return;
    }
    setErrorMsg("");
    setOccasionType(type);
    const meta = OCCASIONS.find((o) => o.type === type);
    if (meta) {
      if (type === "wedding") {
        const opt =
          WEDDING_COLLECTION_OPTIONS.find((c) => c.id === weddingCollection) ||
          WEDDING_COLLECTION_OPTIONS[0];
        setTitle(opt.defaultTitle);
        setTheme(opt.theme);
        setPartner1Name(opt.defaultBride);
        setPartner2Name(opt.defaultGroom);
        setRecipientName(`${opt.defaultBride} & ${opt.defaultGroom}`);
        setAnniversaryDate(opt.defaultDate);
      } else {
        setTitle(meta.defaultTitle);
        setTheme(meta.defaultTheme);
      }
    }
  };

  const handleSelectWeddingCollection = (colId: string) => {
    setWeddingCollection(colId);
    const opt = WEDDING_COLLECTION_OPTIONS.find((c) => c.id === colId);
    if (opt) {
      setTitle(opt.defaultTitle);
      setTheme(opt.theme);
      setPartner1Name(opt.defaultBride);
      setPartner2Name(opt.defaultGroom);
      setRecipientName(`${opt.defaultBride} & ${opt.defaultGroom}`);
      setAnniversaryDate(opt.defaultDate);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCurrentOccasionHidden) {
      setErrorMsg("This experience is currently unavailable for new creations. Please select another celebration.");
      return;
    }

    // Map names according to occasion
    let finalRecipient = recipientName.trim();
    let finalSender = senderName.trim();

    if (occasionType === "wedding" || occasionType === "anniversary" || occasionType === "love") {
      if (!partner1Name.trim() || !partner2Name.trim()) {
        setErrorMsg("Please enter both partner names.");
        return;
      }
      finalRecipient = partner1Name.trim();
      finalSender = partner2Name.trim();
    } else {
      if (!finalRecipient || !finalSender) {
        setErrorMsg("Please enter both recipient and sender names.");
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || `${finalRecipient}'s Gift Website`,
          occasionType,
          recipientName: finalRecipient,
          senderName: finalSender,
          partner1Name: partner1Name.trim() || finalRecipient,
          partner2Name: partner2Name.trim() || finalSender,
          anniversaryDate: anniversaryDate.trim() || undefined,
          birthdayDate: birthdayDate.trim() || undefined,
          recipientType: occasionType === "birthday" ? recipientType : undefined,
          subcategoryId: occasionType === "wedding" ? weddingCollection : undefined,
          weddingDetails:
            occasionType === "wedding"
              ? {
                  collection: weddingCollection,
                  brideName: finalRecipient,
                  groomName: finalSender,
                }
              : undefined,
          theme,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.project) {
        throw new Error(data.error || "Failed to create gift website");
      }

      // Redirect into customer visual editor
      router.push(`/editor/${data.project._id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-sans">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-serif mb-6 transition-colors"
      >
        <ChevronLeft size={14} />
        <span>Back to My Websites</span>
      </Link>

      {/* Main Header */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#541D2B]/10 text-[#541D2B] text-xs font-semibold mb-3 border border-[#541D2B]/15">
          <Sparkles size={13} className="text-[#541D2B]" />
          <span>EXPERTO MEMORIES STUDIO</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Create Your Personalized Gift Website
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-2xl leading-relaxed">
          Choose the occasion you are celebrating, add your names, and start creating something unforgettable. Customize and preview everything for free before publishing.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-10">
        {/* Step 1: Occasion Selection */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-stone-200/80">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#541D2B] uppercase block">
                STEP 1 &bull; OCCASION SELECTION
              </span>
              <h2 className="text-sm sm:text-base font-serif font-bold tracking-wide uppercase text-stone-900 mt-0.5">
                FIRST, CHOOSE YOUR GIFT EXPERIENCE
              </h2>
            </div>
            <span className="text-xs text-stone-500">
              Selected: <strong className="text-[#541D2B]">{activeOccasion.occasionBadge}</strong>
            </span>
          </div>

          {/* Warning Banner if selected occasion is hidden */}
          {isCurrentOccasionHidden && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">This experience is currently unavailable for new creations.</p>
                <p className="text-[11px] text-amber-800">Please select one of our available celebration experiences below.</p>
              </div>
            </div>
          )}

          {/* 4 Premium Selection Cards: Desktop 2 cols, Tablet 2 cols, Mobile 1 col */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {OCCASIONS.map((occ) => {
              const isSelected = occasionType === occ.type;
              const isHidden = productVisibility[occ.type.toLowerCase()] === false;
              return (
                <div
                  key={occ.type}
                  onClick={() => !isHidden && handleSelectOccasion(occ.type)}
                  role="button"
                  tabIndex={isHidden ? -1 : 0}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !isHidden) {
                      handleSelectOccasion(occ.type);
                    }
                  }}
                  className={`p-5 sm:p-6 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden group ${
                    isHidden
                      ? "border-stone-200 bg-stone-100/60 opacity-60 cursor-not-allowed"
                      : isSelected
                      ? "border-[#541D2B] bg-[#541D2B]/[0.025] shadow-xl shadow-[#541D2B]/10 ring-2 ring-[#541D2B]/20 cursor-pointer"
                      : "border-stone-200 bg-white hover:border-[#541D2B]/40 hover:shadow-md hover:bg-[#FAF7F2]/40 cursor-pointer"
                  }`}
                >
                  {/* Selected Pill Accent */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#541D2B]/10 to-transparent pointer-events-none rounded-tr-3xl" />
                  )}

                  <div>
                    {/* Header Row: Occasion Badge & Selection Indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-mono font-extrabold tracking-wider uppercase border shadow-2xs ${occ.badgeStyle.bg} ${occ.badgeStyle.text} ${occ.badgeStyle.border}`}
                        >
                          {occ.occasionBadge}
                        </span>
                        {isHidden && (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full border border-stone-300">
                            Unavailable
                          </span>
                        )}
                        <span className="text-xs text-stone-400 font-serif hidden sm:inline">
                          &bull; {occ.occasionTitle}
                        </span>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#541D2B] bg-[#541D2B] text-white shadow-xs"
                            : "border-stone-300 group-hover:border-[#541D2B]/50 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>

                    {/* Prominent Creative Experience Name */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#541D2B] transition-colors leading-snug">
                      {occ.experienceName}
                    </h3>

                    {/* Meaningful Description */}
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                      {occ.description}
                    </p>

                    {/* Interactive Preview Mockup Illustration */}
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      {occ.type === "wedding" && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50/80 via-rose-50/60 to-stone-50 border border-amber-300/70 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-serif font-bold text-stone-900">
                                Royal Door &amp; RSVP Agenda
                              </p>
                              <p className="text-[10px] text-stone-500">
                                Shehnai &bull; Maps &bull; Multi-event
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-amber-300 shadow-2xs">
                            <Heart size={12} className="text-amber-600 fill-amber-600" />
                            <span className="text-[10px] font-mono font-semibold text-amber-900">Wedding RSVP 💌</span>
                          </div>
                        </div>
                      )}

                      {occ.type === "apology" && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50/70 to-stone-50 border border-rose-200/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-rose-200 flex items-center justify-center text-rose-500 shrink-0">
                              <Mail size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-serif font-bold text-stone-800">
                                Heartfelt Letter &amp; Forgiveness
                              </p>
                              <p className="text-[10px] text-stone-500">
                                Coupon tickets &bull; Cute minigame
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-rose-200/80 shadow-2xs">
                            <Ticket size={12} className="text-rose-500" />
                            <span className="text-[10px] font-mono font-semibold text-rose-700">1x Warm Hug</span>
                          </div>
                        </div>
                      )}

                      {occ.type === "anniversary" && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50/70 to-stone-50 border border-amber-200/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                              <Disc size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-serif font-bold text-stone-800">
                                Love Timeline &amp; Soundtrack
                              </p>
                              <p className="text-[10px] text-stone-500">
                                Polaroids &bull; Milestone moments
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-amber-200/80 shadow-2xs">
                            <Calendar size={12} className="text-amber-600" />
                            <span className="text-[10px] font-mono font-semibold text-amber-800">Together Forever</span>
                          </div>
                        </div>
                      )}

                      {occ.type === "birthday" && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50/70 to-stone-50 border border-purple-200/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                              <Cake size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-serif font-bold text-stone-800">
                                Cake Celebration &amp; Confetti
                              </p>
                              <p className="text-[10px] text-stone-500">
                                Blow candles &bull; Wish balloons
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-purple-200/80 shadow-2xs">
                            <Flame size={12} className="text-amber-500" />
                            <span className="text-[10px] font-mono font-semibold text-purple-800">Blow Candle 🕯️</span>
                          </div>
                        </div>
                      )}

                      {occ.type === "love" && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#541D2B]/10 via-rose-50/70 to-stone-50 border border-[#541D2B]/20 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-[#541D2B]/20 flex items-center justify-center text-[#541D2B] shrink-0">
                              <Heart size={18} className="fill-[#541D2B]" />
                            </div>
                            <div>
                              <p className="text-[11px] font-serif font-bold text-stone-800">
                                Romantic World &amp; Starlight
                              </p>
                              <p className="text-[10px] text-stone-500">
                                Secret letters &bull; Love puzzles
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#541D2B]/20 shadow-2xs">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-mono font-semibold text-[#541D2B]">Will You? ❤️</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="mt-4 pt-3 flex flex-wrap gap-1.5">
                    {occ.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Gift Details Form */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#541D2B] uppercase block">
                STEP 2 &bull; PERSONALIZATION
              </span>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900 mt-0.5">
                Add Names &amp; Gift Details
              </h2>
            </div>

            {/* Selected Occasion Context Reminder */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FAF7F2] border border-[#541D2B]/15">
              <span
                className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full ${activeOccasion.badgeStyle.bg} ${activeOccasion.badgeStyle.text}`}
              >
                {activeOccasion.occasionBadge}
              </span>
              <span className="font-serif font-bold text-xs text-stone-900 truncate">
                {activeOccasion.experienceName}
              </span>
            </div>
          </div>

          {/* Cultural Wedding Collection Picker */}
          {occasionType === "wedding" && (
            <div className="space-y-3 pb-5 border-b border-stone-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-serif font-semibold text-stone-800">
                  Select Cultural Wedding Collection &amp; Ceremony Style:
                </label>
                <span className="text-[11px] text-amber-800 font-serif font-medium hidden sm:inline">
                  7 Bespoke Wedding Collections Available
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {WEDDING_COLLECTION_OPTIONS.map((col) => {
                  const isColSelected = weddingCollection === col.id;
                  return (
                    <button
                      type="button"
                      key={col.id}
                      onClick={() => handleSelectWeddingCollection(col.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        isColSelected
                          ? "border-[#541D2B] bg-[#541D2B]/[0.04] shadow-xs ring-1 ring-[#541D2B]/30"
                          : "border-stone-200 bg-white hover:border-[#541D2B]/30 hover:bg-[#FAF7F2]/60"
                      }`}
                    >
                      <span className="text-base block mb-1">{col.emblem}</span>
                      <p className="font-serif font-bold text-xs text-stone-900 leading-tight">
                        {col.label}
                      </p>
                      <p className="text-[10px] text-stone-500 font-sans mt-0.5 truncate">
                        {col.subtitle}
                      </p>
                      {isColSelected && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#541D2B]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Name Inputs based on Occasion */}
          {occasionType === "wedding" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                  Bride&rsquo;s Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roshni, Ananya, Priya"
                  value={partner1Name}
                  onChange={(e) => {
                    setPartner1Name(e.target.value);
                    setRecipientName(`${e.target.value} & ${partner2Name || "Aarav"}`);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                  Groom&rsquo;s Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav, Rohan, Kabir"
                  value={partner2Name}
                  onChange={(e) => {
                    setPartner2Name(e.target.value);
                    setRecipientName(`${partner1Name || "Roshni"} & ${e.target.value}`);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                />
              </div>
            </div>
          ) : occasionType === "anniversary" || occasionType === "love" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                  Partner 1 Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya, Devika, Priya"
                  value={partner1Name}
                  onChange={(e) => {
                    setPartner1Name(e.target.value);
                    if (!recipientName) setRecipientName(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                  Partner 2 Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan, Kabir, Arjun"
                  value={partner2Name}
                  onChange={(e) => {
                    setPartner2Name(e.target.value);
                    if (!senderName) setSenderName(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                />
              </div>
            </div>
          ) : occasionType === "birthday" ? (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                  Who Are You Celebrating? <span className="text-stone-400 font-sans font-normal">(Personalizes your cards &amp; wishes)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "general", label: "Special Someone 🌟" },
                    { id: "mother", label: "Mother / Mom 🌸" },
                    { id: "father", label: "Father / Dad 🎖️" },
                    { id: "best-friend", label: "Best Friend 🎉" },
                    { id: "kids", label: "Kids / Champion 🚀" },
                    { id: "sister", label: "Sister 💖" },
                    { id: "brother", label: "Brother ⚡" },
                    { id: "wife", label: "Wife / Partner 💍" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setRecipientType(item.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-serif font-semibold text-center transition-all border ${
                        recipientType === item.id
                          ? "bg-purple-100 text-purple-900 border-purple-300 shadow-xs ring-1 ring-purple-400"
                          : "bg-white text-stone-700 border-stone-200 hover:border-purple-200 hover:bg-stone-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                    Birthday Person&rsquo;s Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya, Aarav, Ananya"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                    Your Name (Sender / Bestie) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha, Kabir, Bestie"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Apology */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                  Recipient&rsquo;s Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah, Priya, My Love"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                  Your Name (Sender) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex, Rahul, Me"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
                />
              </div>
            </div>
          )}

          {/* Website Header Title */}
          <div>
            <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
              Website Header Title
            </label>
            <input
              type="text"
              required
              placeholder={`e.g. ${activeOccasion.defaultTitle}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
            />
          </div>

          {/* Optional Milestone Date */}
          {occasionType === "wedding" && (
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                Wedding Date &amp; City (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. December 14-15, 2026 • Jaipur, Rajasthan"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
              />
            </div>
          )}

          {occasionType === "anniversary" && (
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                Anniversary Date or Milestone (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. October 14th, 2021 or 3 Magical Years"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
              />
            </div>
          )}

          {occasionType === "birthday" && (
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                Birthday Date or Milestone (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. November 24th or 25th Birthday"
                value={birthdayDate}
                onChange={(e) => setBirthdayDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
              />
            </div>
          )}

          {occasionType === "love" && (
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-xs font-serif font-semibold text-stone-700 mb-1.5">
                Special Date or Anniversary (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Since September 18th or Forever"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#541D2B] font-serif bg-white"
              />
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
              {errorMsg}
            </p>
          )}

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
            <span className="text-[11px] text-stone-500 font-serif text-center sm:text-left">
              ✓ Free to create &bull; Free to preview on mobile &amp; desktop &bull; No payment required upfront
            </span>

            <button
              type="submit"
              disabled={loading || isCurrentOccasionHidden}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-serif font-bold text-xs bg-[#541D2B] hover:bg-[#3D141F] text-white shadow-xl shadow-[#541D2B]/15 transition-all flex items-center justify-center gap-2 ${
                loading || isCurrentOccasionHidden
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-102"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Creating Draft...</span>
                </>
              ) : isCurrentOccasionHidden ? (
                <span>Experience Unavailable</span>
              ) : (
                <>
                  <span>Open In Visual Editor</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateCustomerWebsitePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center text-stone-400 font-serif text-sm">
            Loading Gift Creation Form...
          </div>
        }
      >
        <CreateCustomerWebsiteInner />
      </Suspense>
    </div>
  );
}
