"use client";

import React, { useState } from "react";
import { WebsiteProjectData } from "@/types/website";
import { getLoveThemeConfig } from "@/config/love-themes";
import { LovePetals } from "./effects/LovePetals";
import { LoveMusicPlayer } from "./audio/LoveMusicPlayer";
import { LoveBookEngine } from "./book/LoveBookEngine";

interface Props {
  project: WebsiteProjectData;
  previewMode?: boolean;
  viewport?: "mobile" | "desktop";
}

export function LoveRenderer({ project, previewMode = false, viewport }: Props) {
  const [replayKey, setReplayKey] = useState(0);

  const themeConfig = getLoveThemeConfig(project.theme);

  return (
    <div
      key={replayKey}
      className="relative min-h-screen w-full flex flex-col items-center justify-between select-none overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 28%, #FFFDF9 0%, #FDF4ED 40%, #F8E8DF 75%, #F0D9CD 100%)",
      }}
      data-theme={project.theme}
    >
      {/* GENTLE NATURAL SUNLIGHT WASH */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 245, 238, 0.35) 45%, rgba(245, 225, 218, 0.1) 100%)",
        }}
      />

      {/* SUBTLE ARTISAN LINEN & PAPER SURFACE TEXTURE */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* DELICATE BLURRED BOTANICAL & PALE ROSE VIGNETTES AT EDGES */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(244, 180, 190, 0.22) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(240, 195, 185, 0.22) 0%, transparent 45%), radial-gradient(circle at 100% 0%, rgba(255, 215, 200, 0.18) 0%, transparent 35%)",
        }}
      />

      {/* DELICATE FLOATING ROSE PETALS (SLOW & SUBTLE) */}
      <LovePetals theme={project.theme} />

      {/* DOCKED AMBIENT ROMANTIC SOUNDTRACK PLAYER */}
      <LoveMusicPlayer
        audioSettings={project.audioSettings}
        previewMode={previewMode}
      />

      {/* MAIN INTERACTIVE DIGITAL LOVE BOOK */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-4 sm:py-8 px-1 sm:px-4">
        <LoveBookEngine
          key={`${viewport || "responsive"}-${replayKey}`}
          project={project}
          theme={themeConfig}
          previewMode={previewMode}
          viewport={viewport}
        />
      </main>
    </div>
  );
}
