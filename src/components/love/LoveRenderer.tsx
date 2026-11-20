"use client";

import React, { useState } from "react";
import { WebsiteProjectData, WebsiteSectionData } from "@/types/website";
import { getLoveThemeConfig } from "@/config/love-themes";
import { LovePetals } from "./effects/LovePetals";
import { LoveMusicPlayer } from "./audio/LoveMusicPlayer";
import { LoveInvitationSection } from "./sections/LoveInvitationSection";
import { LoveQuestionSection } from "./sections/LoveQuestionSection";
import { LoveReasonsSection } from "./sections/LoveReasonsSection";
import { LoveUniverseSection } from "./sections/LoveUniverseSection";
import { LovePuzzleSection } from "./sections/LovePuzzleSection";
import { LoveGallerySection } from "./sections/LoveGallerySection";
import { LoveLetterSection } from "./sections/LoveLetterSection";
import { LoveSurpriseSection } from "./sections/LoveSurpriseSection";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export function LoveRenderer({ project, previewMode = false }: Props) {
  const [replayKey, setReplayKey] = useState(0);

  const themeConfig = getLoveThemeConfig(project.theme);
  const recipient = project.recipientName || project.partner1Name || "My Love";
  const sender = project.senderName || project.partner2Name || "Forever Yours";

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter enabled sections and sort by order
  const activeSections = (project.sections || [])
    .filter((s) => s.enabled !== false)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section: WebsiteSectionData) => {
    switch (section.type) {
      case "love_invitation":
        return (
          <LoveInvitationSection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            recipientName={recipient}
            senderName={sender}
            theme={themeConfig}
          />
        );

      case "love_question":
        return (
          <LoveQuestionSection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            recipientName={recipient}
            theme={themeConfig}
          />
        );

      case "love_reasons":
        return (
          <LoveReasonsSection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            theme={themeConfig}
          />
        );

      case "love_universe":
        return (
          <LoveUniverseSection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            theme={themeConfig}
          />
        );

      case "love_puzzle":
        return (
          <LovePuzzleSection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            theme={themeConfig}
          />
        );

      case "love_gallery":
        return (
          <LoveGallerySection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            theme={themeConfig}
          />
        );

      case "love_letter":
        return (
          <LoveLetterSection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            recipientName={recipient}
            senderName={sender}
            theme={themeConfig}
          />
        );

      case "love_soundtrack":
        // Ambient player is docked via LoveMusicPlayer
        return null;

      case "love_surprise":
        return (
          <LoveSurpriseSection
            key={`${section.id}-${replayKey}`}
            config={section.config as any}
            recipientName={recipient}
            senderName={sender}
            theme={themeConfig}
            onReplay={handleReplay}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      key={replayKey}
      className={`relative min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${themeConfig.bgClass}`}
      data-theme={project.theme}
    >
      {/* Delicate floating rose petals and starlight particles */}
      <LovePetals theme={project.theme} />

      {/* Docked Ambient Romantic Soundtrack Player */}
      <LoveMusicPlayer
        audioSettings={project.audioSettings}
        previewMode={previewMode}
      />

      {/* Main Interactive Story Experience */}
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
