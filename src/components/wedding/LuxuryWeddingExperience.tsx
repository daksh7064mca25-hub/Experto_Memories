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
  Music,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  Compass,
  Mail,
  User,
  Users,
  Phone,
  MessageSquare,
  Wine,
} from "lucide-react";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export const LuxuryWeddingExperience: React.FC<Props> = ({
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

  // Names & Dates
  const brideName = coupleSec?.config?.brideName || project.partner1Name || "Seraphina";
  const groomName = coupleSec?.config?.groomName || project.partner2Name || "Alexander";
  const coupleNames = `${brideName} & ${groomName}`;
  const weddingDateText =
    openingSec?.config?.weddingDateText || "Saturday, September 19, 2026 • Lake Como, Italy";
  const venueCity = countdownSec?.config?.venueCity || "Villa Balbiano, Lake Como, Italy";
  const targetDateStr = countdownSec?.config?.targetDate || "2026-09-19T16:30:00+02:00";

  // Monogram
  const brideInitial = brideName.charAt(0).toUpperCase() || "S";
  const groomInitial = groomName.charAt(0).toUpperCase() || "A";
  const monogram = `${brideInitial} & ${groomInitial}`;

  // Music URL
  const musicUrl =
    project.audioSettings?.backgroundMusicUrl ||
    "https://assets.mixkit.co/music/preview/mixkit-celebration-happiness-565.mp3";

  // Lightbox & Modal states
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("2");
  const [rsvpDiet, setRsvpDiet] = useState("Chef's Tasting Menu");
  const [rsvpNote, setRsvpNote] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "Welcome Soirée",
    "Wedding Vows",
    "Grand Gala Dinner",
    "Farewell Brunch",
  ]);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Countdown timer calculations
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
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
        caption: "The Golden Hour Arrival at Villa Balbiano",
      },
      {
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85",
        caption: "Whispered Promises Along the Cypress Terrace",
      },
      {
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85",
        caption: "Sunset Wooden Boat Cruise Across Lake Como",
      },
      {
        url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=85",
        caption: "Under the Starlit Italian Pergola",
      },
      {
        url: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1400&q=85",
        caption: "The Vintage Champagne First Dance",
      },
    ];
  }, [gallerySec]);

  // Carousel State
  const [currentCarouselIdx, setCurrentCarouselIdx] = useState(0);

  const handleNextPhoto = () => {
    setCurrentCarouselIdx((prev) => (prev + 1) % galleryPhotos.length);
  };
  const handlePrevPhoto = () => {
    setCurrentCarouselIdx((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  // Events list
  const events = useMemo(() => {
    const custom = eventsSec?.config?.events || [];
    if (custom.length > 0) return custom;
    return [
      {
        id: "evt-welcome-soiree",
        title: "Sunset Welcome Soirée & Bellini Toast",
        date: "Friday, September 18, 2026",
        time: "06:00 PM onwards",
        venueName: "The Terrace Gardens, Villa Balbiano",
        address: "Piazza Carducci, Ossuccio, Lake Como, Italy",
        googleMapsUrl: "https://maps.google.com/?q=Villa+Balbiano+Lake+Como",
        dressCode: "Cocktail Chic (Linen & Summer Pastels)",
        description:
          "Crisp prosecco, acoustic strings by the water, artisan antipasti, and welcoming toasts under the Alpine twilight.",
        badge: "Welcome Gathering",
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
        description:
          "Processional harp accompaniment, solemn exchange of vows, and golden rose petals by the calm waters of Lake Como.",
        badge: "Sacred Union",
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
        description:
          "Four-course Michelin-inspired Italian banquet, vintage champagne toasts, cutting of the millefoglie, and dancing under the stars.",
        badge: "Gala Banquet",
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
        description:
          "Freshly brewed espresso, artisan pastries, bellinis, and warm farewell embraces before departure.",
        badge: "Farewell Gathering",
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
        title: "The Serendipitous Meeting",
        year: "Autumn 2021",
        description:
          "A rainy afternoon in an old Zurich bookstore, where a shared curiosity over vintage architectural blueprints blossomed into a three-hour conversation over espresso.",
        quote: "“In an instant, the world grew quiet, and all that mattered was her laughter.”",
      },
      {
        number: "Chapter II",
        title: "The Proposal at Twilight",
        year: "Summer 2024",
        description:
          "Beneath the cypress trees of Lake Como, as the evening bells chimed across the water, Alexander knelt with a family heirloom and asked Seraphina to share all her tomorrows with him.",
        quote: "“With every sunset since, our promises have grown deeper and brighter.”",
      },
      {
        number: "Chapter III",
        title: "The Vow of Forever",
        year: "September 2026",
        description:
          "Surrounded by those who have loved, guided, and cheered us through every step, we step hand in hand into a lifetime of adventure, devotion, and boundless joy.",
        quote: "“Two souls with but a single thought, two hearts that beat as one.”",
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
    }, 1100);
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
    <div className="min-h-screen bg-[#110D0B] text-[#FAF5ED] font-serif relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-[#1A140F]">
      {/* Background Audio Element */}
      {project.audioSettings?.enabled !== false && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Controller */}
      {invitationOpened && (
        <button
          type="button"
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
            isPlayingMusic
              ? "bg-[#D4AF37] text-[#1A140F] border-[#E8D49E] shadow-[0_0_25px_rgba(212,175,55,0.6)]"
              : "bg-[#1E1712]/90 text-[#FAF5ED] border-[#D4AF37]/40"
          }`}
          title={isPlayingMusic ? "Mute Classical Soundtrack" : "Play Classical Soundtrack"}
          aria-label={isPlayingMusic ? "Mute Classical Soundtrack" : "Play Classical Soundtrack"}
        >
          {isPlayingMusic ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      )}

      {/* =========================================================================
          PART 1: 3D / EDITORIAL UNBOXING FOLIO (OPENING CEREMONY)
      ========================================================================= */}
      {!openingDismissed && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-1000 ${
            invitationOpened
              ? "opacity-0 pointer-events-none scale-105"
              : "opacity-100 pointer-events-auto bg-[#0C0908]/95 backdrop-blur-xl"
          }`}
        >
          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-radial from-[#3A2A1E]/30 via-transparent to-black pointer-events-none" />

          {/* Gilded Stationery Folio */}
          <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#1C1612] via-[#241C16] to-[#14100D] border-2 border-[#D4AF37]/60 rounded-3xl p-8 sm:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-center overflow-hidden">
            {/* Ornamental Corner Filigree */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50 pointer-events-none" />

            {/* Gilded Monogram Wax Seal */}
            <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-[#E6C665] via-[#D4AF37] to-[#8C6D23] shadow-[0_8px_25px_rgba(212,175,55,0.45)] ring-4 ring-[#1C1612] ring-offset-2 ring-offset-[#D4AF37]/40 animate-pulse">
              <span className="font-serif font-bold text-xl tracking-wider text-[#2B1B17]">
                {monogram}
              </span>
            </div>

            {/* Eyebrow & Couple Invitation Copy */}
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] mb-3">
              {openingSec?.config?.eyebrow || "Together with their families"}
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF5ED] mb-3 leading-tight">
              {coupleNames}
            </h1>

            <p className="text-xs sm:text-sm italic text-stone-300 max-w-xs mx-auto mb-6 leading-relaxed">
              Request the honour of your presence at the celebration of their holy union.
            </p>

            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-transparent mb-6" />

            <div className="space-y-1 mb-8">
              <p className="text-xs font-mono tracking-wider uppercase text-[#E8D49E]">
                {weddingDateText}
              </p>
              <p className="text-[11px] text-stone-400 font-sans">{venueCity}</p>
            </div>

            {/* Interactive Unbox CTA Button */}
            <button
              type="button"
              onClick={handleOpenInvitation}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-serif font-bold text-sm tracking-wide bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A36A] text-[#241810] shadow-[0_10px_35px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_45px_rgba(212,175,55,0.55)] hover:scale-103 transition-all duration-300 cursor-pointer"
            >
              <Sparkles size={16} className="text-[#5A3F15] transition-transform group-hover:rotate-45" />
              <span>Unfold Invitation Folio</span>
            </button>

            <p className="text-[10px] text-stone-400 mt-4 tracking-wide font-sans">
              Click to open &amp; experience classical music soundtrack
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          PART 2: THE HAUTE COUTURE LUXURY WEDDING SUITE
      ========================================================================= */}
      <main className="relative w-full">
        {/* 1. EDITORIAL HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden">
          {/* High-Resolution Background Photography */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
              alt="Villa Balbiano Destination Wedding"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter brightness-45 scale-102 transform duration-1000"
            />
            {/* Elegant Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#110D0B] via-[#110D0B]/60 to-[#110D0B]/80" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#110D0B]/40 to-[#110D0B]" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-10">
            {/* Luminous Monogram Crest */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#D4AF37]/50 bg-[#1C1612]/70 backdrop-blur-md text-[#D4AF37] font-serif text-lg font-bold shadow-lg mb-2">
              <span>{monogram}</span>
            </div>

            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
              {openingSec?.config?.eyebrow || "Together with their families"}
            </p>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#FAF5ED] leading-[1.05] drop-shadow-md">
              {coupleNames}
            </h1>

            <p className="font-serif italic text-lg sm:text-2xl text-stone-200 max-w-2xl mx-auto leading-relaxed">
              {openingSec?.config?.headline || "A Celebration of Love & Destiny"}
            </p>

            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-4" />

            <div className="space-y-1">
              <p className="text-sm sm:text-base font-serif font-bold text-[#E8D49E] tracking-wider">
                {weddingDateText}
              </p>
              <p className="text-xs sm:text-sm font-sans text-stone-300">
                {venueCity}
              </p>
            </div>

            {/* Quick RSVP Anchor Link */}
            <div className="pt-6">
              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-serif font-bold tracking-widest uppercase bg-[#D4AF37] text-[#1A140F] hover:bg-[#E8D49E] transition-all shadow-xl hover:scale-105"
              >
                <span>Confirm Your Attendance</span>
                <Heart size={14} className="fill-current" />
              </a>
            </div>
          </div>
        </section>

        {/* 2. WEDDING KEEPSAKE COUNTDOWN SECTION */}
        <section className="relative py-16 px-4 sm:px-6 bg-[#16110E] border-y border-[#D4AF37]/20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
              THE SACRED RENDEZVOUS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF5ED] mb-8">
              Counting Down to Forever
            </h2>

            {/* Four Gilded Dials */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mb-8">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((dial, idx) => (
                <div
                  key={idx}
                  className="bg-[#1F1713] border border-[#D4AF37]/30 rounded-2xl p-3 sm:p-5 shadow-inner"
                >
                  <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FAF5ED] block mb-1">
                    {String(dial.value).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] sm:text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                    {dial.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-stone-300 font-sans">
              <Calendar size={13} className="text-[#D4AF37]" />
              <span>Saturday, September 19, 2026 &bull; Lake Como, Italy</span>
            </div>
          </div>
        </section>

        {/* 3. OUR STORY TIMELINE */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
              MEMOIRS OF DEVOTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF5ED] mb-3">
              The Journey to Forever
            </h2>
            <p className="text-sm text-stone-400 font-serif italic max-w-lg mx-auto">
              Every chapter written with grace, laughter, and the quiet certainty of love.
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-[#D4AF37]/25 before:hidden md:before:block">
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
                  <div className="w-full md:w-1/2 p-6 sm:p-8 rounded-3xl bg-[#1C1612] border border-[#D4AF37]/30 shadow-lg text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37]">
                        {ch.number}
                      </span>
                      <span className="text-xs font-mono text-stone-400">{ch.year}</span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF5ED] mb-3">
                      {ch.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4 font-sans">
                      {ch.description}
                    </p>
                    <blockquote className="border-l-2 border-[#D4AF37] pl-3 text-xs italic text-[#E8D49E] font-serif">
                      {ch.quote}
                    </blockquote>
                  </div>

                  {/* Center Emblem Marker on Desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4AF37] text-[#1A140F] items-center justify-center font-bold text-xs shadow-md">
                    <Sparkles size={12} />
                  </div>

                  {/* Image/Ornament Placeholder */}
                  <div className="w-full md:w-1/2 relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-[#D4AF37]/20 shadow-md">
                    <Image
                      src={galleryPhotos[idx % galleryPhotos.length].url}
                      alt={ch.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 512px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#110D0B]/80 via-transparent to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. CEREMONIES & CELEBRATIONS */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#16110E] border-y border-[#D4AF37]/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
                THE ITINERARY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF5ED] mb-3">
                Celebrations &amp; Ceremonies
              </h2>
              <p className="text-sm text-stone-400 font-serif italic max-w-xl mx-auto">
                Join us for a three-day celebration along the sunlit shores and starry night skies of Lake Como.
              </p>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((evt: any, idx: number) => (
                <div
                  key={evt.id || idx}
                  className="group relative rounded-3xl bg-[#1C1612] border border-[#D4AF37]/35 p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37] transition-all duration-300 shadow-xl hover:scale-[1.01]"
                >
                  <div>
                    {/* Header with badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                        <Sparkles size={11} />
                        <span>{evt.badge || "Ceremony"}</span>
                      </span>
                      <span className="text-xs font-mono text-stone-400">{evt.time}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF5ED] mb-2 leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 font-sans">
                      {evt.description}
                    </p>

                    {/* Metadata Pill Block */}
                    <div className="space-y-2.5 pt-4 border-t border-[#D4AF37]/20 text-xs font-sans text-stone-300 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#D4AF37] shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-200 block">{evt.venueName}</strong>
                          <span className="text-[11px] text-stone-400">{evt.address}</span>
                        </div>
                      </div>
                      {evt.dressCode && (
                        <div className="flex items-center gap-2 pt-1">
                          <Wine size={14} className="text-[#D4AF37] shrink-0" />
                          <span className="text-stone-300">
                            Attire: <strong className="text-[#FAF5ED]">{evt.dressCode}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-800">
                    <a
                      href={evt.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(evt.address || evt.venueName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#D4AF37] hover:text-[#FAF5ED] transition-colors"
                    >
                      <MapPin size={13} />
                      <span>Get GPS Directions</span>
                      <ExternalLink size={12} />
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedEventModal(evt)}
                      className="px-4 py-2 rounded-full text-xs font-serif font-semibold bg-[#D4AF37]/15 hover:bg-[#D4AF37] hover:text-[#1A140F] text-[#FAF5ED] border border-[#D4AF37]/35 transition-all cursor-pointer"
                    >
                      Details &amp; Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PORTRAIT GALLERY & CAROUSEL */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
              VISUAL KEEPSAKES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF5ED] mb-3">
              Curated Portrait Gallery
            </h2>
            <p className="text-sm text-stone-400 font-serif italic max-w-md mx-auto">
              Portraits of quiet tenderness, laughter by the water, and twilight strolls.
            </p>
          </div>

          {/* Interactive Carousel */}
          <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#1C1612] aspect-[16/10] sm:aspect-[16/9]">
            <Image
              src={galleryPhotos[currentCarouselIdx].url}
              alt={galleryPhotos[currentCarouselIdx].caption || "Wedding portrait"}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover transition-all duration-700 cursor-pointer"
              onClick={() => setActivePhotoIdx(currentCarouselIdx)}
            />
            {/* Caption Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
                  Photo {currentCarouselIdx + 1} of {galleryPhotos.length}
                </span>
                <p className="font-serif text-sm sm:text-base text-[#FAF5ED] font-semibold">
                  {galleryPhotos[currentCarouselIdx].caption}
                </p>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="p-2.5 rounded-full bg-black/60 text-white hover:bg-[#D4AF37] hover:text-[#1A140F] transition cursor-pointer"
                  aria-label="Previous photograph"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="p-2.5 rounded-full bg-black/60 text-white hover:bg-[#D4AF37] hover:text-[#1A140F] transition cursor-pointer"
                  aria-label="Next photograph"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center justify-center gap-3 mt-6 overflow-x-auto pb-2">
            {galleryPhotos.map((photo: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentCarouselIdx(idx)}
                className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                  currentCarouselIdx === idx
                    ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105"
                    : "border-stone-700 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 64px, 80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </section>

        {/* 6. VENUE CONCIERGE & ACCOMMODATIONS */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#16110E] border-y border-[#D4AF37]/20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
                HOSPITALITY CONCIERGE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF5ED] mb-3">
                Venue &amp; Travel Logistics
              </h2>
              <p className="text-sm text-stone-400 font-serif italic max-w-lg mx-auto">
                Everything you need for effortless arrival, luxurious accommodations, and private water transfers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: The Estate */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1612] border border-[#D4AF37]/30 shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mb-4">
                  <MapPin size={20} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FAF5ED] mb-2">The Estate</h3>
                <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4">
                  Villa Balbiano is situated on the western shore of Lake Como in Ossuccio. Private water taxis depart from Como and Tremezzo.
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyAddress("Villa Balbiano, Piazza Carducci, Ossuccio, Lake Como, Italy")}
                  className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#D4AF37] hover:text-[#FAF5ED] transition cursor-pointer"
                >
                  {copiedAddress ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedAddress ? "Address Copied!" : "Copy Full Address"}</span>
                </button>
              </div>

              {/* Card 2: Airports & Transfers */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1612] border border-[#D4AF37]/30 shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mb-4">
                  <Compass size={20} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FAF5ED] mb-2">Airports &amp; Rail</h3>
                <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4">
                  Milan Malpensa (MXP) is 60 mins away. High-speed trains run from Milano Centrale to Como San Giovanni every 30 minutes.
                </p>
                <span className="text-[11px] font-mono text-[#D4AF37]">
                  Airport Chauffeur Coordination Available
                </span>
              </div>

              {/* Card 3: Accommodations */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1612] border border-[#D4AF37]/30 shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mb-4">
                  <Heart size={20} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FAF5ED] mb-2">Accommodations</h3>
                <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4">
                  Reserved room blocks are available at Grand Hotel Tremezzo and Mandarin Oriental Lake Como with wedding code: <strong className="text-[#FAF5ED]">SERALEX26</strong>.
                </p>
                <span className="text-[11px] font-mono text-[#D4AF37]">
                  Concierge Desk: luxury@villa-balbiano.it
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. VIP GUEST RSVP SECTION */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto" id="rsvp">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block mb-2">
              REQUISITION OF PRESENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF5ED] mb-3">
              Confirm Your Attendance
            </h2>
            <p className="text-sm text-stone-400 font-serif italic max-w-md mx-auto">
              Please respond by August 15, 2026 to ensure our culinary and concierge teams prepare for your stay.
            </p>
          </div>

          <div className="rounded-3xl bg-[#1C1612] border-2 border-[#D4AF37]/50 p-8 sm:p-12 shadow-2xl relative">
            {rsvpSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#FAF5ED]">
                  Thank You, {rsvpName}!
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-sm mx-auto leading-relaxed">
                  Your attendance has been confirmed for {selectedEvents.length} ceremonies. We cannot wait to celebrate with you at Villa Balbiano!
                </p>
                <div className="pt-4 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setRsvpSubmitted(false)}
                    className="px-6 py-2.5 rounded-full text-xs font-serif font-bold text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition cursor-pointer"
                  >
                    Edit Response
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `I just confirmed my attendance for the wedding of ${coupleNames} at Villa Balbiano, Lake Como! 🥂✨`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#D4AF37] text-[#1A140F] hover:bg-[#E8D49E] transition"
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
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-3.5 text-stone-500" />
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="e.g. Lord & Lady Hamilton"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#241C16] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF5ED] placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-3.5 text-stone-500" />
                      <input
                        type="email"
                        required
                        value={rsvpEmail}
                        onChange={(e) => setRsvpEmail(e.target.value)}
                        placeholder="hamilton@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#241C16] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF5ED] placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-3.5 text-stone-500" />
                      <input
                        type="tel"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        placeholder="+44 7911 123456"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#241C16] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF5ED] placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
                      Total Attending Guests
                    </label>
                    <div className="relative">
                      <Users size={14} className="absolute left-3.5 top-3.5 text-stone-500" />
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#241C16] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF5ED] focus:outline-none focus:border-[#D4AF37] font-sans"
                      >
                        <option value="1">1 Honored Guest</option>
                        <option value="2">2 Guests (Couple)</option>
                        <option value="3">3 Guests (Family)</option>
                        <option value="4">4 Guests (Family Suite)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Multi-Ceremony Attendance Checkboxes */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
                    Ceremonies You Will Attend:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Welcome Soirée",
                      "Wedding Vows",
                      "Grand Gala Dinner",
                      "Farewell Brunch",
                    ].map((title) => {
                      const isChecked = selectedEvents.includes(title);
                      return (
                        <button
                          type="button"
                          key={title}
                          onClick={() => handleToggleEventRSVP(title)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isChecked
                              ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAF5ED]"
                              : "bg-[#241C16] border-stone-800 text-stone-400 hover:border-stone-700"
                          }`}
                        >
                          <span className="text-xs font-serif font-bold">{title}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isChecked
                                ? "bg-[#D4AF37] border-[#D4AF37] text-[#1A140F]"
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

                {/* Dietary Preference */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
                    Gourmet Dietary Preference:
                  </label>
                  <select
                    value={rsvpDiet}
                    onChange={(e) => setRsvpDiet(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#241C16] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF5ED] focus:outline-none focus:border-[#D4AF37] font-sans"
                  >
                    <option value="Chef's Tasting Menu">Chef&rsquo;s Tasting Menu (Classic Haute Cuisine)</option>
                    <option value="Vegetarian Haute Cuisine">Vegetarian Haute Cuisine</option>
                    <option value="Vegan Mediterranean">Vegan Mediterranean</option>
                    <option value="Gluten-Free &amp; Nut-Free">Gluten-Free &amp; Nut-Free Special Preparation</option>
                  </select>
                </div>

                {/* Wishes Note */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
                    Heartfelt Blessings &amp; Notes to the Couple
                  </label>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3.5 top-3.5 text-stone-500" />
                    <textarea
                      rows={3}
                      value={rsvpNote}
                      onChange={(e) => setRsvpNote(e.target.value)}
                      placeholder="Share a private wish, favorite memory, or travel inquiry..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#241C16] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF5ED] placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] font-sans"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  className="w-full py-4 rounded-full font-serif font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E2B3] to-[#C5A36A] text-[#241810] shadow-xl hover:shadow-[0_10px_35px_rgba(212,175,55,0.45)] hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
                >
                  {rsvpSubmitting ? "Confirming With Concierge..." : "Confirm My Attendance ✨"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 8. PARENTS & FAMILY BLESSINGS */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#16110E] border-t border-[#D4AF37]/20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#D4AF37] block">
              SACRED PATRIMONY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF5ED]">
              With Gratitude to Our Families
            </h2>
            <blockquote className="text-base sm:text-lg italic text-[#E8D49E] font-serif leading-relaxed max-w-xl mx-auto">
              {coupleSec?.config?.parentsBlessing ||
                "“May your union be blessed with deep affection, timeless grace, unwavering courage, and boundless laughter through every season of life.”"}
            </blockquote>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400">
              — Lady Eleanor &amp; Lord Arthur Sterling &bull; Dr. Victoria &amp; Ambassador Charles Montgomery —
            </p>
          </div>
        </section>

        {/* 9. EXPERTOMEMORIES BRAND SIGNATURE FOOTER */}
        <footer className="relative py-12 px-4 sm:px-6 bg-[#0E0A08] border-t border-[#D4AF37]/20 text-center text-xs text-stone-400">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-10 h-10 mx-auto rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-xs">
              {monogram}
            </div>
            <p className="font-serif italic text-stone-300">
              {coupleNames} &bull; September 19, 2026 &bull; Villa Balbiano, Lake Como
            </p>
            <ExpertoMemoriesBrandSignature />
          </div>
        </footer>
      </main>

      {/* =========================================================================
          PART 3: MODALS (EVENT DETAILS & PHOTO LIGHTBOX)
      ========================================================================= */}
      {/* Event Details Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#1C1612] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white bg-black/40 hover:bg-black/80 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] block mb-1">
              {selectedEventModal.badge || "Ceremony"}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#FAF5ED] mb-3">
              {selectedEventModal.title}
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300 font-sans mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#D4AF37]" />
                <span>{selectedEventModal.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#D4AF37]" />
                <span>{selectedEventModal.time}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">{selectedEventModal.venueName}</strong>
                  <span className="text-stone-400 text-xs">{selectedEventModal.address}</span>
                </div>
              </div>
              {selectedEventModal.dressCode && (
                <div className="flex items-center gap-2 pt-1">
                  <Wine size={15} className="text-[#D4AF37]" />
                  <span>
                    Dress Code: <strong className="text-white">{selectedEventModal.dressCode}</strong>
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-sans mb-6 bg-[#241C16] p-4 rounded-xl border border-stone-800">
              {selectedEventModal.description}
            </p>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="px-5 py-2.5 rounded-full text-xs font-serif font-bold text-stone-300 border border-stone-700 hover:bg-white/5 transition cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedEventModal.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(selectedEventModal.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-serif font-bold bg-[#D4AF37] text-[#1A140F] hover:bg-[#E8D49E] transition"
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
            className="absolute top-6 right-6 p-3 rounded-full text-white bg-black/60 hover:bg-[#D4AF37] hover:text-[#1A140F] transition cursor-pointer z-50"
          >
            <X size={20} />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/50">
            <Image
              src={galleryPhotos[activePhotoIdx].url}
              alt={galleryPhotos[activePhotoIdx].caption || "Wedding portrait"}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-8 inset-x-0 text-center pointer-events-none">
            <p className="text-sm font-serif font-bold text-[#FAF5ED] drop-shadow-md">
              {galleryPhotos[activePhotoIdx].caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
