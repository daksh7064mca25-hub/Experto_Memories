"use client";

import React from "react";
import { HinduMandir3DOpening } from "./HinduMandir3DOpening";
import { WeddingOpeningConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";

interface Props {
  config: WeddingOpeningConfig;
  theme: WeddingThemeStyles;
  onOpenInvitation: () => void;
  isOpen: boolean;
}

/**
 * Genuine Three.js 3D Hindu Mandir Opening Experience
 * Replaces flat 2D CSS approximations with an authentic 3D environment,
 * 3D carved pillars, interactive 3D hanging brass bells, 3D rotating wooden doors,
 * flickering brass diyas, and a cinematic camera dolly zoom.
 */
export const HinduMandirOpening: React.FC<Props> = (props) => {
  return <HinduMandir3DOpening {...props} />;
};

export default HinduMandirOpening;
