"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plane, Compass, Sparkles, MapPin, Calendar, ChevronRight, Volume2, VolumeX } from "lucide-react";

interface DestinationOpeningAnimationProps {
  config: {
    headline?: string;
    coupleNames?: string;
    weddingDateText?: string;
    actionButtonText?: string;
    skipButtonText?: string;
    audioNotice?: string;
    religiousBlessingText?: string;
    culturalSymbol?: string;
    monogram?: string;
    venueCity?: string;
  };
  onOpenInvitation: () => void;
  isOpen: boolean;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
}

export const DestinationOpeningAnimation: React.FC<DestinationOpeningAnimationProps> = ({
  config,
  onOpenInvitation,
  isOpen,
  isPlayingMusic,
  onToggleMusic,
}) => {
  // 5 Scenes: 0: Runway, 1: Takeoff, 2: Cloud Cruise, 3: Destination Reveal, 4: Passport Folio
  const [scene, setScene] = useState<number>(0);
  const [animating, setAnimating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const coupleNames = config.coupleNames || "Kabir & Natasha";
  const weddingDateText = config.weddingDateText || "November 06 – 08, 2026 • South Goa, India";
  const venueCity = config.venueCity || "South Goa, India";
  const monogram = config.monogram || "K & N";

  const clearAllTimers = () => {
    timerRef.current.forEach((t) => clearTimeout(t));
    timerRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Listen for editor "preview-opening" custom event
  useEffect(() => {
    const handlePreviewOpening = () => {
      clearAllTimers();
      setScene(0);
      setAnimating(false);
      setIsDismissed(false);
    };
    window.addEventListener("preview-opening", handlePreviewOpening);
    return () => window.removeEventListener("preview-opening", handlePreviewOpening);
  }, []);

  // Check reduced motion preference
  const isReducedMotion = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const handleStartFlight = () => {
    if (animating) return;

    if (isReducedMotion()) {
      handleComplete();
      return;
    }

    setAnimating(true);
    // Scene 1: Acceleration & Takeoff
    setScene(1);

    // Scene 2: Cloud Transit & Cruise (after 1.8s)
    const t1 = setTimeout(() => {
      setScene(2);
    }, 1800);

    // Scene 3: Destination Reveal (after 3.6s)
    const t2 = setTimeout(() => {
      setScene(3);
    }, 3600);

    // Scene 4: Passport / Envelope Arrival (after 5.2s)
    const t3 = setTimeout(() => {
      setScene(4);
    }, 5200);

    timerRef.current = [t1, t2, t3];
  };

  const handleComplete = () => {
    clearAllTimers();
    setIsDismissed(true);
    onOpenInvitation();
  };

  if (isOpen || isDismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden select-none bg-[#07131E] min-h-[100dvh] flex flex-col justify-between items-center"
      style={{
        background: "radial-gradient(ellipse at 50% 20%, #17324D 0%, #0B1E2E 45%, #050D15 100%)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Destination Wedding Flight Experience"
    >
      {/* Background Ambience: Stars & Horizon Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C4A052_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:32px_32px]" />
        <div
          className={`absolute bottom-0 inset-x-0 h-[50vh] sm:h-[65vh] transition-all duration-1000 ${
            scene >= 2
              ? "bg-gradient-to-t from-[#E8A87C]/25 via-[#C38D9E]/15 to-transparent"
              : "bg-gradient-to-t from-[#1F4068]/30 via-[#162447]/15 to-transparent"
          }`}
        />
        {scene >= 2 && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-b from-[#F5D061]/20 to-transparent blur-3xl animate-pulse" />
        )}
      </div>

      {/* Persistent Fixed Header: Skip & Audio Controls */}
      <header className="fixed top-0 inset-x-0 h-14 px-3 sm:px-8 flex items-center justify-between z-50 bg-[#07131E]/85 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37]/40 bg-[#0E2235]/80 flex items-center justify-center text-[#E5C378] shadow-sm shrink-0">
            <Compass size={14} className="animate-[spin_12s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-mono text-[#D4AF37]/90 font-semibold">
              FIRST CLASS FLIGHT
            </span>
            <span className="text-[11px] sm:text-xs font-serif text-stone-200 hidden xs:inline">
              ExpertoMemories Aviation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleMusic && (
            <button
              type="button"
              onClick={onToggleMusic}
              className="px-2.5 sm:px-3 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#0E2235]/80 text-[#E5C378] hover:bg-[#D4AF37]/20 transition-all flex items-center gap-1 text-xs cursor-pointer min-h-[32px]"
              title={isPlayingMusic ? "Mute Background Music" : "Play Background Music"}
              aria-label={isPlayingMusic ? "Mute Background Music" : "Play Background Music"}
            >
              {isPlayingMusic ? <Volume2 size={13} className="animate-pulse" /> : <VolumeX size={13} />}
              <span className="hidden md:inline font-mono text-[10px]">SOUND</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleComplete}
            className="px-3 sm:px-4 py-1.5 rounded-full border border-stone-400/30 bg-stone-900/80 hover:bg-[#D4AF37] hover:text-[#0A1926] text-stone-200 text-xs font-mono tracking-wider flex items-center gap-1 cursor-pointer shadow-md min-h-[32px]"
          >
            <span>{config.skipButtonText || "Skip"}</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </header>

      {/* Main Center Content Spacer (accounting for fixed header) */}
      <div className="w-full flex-1 pt-16 sm:pt-20 pb-4 px-3 sm:px-4 flex flex-col items-center justify-center">
        {/* ========================================================
            SCENE 0: RUNWAY PRE-BOARDING & ANTICIPATION
           ======================================================== */}
        {scene === 0 && (
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center animate-[fadeIn_0.8s_ease-out]">
            {/* Top Expedition Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#0B2032]/80 backdrop-blur-md text-[#E5C378] mb-3 sm:mb-4 shadow-sm">
              <Plane size={11} className="rotate-45 text-[#F3D389]" />
              <span className="text-[10px] font-mono tracking-widest uppercase">
                DESTINATION WEDDING
              </span>
            </div>

            {/* Departure Card */}
            <div className="w-full bg-gradient-to-b from-[#102A43]/95 via-[#0D2235]/95 to-[#081724]/95 border border-[#D4AF37]/35 rounded-2xl p-4 sm:p-7 backdrop-blur-xl shadow-2xl text-stone-100 relative overflow-hidden">
              <p className="text-[11px] sm:text-xs font-serif italic tracking-wide text-[#E5C378] mb-1.5">
                You are cordially invited to embark upon
              </p>

              <h1 className="text-xl sm:text-3xl font-serif font-normal text-white tracking-wide mb-2">
                The Wedding Journey of
              </h1>

              <div className="py-2 px-3 my-2 border-y border-[#D4AF37]/30 flex items-center justify-center">
                <span className="text-xl sm:text-3xl font-serif font-medium text-[#F6E0A4] tracking-wider truncate max-w-full">
                  {coupleNames}
                </span>
              </div>

              {/* Compact Responsive Flight Route */}
              <div className="my-3 sm:my-4 p-2.5 sm:p-3 rounded-xl bg-[#061421]/80 border border-[#234A6F] flex items-center justify-between text-left gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-sky-300 uppercase">
                    ORIGIN
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                    HOME HEARTS
                  </span>
                  <span className="text-[9px] text-stone-400">Gate: Forever</span>
                </div>

                <div className="flex flex-col items-center px-1 shrink-0">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <span className="w-5 sm:w-10 h-[1px] bg-[#D4AF37]/60" />
                    <Plane size={13} className="rotate-90 text-[#F5D061] animate-pulse" />
                    <span className="w-5 sm:w-10 h-[1px] bg-[#D4AF37]/60" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-mono text-[#E5C378] mt-0.5 tracking-wider">
                    DIRECT
                  </span>
                </div>

                <div className="flex flex-col text-right min-w-0">
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#E5C378] uppercase">
                    DESTINATION
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                    {venueCity}
                  </span>
                  <span className="text-[9px] text-stone-400">Class: First</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-300 font-serif mb-4">
                <Calendar size={13} className="text-[#D4AF37] shrink-0" />
                <span className="truncate">{weddingDateText}</span>
              </div>

              {/* Board Flight Button */}
              <button
                type="button"
                onClick={handleStartFlight}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-serif text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#091825] bg-gradient-to-r from-[#F7E1A0] via-[#E5C378] to-[#C89B3C] hover:from-[#FFF0C2] hover:to-[#DBA843] shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Plane size={15} className="rotate-45" />
                <span>{config.actionButtonText || "Board Flight & Begin Journey ✈️"}</span>
              </button>

              {config.audioNotice && (
                <p className="mt-2.5 text-[9px] sm:text-[10px] text-stone-400 font-mono tracking-tight">
                  ♪ {config.audioNotice}
                </p>
              )}
            </div>

            {/* Runway Perspective Glow */}
            <div className="w-full max-w-xs h-8 sm:h-10 mt-2 relative overflow-hidden flex justify-center items-end opacity-50">
              <div className="w-0.5 h-8 bg-gradient-to-t from-[#D4AF37] to-transparent animate-pulse" />
              <div className="absolute inset-x-4 bottom-0 flex justify-between">
                <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCENE 1: RUNWAY ACCELERATION & TAKEOFF
           ======================================================== */}
        {scene === 1 && (
          <div className="relative z-20 w-full flex flex-col items-center justify-center my-auto">
            {/* Runway centerline lights */}
            <div className="absolute inset-x-0 bottom-0 top-1/3 overflow-hidden pointer-events-none flex justify-center">
              <div className="w-64 max-w-full h-full flex justify-between relative">
                <div className="w-[1px] bg-emerald-400/80 animate-[runwayStreak_0.5s_linear_infinite]" />
                <div className="w-[1px] border-l border-dashed border-[#D4AF37]/60 animate-[runwayStreak_0.35s_linear_infinite]" />
                <div className="w-[1px] bg-emerald-400/80 animate-[runwayStreak_0.5s_linear_infinite]" />
              </div>
            </div>

            <div className="relative flex flex-col items-center animate-[aircraftTakeoffMobile_2s_cubic-bezier(0.22,1,0.36,1)_forwards]">
              <svg
                className="w-36 sm:w-56 h-auto text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="100" cy="180" rx="14" ry="24" fill="url(#jetGlow)" opacity="0.85" className="animate-pulse" />
                <ellipse cx="100" cy="172" rx="7" ry="14" fill="#FFE599" />
                <path
                  d="M100 20 C108 40 114 90 114 140 C114 165 110 172 100 172 C90 172 86 165 86 140 C86 90 92 40 100 20 Z"
                  fill="url(#fuselageGrad)"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                <path d="M95 38 C97 32 103 32 105 38 L106 48 C103 46 97 46 94 48 Z" fill="#38BDF8" opacity="0.9" />
                <path d="M87 95 L15 132 C12 134 14 138 18 138 L87 132 Z" fill="url(#wingGrad)" stroke="#D4AF37" strokeWidth="1" />
                <path d="M113 95 L185 132 C188 134 186 138 182 138 L113 132 Z" fill="url(#wingGrad)" stroke="#D4AF37" strokeWidth="1" />
                <path d="M90 152 L62 168 C60 169 61 172 63 172 L90 165 Z" fill="#D4AF37" />
                <path d="M110 152 L138 168 C140 169 139 172 137 172 L110 165 Z" fill="#D4AF37" />
                <path d="M98 135 L102 135 L101 168 L99 168 Z" fill="#F5D061" />
                <circle cx="100" cy="105" r="7" fill="#0A1E2F" stroke="#D4AF37" strokeWidth="1" />
                <text x="100" y="108" fill="#F5D061" fontSize="5" fontFamily="serif" textAnchor="middle">
                  {monogram.replace("&", "•")}
                </text>

                <defs>
                  <linearGradient id="fuselageGrad" x1="100" y1="20" x2="100" y2="172" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F8FAFC" />
                    <stop offset="0.7" stopColor="#E2E8F0" />
                    <stop offset="1" stopColor="#CBD5E1" />
                  </linearGradient>
                  <linearGradient id="wingGrad" x1="100" y1="95" x2="15" y2="138" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#CBD5E1" />
                    <stop offset="1" stopColor="#94A3B8" />
                  </linearGradient>
                  <radialGradient id="jetGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 180) rotate(90) scale(24 14)">
                    <stop stopColor="#F97316" />
                    <stop offset="0.6" stopColor="#EAB308" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#EAB308" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              <div className="mt-6 px-3.5 py-1 rounded-full bg-black/60 border border-[#D4AF37]/50 backdrop-blur-md text-center text-[10px] sm:text-xs font-mono text-[#F3D389] tracking-wider uppercase animate-pulse">
                TAKEOFF POWER SET • CLIMBING OUT 🛫
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCENE 2: CLOUD TRANSIT & CRUISE
           ======================================================== */}
        {scene === 2 && (
          <div className="relative z-20 w-full flex flex-col items-center justify-center my-auto overflow-hidden">
            {/* Bounded Sunset Cloud Drift */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[15%] -left-10 w-full h-36 bg-gradient-to-r from-[#DDA7A5]/25 via-[#E8B4B8]/15 to-transparent blur-2xl rounded-full animate-[cloudDrift_8s_linear_infinite]" />
              <div className="absolute top-[45%] -right-10 w-full h-44 bg-gradient-to-l from-[#F3D089]/20 via-[#C38D9E]/15 to-transparent blur-2xl rounded-full animate-[cloudDrift_10s_linear_infinite_reverse]" />
            </div>

            <div className="relative flex flex-col items-center animate-[aircraftCruise_3s_ease-in-out_infinite]">
              <svg
                className="w-40 sm:w-60 h-auto text-white drop-shadow-[0_20px_40px_rgba(232,168,124,0.4)]"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="16" y1="138" x2="16" y2="210" stroke="white" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" className="animate-pulse" />
                <line x1="184" y1="138" x2="184" y2="210" stroke="white" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" className="animate-pulse" />
                <path
                  d="M100 20 C108 40 114 90 114 140 C114 165 110 172 100 172 C90 172 86 165 86 140 C86 90 92 40 100 20 Z"
                  fill="url(#cruiseFuselage)"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                <line x1="100" y1="35" x2="100" y2="165" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 2" />
                <path d="M95 38 C97 32 103 32 105 38 L106 48 C103 46 97 46 94 48 Z" fill="#7DD3FC" />
                <path d="M87 95 L15 132 C12 134 14 138 18 138 L87 132 Z" fill="#F1F5F9" stroke="#D4AF37" strokeWidth="1" />
                <path d="M113 95 L185 132 C188 134 186 138 182 138 L113 132 Z" fill="#F1F5F9" stroke="#D4AF37" strokeWidth="1" />
                <path d="M90 152 L62 168 C60 169 61 172 63 172 L90 165 Z" fill="#D4AF37" />
                <path d="M110 152 L138 168 C140 169 139 172 137 172 L110 165 Z" fill="#D4AF37" />

                <defs>
                  <linearGradient id="cruiseFuselage" x1="86" y1="96" x2="114" y2="96" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F8FAFC" />
                    <stop offset="0.5" stopColor="#FFFFFF" />
                    <stop offset="1" stopColor="#E2E8F0" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="mt-6 px-3.5 py-1.5 rounded-full bg-[#081B2B]/90 border border-[#D4AF37]/50 backdrop-blur-md flex items-center gap-2 text-stone-200 max-w-[90vw]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-[10px] sm:text-xs font-serif tracking-wider text-[#F6E0A4] truncate">
                  CRUISING TO PARADISE • 35,000 FT
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCENE 3: DESTINATION REVEAL
           ======================================================== */}
        {scene === 3 && (
          <div className="relative z-20 w-full max-w-sm mx-auto flex flex-col items-center text-center animate-[fadeIn_0.8s_ease-out] my-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#F5D061] to-[#C89B3C] p-0.5 shadow-[0_0_30px_rgba(245,208,97,0.5)] mb-3 animate-bounce">
              <div className="w-full h-full rounded-full bg-[#071725] flex items-center justify-center text-[#F5D061]">
                <MapPin size={22} className="text-[#F5D061]" />
              </div>
            </div>

            <span className="text-[10px] font-mono tracking-widest uppercase text-[#F3D389] mb-1">
              DESTINATION REACHED
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-wide mb-2">
              {venueCity}
            </h2>

            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-2" />

            <p className="text-xs sm:text-sm font-serif italic text-stone-300 max-w-xs mb-4">
              “Where golden sunsets meet the ocean breeze, we gather to celebrate eternal love.”
            </p>

            <div className="px-3 py-1.5 rounded-full bg-[#0F293F]/90 border border-[#D4AF37]/40 text-[10px] sm:text-xs font-mono text-stone-300 flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#F5D061] animate-spin" />
              <span>Landing Clearance Approved</span>
            </div>
          </div>
        )}

        {/* ========================================================
            SCENE 4: PASSPORT / LUXURY FOLIO ARRIVAL
           ======================================================== */}
        {scene === 4 && (
          <div className="relative z-20 w-full max-w-sm mx-auto flex flex-col items-center text-center animate-[envelopeDrop_1s_cubic-bezier(0.16,1,0.3,1)_forwards] my-auto">
            <div className="w-full bg-gradient-to-b from-[#142F47] via-[#0E2437] to-[#081724] border-2 border-[#D4AF37] rounded-2xl sm:rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute inset-1.5 sm:inset-2 border border-[#D4AF37]/30 rounded-xl pointer-events-none" />

              <div className="flex flex-col items-center mb-3">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border border-[#D4AF37] bg-[#0A1A28] flex items-center justify-center text-[#F5D061] shadow-sm mb-1.5">
                  <Compass size={20} className="animate-[spin_20s_linear_infinite]" />
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#F3D389]">
                  PASSPORT TO CELEBRATION
                </span>
              </div>

              <div className="py-1">
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-widest text-[#F9E2AF]">
                  {monogram}
                </h3>
                <p className="text-[10px] sm:text-xs font-serif text-[#C4A052] uppercase tracking-wider mt-0.5">
                  FIRST CLASS GUEST INVITATION
                </p>
              </div>

              <div className="my-3 py-2 px-2.5 border border-dashed border-[#D4AF37]/50 rounded-xl bg-[#06121D]/60 flex items-center justify-between text-left">
                <div>
                  <span className="text-[7px] sm:text-[8px] font-mono uppercase text-sky-400 block">DESTINATION</span>
                  <span className="text-xs font-semibold text-white">{venueCity}</span>
                </div>
                <div className="h-5 w-[1px] bg-[#D4AF37]/30" />
                <div>
                  <span className="text-[7px] sm:text-[8px] font-mono uppercase text-[#F3D389] block">DATE</span>
                  <span className="text-xs font-semibold text-white">{weddingDateText.split("•")[0]}</span>
                </div>
                <div className="h-5 w-[1px] bg-[#D4AF37]/30" />
                <div className="text-right">
                  <span className="text-[7px] sm:text-[8px] font-mono uppercase text-emerald-400 block">STATUS</span>
                  <span className="text-xs font-bold text-emerald-300">CONFIRMED</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                className="w-full mt-2 py-3 px-4 rounded-xl font-serif text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#091825] bg-gradient-to-r from-[#F7E1A0] via-[#E5C378] to-[#C89B3C] hover:from-[#FFF0C2] hover:to-[#DBA843] shadow-[0_4px_25px_rgba(212,175,55,0.5)] transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Sparkles size={15} className="text-[#091825]" />
                <span>Unfold Invitation Folio ✉️</span>
              </button>
            </div>

            <p className="mt-3 text-xs font-serif text-[#E5C378]/80 italic">
              Tap to open the complete wedding celebration folio
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes runwayStreak {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        @keyframes aircraftTakeoffMobile {
          0% {
            transform: scale(0.7) translateY(80px) rotate(-1deg);
            opacity: 0.6;
          }
          50% {
            transform: scale(0.85) translateY(10px) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.95) translateY(-90px) rotate(5deg);
            opacity: 0.95;
          }
        }
        @keyframes aircraftCruise {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1deg);
          }
        }
        @keyframes cloudDrift {
          0% {
            transform: translateX(-5%);
          }
          100% {
            transform: translateX(5%);
          }
        }
        @keyframes envelopeDrop {
          0% {
            transform: translateY(-50px) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
