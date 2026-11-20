import { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import { createDefaultWeddingProject, normalizeWeddingCollection } from "@/config/wedding-template";
import { WeddingDemoHeader } from "@/components/wedding/WeddingDemoHeader";

interface Props {
  params: Promise<{
    collection: string;
  }>;
  searchParams?: Promise<{
    theme?: string;
  }>;
}

export function generateStaticParams() {
  return [
    { collection: "royal" },
    { collection: "hindu" },
    { collection: "punjabi" },
    { collection: "sikh" },
    { collection: "muslim" },
    { collection: "christian" },
    { collection: "minimal" },
    { collection: "floral" },
    { collection: "destination" },
    { collection: "contemporary" },
    // Also include long slugs for full compatibility
    { collection: "royal-indian" },
    { collection: "traditional-hindu" },
    { collection: "anand-karaj" },
    { collection: "nikah" },
    { collection: "modern-minimal" },
    { collection: "floral-garden" },
    { collection: "luxury-destination" },
    { collection: "elegant-contemporary" },
  ];
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  const normalized = normalizeWeddingCollection(collection);
  if (!normalized) {
    return {
      title: "Wedding Collection Not Found | ExpertoMemories Atelier",
      description: "The requested digital wedding invitation collection could not be found.",
    };
  }

  const titles: Record<string, string> = {
    "royal-indian": "Royal Indian Wedding Invitation Demo",
    "traditional-hindu": "Traditional Hindu Sacred Vivah Demo",
    punjabi: "Punjabi Shahi Wedding Invitation Demo",
    sikh: "Sikh Anand Karaj Sacred Invitation Demo",
    muslim: "Muslim Noor-e-Nikah Invitation Demo",
    christian: "Christian Holy Matrimony Invitation Demo",
    "modern-minimal": "Modern Minimalist Wedding Invitation Demo",
    "floral-garden": "Floral Garden Wedding Invitation Demo",
    "luxury-destination": "Luxury Destination Wedding Invitation Demo",
    "elegant-contemporary": "Elegant Contemporary Wedding Invitation Demo",
  };

  const title = titles[normalized] || "Bespoke Wedding Invitation Demo";
  return {
    title: `${title} | ExpertoMemories Atelier`,
    description: `Experience the interactive digital invitation for ${title} featuring cultural opening ceremony, multi-event agendas, and guest RSVP tracking.`,
  };
}

export default async function WeddingCollectionDemoPage({ params, searchParams }: Props) {
  const { collection } = await params;
  const search = await searchParams;
  const normalizedCollection = normalizeWeddingCollection(collection);

  if (!normalizedCollection) {
    notFound();
  }

  const demoProject = createDefaultWeddingProject(
    `demo-wedding-${normalizedCollection}`,
    undefined,
    undefined,
    normalizedCollection
  );

  if (search?.theme) {
    demoProject.theme = search.theme as any;
  }

  return (
    <div className="relative">
      <WeddingDemoHeader currentCollection={normalizedCollection} />
      <WeddingRenderer project={demoProject} previewMode={false} />
    </div>
  );
}
