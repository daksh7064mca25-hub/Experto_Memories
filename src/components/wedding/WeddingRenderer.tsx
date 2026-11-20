"use client";

import React, { useState, useRef, useEffect } from "react";
import { WebsiteProjectData, WeddingSectionType } from "@/types/website";
import { getWeddingTheme } from "./weddingThemes";
import { WeddingOpeningSection } from "./sections/WeddingOpeningSection";
import { WeddingCoupleSection } from "./sections/WeddingCoupleSection";
import { WeddingCountdownSection } from "./sections/WeddingCountdownSection";
import { WeddingEventsSection } from "./sections/WeddingEventsSection";
import { WeddingStorySection } from "./sections/WeddingStorySection";
import { WeddingGallerySection } from "./sections/WeddingGallerySection";
import { WeddingRSVPSection } from "./sections/WeddingRSVPSection";
import { WeddingTravelSection } from "./sections/WeddingTravelSection";
import { WeddingWishesSection } from "./sections/WeddingWishesSection";
import { Volume2, VolumeX, Music, Sparkles } from "lucide-react";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export const WeddingRenderer: React.FC<Props> = ({ project, previewMode = false }) => {
  const theme = getWeddingTheme(project.theme);
  const [invitationOpened, setInvitationOpened] = useState(previewMode);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Find enabled sections by type
  const sections = project.sections || [];
  const getSection = (type: WeddingSectionType) =>
    sections.find((s) => s.type === type && s.enabled !== false);

  const openingSection = getSection("wedding_opening");
  const coupleSection = getSection("wedding_couple");
  const countdownSection = getSection("wedding_countdown");
  const eventsSection = getSection("wedding_events");
  const storySection = getSection("wedding_story");
  const gallerySection = getSection("wedding_gallery");
  const soundtrackSection = getSection("wedding_soundtrack");
  const rsvpSection = getSection("wedding_rsvp");
  const travelSection = getSection("wedding_travel");
  const wishesSection = getSection("wedding_wishes");

  const musicUrl =
    soundtrackSection?.config?.audioUrl ||
    project.audioSettings?.backgroundMusicUrl ||
    "/audio/wedding-shehnai.mp3";

  const handleOpenInvitation = () => {
    setInvitationOpened(true);
    // Attempt audio playback on user gesture
    if (audioRef.current && project.audioSettings?.enabled !== false) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {
          // Autoplay policy prevented playback, keep muted
        });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {});
    }
  };

  return (
    <div className={`min-h-screen text-stone-100 selection:bg-[#D4AF37] selection:text-[#2E0B14] font-sans relative ${theme.bgGradient}`}>
      {/* Background Audio */}
      {project.audioSettings?.enabled !== false && musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Royal Music Control */}
      {invitationOpened && (
        <button
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
            isPlayingMusic
              ? "bg-[#D4AF37] text-[#2E0B14] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              : "bg-black/60 text-[#D4AF37] border-[#D4AF37]/50"
          }`}
          aria-label={isPlayingMusic ? "Pause background music" : "Play wedding music"}
          title={isPlayingMusic ? "Mute Royal Soundtrack" : "Play Royal Soundtrack"}
        >
          {isPlayingMusic ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </button>
      )}

      {/* 1. ROYAL OPENING CEREMONY (PALACE DOORS) */}
      {openingSection && (
        <WeddingOpeningSection
          config={openingSection.config as any}
          theme={theme}
          onOpenInvitation={handleOpenInvitation}
          isOpen={invitationOpened}
        />
      )}

      {/* 2. REVEALED INVITATION CONTENT */}
      {invitationOpened && (
        <main className="relative z-10 transition-opacity duration-1000 ease-in-out opacity-100">
          {/* Subtle Royal Damask Overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Couple & Parents Section */}
          {coupleSection && (
            <WeddingCoupleSection config={coupleSection.config as any} theme={theme} />
          )}

          {/* Auspicious Countdown Section */}
          {countdownSection && (
            <WeddingCountdownSection config={countdownSection.config as any} theme={theme} />
          )}

          {/* Celebrations Agenda Section */}
          {eventsSection && (
            <WeddingEventsSection config={eventsSection.config as any} theme={theme} />
          )}

          {/* Love Story Section */}
          {storySection && (
            <WeddingStorySection config={storySection.config as any} theme={theme} />
          )}

          {/* Photo Gallery Section */}
          {gallerySection && (
            <WeddingGallerySection config={gallerySection.config as any} theme={theme} />
          )}

          {/* Guest RSVP Section */}
          {rsvpSection && (
            <WeddingRSVPSection
              config={rsvpSection.config as any}
              theme={theme}
              events={eventsSection?.config?.events || []}
              projectSlug={project.slug}
              previewMode={previewMode}
            />
          )}

          {/* Travel & Hospitality Section */}
          {travelSection && (
            <WeddingTravelSection config={travelSection.config as any} theme={theme} />
          )}

          {/* Family Blessings & WhatsApp Sharing Section */}
          {wishesSection && (
            <WeddingWishesSection
              config={wishesSection.config as any}
              theme={theme}
              projectSlug={project.slug}
            />
          )}
        </main>
      )}
    </div>
  );
};
