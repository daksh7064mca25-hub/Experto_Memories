"use client";

import React, { useState } from "react";
import { Plus, Minus, Sparkles, Heart, HelpCircle, ShieldCheck, Clock, Share2, Globe, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface FaqItem {
  id: string;
  category: "Getting Started" | "Customization" | "Payments & Publishing" | "Sharing & Domains";
  q: string;
  a: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: "what-is-expertomemories",
    category: "Getting Started",
    q: "What is ExpertoMemories?",
    a: "ExpertoMemories is a luxury digital gifting studio where you create personalized, interactive gift websites for your loved ones. Rather than sending a fleeting text or a static card, you build a private, cinematic web experience complete with handwritten love letters, polaroid photo memories, background acoustic music, couple games, and interactive surprises.",
  },
  {
    id: "can-i-customize-myself",
    category: "Getting Started",
    q: "Can I customize my gift website myself?",
    a: "Yes, completely! Our self-service Visual Studio Editor requires no technical knowledge or coding skills. You can write your own personal notes, upload photographs, choose background music, adjust color themes, and reorder sections with simple visual controls.",
  },
  {
    id: "is-customization-free",
    category: "Getting Started",
    q: "Is customization free?",
    a: "Yes, 100%. You can create an account, start a project, write your letters, upload photos, and preview the entire live experience across mobile and desktop viewports without paying a single rupee.",
  },
  {
    id: "pay-before-editing",
    category: "Getting Started",
    q: "Do I have to pay before editing?",
    a: "No. You never pay upfront. You only pay when you are completely satisfied with your preview and ready to publish your website live to share with your recipient.",
  },
  {
    id: "add-photos-and-music",
    category: "Customization",
    q: "Can I add my own photographs and music?",
    a: "Yes! You can upload high-resolution photographs directly into your memory gallery and upload custom MP3/WAV audio tracks, or choose from our pre-cleared collection of romantic acoustic soundtracks.",
  },
  {
    id: "password-protection",
    category: "Customization",
    q: "Can I password-protect my gift?",
    a: "Yes. In the editor's Access & Security tab, you can enable password protection and set a personal passphrase along with a secret hint. Only someone who enters the correct password will be able to unlock and view your personal letters and memories.",
  },
  {
    id: "what-happens-after-payment",
    category: "Payments & Publishing",
    q: "What happens after payment?",
    a: "Immediately upon payment confirmation, your gift website is published to its permanent, private live link (e.g. expertomemories.shop/gift/your-story). You receive a 1-click WhatsApp sharing link and a high-resolution printable QR gift card to include in physical gift boxes or flowers.",
  },
  {
    id: "how-long-accessible",
    category: "Payments & Publishing",
    q: "How long will my gift website remain accessible?",
    a: "Every published gift website includes 12 full months of high-speed cloud hosting on secure global CDN infrastructure. You can extend or renew your hosting at any time directly from your customer dashboard.",
  },
  {
    id: "share-through-whatsapp",
    category: "Sharing & Domains",
    q: "Can I share my gift through WhatsApp?",
    a: "Yes! Your published website includes a pre-formatted WhatsApp share button that generates an elegant message and your private link, designed specifically for a magical mobile viewing experience.",
  },
  {
    id: "custom-domain",
    category: "Sharing & Domains",
    q: "Can I request a custom domain?",
    a: "Yes. During checkout or from your customer dashboard, you can connect your own custom domain (e.g. www.elenaandmarcus.love). We provide simple CNAME instructions to connect your custom web address directly to your gift website.",
  },
];

interface Props {
  initialOpenIndex?: number | null;
  showCategoryFilter?: boolean;
}

export function FaqAccordion({ initialOpenIndex = 0, showCategoryFilter = true }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(initialOpenIndex !== null && FAQ_DATA[initialOpenIndex] ? [FAQ_DATA[initialOpenIndex].id] : [])
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Getting Started", "Customization", "Payments & Publishing", "Sharing & Domains"];

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredItems =
    selectedCategory === "All"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Category Pills (Subtle filtering) */}
      {showCategoryFilter && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all shrink-0 select-none ${
                  isSelected
                    ? "bg-[#541D2B] text-white shadow-xs font-medium"
                    : "bg-[#FAF7F2] text-[#57534E] border border-[#EAE3D9] hover:border-[#C5A36A] hover:text-[#211715]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion Cards */}
      <div className="space-y-3.5">
        {filteredItems.map((item, idx) => {
          const isOpen = openIds.has(item.id);
          const controlsId = `faq-answer-${item.id}`;
          const buttonId = `faq-button-${item.id}`;

          return (
            <div
              key={item.id}
              className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-white border-[#C5A36A]/60 shadow-md shadow-[#541D2B]/5 ring-1 ring-[#C5A36A]/20"
                  : "bg-white/70 hover:bg-white border-[#EAE3D9] hover:border-[#C5A36A]/40 shadow-xs"
              }`}
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => toggleFaq(item.id)}
                aria-expanded={isOpen}
                aria-controls={controlsId}
                className="w-full py-4 sm:py-5 px-5 sm:px-7 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#541D2B] focus-visible:ring-offset-2 rounded-2xl transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3 sm:gap-3.5 pr-2">
                  <span
                    className={`mt-0.5 text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md transition-colors shrink-0 ${
                      isOpen
                        ? "bg-[#541D2B]/10 text-[#541D2B]"
                        : "bg-[#FAF7F2] text-[#78716C] group-hover:text-[#541D2B]"
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="font-serif font-bold text-sm sm:text-base text-[#211715] group-hover:text-[#541D2B] transition-colors leading-snug">
                    {item.q}
                  </span>
                </div>

                {/* Animated Plus / Minus Indicator */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen
                      ? "bg-[#541D2B] text-white rotate-90"
                      : "bg-[#FAF7F2] text-[#541D2B] border border-[#EAE3D9] group-hover:border-[#C5A36A]"
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                </div>
              </button>

              {/* Collapsible Answer Container */}
              <div
                id={controlsId}
                role="region"
                aria-labelledby={buttonId}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-96 opacity-100 block" : "max-h-0 opacity-0 hidden"
                }`}
              >
                <div className="px-5 sm:px-7 pb-5 pt-1 text-xs sm:text-sm text-[#57534E] leading-relaxed border-t border-[#F2EDE5] font-sans">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
