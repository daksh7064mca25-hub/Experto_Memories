"use client";

import React, { useState, useRef } from "react";
import { WebsiteProjectData } from "@/types/website";
import { RoyalInvitation3DOpening } from "./sections/RoyalInvitation3DOpening";
import { RoyalIndianEditorialExperience } from "./sections/RoyalIndianEditorialExperience";
import { Volume2, VolumeX } from "lucide-react";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export const RoyalIndianWeddingExperience: React.FC<Props> = ({
  project,
  previewMode = false,
}) => {
  const [invitationOpened, setInvitationOpened] = useState(previewMode);
  const [openingDismissed, setOpeningDismissed] = useState(previewMode);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract sections from project
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

  // Dynamic names & dates with royal defaults
  const brideName = coupleSec?.config?.brideName || project.partner1Name || "Roshni";
  const groomName = coupleSec?.config?.groomName || project.partner2Name || "Aarav";
  const coupleNames = `${groomName} & ${brideName}`;
  const weddingDateText =
    openingSec?.config?.weddingDateText || "December 14 – 15, 2026 • Jaipur, Rajasthan";
  const venueCity = countdownSec?.config?.venueCity || "Jaipur, Rajasthan, India";
  const targetDate = countdownSec?.config?.targetDate || "2026-12-14T17:30:00+05:30";

  const handleOpenInvitation = () => {
    setInvitationOpened(true);
    if (audioRef.current && project.audioSettings?.enabled !== false) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
    // Allow smooth crossfade before unmounting opening card from DOM
    setTimeout(() => {
      setOpeningDismissed(true);
    }, 1000);
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#3E141B] font-sans relative overflow-x-hidden">
      {/* Background Royal Sitar / Shehnai Soundtrack */}
      {project.audioSettings?.enabled !== false && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Royal Music Control */}
      {invitationOpened && (
        <button
          type="button"
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
            isPlayingMusic
              ? "bg-[#C5A36A] text-white border-[#D4AF37] shadow-[0_0_20px_rgba(197,163,106,0.6)]"
              : "bg-white/95 text-[#3E141B] border-[#C5A36A]/40"
          }`}
          title={isPlayingMusic ? "Mute Royal Soundtrack" : "Play Royal Soundtrack"}
          aria-label={isPlayingMusic ? "Mute Royal Soundtrack" : "Play Royal Soundtrack"}
        >
          {isPlayingMusic ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </button>
      )}

      {/* ========================================================
          STAGE 1: PHYSICAL 3D WEDDING INVITATION OPENING
         ======================================================== */}
      {!openingDismissed && (
        <RoyalInvitation3DOpening
          config={
            (openingSec?.config as any) || {
              revealStyle: "palace_doors",
              eyebrow: "With the divine blessings of our families & the Almighty",
              coupleNames,
              weddingDateText,
              actionButtonText: "Open Royal Invitation ✨",
              monogram: `${groomName.charAt(0)} & ${brideName.charAt(0)}`,
            }
          }
          groomName={groomName}
          brideName={brideName}
          coupleNames={coupleNames}
          weddingDateText={weddingDateText}
          onOpenInvitation={handleOpenInvitation}
          isOpen={invitationOpened}
        />
      )}

      {/* ========================================================
          STAGES 2–9: ROYAL WEDDING HERO & EDITORIAL EXPERIENCE
         ======================================================== */}
      {invitationOpened && (
        <RoyalIndianEditorialExperience
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

export default RoyalIndianWeddingExperience;
