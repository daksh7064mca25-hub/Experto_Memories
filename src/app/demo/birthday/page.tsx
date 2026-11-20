import { Metadata, Viewport } from "next";
import { BirthdayRenderer } from "@/components/birthday/BirthdayRenderer";
import { createRelationshipBirthdayProject } from "@/config/birthday-template";
import Link from "next/link";
import { ArrowLeft, Sparkles, Gift } from "lucide-react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Live Interactive Birthday Website Demo | ExpertoMemories",
  description:
    "Explore interactive Birthday demos for ExpertoMemories. Celebrate Mom, Dad, Best Friends, Kids, or Milestones with candle blowouts, scrapbook memories, and celebration games.",
  openGraph: {
    title: "The Birthday Wonderland — Interactive Sample | ExpertoMemories",
    description: "An interactive digital celebration made exclusively for birthdays.",
    type: "website",
  },
};

interface BirthdayDemoProps {
  searchParams?: Promise<{ for?: string }>;
}

export default async function BirthdayDemoPage({ searchParams }: BirthdayDemoProps) {
  const params = await searchParams;
  const rel = (params?.for || "general").toLowerCase();

  let recipientName = "Ananya";
  let senderName = "Rohan & Family";
  let age = 25;

  if (rel === "mother" || rel === "mom") {
    recipientName = "Mom";
    senderName = "With All Our Love";
    age = 52;
  } else if (rel === "father" || rel === "dad") {
    recipientName = "Dad";
    senderName = "With Immense Respect";
    age = 56;
  } else if (rel === "best-friend" || rel === "friend") {
    recipientName = "Tara";
    senderName = "Sameer (Your Bestie)";
    age = 24;
  } else if (rel === "kids" || rel === "kid") {
    recipientName = "Aarav";
    senderName = "Mom & Dad";
    age = 7;
  }

  const project = {
    ...createRelationshipBirthdayProject("demo-birthday", recipientName, senderName, rel, age),
    _id: `demo-project-birthday-${rel}`,
    status: "published" as const,
  };

  return (
    <div className="relative">
      {/* Floating Header Bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/birthdays"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-bold bg-white/90 backdrop-blur-md text-stone-800 shadow-md hover:bg-white transition-all"
          >
            <ArrowLeft size={13} />
            <span>All Birthdays</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500 text-white shadow-md">
            <Sparkles size={11} />
            <span>Interactive Sample</span>
          </span>
        </div>

        {/* Relationship switch pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-xl overflow-x-auto max-w-[calc(100vw-140px)] sm:max-w-none">
          <Link
            href="/demo/birthday"
            className={`px-3 py-1 rounded-full text-[11px] font-serif font-semibold transition ${
              rel === "general"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Wonderland
          </Link>
          <Link
            href="/demo/birthday?for=mother"
            className={`px-3 py-1 rounded-full text-[11px] font-serif font-semibold transition ${
              rel === "mother"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            For Mom
          </Link>
          <Link
            href="/demo/birthday?for=father"
            className={`px-3 py-1 rounded-full text-[11px] font-serif font-semibold transition ${
              rel === "father"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            For Dad
          </Link>
          <Link
            href="/demo/birthday?for=best-friend"
            className={`px-3 py-1 rounded-full text-[11px] font-serif font-semibold transition ${
              rel === "best-friend"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Best Friend
          </Link>
          <Link
            href="/demo/birthday?for=kids"
            className={`px-3 py-1 rounded-full text-[11px] font-serif font-semibold transition ${
              rel === "kids"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            Kids
          </Link>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <Link
          href={`/dashboard/create?occasion=birthday&relationship=${rel}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 transition-all hover:scale-105"
        >
          <Gift size={14} />
          <span>Customize This Birthday</span>
        </Link>
      </div>

      <BirthdayRenderer project={project} previewMode={false} />
    </div>
  );
}
