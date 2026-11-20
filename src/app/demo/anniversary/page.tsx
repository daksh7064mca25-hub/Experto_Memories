import { Metadata, Viewport } from "next";
import { AnniversaryDemoExperience } from "@/components/anniversary/AnniversaryDemoExperience";
import { AnniversaryThemeId } from "@/types/website";

interface Props {
  searchParams: Promise<{
    theme?: string;
    embed?: string;
  }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Live Interactive Anniversary Demo | ExpertoMemories — Our Forever Story",
  description:
    "Explore the interactive Anniversary demo for ExpertoMemories. Features love milestones, constellation star memories, couple quiz, turntable soundtrack, and more.",
  openGraph: {
    title: "Interactive Anniversary Website Demo ❤️ | ExpertoMemories",
    description:
      "A complete interactive demonstration of 'Our Forever Story'. Tap to explore milestones, quiz questions, constellation memories and love notes.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const VALID_THEMES: AnniversaryThemeId[] = [
  "pink-paradise",
  "golden-forever",
  "our-universe",
  "sunset-love",
];

export default async function AnniversaryDemoPage({ searchParams }: Props) {
  const { theme, embed } = await searchParams;

  const validTheme: AnniversaryThemeId =
    theme && VALID_THEMES.includes(theme as AnniversaryThemeId)
      ? (theme as AnniversaryThemeId)
      : "pink-paradise";

  const isEmbedded = embed === "true";

  return <AnniversaryDemoExperience initialTheme={validTheme} isEmbedded={isEmbedded} />;
}

