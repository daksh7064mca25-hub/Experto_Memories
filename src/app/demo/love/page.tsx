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
  title: "Our Little Love Story — Interactive Digital Love Book | ExpertoMemories",
  description:
    "Open a realistic, interactive digital love book crafted exclusively for your partner. Features handwritten love letters, Polaroid scrapbook memories, love reasons, date coupons, and songs.",
  openGraph: {
    title: "Our Little Love Story — Interactive Digital Love Book | ExpertoMemories",
    description: "A realistic digital love book with turning pages, handwritten letters, and couple memories.",
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
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-serif font-semibold bg-rose-50/95 backdrop-blur-md text-rose-900 shadow-sm border border-rose-200">
          <Sparkles size={11} className="text-amber-500" />
          <span>Interactive Digital Love Book 📖</span>
        </span>
      </div>

      <div className="fixed bottom-4 right-4 z-50 hidden sm:block">
        <Link
          href="/dashboard/create?occasion=love"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-serif font-bold bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:scale-105 text-white shadow-xl shadow-rose-900/20 transition-all border border-amber-300/40"
        >
          <Heart size={14} className="fill-current" />
          <span>Create Your Love Book</span>
        </Link>
      </div>

      <LoveRenderer project={LOVE_DEMO_PROJECT} previewMode={false} />
    </div>
  );
}
