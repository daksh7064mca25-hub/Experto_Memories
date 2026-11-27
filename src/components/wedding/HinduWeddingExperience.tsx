"use client";

import React, { useState, useRef } from "react";
import { WebsiteProjectData } from "@/types/website";
import { HinduMandirOpening } from "./sections/HinduMandirOpening";
import { HinduEditorialInvitation } from "./sections/HinduEditorialInvitation";
import { getWeddingTheme } from "./weddingThemes";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export const HinduWeddingExperience: React.FC<Props> = ({ project, previewMode = false }) => {
  const [invitationOpened, setInvitationOpened] = useState(previewMode);
  const [mandirDismissed, setMandirDismissed] = useState(previewMode);
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

  // Dynamic Content with culturally authentic defaults
  const brideName = coupleSec?.config?.brideName || project.partner1Name || "Priya";
  const groomName = coupleSec?.config?.groomName || project.partner2Name || "Akshar";
  const coupleNames = `${groomName} & ${brideName}`;
  const weddingDateText = openingSec?.config?.weddingDateText || "Sunday, 18 October 2026 • New Delhi";
  const venueCity = countdownSec?.config?.venueCity || "New Delhi, India";
  const targetDate = countdownSec?.config?.targetDate || "2026-10-18T18:00:00+05:30";

  const handleOpenInvitation = () => {
    setInvitationOpened(true);
    if (audioRef.current && project.audioSettings?.enabled !== false) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
    // Allow smooth crossfade before unmounting 3D temple scene from DOM
    setTimeout(() => {
      setMandirDismissed(true);
    }, 900);
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

  const musicUrl =
    project.audioSettings?.backgroundMusicUrl ||
    "https://assets.mixkit.co/music/preview/mixkit-celebration-happiness-565.mp3";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3E141B] selection:bg-[#C5A36A] selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Shehnai / Wedding Sitar Soundtrack */}
      {project.audioSettings?.enabled !== false && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Music Toggle */}
      {invitationOpened && (
        <button
          type="button"
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
            isPlayingMusic
              ? "bg-[#C5A36A] text-white border-[#D4AF37] shadow-[0_0_20px_rgba(197,163,106,0.6)]"
              : "bg-white/95 text-[#3E141B] border-[#C5A36A]/40"
          }`}
          title={isPlayingMusic ? "Mute Wedding Music" : "Play Wedding Music"}
          aria-label={isPlayingMusic ? "Mute Wedding Music" : "Play Wedding Music"}
        >
          {isPlayingMusic ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </button>
      )}

      {/* ========================================================
          1. REAL THREE.JS 3D HINDU TEMPLE OPENING EXPERIENCE
          (Genuine 3D WebGL environment, 3D carved pillars,
          interactive 3D bells, 3D rotating doors & camera dolly)
         ======================================================== */}
      {!mandirDismissed && (
        <HinduMandirOpening
          config={
            (openingSec?.config as any) || {
              revealStyle: "hindu_mandir",
              eyebrow: "|| श्री गणेशाय नमः ||",
              coupleNames,
              weddingDateText,
              actionButtonText: "Enter The Sacred Mandap 🪷",
              monogram: `${groomName.charAt(0)} & ${brideName.charAt(0)}`,
            }
          }
          theme={getWeddingTheme(project.theme)}
          onOpenInvitation={handleOpenInvitation}
          isOpen={invitationOpened}
        />
      )}

      {/* ========================================================
          2. COMPLETELY REDESIGNED EDITORIAL WEDDING INVITATION WEBSITE
          (Luxury Indian wedding editorial publication with GSAP ScrollTrigger)
         ======================================================== */}
      {invitationOpened && (
        <HinduEditorialInvitation
          project={project}
          groomName={groomName}
          brideName={brideName}
          coupleNames={coupleNames}
          weddingDateText={weddingDateText}
          targetDate={targetDate}
          venueCity={venueCity}
          openingSec={openingSec}
          coupleSec={coupleSec}
          storySec={storySec}
          countdownSec={countdownSec}
          eventsSec={eventsSec}
          venueSec={venueSec}
          gallerySec={gallerySec}
          rsvpSec={rsvpSec}
          previewMode={previewMode}
        />
      )}
    </div>
  );
};

export default HinduWeddingExperience;
