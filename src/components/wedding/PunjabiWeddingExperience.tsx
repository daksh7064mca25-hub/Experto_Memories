"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { WebsiteProjectData } from "@/types/website";
import { ExpertoMemoriesBrandSignature } from "@/components/common/ExpertoMemoriesBrandSignature";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  Users,
  Mail,
  User,
  Phone,
  MessageSquare,
  PartyPopper,
  Compass,
} from "lucide-react";
import {
  PhulkariDiamondBorder,
  PhulkariCornerOrnament,
  MarigoldToranGarland,
  TraditionalHaveliArch,
} from "./punjabi/PhulkariPatterns";
import { JaggoInteractiveScene } from "./punjabi/JaggoInteractiveScene";
import { BaraatArrivalScene } from "./punjabi/BaraatArrivalScene";
import { PunjabiCeremonySection, CeremonyConfig } from "./punjabi/PunjabiCeremonySection";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export const PunjabiWeddingExperience: React.FC<Props> = ({
  project,
  previewMode = false,
}) => {
  const [invitationOpened, setInvitationOpened] = useState(previewMode);
  const [openingDismissed, setOpeningDismissed] = useState(previewMode);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract sections
  const sections = project.sections || [];
  const getSection = (type: string) => sections.find((s) => s.type === type && s.enabled !== false);

  const openingSec = getSection("wedding_opening");
  const coupleSec = getSection("wedding_couple");
  const storySec = getSection("wedding_story");
  const countdownSec = getSection("wedding_countdown");
  const eventsSec = getSection("wedding_events");
  const venueSec = getSection("wedding_venue") || getSection("wedding_travel");
  const gallerySec = getSection("wedding_gallery");
  const rsvpSec = getSection("wedding_rsvp");

  // Couple names & cultural details
  const brideName = coupleSec?.config?.brideName || project.partner1Name || "Simran";
  const groomName = coupleSec?.config?.groomName || project.partner2Name || "Harpreet";
  const coupleNames = `${brideName} & ${groomName}`;
  const weddingDateText =
    openingSec?.config?.weddingDateText || "December 20 – 21, 2026 • Amritsar, Punjab";
  const venueCity = countdownSec?.config?.venueCity || "Amritsar, Punjab, India";
  const targetDateStr = countdownSec?.config?.targetDate || "2026-12-20T18:00:00+05:30";

  // Monogram initials
  const brideInitial = brideName.charAt(0).toUpperCase() || "S";
  const groomInitial = groomName.charAt(0).toUpperCase() || "H";
  const monogram = `${brideInitial} & ${groomInitial}`;

  // Ceremony configuration (Sikh vs Hindu vs Custom)
  const ceremonyConfig: CeremonyConfig = useMemo(() => {
    // Check if explicitly configured in events section or weddingDetails
    const ceremonyType =
      eventsSec?.config?.ceremonyType ||
      (project.weddingDetails as any)?.ceremonyType ||
      (project.weddingDetails?.collection === "sikh" || project.templateId?.includes("sikh") ? "sikh" : "sikh");

    return {
      ceremonyType,
      date: eventsSec?.config?.ceremonyDate || "Sunday, December 21, 2026",
      time: eventsSec?.config?.ceremonyTime || (ceremonyType === "hindu" ? "11:30 AM (Varmala) • 01:15 PM (Pheras)" : "10:30 AM (Baraat) • 11:30 AM (Anand Karaj)"),
      venueName: eventsSec?.config?.ceremonyVenueName,
      address: eventsSec?.config?.ceremonyAddress,
      googleMapsUrl: eventsSec?.config?.ceremonyMapsUrl,
      familyMessage: eventsSec?.config?.ceremonyFamilyMessage,
      ceremonyDescription: eventsSec?.config?.ceremonyDescription,
      showLaavanExplanation: eventsSec?.config?.showLaavanExplanation !== false,
      religiousQuote: eventsSec?.config?.ceremonyReligiousQuote,
      shubhMuhurat: eventsSec?.config?.shubhMuhurat || "01:15 PM (Auspicious Lagna Muhurat)",
      showPherasExplanation: eventsSec?.config?.showPherasExplanation !== false,
    };
  }, [project, eventsSec]);

  // Jaggo & Baraat scene settings
  const jaggoConfig = eventsSec?.config?.jaggoConfig || (project.weddingDetails as any)?.jaggoConfig;
  const baraatConfig = eventsSec?.config?.baraatConfig || (project.weddingDetails as any)?.baraatConfig;

  // Music URL
  const musicUrl =
    project.audioSettings?.backgroundMusicUrl ||
    "https://assets.mixkit.co/music/preview/mixkit-celebration-happiness-565.mp3";

  // Modals & UI states
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpDiet, setRsvpDiet] = useState("Authentic Punjabi Feast (Vegetarian)");
  const [rsvpNote, setRsvpNote] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "Roka & Shagan",
    "Chooda & Vatna",
    "Jaggo & Sangeet",
    "Shahi Viah & Baraat",
    "Grand Reception",
  ]);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // Gallery Photos
  const galleryPhotos = useMemo(() => {
    const custom = gallerySec?.config?.photos || [];
    if (custom.length > 0) return custom;
    return [
      {
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85",
        caption: "Rangla Punjab Festive Celebration & Traditional Royal Attire",
      },
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
        caption: "Shahi Haveli Courtyard, Marigold Garlands & Golden Lanterns",
      },
      {
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85",
        caption: "Golden Sunset Over Punjab Sarson Fields",
      },
      {
        url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=85",
        caption: "Illuminated Jaggo Night Under The Punjab Starlit Sky",
      },
      {
        url: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1400&q=85",
        caption: "Joyous Family Laughter & Timeless Heritage Traditions",
      },
    ];
  }, [gallerySec]);

  // Carousel index
  const [currentCarouselIdx, setCurrentCarouselIdx] = useState(0);

  const handleNextPhoto = () => {
    setCurrentCarouselIdx((prev) => (prev + 1) % galleryPhotos.length);
  };
  const handlePrevPhoto = () => {
    setCurrentCarouselIdx((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  // Events List with Distinct Cultural Themes
  const events = useMemo(() => {
    const custom = eventsSec?.config?.events || [];
    if (custom.length > 0) return custom;
    return [
      {
        id: "evt-roka",
        title: "Roka & Shagan Ceremony",
        date: "Saturday, December 20, 2026",
        time: "11:00 AM onwards",
        venueName: "The Royal Orchid Farms, Amritsar",
        address: "Airport Road, Rajasansi, Amritsar, Punjab 143101",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Bright Phulkari & Kurta Pajama",
        description:
          "Official blessings, exchange of dry fruits and sweets, followed by joyous family congratulations, dhol beats, and refreshing thandai.",
        badge: "Shagan & Blessings",
        themeColor: "amber",
        accentHex: "#E5A910",
      },
      {
        id: "evt-chooda",
        title: "Chooda & Haldi Vatna Ceremony",
        date: "Sunday, December 21, 2026",
        time: "09:30 AM onwards",
        venueName: "The Dhillon Courtyard, Amritsar",
        address: "Airport Road, Rajasansi, Amritsar, Punjab 143101",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Haldi Yellow & Festive Pastels",
        description:
          "Maternal uncles blessing the bride with sacred red and ivory bangles and tinkling Kalire, followed by fragrant turmeric cleansing and phoolon ki holi.",
        badge: "Auspicious Vatna",
        themeColor: "yellow",
        accentHex: "#F59E0B",
      },
      {
        id: "evt-jaggo",
        title: "Jaggo Night & Grand Sangeet",
        date: "Sunday, December 21, 2026",
        time: "07:30 PM onwards",
        venueName: "The Grand Heritage Lawn, Amritsar",
        address: "Airport Road, Rajasansi, Amritsar, Punjab 143101",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Heavy Patiala Shahi & Mirror-work Kurtas",
        description:
          "Carrying the illuminated brass Jaggo pots on heads, non-stop high-energy Bhangra beats, Giddha boliyan, live dholis, and an authentic open tandoor feast.",
        badge: "Jaggo & Dhol",
        themeColor: "magenta",
        accentHex: "#C2185B",
      },
      {
        id: "evt-baraat",
        title: "The Grand Shahi Viah & Baraat",
        date: "Monday, December 22, 2026",
        time: "11:30 AM (Baraat) • 01:00 PM (Ceremony & Feast)",
        venueName: "The Heritage Haveli Resort, Amritsar",
        address: "GT Road, Amritsar, Punjab 143001",
        googleMapsUrl: "https://maps.google.com/?q=Amritsar+Punjab",
        dressCode: "Royal Turban / Sherwani & Designer Lehengas",
        description:
          "The grand Baraat procession with live dholis and brass band, solemn wedding ceremony, garland exchange, and a royal celebratory feast.",
        badge: "Shahi Viah",
        themeColor: "maroon",
        accentHex: "#8B1229",
      },
      {
        id: "evt-reception",
        title: "Grand Reception & Shahi Dawat",
        date: "Monday, December 22, 2026",
        time: "07:30 PM onwards",
        venueName: "The Grand Ballroom, Hyatt Regency Amritsar",
        address: "MBM Farms, GT Road, Amritsar, Punjab 143001",
        googleMapsUrl: "https://maps.google.com/?q=Hyatt+Regency+Amritsar",
        dressCode: "Evening Formal / Velvet & Brocade",
        description:
          "A magnificent evening of celebratory toasts, cake cutting, live folk ghazals & Punjabi music, and an exquisite multi-course royal feast.",
        badge: "Grand Dawat",
        themeColor: "emerald",
        accentHex: "#044E36",
      },
    ];
  }, [eventsSec]);

  // Story Chapters
  const storyChapters = useMemo(() => {
    const custom = storySec?.config?.chapters || [];
    if (custom.length > 0) return custom;
    return [
      {
        number: "Chapter I",
        title: "The Serendipitous First Meeting",
        year: "Winter 2022",
        description:
          "Across a lively family gathering amidst clinking tea glasses and joyful laughter in Chandigarh, a shared joke sparkled into hours of heartfelt conversation.",
        quote: "“Her radiant smile and warm laugh made the whole bustling room feel completely still.”",
      },
      {
        number: "Chapter II",
        title: "The Roka & Shared Dreams",
        year: "Spring 2025",
        description:
          "With both families gathered in joyful celebration, sweet boxes exchanged, and elders offering heartfelt blessings, two families seamlessly united into one warm home.",
        quote: "“When families unite with such deep warmth and mutual love, destiny simply smiles.”",
      },
      {
        number: "Chapter III",
        title: "The Promise of Togetherness",
        year: "December 2026",
        description:
          "Surrounded by the beats of the dhol, golden marigold flowers, and the boundless love of our dear ones, we step together into a lifetime of adventure, laughter, and devotion.",
        quote: "“Together in every beat, in every laughter, and through every season of life.”",
      },
    ];
  }, [storySec]);

  const handleOpenInvitation = () => {
    setInvitationOpened(true);
    if (audioRef.current && project.audioSettings?.enabled !== false) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
    setTimeout(() => {
      setOpeningDismissed(true);
    }, 1200);
  };

  const handleSkipToContent = () => {
    setInvitationOpened(true);
    setOpeningDismissed(true);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleCopyAddress = async (text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch {}
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const handleToggleEventRSVP = (evtTitle: string) => {
    setSelectedEvents((prev) =>
      prev.includes(evtTitle) ? prev.filter((e) => e !== evtTitle) : [...prev, evtTitle]
    );
  };

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setRsvpSubmitting(true);
    try {
      await fetch(`/api/gift/${project.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName,
          email: rsvpEmail,
          phone: rsvpPhone,
          guests: rsvpGuests,
          attending: true,
          diet: rsvpDiet,
          events: selectedEvents,
          note: rsvpNote,
        }),
      }).catch(() => {});
    } catch {}
    setRsvpSubmitting(false);
    setRsvpSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#2A060E] text-[#FFFDF9] font-serif relative overflow-x-hidden selection:bg-[#E5A910] selection:text-[#2A060E]">
      {/* Background Audio */}
      {project.audioSettings?.enabled !== false && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Festive Music Control */}
      {invitationOpened && (
        <button
          type="button"
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
            isPlayingMusic
              ? "bg-[#D97706] text-[#2A060E] border-[#FDE68A] shadow-[0_0_25px_rgba(217,119,6,0.6)]"
              : "bg-[#3D0C18]/90 text-[#FFF9F2] border-[#D97706]/40"
          }`}
          title={isPlayingMusic ? "Mute Festive Dhol Beats" : "Play Festive Dhol Beats"}
          aria-label={isPlayingMusic ? "Mute Festive Dhol Beats" : "Play Festive Dhol Beats"}
        >
          {isPlayingMusic ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {/* =========================================================================
          SCENE 01 — THE PHULKARI OPENING (CINEMATIC EMBROIDERED TEXTILE)
      ========================================================================= */}
      {!openingDismissed && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-1000 ${
            invitationOpened
              ? "opacity-0 pointer-events-none scale-105"
              : "opacity-100 pointer-events-auto bg-[#170308]/98 backdrop-blur-xl"
          }`}
        >
          {/* Subtle Ambient Marigold Glow */}
          <div className="absolute inset-0 bg-radial from-[#8B1229]/50 via-transparent to-black pointer-events-none" />

          {/* Phulkari Tapestry Card */}
          <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#3E0A16] via-[#520F1F] to-[#2B060F] border-2 border-[#E5A910]/80 rounded-3xl p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-center overflow-hidden">
            {/* Phulkari Corner Embroideries */}
            <PhulkariCornerOrnament position="top-left" className="absolute top-2 left-2" />
            <PhulkariCornerOrnament position="top-right" className="absolute top-2 right-2" />
            <PhulkariCornerOrnament position="bottom-left" className="absolute bottom-2 left-2" />
            <PhulkariCornerOrnament position="bottom-right" className="absolute bottom-2 right-2" />

            {/* Top Phulkari Diamond Thread Border */}
            <div className="mb-6 opacity-90">
              <PhulkariDiamondBorder />
            </div>

            {/* Brass Monogram Emblem */}
            <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#78350F] shadow-[0_8px_30px_rgba(245,158,11,0.5)] ring-4 ring-[#2B060F] ring-offset-2 ring-offset-[#E5A910]/70 animate-pulse">
              <span className="font-serif font-bold text-xl tracking-wider text-[#2A060E]">
                {monogram}
              </span>
            </div>

            {/* Cultural Greetings */}
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] mb-2 font-bold">
              {openingSec?.config?.eyebrow || "ੴ • Lakh Lakh Vadhaiyan • With Family Blessings"}
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFDF9] mb-3 leading-tight">
              {coupleNames}
            </h1>

            <p className="text-xs sm:text-sm italic text-amber-100 max-w-xs mx-auto mb-6 leading-relaxed font-sans">
              Warmly invite you to celebrate the music, laughter, and sacred traditions of Rangla Punjab.
            </p>

            <div className="h-px w-28 mx-auto bg-gradient-to-r from-transparent via-[#E5A910] to-transparent mb-6" />

            <div className="space-y-1 mb-8">
              <p className="text-xs font-mono tracking-wider uppercase text-[#FDE68A] font-bold">
                {weddingDateText}
              </p>
              <p className="text-[11px] text-amber-200/90 font-sans">{venueCity}</p>
            </div>

            {/* Interactive Open CTA */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleOpenInvitation}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-serif font-bold text-sm tracking-wide bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-[#2A060E] shadow-[0_10px_35px_rgba(245,158,11,0.5)] hover:shadow-[0_12px_45px_rgba(245,158,11,0.7)] hover:scale-103 transition-all duration-300 cursor-pointer"
              >
                <Sparkles size={16} className="text-[#3A0F1A] transition-transform group-hover:rotate-45" />
                <span>Open Your Invitation 🪔</span>
              </button>

              <div>
                <button
                  type="button"
                  onClick={handleSkipToContent}
                  className="text-[11px] text-amber-300/80 hover:text-white underline underline-offset-4 font-sans cursor-pointer transition-colors"
                >
                  Skip opening &amp; enter directly &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN INVITATION JOURNEY (SCENES 02 THROUGH 09)
      ========================================================================= */}
      <main className="relative w-full">
        {/* =====================================================================
            SCENE 02 — WELCOME TO THE PUNJABI HAVELI ("JEE AAYAN NU")
        ===================================================================== */}
        <section id="haveli-hero" className="relative min-h-[92vh] flex items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden">
          {/* Background Photography & Warm Sandstone / Marigold Gradients */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=85"
              alt="Punjabi Haveli Courtyard Atmosphere"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter brightness-40 scale-102 transform duration-1000"
            />
            {/* Rich Ruby, Sandstone & Amber Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A060E] via-[#2A060E]/70 to-[#2A060E]/85" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#2A060E]/50 to-[#2A060E]" />
          </div>

          {/* Marigold Swag across top of Haveli Courtyard */}
          <div className="absolute top-0 inset-x-0 z-10">
            <MarigoldToranGarland />
          </div>

          {/* Haveli Welcome Content */}
          <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-10">
            <TraditionalHaveliArch>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#E5A910]/70 bg-[#3E0A16]/80 backdrop-blur-md text-[#FBBF24] font-serif text-lg font-bold shadow-lg mb-2">
                <span>{monogram}</span>
              </div>
            </TraditionalHaveliArch>

            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-[#FBBF24] font-bold">
              Jee Aayan Nu &bull; {openingSec?.config?.eyebrow || "Lakh Lakh Vadhaiyan"}
            </p>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FFFDF9] leading-[1.05] drop-shadow-md">
              {coupleNames}
            </h1>

            <p className="font-serif italic text-lg sm:text-2xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
              {openingSec?.config?.headline || "Rangla Punjab — A Celebration of Love, Family & Heritage"}
            </p>

            <div className="h-px w-36 mx-auto bg-gradient-to-r from-transparent via-[#E5A910] to-transparent my-4" />

            <div className="space-y-1">
              <p className="text-sm sm:text-base font-serif font-bold text-[#FDE68A] tracking-wider">
                {weddingDateText}
              </p>
              <p className="text-xs sm:text-sm font-sans text-amber-200/90 font-medium">
                {venueCity}
              </p>
            </div>

            {/* Quick Navigation Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#jaggo-scene"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-serif font-bold tracking-widest uppercase bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-[#2A060E] hover:brightness-110 transition-all shadow-xl hover:scale-105 cursor-pointer"
              >
                <span>Experience Jaggo Night 🪔</span>
              </a>

              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-serif font-bold tracking-widest uppercase bg-[#3E0A16]/80 hover:bg-[#3E0A16] text-[#FDE68A] border border-[#E5A910]/50 transition-all shadow-md hover:scale-105"
              >
                <span>Confirm Hazri (RSVP)</span>
                <Heart size={13} className="fill-current text-rose-500" />
              </a>
            </div>
          </div>

          {/* Phulkari border at bottom of Scene 02 */}
          <div className="absolute bottom-0 inset-x-0">
            <PhulkariDiamondBorder />
          </div>
        </section>

        {/* =====================================================================
            SCENE 03 — INTERACTIVE JAGGO CELEBRATION
        ===================================================================== */}
        <JaggoInteractiveScene
          weddingDateText={weddingDateText}
          venueCity={venueCity}
          config={jaggoConfig}
        />

        {/* =====================================================================
            SCENE 04 — BARAAT ARRIVAL (OPTIONAL CULTURAL PROCESSION)
        ===================================================================== */}
        <BaraatArrivalScene
          groomName={groomName}
          brideName={brideName}
          weddingDateText={weddingDateText}
          config={baraatConfig}
        />

        {/* =====================================================================
            SCENE 05 — WEDDING FUNCTIONS (DISTINCT CULTURAL COLOR IDENTITIES)
        ===================================================================== */}
        <section
          id="functions-section"
          aria-label="Wedding Functions & Itinerary"
          className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#360812] border-y border-[#E5A910]/25"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block font-bold">
                SHAHI SAMAGAM &bull; CELEBRATION ITINERARY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF9]">
                Wedding Functions
              </h2>
              <p className="text-sm text-amber-200/80 font-serif italic max-w-xl mx-auto">
                Join our families for traditional ceremonies, festive feasts, and joyous celebrations across Punjab.
              </p>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {events.map((evt: any, idx: number) => {
                const borderHex = evt.accentHex || "#E5A910";
                return (
                  <div
                    key={evt.id || idx}
                    className="group relative rounded-3xl bg-[#3E0A16] border p-6 sm:p-7 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{ borderColor: `${borderHex}60` }}
                  >
                    <div>
                      {/* Header with badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold"
                          style={{
                            backgroundColor: `${borderHex}25`,
                            color: borderHex === "#044E36" ? "#34D399" : "#FBBF24",
                            border: `1px solid ${borderHex}60`,
                          }}
                        >
                          <Sparkles size={11} />
                          <span>{evt.badge || "Function"}</span>
                        </span>
                        <span className="text-xs font-mono text-amber-200/80">{evt.time}</span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FFFDF9] mb-2 leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-amber-100/90 leading-relaxed mb-5 font-sans">
                        {evt.description}
                      </p>

                      {/* Metadata Block */}
                      <div className="space-y-2 pt-3 border-t border-[#E5A910]/25 text-xs font-sans text-amber-100 mb-5">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-[#FBBF24] shrink-0" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={13} className="text-[#FBBF24] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white block">{evt.venueName}</strong>
                            <span className="text-[11px] text-amber-200/80">{evt.address}</span>
                          </div>
                        </div>
                        {evt.dressCode && (
                          <div className="flex items-center gap-2 pt-1">
                            <PartyPopper size={13} className="text-[#FBBF24] shrink-0" />
                            <span>
                              Dress: <strong className="text-white">{evt.dressCode}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-amber-900/40">
                      <a
                        href={
                          evt.googleMapsUrl ||
                          `https://maps.google.com/?q=${encodeURIComponent(
                            evt.address || evt.venueName
                          )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#FBBF24] hover:text-white transition-colors"
                      >
                        <MapPin size={13} />
                        <span>Directions</span>
                        <ExternalLink size={12} />
                      </a>

                      <button
                        type="button"
                        onClick={() => setSelectedEventModal(evt)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-serif font-semibold bg-[#E5A910]/20 hover:bg-[#E5A910] hover:text-[#2A060E] text-[#FFFDF9] border border-[#E5A910]/40 transition-all cursor-pointer"
                      >
                        Details &amp; Timings
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SCENE 06 — WEDDING CEREMONY (SIKH ANAND KARAJ VS PUNJABI HINDU VIVAH)
        ===================================================================== */}
        <PunjabiCeremonySection
          ceremonyConfig={ceremonyConfig}
          defaultDateText={weddingDateText}
          coupleNames={coupleNames}
        />

        {/* =====================================================================
            SCENE 07 — OUR LOVE STORY (SARSON FIELDS / SUNSET GOLD ATMOSPHERE)
        ===================================================================== */}
        <section
          id="story-section"
          aria-label="Our Love Story"
          className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <div className="text-center mb-16 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block font-bold">
              KAHANI PYAR DI &bull; OUR JOURNEY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF9]">
              The Journey of Two Souls
            </h2>
            <p className="text-sm text-amber-200/80 font-serif italic max-w-lg mx-auto">
              From our first spark of laughter to the sacred blessing of our families.
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-[#E5A910]/25 before:hidden md:before:block">
            {storyChapters.map((ch: any, idx: number) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Card */}
                  <div className="w-full md:w-1/2 p-6 sm:p-8 rounded-3xl bg-[#3E0A16] border border-[#E5A910]/40 shadow-xl text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#FBBF24] font-bold">
                        {ch.number}
                      </span>
                      <span className="text-xs font-mono text-amber-200/80">{ch.year}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FFFDF9] mb-3">
                      {ch.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mb-4 font-sans">
                      {ch.description}
                    </p>
                    {ch.quote && (
                      <blockquote className="border-l-2 border-[#E5A910] pl-3 text-xs italic text-[#FDE68A] font-serif">
                        {ch.quote}
                      </blockquote>
                    )}
                  </div>

                  {/* Center Emblem Marker on Desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#E5A910] text-[#2A060E] items-center justify-center font-bold text-xs shadow-md">
                    <Sparkles size={12} />
                  </div>

                  {/* Image Card */}
                  <div className="w-full md:w-1/2 relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-[#E5A910]/35 shadow-lg">
                    <Image
                      src={galleryPhotos[idx % galleryPhotos.length].url}
                      alt={ch.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 512px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A060E]/80 via-transparent to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            SCENE 08 — FAMILY AND BLESSINGS ("VADDE-VADERIAN DE ASHIRWAAD")
        ===================================================================== */}
        <section
          id="family-section"
          aria-label="Family and Blessings"
          className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#360812] border-y border-[#E5A910]/25 text-center"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block font-bold">
              VADDE-VADERIAN DE ASHIRWAAD &bull; FAMILY LINEAGE
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFFDF9]">
              With Gratitude to Our Elders &amp; Families
            </h2>

            <blockquote className="text-base sm:text-lg italic text-[#FDE68A] font-serif leading-relaxed max-w-xl mx-auto">
              {coupleSec?.config?.parentsBlessing ||
                "“May our children be blessed with lifelong laughter, robust health, immense joy, and unwavering warmth in every step of their journey together.”"}
            </blockquote>

            {/* Lineage & Names Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl mx-auto text-xs font-sans text-amber-100">
              <div className="p-4 rounded-2xl bg-[#3E0A16] border border-[#E5A910]/30">
                <span className="font-serif font-bold text-sm text-[#FBBF24] block mb-1">
                  Bride&apos;s Family
                </span>
                <p className="text-amber-100/90 leading-relaxed">
                  {coupleSec?.config?.brideTitle || "D/o Smt. Manjit & Sardar Balwinder Singh Sandhu"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#3E0A16] border border-[#E5A910]/30">
                <span className="font-serif font-bold text-sm text-[#FBBF24] block mb-1">
                  Groom&apos;s Family
                </span>
                <p className="text-amber-100/90 leading-relaxed">
                  {coupleSec?.config?.groomTitle || "S/o Smt. Jaspreet & Sardar Gurdeep Singh Dhillon"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SCENE 09 — COUNTDOWN, VENUE CONCIERGE & FINAL INVITATION (RSVP)
        ===================================================================== */}
        {/* Countdown Dials */}
        <section className="relative py-16 px-4 sm:px-6 bg-[#26050C]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block mb-2 font-bold">
              LAKH LAKH VADHAIYAN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF9] mb-8">
              Counting Down to The Big Day
            </h2>

            {/* Four Brass/Amber Dials */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mb-8">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((dial, idx) => (
                <div
                  key={idx}
                  className="bg-[#3E0A16] border border-[#E5A910]/40 rounded-2xl p-3 sm:p-5 shadow-inner"
                >
                  <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF9] block mb-1">
                    {String(dial.value).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] sm:text-xs font-mono uppercase tracking-widest text-[#FBBF24]">
                    {dial.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-amber-200 font-sans">
              <Calendar size={13} className="text-[#FBBF24]" />
              <span>{weddingDateText}</span>
            </div>
          </div>
        </section>

        {/* Venue & Travel Concierge */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#360812] border-t border-[#E5A910]/25">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block font-bold">
                HOSPITALITY &amp; LOGISTICS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFFDF9]">
                Venue &amp; Guest Concierge
              </h2>
              <p className="text-sm text-amber-200/80 font-serif italic max-w-lg mx-auto">
                Welcoming our out-of-town guests with true Punjabi hospitality and seamless travel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Main Venue */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#3E0A16] border border-[#E5A910]/35 shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#E5A910]/20 flex items-center justify-center text-[#FBBF24] mb-4">
                  <MapPin size={20} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FFFDF9] mb-2">Main Celebrations</h3>
                <p className="text-xs text-amber-100/90 font-sans leading-relaxed mb-4">
                  The Royal Orchid Farms and Haveli Banquets on Airport Road, Rajasansi, Amritsar.
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyAddress("Airport Road, Rajasansi, Amritsar, Punjab 143101")}
                  className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#FBBF24] hover:text-white transition cursor-pointer"
                >
                  {copiedAddress ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedAddress ? "Address Copied!" : "Copy Full Address"}</span>
                </button>
              </div>

              {/* Card 2: Airport & Rail */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#3E0A16] border border-[#E5A910]/35 shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#E5A910]/20 flex items-center justify-center text-[#FBBF24] mb-4">
                  <Compass size={20} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FFFDF9] mb-2">Airport &amp; Rail</h3>
                <p className="text-xs text-amber-100/90 font-sans leading-relaxed mb-4">
                  Sri Guru Ram Dass Jee International Airport (ATQ) is 10 mins away. Amritsar Junction railway station is 20 mins away.
                </p>
                <span className="text-[11px] font-mono text-[#FBBF24]">
                  Family Pickups &amp; Shuttles Coordinated
                </span>
              </div>

              {/* Card 3: Accommodations */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#3E0A16] border border-[#E5A910]/35 shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#E5A910]/20 flex items-center justify-center text-[#FBBF24] mb-4">
                  <Heart size={20} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FFFDF9] mb-2">Accommodations</h3>
                <p className="text-xs text-amber-100/90 font-sans leading-relaxed mb-4">
                  Special guest rooms reserved at Hyatt Regency Amritsar under wedding code: <strong className="text-white">SHAHI26</strong>.
                </p>
                <span className="text-[11px] font-mono text-[#FBBF24]">
                  Concierge Desk: hospitality@shahi-viah.in
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* VIP Guest RSVP Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto" id="rsvp">
          <div className="text-center mb-14 space-y-2">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block font-bold">
              HAZRI &bull; RSVP
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF9]">
              Confirm Your Attendance
            </h2>
            <p className="text-sm text-amber-200/80 font-serif italic max-w-md mx-auto">
              Please respond by November 30, 2026 so our family can arrange royal hospitality and feast arrangements for you.
            </p>
          </div>

          <div className="rounded-3xl bg-[#3E0A16] border-2 border-[#E5A910]/60 p-8 sm:p-12 shadow-2xl relative">
            {rsvpSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E5A910]/20 border border-[#E5A910] flex items-center justify-center text-[#FBBF24]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#FFFDF9]">
                  Lakh Lakh Vadhaiyan, {rsvpName}!
                </h3>
                <p className="text-xs sm:text-sm text-amber-100 font-sans max-w-sm mx-auto leading-relaxed">
                  Your attendance has been confirmed for {selectedEvents.length} ceremonies. We cannot wait to celebrate with you in Amritsar! 🪔✨
                </p>
                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setRsvpSubmitted(false)}
                    className="px-6 py-2.5 rounded-full text-xs font-serif font-bold text-[#FBBF24] border border-[#E5A910]/50 hover:bg-[#E5A910]/10 transition cursor-pointer"
                  >
                    Edit Response
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `I just confirmed my attendance for the Shahi Punjabi wedding of ${coupleNames} in Amritsar! 🥁✨`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#E5A910] text-[#2A060E] hover:bg-[#FBBF24] transition"
                  >
                    <Share2 size={13} />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#FBBF24] mb-2 font-bold">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="e.g. Sardar & Sardarni Grewal"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2B060F] border border-[#E5A910]/40 text-xs sm:text-sm text-[#FFFDF9] placeholder-stone-400 focus:outline-none focus:border-[#FBBF24] font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#FBBF24] mb-2 font-bold">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={rsvpEmail}
                        onChange={(e) => setRsvpEmail(e.target.value)}
                        placeholder="grewal@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2B060F] border border-[#E5A910]/40 text-xs sm:text-sm text-[#FFFDF9] placeholder-stone-400 focus:outline-none focus:border-[#FBBF24] font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#FBBF24] mb-2 font-bold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="tel"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2B060F] border border-[#E5A910]/40 text-xs sm:text-sm text-[#FFFDF9] placeholder-stone-400 focus:outline-none focus:border-[#FBBF24] font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#FBBF24] mb-2 font-bold">
                      Total Attending Guests
                    </label>
                    <div className="relative">
                      <Users size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2B060F] border border-[#E5A910]/40 text-xs sm:text-sm text-[#FFFDF9] focus:outline-none focus:border-[#FBBF24] font-sans"
                      >
                        <option value="1">1 Honored Guest</option>
                        <option value="2">2 Guests (Couple)</option>
                        <option value="3">3 Guests (Family)</option>
                        <option value="4">4 Guests (Family Group)</option>
                        <option value="5">5+ Guests (Extended Family)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Multi-Ceremony Checkboxes */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#FBBF24] mb-2 font-bold">
                    Ceremonies You Will Attend:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Roka & Shagan",
                      "Chooda & Vatna",
                      "Jaggo & Sangeet",
                      "Shahi Viah & Baraat",
                      "Grand Reception",
                    ].map((title) => {
                      const isChecked = selectedEvents.includes(title);
                      return (
                        <button
                          type="button"
                          key={title}
                          onClick={() => handleToggleEventRSVP(title)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isChecked
                              ? "bg-[#E5A910]/20 border-[#FBBF24] text-[#FFFDF9]"
                              : "bg-[#2B060F] border-stone-800 text-stone-400 hover:border-stone-700"
                          }`}
                        >
                          <span className="text-xs font-serif font-bold">{title}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isChecked
                                ? "bg-[#E5A910] border-[#E5A910] text-[#2A060E]"
                                : "border-stone-600"
                            }`}
                          >
                            {isChecked && <Check size={10} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feast Preference */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#FBBF24] mb-2 font-bold">
                    Dawat &amp; Feast Preference:
                  </label>
                  <select
                    value={rsvpDiet}
                    onChange={(e) => setRsvpDiet(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#2B060F] border border-[#E5A910]/40 text-xs sm:text-sm text-[#FFFDF9] focus:outline-none focus:border-[#FBBF24] font-sans"
                  >
                    <option value="Authentic Punjabi Feast (Vegetarian)">Authentic Punjabi Feast (Pure Vegetarian)</option>
                    <option value="Amritsari Special (Both Non-Veg &amp; Veg Feasts)">Amritsari Special (Both Non-Veg &amp; Veg Feasts)</option>
                    <option value="Jain Preparation">Jain Satvik Preparation</option>
                    <option value="Gluten-Free &amp; Vegan">Gluten-Free &amp; Vegan Dedicated Dishes</option>
                  </select>
                </div>

                {/* Warm Blessings Note */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#FBBF24] mb-2 font-bold">
                    Heartfelt Blessings &amp; Message for the Couple:
                  </label>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                    <textarea
                      rows={3}
                      value={rsvpNote}
                      onChange={(e) => setRsvpNote(e.target.value)}
                      placeholder="Share your congratulations, favorite memory, or travel inquiry..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#2B060F] border border-[#E5A910]/40 text-xs sm:text-sm text-[#FFFDF9] placeholder-stone-400 focus:outline-none focus:border-[#FBBF24] font-sans"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  className="w-full py-4 rounded-full font-serif font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-[#2A060E] shadow-xl hover:shadow-[0_10px_35px_rgba(245,158,11,0.5)] hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {rsvpSubmitting ? "Confirming Hazri..." : "Confirm My Hazri (RSVP) 🪔✨"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Footer with Brand Signature */}
        <footer className="relative py-12 px-4 sm:px-6 bg-[#170308] border-t border-[#E5A910]/25 text-center text-xs text-amber-200/70">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-10 h-10 mx-auto rounded-full border border-[#E5A910]/50 flex items-center justify-center text-[#FBBF24] font-serif font-bold text-xs">
              {monogram}
            </div>
            <p className="font-serif italic text-amber-100">
              {coupleNames} &bull; {weddingDateText}
            </p>
            <ExpertoMemoriesBrandSignature />
          </div>
        </footer>
      </main>

      {/* =========================================================================
          MODALS: EVENT DETAILS & PHOTO LIGHTBOX
      ========================================================================= */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#3E0A16] border-2 border-[#E5A910] rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-300 hover:text-white bg-black/40 hover:bg-black/80 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-mono tracking-widest uppercase text-[#FBBF24] block mb-1 font-bold">
              {selectedEventModal.badge || "Function"}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#FFFDF9] mb-3">
              {selectedEventModal.title}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-amber-100 font-sans mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#FBBF24]" />
                <span>{selectedEventModal.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#FBBF24]" />
                <span>{selectedEventModal.time}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#FBBF24] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">{selectedEventModal.venueName}</strong>
                  <span className="text-amber-200/80 text-xs">{selectedEventModal.address}</span>
                </div>
              </div>
              {selectedEventModal.dressCode && (
                <div className="flex items-center gap-2 pt-1">
                  <PartyPopper size={15} className="text-[#FBBF24]" />
                  <span>
                    Dress Code: <strong className="text-white">{selectedEventModal.dressCode}</strong>
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-amber-100 leading-relaxed font-sans mb-6 bg-[#2B060F] p-4 rounded-xl border border-amber-900/40">
              {selectedEventModal.description}
            </p>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="px-5 py-2.5 rounded-full text-xs font-serif font-bold text-amber-200 border border-amber-700 hover:bg-white/5 transition cursor-pointer"
              >
                Close
              </button>
              <a
                href={
                  selectedEventModal.googleMapsUrl ||
                  `https://maps.google.com/?q=${encodeURIComponent(
                    selectedEventModal.address || selectedEventModal.venueName
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#E5A910] text-[#2A060E] hover:bg-[#FBBF24] transition"
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {activePhotoIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActivePhotoIdx(null)}
            className="absolute top-6 right-6 p-3 rounded-full text-white bg-black/60 hover:bg-[#E5A910] hover:text-[#2A060E] transition cursor-pointer z-50"
          >
            <X size={20} />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-[#E5A910]/50">
            <Image
              src={galleryPhotos[activePhotoIdx].url}
              alt={galleryPhotos[activePhotoIdx].caption || "Wedding portrait"}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-8 inset-x-0 text-center pointer-events-none">
            <p className="text-sm font-serif font-bold text-[#FFFDF9] drop-shadow-md">
              {galleryPhotos[activePhotoIdx].caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
