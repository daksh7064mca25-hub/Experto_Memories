"use client";

import React, { useState, useEffect, useRef } from "react";
import { WebsiteProjectData, WebsiteSectionData } from "@/types/website";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Send,
  UserCheck,
  Share2,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Crown,
  Maximize2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RoyalWeddingCelebrationCards } from "./RoyalWeddingCelebrationCards";

interface Props {
  project: WebsiteProjectData;
  groomName: string;
  brideName: string;
  coupleNames: string;
  weddingDateText: string;
  targetDate: string;
  venueCity: string;
  openingSec?: WebsiteSectionData;
  coupleSec?: WebsiteSectionData;
  storySec?: WebsiteSectionData;
  countdownSec?: WebsiteSectionData;
  eventsSec?: WebsiteSectionData;
  venueSec?: WebsiteSectionData;
  gallerySec?: WebsiteSectionData;
  rsvpSec?: WebsiteSectionData;
  previewMode?: boolean;
}

export const RoyalIndianEditorialExperience: React.FC<Props> = ({
  project,
  groomName,
  brideName,
  coupleNames,
  weddingDateText,
  targetDate,
  venueCity,
  openingSec,
  coupleSec,
  storySec,
  countdownSec,
  eventsSec,
  venueSec,
  gallerySec,
  rsvpSec,
  previewMode = false,
}) => {
  // Section DOM Refs for GSAP ScrollTrigger
  const heroRef = useRef<HTMLElement | null>(null);
  const countdownRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const eventsRef = useRef<HTMLElement | null>(null);
  const venueRef = useRef<HTMLElement | null>(null);
  const rsvpRef = useRef<HTMLElement | null>(null);
  const finaleRef = useRef<HTMLElement | null>(null);

  // Address Copy & Share States
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate || "2026-12-14T17:30:00+05:30").getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isPast: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Gallery Photos for Carousel & Lightbox
  const rawPhotos = Array.isArray(gallerySec?.config?.photos) ? gallerySec.config.photos : [];
  const photos = rawPhotos.length > 0 ? rawPhotos : [
    {
      id: "gal-1",
      url: "/images/royal/palace_arch.jpg",
      caption: "Under the heritage palace arches in Jaipur",
      category: "Portraits",
    },
    {
      id: "gal-2",
      url: "/images/royal/palace_courtyard.jpg",
      caption: "Evening stroll across the palace courtyard",
      category: "Candid",
    },
    {
      id: "gal-3",
      url: coupleSec?.config?.groomPhotoUrl || "/images/royal/groom_portrait.jpg",
      caption: `${groomName} in ceremonial royal sherwani`,
      category: "Groom",
    },
    {
      id: "gal-4",
      url: coupleSec?.config?.bridePhotoUrl || "/images/royal/bride_portrait.jpg",
      caption: `${brideName} in handcrafted heritage bridal lehenga`,
      category: "Bride",
    },
  ];

  // Carousel Active Slide State & Autoplay
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselAutoplay, setIsCarouselAutoplay] = useState(true);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isCarouselAutoplay || photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselAutoplay, photos.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  // Touch swipe support on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  // Lightbox Open & Navigation
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    attendanceStatus: "attending",
    guestCount: 2,
    personalBlessing: "",
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpError("");

    if (!rsvpData.guestName.trim()) {
      setRsvpError("Please provide your name to confirm attendance.");
      return;
    }

    setIsSubmittingRsvp(true);
    try {
      if (previewMode) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsRsvpSubmitted(true);
        setIsSubmittingRsvp(false);
        return;
      }

      const res = await fetch(`/api/gift/${project.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: project.slug,
          ...rsvpData,
        }),
      });

      if (res.ok) {
        setIsRsvpSubmitted(true);
      } else {
        const err = await res.json();
        setRsvpError(err.error || "Unable to submit RSVP. Please try again.");
      }
    } catch {
      setRsvpError("Network connection error. Please try again.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Clipboard & Share actions
  const copyAddressToClipboard = async (addressText: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(addressText).catch(() => {});
      }
    } catch {
      // Fallback: silently ignore writeText permission errors
    }
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2400);
  };

  const handleShareInvitation = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      (navigator as any)
        .share({
          title: `${coupleNames} — Royal Wedding Invitation`,
          text: `You are cordially invited to celebrate the royal wedding of ${coupleNames}.`,
          url,
        })
        .catch(() => {});
    } else {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url).catch(() => {});
        }
      } catch {
        // Fallback: silently ignore writeText permission errors
      }
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2400);
    }
  };

  // Extract Configured Events
  const configuredEvents = Array.isArray(eventsSec?.config?.events)
    ? eventsSec.config.events
    : [];

  const defaultEvents = [
    {
      id: "evt-haldi",
      title: "Haldi & Phoolon Ki Holi",
      date: "Sunday, December 14, 2026",
      time: "10:30 AM onwards",
      venueName: "The Sunlit Courtyard, Fairmont Jaipur",
      address: "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028",
      googleMapsUrl: "https://maps.google.com/?q=Fairmont+Jaipur",
      dressCode: "Sunshine Yellow & Floral Pastels",
      description: "A joyful morning filled with auspicious turmeric, fragrant flower petals, high-energy dhol beats, and refreshing royal thandai.",
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
      description: "An evening of choreographed family dance performances, soul-stirring live music, signature cocktails, and midnight celebrations.",
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
      description: "The grand royal procession followed by sacred Vedic vows and seven pheras as two families unite under the starry Jaipur sky.",
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
      description: "A grand feast celebrating the newly married couple with live acoustic sitar recitals, gourmet culinary stations, and midnight toasts.",
    },
  ];

  const eventsList = configuredEvents.length > 0 ? configuredEvents : defaultEvents;

  // Register GSAP ScrollTrigger Animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const sections = [
      countdownRef.current,
      storyRef.current,
      carouselRef.current,
      eventsRef.current,
      venueRef.current,
      rsvpRef.current,
      finaleRef.current,
    ].filter(Boolean);

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      if (!section) return;
      const anim = gsap.fromTo(
        section,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const heroBackground =
    openingSec?.config?.heroBackgroundImageUrl ||
    (project as any).coverImageUrl ||
    "/images/royal/palace_hero.jpg";

  return (
    <div className="relative w-full bg-[#FAF7F2] text-[#3E141B] font-sans selection:bg-[#C5A36A] selection:text-white overflow-x-hidden">
      {/* ========================================================
          STAGE 2: ROYAL WEDDING HERO (PALACE BACKGROUND)
         ======================================================== */}
      <section
        ref={heroRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-between text-center px-4 sm:px-8 py-16 sm:py-24 overflow-hidden"
      >
        {/* High-Quality Royal Palace Photographic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-top transform scale-105 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url('${heroBackground}')` }}
        />

        {/* Elegant Royal Dark Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F070E]/75 via-[#2B0B14]/60 to-[#120307]/90 backdrop-blur-[0.5px]" />

        {/* Delicate Golden Frame Border inside Hero Viewport */}
        <div className="absolute inset-4 sm:inset-8 border border-[#D4AF37]/35 rounded-xs pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-4">
          <div className="flex justify-between text-[#D4AF37]/50 text-xs">
            <span>🪷</span>
            <span>🪷</span>
          </div>
          <div className="flex justify-between text-[#D4AF37]/50 text-xs">
            <span>🪷</span>
            <span>🪷</span>
          </div>
        </div>

        {/* Top Blessing Invocation */}
        <div className="relative z-20 pt-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-serif font-bold tracking-[0.25em] uppercase text-[#FDE68A] bg-black/40 border border-[#D4AF37]/40 shadow-lg backdrop-blur-md">
            <Sparkles size={12} className="text-[#F59E0B]" />
            <span>{openingSec?.config?.eyebrow || "WITH THE BLESSINGS OF OUR FAMILIES"}</span>
            <Sparkles size={12} className="text-[#F59E0B]" />
          </div>
        </div>

        {/* Center Main Couple Names & Royal Union Headline */}
        <div className="relative z-20 my-auto py-8 max-w-4xl mx-auto">
          <span className="font-serif text-sm sm:text-base italic tracking-[0.3em] uppercase text-[#FDE68A] block mb-3 drop-shadow-md">
            {openingSec?.config?.headline || "Two Hearts, One Royal Union"}
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-[#FAF7F2] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-none my-2">
            {groomName}{" "}
            <span className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#D4AF37] block sm:inline my-1 sm:my-0">
              &amp;
            </span>{" "}
            {brideName}
          </h1>

          <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-6" />

          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#FDE68A] font-semibold drop-shadow-md">
            {weddingDateText}
          </p>

          <p className="font-serif italic text-xs sm:text-sm text-stone-200 mt-2 max-w-md mx-auto drop-shadow-sm">
            Fairmont Jaipur &bull; {venueCity}
          </p>
        </div>

        {/* Bottom Scroll Down Indicator & Share Button */}
        <div className="relative z-20 pb-2 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleShareInvitation}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-[#D4AF37]/40 text-xs font-serif text-[#FDE68A] hover:text-white transition shadow-md backdrop-blur-sm cursor-pointer"
          >
            <Share2 size={13} />
            <span>{copiedShareLink ? "Link Copied!" : "Share Invitation"}</span>
          </button>

          <div className="flex flex-col items-center text-stone-300 text-[10px] tracking-widest uppercase font-serif animate-bounce mt-1">
            <span>Scroll to Discover</span>
            <span className="text-base text-[#D4AF37] mt-0.5">&darr;</span>
          </div>
        </div>
      </section>

      {/* Main Editorial Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-28 sm:space-y-36">
        {/* ========================================================
            STAGE 3: UNIQUE WEDDING COUNTDOWN (LUXURY KEEPSAKE CARD)
           ======================================================== */}
        <section ref={countdownRef} className="text-center max-w-3xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-sm border border-[#D4AF37]/60 bg-[#FFFDF9] shadow-[0_4px_30px_rgba(212,175,55,0.12)]">
            {/* Corner Filigree Flourish */}
            <div className="absolute top-2 left-2 text-[#C5A36A] opacity-40 text-sm">🪷</div>
            <div className="absolute top-2 right-2 text-[#C5A36A] opacity-40 text-sm">🪷</div>
            <div className="absolute bottom-2 left-2 text-[#C5A36A] opacity-40 text-sm">🪷</div>
            <div className="absolute bottom-2 right-2 text-[#C5A36A] opacity-40 text-sm">🪷</div>

            <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2 font-bold">
              The Auspicious Countdown
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#3E141B] font-normal mb-3">
              Counting Moments Until Forever
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-[#8B5E3C] max-w-md mx-auto mb-8">
              “Every second brings us closer to the sacred vows of the Saptapadi.”
            </p>

            {timeLeft.isPast ? (
              <div className="p-6 bg-[#FAF7F2] border border-[#E2D4BA] rounded-xs">
                <span className="font-serif text-2xl text-[#8B2635] block mb-1">
                  The Celebrations Have Commenced 🥂
                </span>
                <p className="text-xs font-sans text-[#7A6A60]">
                  Thank you for showering Aarav &amp; Roshni with your eternal love and blessings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hours", val: timeLeft.hours },
                  { label: "Minutes", val: timeLeft.minutes },
                  { label: "Seconds", val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF7F2] border border-[#E2D4BA] rounded-xs py-4 px-2 shadow-xs"
                  >
                    <span className="font-serif text-3xl sm:text-5xl font-normal text-[#8B2635] block transition-all">
                      {String(item.val).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold mt-1 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            STAGE 4: COUPLE STORY & PREMIUM PHOTO CAROUSEL
           ======================================================== */}
        <section ref={storyRef} className="space-y-16">
          {/* Story Chronicle */}
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2 font-bold">
              Our Journey of Love
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#3E141B] mb-8">
              The Royal Story
            </h2>

            <div className="relative border-l border-[#E2D4BA] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10 text-left">
              {/* Milestone 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border-2 border-[#C5A36A]" />
                <span className="font-sans text-[11px] uppercase tracking-wider text-[#C5A36A] font-bold block mb-1">
                  November 2023 &bull; Jaipur, Rajasthan
                </span>
                <h3 className="font-serif text-xl font-bold text-[#3E141B] mb-1.5">
                  The First Meeting at Amber
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                  {storySec?.config?.meetingStory ||
                    "Introduced during a heritage design symposium in the Pink City, an afternoon coffee turned into a stroll along the ramparts of Amber Fort. Amidst centuries of history, a quiet modern love story began."}
                </p>
              </div>

              {/* Milestone 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border-2 border-[#C5A36A]" />
                <span className="font-sans text-[11px] uppercase tracking-wider text-[#C5A36A] font-bold block mb-1">
                  Winter 2024 &bull; The Courtship
                </span>
                <h3 className="font-serif text-xl font-bold text-[#3E141B] mb-1.5">
                  Shared Passions &amp; Deeper Horizons
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                  A shared reverence for music, architecture, and family heritage brought their worlds together. From quiet weekend classical concerts to desert road trips under starlit skies, every season deepened their bond.
                </p>
              </div>

              {/* Milestone 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border-2 border-[#C5A36A]" />
                <span className="font-sans text-[11px] uppercase tracking-wider text-[#C5A36A] font-bold block mb-1">
                  Spring 2025 &bull; The Royal Yes
                </span>
                <h3 className="font-serif text-xl font-bold text-[#3E141B] mb-1.5">
                  Two Souls, One Forever
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
                  {storySec?.config?.proposalStory ||
                    "Under the glowing lanterns of a private palace terrace with the blessings of both sets of parents, Aarav asked Roshni to be his wife. With tears of joy and radiant smiles, her resounding yes sealed their destiny."}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Photo Carousel */}
          <div ref={carouselRef} className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-1 font-bold">
                Captured Moments
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#3E141B]">
                Couple Keepsake Gallery
              </h3>
            </div>

            <div
              className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-sm overflow-hidden bg-[#2B0B14] shadow-2xl border border-[#D4AF37]/50 select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {photos.map((photo: any, idx: number) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Royal Wedding Photo"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Caption & Category Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white pointer-events-none">
                    <div className="text-left max-w-lg">
                      <span className="text-[10px] uppercase font-sans tracking-widest text-[#D4AF37] font-semibold block mb-1">
                        {photo.category || "Memories"} &bull; {idx + 1} of {photos.length}
                      </span>
                      <p className="font-serif text-sm sm:text-lg italic text-[#FAF7F2]">
                        {photo.caption}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-black/40 text-[#D4AF37] hover:text-white transition">
                      <Maximize2 size={16} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-[#D4AF37] hover:text-white transition border border-[#D4AF37]/40 shadow-lg cursor-pointer"
                title="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-[#D4AF37] hover:text-white transition border border-[#D4AF37]/40 shadow-lg cursor-pointer"
                title="Next photo"
              >
                <ChevronRight size={20} />
              </button>

              {/* Autoplay Pause / Play Toggle */}
              <button
                type="button"
                onClick={() => setIsCarouselAutoplay((prev) => !prev)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer border border-white/20"
                title={isCarouselAutoplay ? "Pause slideshow" : "Play slideshow"}
              >
                {isCarouselAutoplay ? <Pause size={12} /> : <Play size={12} />}
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center items-center gap-2 mt-4">
              {photos.map((_: any, dotIdx: number) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlide(dotIdx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    dotIdx === currentSlide
                      ? "w-8 bg-[#8B2635]"
                      : "w-2 bg-[#E2D4BA] hover:bg-[#C5A36A]"
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            STAGE 5: WEDDING EVENTS & ROYAL ITINERARY
           ======================================================== */}
        <section ref={eventsRef} className="w-full">
          <RoyalWeddingCelebrationCards
            events={eventsList}
            coupleNames={coupleNames}
          />
        </section>

        {/* ========================================================
            STAGE 6: VENUE & LOCATION CONCIERGE
           ======================================================== */}
        <section ref={venueRef} className="max-w-3xl mx-auto text-center">
          <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2 font-bold">
            Hospitality &amp; Venue
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B] mb-8">
            The Royal Destination
          </h2>

          <div className="border border-[#E2D4BA] p-6 sm:p-10 bg-white/90 shadow-sm text-left relative overflow-hidden">
            <div className="w-full aspect-[21/9] sm:aspect-[3/1] rounded-xs overflow-hidden mb-6 bg-[#2B0B14]">
              <img
                src="/images/royal/palace_courtyard.jpg"
                alt="Fairmont Jaipur"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E141B] mb-1">
              {venueSec?.config?.venueName || "The Heritage Mandap Lawn, Fairmont Jaipur"}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#7A6A60] mb-6 flex items-start gap-2">
              <MapPin size={16} className="text-[#C5A36A] shrink-0 mt-0.5" />
              <span>
                {venueSec?.config?.venueAddress ||
                  "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028"}
              </span>
            </p>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E2D4BA]/70">
              <a
                href={
                  venueSec?.config?.googleMapsUrl ||
                  "https://maps.google.com/?q=Fairmont+Jaipur"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B2635] text-white text-xs font-semibold hover:bg-[#6E1C29] transition shadow-xs cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Open in Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() =>
                  copyAddressToClipboard(
                    venueSec?.config?.venueAddress ||
                      "Riico Industrial Area, Kukas, Jaipur, Rajasthan 302028"
                  )
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C5A36A] text-[#8B2635] text-xs font-semibold hover:bg-[#FAF7F2] transition cursor-pointer"
              >
                {copiedAddress ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copiedAddress ? "Address Copied!" : "Copy Full Address"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            STAGE 7: WEDDING GUEST RSVP FORM
           ======================================================== */}
        <section ref={rsvpRef} className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2 font-bold">
              Kindly Respond
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B]">
              Confirm Your Attendance
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-[#7A6A60] mt-2">
              Your presence will make our royal celebration complete. Please let us know if you can join us.
            </p>
          </div>

          {isRsvpSubmitted ? (
            <div className="border border-[#C5A36A] p-8 sm:p-12 bg-[#FBF9F5] text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto mb-4">
                <Check size={24} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#3E141B] mb-2">
                Royal Attendance Confirmed!
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#7A6A60] max-w-md mx-auto">
                Thank you for confirming your presence. We look forward to welcoming you and celebrating this royal union together.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleRsvpSubmit}
              className="border border-[#E2D4BA] p-6 sm:p-10 bg-white shadow-xs space-y-6"
            >
              {rsvpError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                  {rsvpError}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8B5E3C] font-semibold mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpData.guestName}
                  onChange={(e) => setRsvpData({ ...rsvpData, guestName: e.target.value })}
                  placeholder="e.g. Vikram &amp; Ananya Malhotra"
                  className="w-full px-4 py-2.5 border border-[#E2D4BA] rounded-xs text-sm focus:outline-none focus:border-[#C5A36A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8B5E3C] font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={rsvpData.guestEmail}
                    onChange={(e) => setRsvpData({ ...rsvpData, guestEmail: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 border border-[#E2D4BA] rounded-xs text-sm focus:outline-none focus:border-[#C5A36A]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8B5E3C] font-semibold mb-2">
                    Number of Guests
                  </label>
                  <select
                    value={rsvpData.guestCount}
                    onChange={(e) =>
                      setRsvpData({ ...rsvpData, guestCount: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-4 py-2.5 border border-[#E2D4BA] rounded-xs text-sm focus:outline-none focus:border-[#C5A36A]"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5+ Guests (Family)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8B5E3C] font-semibold mb-2">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, attendanceStatus: "attending" })}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-xs border transition cursor-pointer ${
                      rsvpData.attendanceStatus === "attending"
                        ? "bg-[#8B2635] text-white border-[#8B2635]"
                        : "border-[#E2D4BA] text-[#7A6A60] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    Joyfully Attend
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, attendanceStatus: "declined" })}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-xs border transition cursor-pointer ${
                      rsvpData.attendanceStatus === "declined"
                        ? "bg-[#8B2635] text-white border-[#8B2635]"
                        : "border-[#E2D4BA] text-[#7A6A60] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8B5E3C] font-semibold mb-2">
                  Warm Blessing or Message for the Couple
                </label>
                <textarea
                  rows={3}
                  value={rsvpData.personalBlessing}
                  onChange={(e) => setRsvpData({ ...rsvpData, personalBlessing: e.target.value })}
                  placeholder="Share your prayers and heartfelt wishes..."
                  className="w-full px-4 py-2.5 border border-[#E2D4BA] rounded-xs text-sm focus:outline-none focus:border-[#C5A36A]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRsvp}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#C5A36A] via-[#D4AF37] to-[#B38D4A] text-[#2E0B14] font-serif font-bold text-sm rounded-xs tracking-wider uppercase hover:opacity-95 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRsvp ? "Confirming Attendance..." : "Confirm My Attendance"}
              </button>
            </form>
          )}
        </section>

        {/* ========================================================
            STAGE 9: FINAL WEDDING MESSAGE & BRAND SIGNATURE
           ======================================================== */}
        <section ref={finaleRef} className="text-center pt-8 border-t border-[#E2D4BA]/80">
          <p className="font-serif italic text-lg sm:text-xl text-[#3E141B] max-w-lg mx-auto mb-6">
            “May love, laughter and royal elegance guide our journey together.”
          </p>

          <h3 className="font-serif text-3xl font-normal text-[#8B2635] mb-2">
            {coupleNames}
          </h3>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold mb-12">
            With Love from the Kapoor &amp; Sharma Families
          </p>

          {/* ExpertoMemories Brand Signature: Made with love by ExpertoMemories */}
          <div className="pt-6 border-t border-stone-200/60 text-xs font-serif text-stone-500">
            <span>Made with love by </span>
            <a
              href="https://expertomemories.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#8B2635] hover:text-[#C5A36A] transition underline decoration-[#C5A36A]/50"
            >
              ExpertoMemories
            </a>
          </div>
        </section>
      </main>

      {/* ========================================================
          FULL-SCREEN PHOTO LIGHTBOX MODAL
         ======================================================== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close Lightbox"
          >
            <X size={24} />
          </button>

          {/* Lightbox Image Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex]?.url}
              alt={photos[lightboxIndex]?.caption || "Royal Wedding Photo"}
              className="max-w-full max-h-[75vh] object-contain rounded-xs shadow-2xl border border-white/20"
            />
            {photos[lightboxIndex]?.caption && (
              <p className="font-serif italic text-sm text-stone-300 mt-4 text-center">
                {photos[lightboxIndex].caption}
              </p>
            )}
          </div>

          {/* Prev / Next buttons in Lightbox */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
                title="Previous photo"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev + 1) % photos.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition cursor-pointer"
                title="Next photo"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
