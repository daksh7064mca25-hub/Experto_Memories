"use client";

import React, { useState } from "react";
import { WebsiteProjectData, BirthdaySectionType } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";
import { BirthdayConfetti } from "./effects/BirthdayConfetti";
import { BirthdayMusicPlayer } from "./audio/BirthdayMusicPlayer";
import { BirthdayInvitationSection } from "./sections/BirthdayInvitationSection";
import { BirthdayWelcomeSection } from "./sections/BirthdayWelcomeSection";
import { BirthdayBalloonsSection } from "./sections/BirthdayBalloonsSection";
import { BirthdayCakeSection } from "./sections/BirthdayCakeSection";
import { BirthdayScrapbookSection } from "./sections/BirthdayScrapbookSection";
import { BirthdayGameSection } from "./sections/BirthdayGameSection";
import { BirthdayLetterSection } from "./sections/BirthdayLetterSection";
import { BirthdayFinaleSection } from "./sections/BirthdayFinaleSection";
import { ExpertoMemoriesBrandSignature } from "@/components/common/ExpertoMemoriesBrandSignature";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export function BirthdayRenderer({ project, previewMode = false }: Props) {
  const [replayKey, setReplayKey] = useState(0);
  const theme = project.theme || "golden-champagne";
  const themeConfig = getBirthdayThemeConfig(theme);

  const recipient = project.recipientName || "Birthday Superstar";
  const sender = project.senderName || "Someone Special";

  // Filter and sort enabled sections
  const activeSections = (project.sections || [])
    .filter((sec) => sec.enabled)
    .sort((a, b) => a.order - b.order);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSection = (sec: (typeof activeSections)[0]) => {
    switch (sec.type as BirthdaySectionType | any) {
      case "birthday_invitation":
        return (
          <BirthdayInvitationSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            recipientName={recipient}
            senderName={sender}
            theme={theme}
          />
        );
      case "birthday_welcome":
        return (
          <BirthdayWelcomeSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            recipientName={recipient}
            senderName={sender}
            birthdayDate={project.birthdayDate}
            age={project.age}
            theme={theme}
          />
        );
      case "birthday_balloons":
        return (
          <BirthdayBalloonsSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "birthday_cake":
        return (
          <BirthdayCakeSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            recipientName={recipient}
            theme={theme}
          />
        );
      case "birthday_scrapbook":
        return (
          <BirthdayScrapbookSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "birthday_game":
        return (
          <BirthdayGameSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            recipientName={recipient}
            senderName={sender}
            theme={theme}
            projectSlug={project.slug || project._id}
            previewMode={previewMode}
          />
        );
      case "birthday_letter":
        return (
          <BirthdayLetterSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            recipientName={recipient}
            senderName={sender}
            theme={theme}
          />
        );
      case "birthday_finale":
        return (
          <BirthdayFinaleSection
            key={`${sec.id}-${replayKey}`}
            config={sec.config as any}
            recipientName={recipient}
            senderName={sender}
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
      key={replayKey}
      className={`relative min-h-screen w-full transition-colors duration-500 overflow-x-hidden ${themeConfig.bgClass}`}
      data-theme={theme}
    >
      {/* Floating Birthday Sparkles & Confetti */}
      <BirthdayConfetti theme={theme} />

      {/* Floating Birthday Soundtrack Player */}
      <BirthdayMusicPlayer
        audioSettings={project.audioSettings}
        previewMode={previewMode}
      />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto pb-20">
        {activeSections.map((sec) => (
          <div key={sec.id} className="w-full">
            {renderSection(sec)}
          </div>
        ))}

        {/* Official ExpertoMemories Brand Signature */}
        <ExpertoMemoriesBrandSignature
          occasionType="birthday"
          theme={theme}
          previewMode={previewMode}
        />
      </main>
    </div>
  );
}
