"use client";

import React from "react";
import { WebsiteProjectData, SectionType } from "@/types/website";
import { THEMES } from "@/config/themes";
import { FloatingParticles } from "./effects/FloatingParticles";
import { BackgroundAudioPlayer } from "./audio/BackgroundAudioPlayer";
import { EnvelopeSection } from "./sections/EnvelopeSection";
import { ReadyCheckSection } from "./sections/ReadyCheckSection";
import { LetterSection } from "./sections/LetterSection";
import { MemoriesSection } from "./sections/MemoriesSection";
import { ReasonsSection } from "./sections/ReasonsSection";
import { ForgivenessGardenSection } from "./sections/ForgivenessGardenSection";
import { PromisesSection } from "./sections/PromisesSection";
import { ScratchCardSection } from "./sections/ScratchCardSection";
import { CouponBookSection } from "./sections/CouponBookSection";
import { CatchLoveGameSection } from "./sections/CatchLoveGameSection";
import { SecretHeartSection } from "./sections/SecretHeartSection";
import { FinalApologySection } from "./sections/FinalApologySection";
import { ExpertoMemoriesBrandSignature } from "@/components/common/ExpertoMemoriesBrandSignature";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
}

export function ApologyRenderer({ project, previewMode = false }: Props) {
  const theme = project.theme || "cotton-candy";
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  // Sort enabled sections by order
  const activeSections = (project.sections || [])
    .filter((sec) => sec.enabled)
    .sort((a, b) => a.order - b.order);

  const hasReadyCheck = activeSections.some((sec) => sec.type === "ready_check");

  // Interaction state: if ready check section exists, wait for acceptance; otherwise start writing
  const [letterStatus, setLetterStatus] = React.useState<"waiting" | "writing" | "completed">(
    hasReadyCheck && !previewMode ? "waiting" : "writing"
  );

  const handleReadyCheckAccept = React.useCallback(() => {
    setLetterStatus((prev) => (prev === "waiting" ? "writing" : prev));
  }, []);

  const renderSection = (sec: (typeof activeSections)[0]) => {
    switch (sec.type as SectionType) {
      case "envelope":
        return (
          <EnvelopeSection
            key={sec.id}
            config={sec.config as any}
            recipientName={project.recipientName}
            senderName={project.senderName}
            theme={theme}
          />
        );
      case "ready_check":
        return (
          <ReadyCheckSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
            onAccept={handleReadyCheckAccept}
          />
        );
      case "letter":
        return (
          <LetterSection
            key={sec.id}
            config={sec.config as any}
            recipientName={project.recipientName}
            senderName={project.senderName}
            theme={theme}
            typingStatus={letterStatus}
            onTypingStatusChange={setLetterStatus}
          />
        );
      case "memories":
        return (
          <MemoriesSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "reasons":
        return (
          <ReasonsSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "forgiveness_garden":
        return (
          <ForgivenessGardenSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "promises":
        return (
          <PromisesSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "scratch_card":
        return (
          <ScratchCardSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "coupon_book":
        return (
          <CouponBookSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
            projectSlug={project.slug}
            initialRedemptions={project.couponRedemptions}
          />
        );
      case "catch_love_game":
        return (
          <CatchLoveGameSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "secret_heart":
        return (
          <SecretHeartSection
            key={sec.id}
            config={sec.config as any}
            theme={theme}
          />
        );
      case "final_apology":
        return (
          <FinalApologySection
            key={sec.id}
            config={sec.config as any}
            senderName={project.senderName}
            theme={theme}
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
      {/* Floating Particles in Background */}
      <FloatingParticles theme={theme} />

      {/* Floating Audio Player */}
      <BackgroundAudioPlayer audioSettings={project.audioSettings} previewMode={previewMode} />

      {/* Main Story Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto pb-16">
        {activeSections.map((sec) => (
          <div key={sec.id} className="w-full">
            {renderSection(sec)}
          </div>
        ))}

        {/* Official ExpertoMemories Brand Signature */}
        <ExpertoMemoriesBrandSignature
          occasionType="apology"
          theme={theme}
          previewMode={previewMode}
        />
      </main>
    </div>
  );
}

