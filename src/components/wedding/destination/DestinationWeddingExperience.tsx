"use client";

import React, { useState, useRef, useEffect } from "react";
import { WebsiteProjectData, WeddingSectionType } from "@/types/website";
import { DestinationOpeningAnimation } from "./DestinationOpeningAnimation";
import { DestinationInvitationCard } from "./DestinationInvitationCard";
import { DestinationBoardingPass } from "./DestinationBoardingPass";
import { DestinationCountdown } from "./DestinationCountdown";
import { DestinationJourneyMap } from "./DestinationJourneyMap";
import { DestinationItinerary } from "./DestinationItinerary";
import { DestinationGallery } from "./DestinationGallery";
import { DestinationCoupleStory } from "./DestinationCoupleStory";
import { DestinationNavHeader } from "./DestinationNavHeader";
import { DestinationRSVPSection } from "./DestinationRSVPSection";
import { DestinationClosingSection } from "./DestinationClosingSection";
import { getWeddingTheme } from "../weddingThemes";
import { ExpertoMemoriesBrandSignature } from "@/components/common/ExpertoMemoriesBrandSignature";
import { Volume2, VolumeX, Compass, Calendar, MapPin, Sparkles, Navigation } from "lucide-react";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export const DestinationWeddingExperience: React.FC<Props> = ({
  project,
  previewMode = false,
}) => {
  const [invitationOpened, setInvitationOpened] = useState(previewMode);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract sections
  const sections = project.sections || [];
  const getSection = (type: WeddingSectionType) =>
    sections.find((s) => s.type === type && s.enabled !== false);

  const openingSec = getSection("wedding_opening");
  const coupleSec = getSection("wedding_couple");
  const countdownSec = getSection("wedding_countdown");
  const eventsSec = getSection("wedding_events");
  const storySec = getSection("wedding_story");
  const gallerySec = getSection("wedding_gallery");
  const travelSec = getSection("wedding_travel");
  const rsvpSec = getSection("wedding_rsvp");
  const wishesSec = getSection("wedding_wishes");

  // Couple names & cultural details
  const brideName = coupleSec?.config?.brideName || project.partner1Name || "Natasha";
  const groomName = coupleSec?.config?.groomName || project.partner2Name || "Kabir";
  const coupleNames = `${brideName} & ${groomName}`;
  const weddingDateText =
    openingSec?.config?.weddingDateText || "November 06 – 08, 2026 • South Goa, India";
  const venueCity = countdownSec?.config?.venueCity || "South Goa, India";
  const venueName =
    travelSec?.config?.venueName ||
    (eventsSec?.config?.events?.[0]?.venueName) ||
    "The Leela Goa Resort & Palace";

  const brideInitial = brideName.charAt(0).toUpperCase() || "N";
  const groomInitial = groomName.charAt(0).toUpperCase() || "K";
  const monogram = `${groomInitial} & ${brideInitial}`;

  const musicUrl =
    project.audioSettings?.backgroundMusicUrl ||
    "https://assets.mixkit.co/music/preview/mixkit-celebration-happiness-565.mp3";

  const handleOpenInvitation = () => {
    setInvitationOpened(true);
    if (audioRef.current && project.audioSettings?.enabled !== false) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {});
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

  const scrollToSection = (sectionId: string) => {
    if (typeof document !== "undefined") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Listen for editor preview-opening event
  useEffect(() => {
    const handlePreviewOpening = () => {
      setInvitationOpened(false);
    };
    window.addEventListener("preview-opening", handlePreviewOpening);
    return () => window.removeEventListener("preview-opening", handlePreviewOpening);
  }, []);

  const theme = getWeddingTheme(project.theme);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2E40] selection:bg-[#D4AF37] selection:text-[#0A1826] font-sans relative overflow-x-hidden">
      {/* Background Audio Soundtrack */}
      {project.audioSettings?.enabled !== false && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Music Toggle Button */}
      {invitationOpened && (
        <button
          type="button"
          onClick={toggleMusic}
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
            isPlayingMusic
              ? "bg-[#D4AF37] text-[#0A1826] border-[#F5D061] shadow-[0_0_20px_rgba(212,175,55,0.6)]"
              : "bg-white/95 text-[#0A1826] border-[#D4AF37]/40 shadow-lg"
          }`}
          title={isPlayingMusic ? "Mute Destination Soundtrack" : "Play Destination Soundtrack"}
          aria-label={isPlayingMusic ? "Mute Destination Soundtrack" : "Play Destination Soundtrack"}
        >
          {isPlayingMusic ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
        </button>
      )}

      {/* ========================================================
          1. CINEMATIC 5-SCENE AIRPLANE TAKEOFF OPENING ANIMATION
         ======================================================== */}
      {!invitationOpened && (
        <DestinationOpeningAnimation
          config={{
            headline: openingSec?.config?.headline || `The Destination Wedding of ${coupleNames}`,
            coupleNames,
            weddingDateText,
            actionButtonText: openingSec?.config?.actionButtonText || "Board Flight & Begin Journey ✈️",
            skipButtonText: openingSec?.config?.skipButtonText || "Skip to Invitation",
            audioNotice: openingSec?.config?.audioNotice || "Turn on sound for tropical sunset beats",
            religiousBlessingText: openingSec?.config?.religiousBlessingText,
            culturalSymbol: openingSec?.config?.culturalSymbol,
            monogram,
            venueCity,
          }}
          isOpen={invitationOpened}
          onOpenInvitation={handleOpenInvitation}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={toggleMusic}
        />
      )}

      {/* ========================================================
          2. REVEALED DESTINATION WEDDING INVITATION WEBSITE
         ======================================================== */}
      {invitationOpened && (
        <main className="relative z-10 transition-opacity duration-1000 ease-in-out opacity-100">
          {/* Subtle Coastal Wallpaper / Sun Aura */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px]" />

          {/* Responsive Sticky Destination Travel Header */}
          <DestinationNavHeader
            monogram={monogram}
            coupleNames={coupleNames}
            venueCity={venueCity}
            onNavigate={scrollToSection}
          />

          {/* 1. Luxury Destination Wedding Invitation Card */}
          <DestinationInvitationCard
            groomName={groomName}
            brideName={brideName}
            groomTitle={coupleSec?.config?.groomTitle}
            brideTitle={coupleSec?.config?.brideTitle}
            parentsBlessing={coupleSec?.config?.parentsBlessing}
            weddingDateText={weddingDateText}
            venueName={venueName}
            venueCity={venueCity}
            headline={openingSec?.config?.headline}
            onNavigateToSection={scrollToSection}
          />

          {/* 2. Personalized Boarding Pass Keepsake */}
          <DestinationBoardingPass
            groomName={groomName}
            brideName={brideName}
            weddingDateText={weddingDateText}
            venueName={venueName}
            venueCity={venueCity}
            guestNameDefault={project.recipientName || "Honored Guest"}
          />

          {/* 3. Auspicious Countdown Section */}
          {countdownSec && (
            <DestinationCountdown
              targetDate={countdownSec.config?.targetDate}
              headline={countdownSec.config?.headline}
              subtext={countdownSec.config?.subtext}
              venueCity={venueCity}
              calendarUrl={countdownSec.config?.calendarAddToGoogleUrl}
            />
          )}

          {/* 4. Celebration Itinerary & Event Timeline */}
          {eventsSec && (
            <DestinationItinerary
              events={eventsSec.config?.events}
              headline={eventsSec.config?.headline}
              subtext={eventsSec.config?.subtext}
            />
          )}

          {/* 5. Interactive Destination Journey Map & Travel Logistics */}
          <DestinationJourneyMap
            venueName={venueName}
            venueAddress={travelSec?.config?.venueAddress || "Mobor Beach, Cavelossim, Goa 403731, India"}
            venueCity={venueCity}
            googleMapsUrl={travelSec?.config?.googleMapsUrl || "https://maps.google.com/?q=The+Leela+Goa"}
            nearestAirport={travelSec?.config?.nearestAirport}
            shuttleNotes={travelSec?.config?.shuttleNotes}
          />

          {/* 5. Couple's Story & Why This Destination */}
          <DestinationCoupleStory
            groomName={groomName}
            brideName={brideName}
            groomTitle={coupleSec?.config?.groomTitle}
            groomBio={coupleSec?.config?.groomBio}
            groomPhotoUrl={coupleSec?.config?.groomPhotoUrl}
            brideTitle={coupleSec?.config?.brideTitle}
            brideBio={coupleSec?.config?.brideBio}
            bridePhotoUrl={coupleSec?.config?.bridePhotoUrl}
            destinationWhyNarrative={storySec?.config?.romanticQuote}
            chapters={storySec?.config?.chapters}
            venueCity={venueCity}
          />

          {/* 6. Destination Portrait & Landscape Gallery */}
          {gallerySec && (
            <DestinationGallery
              photos={gallerySec.config?.photos}
              headline={gallerySec.config?.headline}
              subtext={gallerySec.config?.subtext}
            />
          )}

          {/* 7. Guest RSVP Section */}
          <DestinationRSVPSection
            config={rsvpSec?.config as any}
            events={eventsSec?.config?.events || []}
            projectSlug={project.slug}
            previewMode={previewMode}
          />

          {/* 8. Family Blessings & WhatsApp Sharing */}
          <DestinationClosingSection
            config={wishesSec?.config as any}
            projectSlug={project.slug}
            coupleNames={coupleNames}
          />

          {/* ExpertoMemories Brand Signature */}
          <ExpertoMemoriesBrandSignature
            occasionType="wedding"
            theme={project.theme}
            previewMode={previewMode}
          />
        </main>
      )}
    </div>
  );
};
