"use client";

import React, { useState, useEffect, useRef } from "react";
import { WebsiteProjectData, WebsiteSectionData } from "@/types/website";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Send,
  UserCheck,
  Sun,
  Flame,
  Music,
  PartyPopper,
  ShieldAlert,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExpertoMemoriesBrandSignature } from "@/components/common/ExpertoMemoriesBrandSignature";

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

export const HinduEditorialInvitation: React.FC<Props> = ({
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
  // 13 Section DOM Refs for GSAP ScrollTrigger Storytelling
  const heroRef = useRef<HTMLElement | null>(null);          // 1. Couple Introduction
  const blessingRef = useRef<HTMLElement | null>(null);      // 2. Welcome Blessing
  const familyRef = useRef<HTMLElement | null>(null);        // 3. Family Introduction
  const storyRef = useRef<HTMLElement | null>(null);         // 4. Couple Story
  const countdownRef = useRef<HTMLElement | null>(null);     // 5. Wedding Countdown
  const haldiRef = useRef<HTMLElement | null>(null);         // 6. Haldi Ceremony
  const mehendiRef = useRef<HTMLElement | null>(null);       // 7. Mehendi Ceremony
  const sangeetRef = useRef<HTMLElement | null>(null);       // 8. Sangeet Ceremony
  const weddingRef = useRef<HTMLElement | null>(null);       // 9. Wedding Ceremony
  const receptionRef = useRef<HTMLElement | null>(null);     // 10. Reception
  const venueRef = useRef<HTMLElement | null>(null);         // 11. Venue & Google Maps
  const rsvpRef = useRef<HTMLElement | null>(null);          // 12. Guest RSVP
  const finaleRef = useRef<HTMLElement | null>(null);        // 13. Final Invitation & Blessings

  // Address copy state
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate || "2026-10-18T18:00:00+05:30").getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    attendanceStatus: "attending",
    guestCount: 2,
    attendingEvents: [] as string[],
    dietaryNotes: "",
    personalBlessing: "",
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  // Extract Configured Events
  const configuredEvents = Array.isArray(eventsSec?.config?.events)
    ? eventsSec.config.events
    : [];

  const haldiEvent = configuredEvents.find((e: any) =>
    (e.id && e.id.toLowerCase().includes("haldi")) ||
    (e.title && e.title.toLowerCase().includes("haldi"))
  ) || {
    title: "Haldi & Phoolon Ki Holi",
    date: "Friday, 16 October 2026",
    time: "10.00 Onwards",
    venueName: "The Sunlit Courtyard, The Leela Palace",
    address: "Diplomatic Enclave, Chanakyapuri, New Delhi 110023",
    googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi",
    dressCode: "Sunshine Yellow & Festive Pastels",
    description: "A joyful morning of turmeric rituals, fragrant rose petal showers, high-energy dhol beats, and traditional delicacies.",
  };

  const mehendiEvent = configuredEvents.find((e: any) =>
    (e.id && e.id.toLowerCase().includes("mehendi")) ||
    (e.title && e.title.toLowerCase().includes("mehendi")) ||
    (e.title && e.title.toLowerCase().includes("henna"))
  ) || {
    title: "Mehendi & Henna Soiree",
    date: "Friday, 16 October 2026",
    time: "15.00 Onwards",
    venueName: "The Royal Verandah, The Leela Palace",
    address: "Diplomatic Enclave, Chanakyapuri, New Delhi 110023",
    googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi",
    dressCode: "Emerald Green & Floral Prints",
    description: "Intricate bridal henna artistry, festive folk music, bangle favors, and afternoon high tea.",
  };

  const sangeetEvent = configuredEvents.find((e: any) =>
    (e.id && e.id.toLowerCase().includes("sangeet")) ||
    (e.title && e.title.toLowerCase().includes("sangeet")) ||
    (e.title && e.title.toLowerCase().includes("ring"))
  ) || {
    title: "Ring Ceremony & Sangeet",
    date: "Saturday, 17 October 2026",
    time: "18.30 Onwards",
    venueName: "The Royal Ballroom, The Leela Palace",
    address: "Diplomatic Enclave, Chanakyapuri, New Delhi 110023",
    googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi",
    dressCode: "Regal Indowestern & Evening Formals",
    description: "An enchanting evening of ring exchange, choreographed dance performances, signature cocktails, and live sufi melodies.",
  };

  const weddingEvent = configuredEvents.find((e: any) =>
    (e.id && e.id.toLowerCase().includes("wedding")) ||
    (e.id && e.id.toLowerCase().includes("vivah")) ||
    (e.title && (e.title.toLowerCase().includes("vivah") || e.title.toLowerCase().includes("wedding") || e.title.toLowerCase().includes("phera")))
  ) || {
    title: "Shubh Vivah & Saptapadi",
    date: "Sunday, 18 October 2026",
    time: "16.30 (Baraat) • 18.00 (Pheras)",
    venueName: "The Heritage Mandap Lawn, The Leela Palace",
    address: "Diplomatic Enclave, Chanakyapuri, New Delhi 110023",
    googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi",
    dressCode: "Traditional Indian Elegance",
    description: "The royal procession followed by sacred Vedic vows and seven pheras around the holy fire.",
  };

  const receptionEvent = configuredEvents.find((e: any) =>
    (e.id && e.id.toLowerCase().includes("reception")) ||
    (e.title && e.title.toLowerCase().includes("reception")) ||
    (e.title && e.title.toLowerCase().includes("dinner"))
  ) || {
    title: "Grand Reception & Gala Dinner",
    date: "Sunday, 18 October 2026",
    time: "20.00 Onwards",
    venueName: "Grand Ballroom, The Leela Palace",
    address: "Diplomatic Enclave, Chanakyapuri, New Delhi 110023",
    googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi",
    dressCode: "Black-Tie or Heavy Traditional",
    description: "A celebratory banquet to bless the newlyweds with acoustic sitar recitals, gourmet culinary stations, and midnight toasts.",
  };

  // Register GSAP ScrollTrigger on Client (Skipped in Editor Preview to prevent canvas hiding)
  useEffect(() => {
    if (typeof window === "undefined" || previewMode) return;
    gsap.registerPlugin(ScrollTrigger);

    const sections = [
      heroRef.current,
      blessingRef.current,
      familyRef.current,
      storyRef.current,
      countdownRef.current,
      haldiRef.current,
      mehendiRef.current,
      sangeetRef.current,
      weddingRef.current,
      receptionRef.current,
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

  // Handle RSVP Submission
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

  return (
    <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-20 space-y-28 sm:space-y-36 text-[#3E141B] font-sans">
      {/* ========================================================
          SECTION 1 — COUPLE INTRODUCTION & EDITORIAL HERO
         ======================================================== */}
      <section
        ref={heroRef}
        id="sec-wedding-couple"
        data-section-id="sec-wedding-couple"
        data-section-type="wedding_couple"
        className="text-center pt-4"
      >
        {/* Sanskrit Auspicious Invocation Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-serif font-bold tracking-widest text-[#8B2635] bg-[#F5EFEB] border border-[#E2D4BA] mb-6 shadow-sm">
          <Sparkles size={12} className="text-[#C5A36A]" />
          <span>|| श्री गणेशाय नमः ||</span>
          <Sparkles size={12} className="text-[#C5A36A]" />
        </div>

        {/* Shloka Benediction */}
        <p className="font-serif text-xs sm:text-sm text-[#8B5E3C] max-w-lg mx-auto italic mb-8 tracking-wide">
          {openingSec?.config?.religiousBlessingText ||
            "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥"}
        </p>

        {/* Editorial Headline */}
        <span className="font-serif text-sm sm:text-base italic tracking-[0.25em] text-[#C5A36A] uppercase block mb-3">
          The Wedding Celebration of
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#3E141B] mb-4">
          {groomName} <span className="text-[#C5A36A] font-serif italic text-3xl sm:text-5xl">&</span> {brideName}
        </h1>

        <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#8B5E3C] font-semibold mb-12">
          {weddingDateText}
        </p>

        {/* Divine Promise Editorial Inscription */}
        <div className="relative py-8 px-6 sm:px-12 my-10 border-y border-[#E2D4BA]/80 text-center max-w-2xl mx-auto">
          <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-[#FAF7F2] px-4 text-[#C5A36A] text-sm">
            🪷
          </div>
          <p className="font-serif italic text-base sm:text-lg text-[#5A2A32] leading-relaxed">
            “Two souls united across time and tradition, embarking upon the sacred journey of the Saptapadi under divine blessings.”
          </p>
        </div>

        {/* Couple Portraits Gallery with Refined Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mt-12 max-w-3xl mx-auto">
          {/* Groom Editorial Frame */}
          <div className="group relative bg-[#FBF9F5] p-3 sm:p-4 rounded-sm border border-[#E2D4BA] shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-[#EFE9DF]">
              <img
                src={
                  coupleSec?.config?.groomPhotoUrl &&
                  !coupleSec.config.groomPhotoUrl.includes("/images/templates/")
                    ? coupleSec.config.groomPhotoUrl
                    : "/images/royal/groom_portrait.jpg"
                }
                alt={groomName}
                className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E0B14]/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#E2D4BA]">The Groom</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">{groomName}</h3>
                <p className="text-xs font-serif text-[#FAF7F2]/90 italic mt-0.5">
                  {coupleSec?.config?.groomTitle || "Son of Mr. Kirit Patel & Mrs. Savita Patel"}
                </p>
              </div>
            </div>
            {coupleSec?.config?.groomBio && (
              <p className="text-xs font-serif text-[#6B5B52] italic p-3 text-left">
                {coupleSec.config.groomBio}
              </p>
            )}
          </div>

          {/* Bride Editorial Frame */}
          <div className="group relative bg-[#FBF9F5] p-3 sm:p-4 rounded-sm border border-[#E2D4BA] shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-[#EFE9DF]">
              <img
                src={
                  coupleSec?.config?.bridePhotoUrl &&
                  !coupleSec.config.bridePhotoUrl.includes("/images/templates/")
                    ? coupleSec.config.bridePhotoUrl
                    : "/images/royal/bride_portrait.jpg"
                }
                alt={brideName}
                className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E0B14]/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#E2D4BA]">The Bride</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">{brideName}</h3>
                <p className="text-xs font-serif text-[#FAF7F2]/90 italic mt-0.5">
                  {coupleSec?.config?.brideTitle || "Daughter of Mr. Mohan Sharma & Mrs. Sharda Sharma"}
                </p>
              </div>
            </div>
            {coupleSec?.config?.brideBio && (
              <p className="text-xs font-serif text-[#6B5B52] italic p-3 text-left">
                {coupleSec.config.brideBio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2 — SACRED WELCOME BLESSING
         ======================================================== */}
      <section
        ref={blessingRef}
        id="sec-wedding-opening"
        data-section-id="sec-wedding-opening"
        data-section-type="wedding_opening"
        className="text-center max-w-2xl mx-auto px-4"
      >
        <div className="border border-[#E2D4BA] p-8 sm:p-12 bg-[#FBF9F5] shadow-xs relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FAF7F2] px-3 font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A]">
            Sacred Benediction
          </div>
          <span className="text-2xl text-[#C5A36A] block mb-3 font-serif">ॐ</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3E141B] mb-4">
            Welcome Blessings
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#5A2A32] leading-relaxed mb-6">
            “माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना।<br />
            कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम्॥”
          </p>
          <p className="text-xs sm:text-sm font-sans text-[#7A6A60] leading-relaxed">
            With the graceful blessings of Lord Ganesha, Lord Shiva, and our respected ancestors,
            we invite you and your family to join us in celebrating the auspicious union of {groomName} and {brideName}.
          </p>
        </div>
      </section>

      {/* ========================================================
          SECTION 3 — FAMILY INTRODUCTION & ANCESTRAL LINEAGE
         ======================================================== */}
      <section
        ref={familyRef}
        id="sec-wedding-family"
        data-section-id="sec-wedding-family"
        data-section-type="wedding_family"
        className="text-center max-w-3xl mx-auto"
      >
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2">
          Heritage & Lineage
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B] mb-10">
          Family Blessings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Groom's Family */}
          <div className="border border-[#E2D4BA]/80 p-6 sm:p-8 bg-white/70">
            <span className="text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold block mb-2">
              Patel Parivar
            </span>
            <h3 className="font-serif text-xl font-bold text-[#3E141B] mb-3">
              Groom&apos;s Parents & Family
            </h3>
            <p className="text-xs sm:text-sm font-serif text-[#6B5B52] leading-relaxed">
              Mr. Kirit Patel &amp; Mrs. Savita Patel, along with the entire Patel family,
              solicit your esteemed presence and blessings for their beloved son.
            </p>
          </div>

          {/* Bride's Family */}
          <div className="border border-[#E2D4BA]/80 p-6 sm:p-8 bg-white/70">
            <span className="text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold block mb-2">
              Sharma Parivar
            </span>
            <h3 className="font-serif text-xl font-bold text-[#3E141B] mb-3">
              Bride&apos;s Parents & Family
            </h3>
            <p className="text-xs sm:text-sm font-serif text-[#6B5B52] leading-relaxed">
              Mr. Mohan Sharma &amp; Mrs. Sharda Sharma, along with the entire Sharma family,
              request the pleasure of your company to shower their beloved daughter with love.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 4 — OUR SACRED STORY CHRONICLE
         ======================================================== */}
      <section
        ref={storyRef}
        id="sec-wedding-story"
        data-section-id="sec-wedding-story"
        data-section-type="wedding_story"
        className="max-w-2xl mx-auto text-center"
      >
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2">
          Destined By Stars
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B] mb-8">
          Our Sacred Story
        </h2>

        <div className="relative border-l border-[#E2D4BA] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10 text-left">
          {/* Milestone 1: The First Meeting */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border-2 border-[#C5A36A]" />
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#C5A36A] font-bold block mb-1">
              October 2023 &bull; New Delhi
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E141B] mb-1.5">
              The First Meeting
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              {storySec?.config?.meetingStory ||
                "Introduced through traditional family channels, our initial quiet conversation over ginger chai unfolded into hours of effortless laughter, shared philosophies, and an instant recognition that our souls had known each other forever."}
            </p>
          </div>

          {/* Milestone 2: The Courtship */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border-2 border-[#C5A36A]" />
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#C5A36A] font-bold block mb-1">
              Spring 2024 &bull; Jaipur &amp; Varanasi
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E141B] mb-1.5">
              Deepening Bonds &amp; Sacred Horizons
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              From attending the evening Ganga Aarti together to quiet weekend road trips across Rajasthan, every season revealed deeper trust, shared devotion, and mutual respect.
            </p>
          </div>

          {/* Milestone 3: The Proposal */}
          <div className="relative">
            <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-3.5 h-3.5 rounded-full bg-[#FAF7F2] border-2 border-[#C5A36A]" />
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#C5A36A] font-bold block mb-1">
              Winter 2025 &bull; The Sacred Yes
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3E141B] mb-1.5">
              Two Families, One Heart
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#6B5B52] leading-relaxed">
              {storySec?.config?.proposalStory ||
                "Surrounded by diyas, marigold garlands, and the blessings of both sets of parents, Akshar asked Priya to walk the seven sacred vows of life together. Her joyful tearful yes echoed through every heart."}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5 — SACRED MUHURTHAM COUNTDOWN
         ======================================================== */}
      <section
        ref={countdownRef}
        id="sec-wedding-countdown"
        data-section-id="sec-wedding-countdown"
        data-section-type="wedding_countdown"
        className="text-center py-6"
      >
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2">
          The Auspicious Muhurtham
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B] mb-4">
          Awaiting The Sacred Hour
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#7A6A60] mb-8">
          Ceremonies commence in {venueCity}
        </p>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
          {[
            { label: "Days", val: timeLeft.days },
            { label: "Hours", val: timeLeft.hours },
            { label: "Minutes", val: timeLeft.minutes },
            { label: "Seconds", val: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-[#E2D4BA] rounded-xs py-4 px-2 shadow-xs text-center"
            >
              <span className="font-serif text-2xl sm:text-4xl font-normal text-[#8B2635] block">
                {String(item.val).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8B5E3C] font-semibold mt-1 block">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          CEREMONIAL ITINERARY HEADER
         ======================================================== */}
      <div className="text-center max-w-xl mx-auto -mb-16">
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2">
          Sacred Ceremonies
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B]">
          Wedding Itinerary
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#7A6A60] mt-2">
          We invite you to grace each ceremonial milestone with your presence and blessings.
        </p>
      </div>

      {/* ========================================================
          SECTION 6 — HALDI CEREMONY
         ======================================================== */}
      <section
        ref={haldiRef}
        id="sec-wedding-haldi"
        data-section-id="sec-wedding-events"
        data-section-type="wedding_events"
        className="border border-[#E2D4BA] p-6 sm:p-10 bg-[#FFFCF5] relative shadow-xs"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-full bg-[#FEF08A]/80 text-[#854D0E]">
            <Sun size={20} />
          </div>
          <div>
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#B45309] font-bold">
              Ceremony 1
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#3E141B]">{haldiEvent.title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-sans text-[#5A4A42] leading-relaxed mb-6">
          {haldiEvent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E2D4BA]/80 pt-4 text-xs font-sans text-[#7A6A60]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A36A]" />
            <span>{haldiEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#C5A36A]" />
            <span>{haldiEvent.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#C5A36A]" />
            <span>Dress: {haldiEvent.dressCode}</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7 — MEHENDI CEREMONY
         ======================================================== */}
      <section
        ref={mehendiRef}
        id="sec-wedding-mehendi"
        data-section-id="sec-wedding-events"
        data-section-type="wedding_events"
        className="border border-[#E2D4BA] p-6 sm:p-10 bg-[#F7FBF8] relative shadow-xs"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-full bg-[#DCFCE7] text-[#166534]">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#15803D] font-bold">
              Ceremony 2
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#3E141B]">{mehendiEvent.title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-sans text-[#5A4A42] leading-relaxed mb-6">
          {mehendiEvent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E2D4BA]/80 pt-4 text-xs font-sans text-[#7A6A60]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A36A]" />
            <span>{mehendiEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#C5A36A]" />
            <span>{mehendiEvent.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#C5A36A]" />
            <span>Dress: {mehendiEvent.dressCode}</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8 — SANGEET CEREMONY
         ======================================================== */}
      <section
        ref={sangeetRef}
        id="sec-wedding-sangeet"
        data-section-id="sec-wedding-events"
        data-section-type="wedding_events"
        className="border border-[#E2D4BA] p-6 sm:p-10 bg-[#FAF7F2] relative shadow-xs"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-full bg-[#E0E7FF] text-[#3730A3]">
            <Music size={20} />
          </div>
          <div>
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#4338CA] font-bold">
              Ceremony 3
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#3E141B]">{sangeetEvent.title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-sans text-[#5A4A42] leading-relaxed mb-6">
          {sangeetEvent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E2D4BA]/80 pt-4 text-xs font-sans text-[#7A6A60]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A36A]" />
            <span>{sangeetEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#C5A36A]" />
            <span>{sangeetEvent.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#C5A36A]" />
            <span>Dress: {sangeetEvent.dressCode}</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9 — WEDDING CEREMONY (SHUBH VIVAH)
         ======================================================== */}
      <section
        ref={weddingRef}
        id="sec-wedding-events"
        data-section-id="sec-wedding-events"
        data-section-type="wedding_events"
        className="border-2 border-[#C5A36A] p-6 sm:p-12 bg-[#FFFBF5] relative shadow-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-[#FEE2E2] text-[#991B1B]">
            <Flame size={24} />
          </div>
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#991B1B] font-bold">
              Ceremony 4 &bull; Main Event
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#3E141B]">{weddingEvent.title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-sans text-[#5A4A42] leading-relaxed mb-6">
          {weddingEvent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#C5A36A]/50 pt-4 text-xs font-sans text-[#7A6A60]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A36A]" />
            <span>{weddingEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#C5A36A]" />
            <span>{weddingEvent.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#C5A36A]" />
            <span>Dress: {weddingEvent.dressCode}</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10 — GRAND RECEPTION
         ======================================================== */}
      <section
        ref={receptionRef}
        id="sec-wedding-reception"
        data-section-id="sec-wedding-events"
        data-section-type="wedding_events"
        className="border border-[#E2D4BA] p-6 sm:p-10 bg-[#FAF7F2] relative shadow-xs"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
            <PartyPopper size={20} />
          </div>
          <div>
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#B45309] font-bold">
              Ceremony 5
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#3E141B]">{receptionEvent.title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-sans text-[#5A4A42] leading-relaxed mb-6">
          {receptionEvent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E2D4BA]/80 pt-4 text-xs font-sans text-[#7A6A60]">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A36A]" />
            <span>{receptionEvent.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#C5A36A]" />
            <span>{receptionEvent.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#C5A36A]" />
            <span>Dress: {receptionEvent.dressCode}</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6 — PORTRAIT GALLERY & CHERISHED MOMENTS
         ======================================================== */}
      <section
        id="sec-wedding-gallery"
        data-section-id="sec-wedding-gallery"
        data-section-type="wedding_gallery"
        className="text-center max-w-4xl mx-auto px-4"
      >
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2">
          Cherished Memories
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B] mb-4">
          {gallerySec?.config?.headline || "Moments & Portraits"}
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#7A6A60] max-w-md mx-auto mb-8">
          {gallerySec?.config?.subtext || "Glimpses of quiet smiles, auspicious milestones, and timeless love."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(gallerySec?.config?.photos && gallerySec.config.photos.length > 0
            ? gallerySec.config.photos
            : [
                {
                  id: "g1",
                  url: "/images/royal/palace_hero.jpg",
                  caption: "The Royal Union",
                  category: "Portrait",
                },
                {
                  id: "g2",
                  url: "/images/royal/palace_arch.jpg",
                  caption: "Sacred Vows",
                  category: "Ceremony",
                },
                {
                  id: "g3",
                  url: "/images/royal/palace_courtyard.jpg",
                  caption: "Celebrations",
                  category: "Celebrations",
                },
              ]
          ).slice(0, 6).map((photo: any, idx: number) => (
            <div
              key={photo.id || idx}
              className="group relative bg-[#FBF9F5] p-2.5 rounded-xs border border-[#E2D4BA] shadow-xs overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-xs bg-[#EFE9DF] relative">
                <img
                  src={photo.url || "/images/royal/palace_hero.jpg"}
                  alt={photo.caption || `Wedding portrait ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {photo.caption && (
                <p className="font-serif italic text-xs text-[#5A2A32] mt-2 truncate px-1 text-left">
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 11 — VENUE & GOOGLE MAPS CONCIERGE
         ======================================================== */}
      <section
        ref={venueRef}
        id="sec-wedding-travel"
        data-section-id="sec-wedding-travel"
        data-section-type="wedding_travel"
        className="max-w-2xl mx-auto text-center"
      >
        <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2">
          Hospitality &amp; Location
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B] mb-8">
          Venue &amp; Concierge
        </h2>

        <div className="border border-[#E2D4BA] p-6 sm:p-10 bg-white/80 shadow-xs text-left">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3E141B] mb-1">
            {venueSec?.config?.venueName || "The Heritage Mandap Lawn, The Leela Palace"}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#7A6A60] mb-6 flex items-start gap-2">
            <MapPin size={16} className="text-[#C5A36A] shrink-0 mt-0.5" />
            <span>{venueSec?.config?.venueAddress || "Diplomatic Enclave, Chanakyapuri, New Delhi 110023"}</span>
          </p>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E2D4BA]/70">
            <a
              href={venueSec?.config?.googleMapsUrl || "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8B2635] text-white text-xs font-semibold hover:bg-[#6E1C29] transition shadow-xs"
            >
              <ExternalLink size={14} />
              <span>Open in Google Maps</span>
            </a>

            <button
              type="button"
              onClick={() =>
                copyAddressToClipboard(
                  venueSec?.config?.venueAddress || "Diplomatic Enclave, Chanakyapuri, New Delhi 110023"
                )
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C5A36A] text-[#8B2635] text-xs font-semibold hover:bg-[#FAF7F2] transition"
            >
              {copiedAddress ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              <span>{copiedAddress ? "Address Copied!" : "Copy Full Address"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 12 — WEDDING GUEST RSVP FORM
         ======================================================== */}
      <section
        ref={rsvpRef}
        id="sec-wedding-rsvp"
        data-section-id="sec-wedding-rsvp"
        data-section-type="wedding_rsvp"
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#C5A36A] block mb-2">
            Kindly Respond
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3E141B]">
            Confirm Your Attendance
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#7A6A60] mt-2">
            Please let us know if you can join us for these sacred celebrations.
          </p>
        </div>

        {isRsvpSubmitted ? (
          <div className="border border-[#C5A36A] p-8 sm:p-12 bg-[#FBF9F5] text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto mb-4">
              <Check size={24} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#3E141B] mb-2">
              Dhanyawaad &amp; Thank You!
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#7A6A60] max-w-md mx-auto">
              Your RSVP has been graciously recorded. We look forward to celebrating this sacred milestone in your joyful company.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="border border-[#E2D4BA] p-6 sm:p-10 bg-white shadow-xs space-y-6">
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
                placeholder="e.g. Ramesh &amp; Meena Sharma"
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
                  onChange={(e) => setRsvpData({ ...rsvpData, guestCount: parseInt(e.target.value, 10) })}
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
                  className={`py-2.5 px-4 text-xs font-semibold rounded-xs border transition ${
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
                  className={`py-2.5 px-4 text-xs font-semibold rounded-xs border transition ${
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
              {isSubmittingRsvp ? "Sending Blessings..." : "Confirm My Attendance"}
            </button>
          </form>
        )}
      </section>

      {/* ========================================================
          SECTION 13 — FINAL INVITATION & BRAND SIGNATURE
         ======================================================== */}
      <section
        ref={finaleRef}
        id="sec-wedding-wishes"
        data-section-id="sec-wedding-wishes"
        data-section-type="wedding_wishes"
        className="text-center pt-8 border-t border-[#E2D4BA]/80"
      >
        <p className="font-serif italic text-lg sm:text-xl text-[#3E141B] max-w-lg mx-auto mb-6">
          “May love and sacred harmony forever brighten our path as we start this divine new chapter.”
        </p>

        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#8B2635] mb-2">
          {coupleNames}
        </h3>
        <p className="text-xs uppercase tracking-[0.25em] text-[#8B5E3C] font-semibold mb-12">
          With Love from the Patel &amp; Sharma Families
        </p>

        {/* ExpertoMemories Luxury Brand Signature */}
        <ExpertoMemoriesBrandSignature occasionType="wedding" variant="luxury-gold" />
      </section>
    </main>
  );
};
