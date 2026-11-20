"use client";

import React, { useState } from "react";
import { WebsiteProjectData, AnniversarySectionType } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { AnniversaryParticles } from "./effects/AnniversaryParticles";
import { AnniversaryVinylPlayer } from "./audio/AnniversaryVinylPlayer";
import { AnniversaryIntroSection } from "./sections/AnniversaryIntroSection";
import { AnniversaryCounterSection } from "./sections/AnniversaryCounterSection";
import { AnniversaryFirstMetSection } from "./sections/AnniversaryFirstMetSection";
import { AnniversaryTimelineSection } from "./sections/AnniversaryTimelineSection";
import { AnniversaryThenNowSection } from "./sections/AnniversaryThenNowSection";
import { AnniversaryReasonsSection } from "./sections/AnniversaryReasonsSection";
import { AnniversaryMuseumSection } from "./sections/AnniversaryMuseumSection";
import { AnniversaryGallerySection } from "./sections/AnniversaryGallerySection";
import { AnniversaryQuizSection } from "./sections/AnniversaryQuizSection";
import { AnniversaryConstellationSection } from "./sections/AnniversaryConstellationSection";
import { AnniversaryLoveNotesSection } from "./sections/AnniversaryLoveNotesSection";
import { AnniversarySoundtrackSection } from "./sections/AnniversarySoundtrackSection";
import { AnniversaryFutureLetterSection } from "./sections/AnniversaryFutureLetterSection";
import { AnniversaryBucketListSection } from "./sections/AnniversaryBucketListSection";
import { AnniversaryFinaleSection } from "./sections/AnniversaryFinaleSection";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export function AnniversaryRenderer({ project, previewMode = false }: Props) {
  const [replayKey, setReplayKey] = useState(0);
  const theme = project.theme || "pink-paradise";
  const themeConfig = getThemeConfig(theme, "anniversary");

  // Sort enabled sections by order
  const activeSections = (project.sections || [])
    .filter((sec) => sec.enabled)
    .sort((a, b) => a.order - b.order);

  const partner1 = project.partner1Name || project.recipientName || "Olivia";
  const partner2 = project.partner2Name || project.senderName || "Liam";

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSection = (sec: (typeof activeSections)[0]) => {
    switch (sec.type as AnniversarySectionType) {
      case "anniversary_intro":
        return (
          <AnniversaryIntroSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            partner1Name={partner1}
            partner2Name={partner2}
            anniversaryDate={project.anniversaryDate}
            yearsTogether={project.yearsTogether}
            theme={theme}
          />
        );
      case "anniversary_counter":
        return (
          <AnniversaryCounterSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            relationshipStartDate={project.relationshipStartDate}
            anniversaryDate={project.anniversaryDate}
            yearsTogether={project.yearsTogether}
            partner1Name={partner1}
            partner2Name={partner2}
            theme={theme}
          />
        );
      case "anniversary_first_met":
        return (
          <AnniversaryFirstMetSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            partner1Name={partner1}
            partner2Name={partner2}
            theme={theme}
          />
        );
      case "anniversary_timeline":
        return (
          <AnniversaryTimelineSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_then_now":
        return (
          <AnniversaryThenNowSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_reasons":
        return (
          <AnniversaryReasonsSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_museum":
        return (
          <AnniversaryMuseumSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_gallery":
        return (
          <AnniversaryGallerySection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_quiz":
        return (
          <AnniversaryQuizSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_constellation":
        return (
          <AnniversaryConstellationSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_love_notes":
        return (
          <AnniversaryLoveNotesSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_soundtrack":
        return (
          <AnniversarySoundtrackSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_future_letter":
        return (
          <AnniversaryFutureLetterSection
            key={sec.id}
            config={sec.config as any}
            partner1Name={partner1}
            partner2Name={partner2}
            theme={theme}
          />
        );
      case "anniversary_bucket_list":
        return (
          <AnniversaryBucketListSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "anniversary_finale":
        return (
          <AnniversaryFinaleSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            partner1Name={partner1}
            partner2Name={partner2}
            theme={theme}
            onReplay={handleReplay}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${themeConfig.bgClass}`}
      data-theme={theme}
    >
      {/* Floating Stardust / Heart Particles */}
      <AnniversaryParticles theme={theme} />

      {/* Ambient Vinyl Soundtrack Player */}
      <AnniversaryVinylPlayer audioSettings={project.audioSettings} previewMode={previewMode} />

      {/* Main Story Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto pb-16">
        {activeSections.map((sec) => (
          <div key={sec.id} className="w-full">
            {renderSection(sec)}
          </div>
        ))}
      </main>
    </div>
  );
}

