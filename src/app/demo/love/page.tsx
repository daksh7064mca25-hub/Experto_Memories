import { Metadata, Viewport } from "next";
import { LoveRenderer } from "@/components/love/LoveRenderer";
import { LOVE_DEMO_PROJECT } from "@/config/love-demo-data";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart } from "lucide-react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Live Interactive Romantic Love Demo | ExpertoMemories",
  description:
    "Explore the interactive Love demo for ExpertoMemories. Features love milestones, secret couple trivia, reasons why I love you constellation, and love letters.",
  openGraph: {
    title: "Letters Across Time — Interactive Love Demo | ExpertoMemories",
    description: "An intimate digital time capsule of pure love and romance.",
    type: "website",
  },
};

export default function LoveDemoPage() {
  return (
    <div className="relative">
      {/* Floating Demo Watermark / Action Pill */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <Link
          href="/#products"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-bold bg-white/90 backdrop-blur-md text-stone-800 shadow-md hover:bg-white transition-all"
        >
          <ArrowLeft size={13} />
          <span>Back to Gifts</span>
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold bg-rose-500 text-white shadow-md">
          <Sparkles size={11} />
          <span>Interactive Romance Sample</span>
        </span>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <Link
          href="/dashboard/create?occasion=love"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/30 transition-all hover:scale-105"
        >
          <Heart size={14} className="fill-current" />
          <span>Customize This Love Gift</span>
        </Link>
      </div>

      <LoveRenderer project={LOVE_DEMO_PROJECT} previewMode={false} />
    </div>
  );
}
