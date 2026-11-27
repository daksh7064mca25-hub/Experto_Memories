"use client";

import React, { useMemo } from "react";
import { Moon, Sparkles, MapPin, Calendar, Heart } from "lucide-react";
import { AnniversaryMoonConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { calculateMoonPhase, MoonPhaseData } from "@/lib/moon-phase";

interface Props {
  config: AnniversaryMoonConfig;
  relationshipStartDate?: string;
  partner1Name?: string;
  partner2Name?: string;
  theme?: ThemeId;
}

export function AnniversaryMoonSection({
  config,
  relationshipStartDate,
  partner1Name = "Olivia",
  partner2Name = "Liam",
  theme = "pink-paradise",
}: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");

  const effectiveDate = config.meetingDate || relationshipStartDate || "October 14, 2021";
  const location = config.location || "Underneath a sky full of stars";
  const headline = config.headline || "The Moon on the Day We Met";
  const subtext =
    config.subtext || "The exact astronomical phase of the moon shining above the night our story began.";
  const personalMessage =
    config.personalMessage ||
    "Under this exact sky, the universe aligned and brought you into my life. Every time I look up at the moon, I remember that we are always under the same sky.";

  // Calculate astronomical phase
  const moonData: MoonPhaseData = useMemo(() => {
    return calculateMoonPhase(effectiveDate);
  }, [effectiveDate]);

  // Helper to generate realistic moon illumination mask
  // Radius R = 60, Center (75, 75)
  const renderMoonIllumination = () => {
    const cx = 75;
    const cy = 75;
    const r = 58;
    const pct = moonData.illuminationPercent / 100;
    const isWaxing = moonData.isWaxing;

    // Full moon
    if (moonData.phaseCode === "full_moon" || pct >= 0.95) {
      return <circle cx={cx} cy={cy} r={r} fill="url(#moonSurface)" filter="url(#moonGlow)" />;
    }

    // New moon
    if (moonData.phaseCode === "new_moon" || pct <= 0.05) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="#1C1824"
          stroke="rgba(232, 180, 184, 0.4)"
          strokeWidth="1.5"
        />
      );
    }

    // Calculate curve based on illumination fraction
    // Ellipse radius x goes from -r to +r
    const rx = Math.abs(r * (2 * pct - 1));
    const sweep = pct >= 0.5 ? 1 : 0;

    let pathD = "";
    if (isWaxing) {
      // Light is on the right side
      pathD = `M ${cx} ${cy - r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r} Z`;
    } else {
      // Light is on the left side
      pathD = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;
    }

    return (
      <g>
        {/* Dark base disc */}
        <circle cx={cx} cy={cy} r={r} fill="#1E1926" />
        {/* Illuminated portion */}
        <path d={pathD} fill="url(#moonSurface)" filter="url(#moonGlow)" />
        {/* Outer outline */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(232, 180, 184, 0.3)" strokeWidth="1" />
      </g>
    );
  };

  return (
    <section id="anniv-sec-moon" className="py-14 sm:py-20 px-4 max-w-xl mx-auto select-none text-center">
      <div className="bg-gradient-to-b from-[#2A1C24] via-[#1F141A] to-[#160B12] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E8B4B8]/40 shadow-black/30 text-white relative overflow-hidden">
        {/* Background Starfield Twinkles */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-6 left-8 text-xs text-rose-200 animate-pulse">✦</div>
          <div className="absolute top-12 right-12 text-sm text-rose-100 animate-pulse delay-300">✦</div>
          <div className="absolute bottom-10 left-12 text-xs text-rose-300 animate-pulse delay-700">✦</div>
          <div className="absolute bottom-16 right-8 text-xs text-rose-200 animate-pulse delay-500">✦</div>
        </div>

        {/* Badge */}
        <span className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-white/10 text-rose-200 border border-white/20 shadow-sm mb-4">
          <Moon size={13} className="text-rose-300" />
          <span>Astronomical Celestial Memory</span>
        </span>

        <h2 className="relative font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          {headline}
        </h2>

        <p className="relative font-serif italic text-xs sm:text-sm text-rose-200/80 max-w-sm mx-auto mb-8 leading-relaxed">
          {subtext}
        </p>

        {/* Celestial Moon Graphic */}
        <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 mb-6 flex items-center justify-center">
          {/* Atmospheric Moonlight Glow */}
          <div className="absolute inset-0 rounded-full bg-radial from-[#F5D7DC]/20 via-[#C46879]/10 to-transparent blur-xl pointer-events-none" />

          {/* Moon SVG Orb */}
          <svg viewBox="0 0 150 150" className="w-full h-full drop-shadow-[0_0_25px_rgba(232,180,184,0.35)]">
            <defs>
              <linearGradient id="moonSurface" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF7F8" />
                <stop offset="40%" stopColor="#F5E4E8" />
                <stop offset="70%" stopColor="#E4CCD2" />
                <stop offset="100%" stopColor="#C9B2B8" />
              </linearGradient>

              <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFEBF0" floodOpacity="0.4" />
              </filter>
            </defs>

            {renderMoonIllumination()}

            {/* Subtle Lunar Crater Details */}
            <circle cx="65" cy="55" r="7" fill="rgba(80, 40, 50, 0.12)" />
            <circle cx="85" cy="85" r="9" fill="rgba(80, 40, 50, 0.10)" />
            <circle cx="60" cy="95" r="5" fill="rgba(80, 40, 50, 0.08)" />
            <circle cx="95" cy="60" r="4" fill="rgba(80, 40, 50, 0.09)" />
          </svg>
        </div>

        {/* Phase Name & Illumination Badge */}
        <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-medium text-rose-100 mb-6">
          <Sparkles size={12} className="text-rose-300" />
          <span>
            {moonData.phaseName} • {moonData.illuminationPercent}% Illuminated
          </span>
        </div>

        {/* Astronomical Details Grid */}
        <div className="relative grid grid-cols-2 gap-3 max-w-md mx-auto mb-6 text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-300 uppercase tracking-wider mb-1">
              <Calendar size={11} />
              <span>Date</span>
            </div>
            <p className="font-serif font-bold text-xs sm:text-sm text-white truncate">
              {effectiveDate}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-300 uppercase tracking-wider mb-1">
              <MapPin size={11} />
              <span>Location</span>
            </div>
            <p className="font-serif font-bold text-xs sm:text-sm text-white truncate">
              {location}
            </p>
          </div>
        </div>

        {/* Romantic Personal Message */}
        <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
          <Heart size={14} className="mx-auto text-rose-300 fill-rose-300 mb-2 animate-pulse" />
          <p className="font-serif italic text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-md mx-auto">
            &ldquo;{personalMessage}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
