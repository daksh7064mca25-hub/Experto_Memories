import { Metadata, Viewport } from "next";
import { DemoExperience } from "@/components/apology/DemoExperience";
import { ApologyThemeId } from "@/types/website";

interface Props {
  searchParams: Promise<{
    theme?: string;
    embed?: string;
    fullscreen?: string;
  }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Interactive Apology Website Demo | ExpertoMemories",
  description:
    "Experience our interactive apology website demo: 3D wax seal envelope, heartfelt handwritten letter, polaroid memories, forgiveness garden, wax promises, scratch card, coupon book, and love mini-game.",
  openGraph: {
    title: "ExpertoMemories — Interactive Apology Website Sample",
    description: "A Little Sorry, A Lot of Love. Tap to open the interactive sample apology gift.",
    type: "website",
  },
};

export default async function ApologyDemoPage({ searchParams }: Props) {
  const params = await searchParams;
  const validThemes: ApologyThemeId[] = [
    "cotton-candy",
    "lavender-dreams",
    "peachy-love",
    "midnight-hearts",
  ];

  const themeParam = params.theme as ApologyThemeId | undefined;
  const initialTheme: ApologyThemeId =
    themeParam && validThemes.includes(themeParam) ? themeParam : "cotton-candy";

  const isEmbedded = params.embed === "true" || params.embed === "1";

  return <DemoExperience initialTheme={initialTheme} isEmbedded={isEmbedded} />;
}
