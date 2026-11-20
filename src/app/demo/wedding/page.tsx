import { Metadata, Viewport } from "next";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import { createDefaultWeddingProject, normalizeWeddingCollection } from "@/config/wedding-template";
import { WeddingDemoHeader } from "@/components/wedding/WeddingDemoHeader";

interface Props {
  searchParams: Promise<{
    collection?: string;
    theme?: string;
  }>;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Live Wedding Invitation Demos | ExpertoMemories Atelier",
  description:
    "Experience 10 distinct interactive digital wedding invitations with cultural opening reveals, multi-event agendas with Google Maps, RSVP tracking, love stories, and curated music.",
  openGraph: {
    title: "Live Wedding Invitation Demos | ExpertoMemories",
    description: "An unforgettable digital wedding invitation experience guests will cherish forever.",
    type: "website",
  },
};

export default async function WeddingDemoPage({ searchParams }: Props) {
  const { collection = "royal-indian", theme } = await searchParams;
  const normalizedCollection = normalizeWeddingCollection(collection) || "royal-indian";

  const demoProject = createDefaultWeddingProject(
    `demo-wedding-${normalizedCollection}`,
    undefined,
    undefined,
    normalizedCollection
  );

  if (theme) {
    demoProject.theme = theme as any;
  }

  return (
    <div className="relative">
      <WeddingDemoHeader currentCollection={normalizedCollection} />
      <WeddingRenderer project={demoProject} previewMode={false} />
    </div>
  );
}
