import React, { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, ExternalLink, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { PhulkariDiamondBorder, TraditionalHaveliArch } from "./PhulkariPatterns";

export type CeremonyType = "sikh" | "hindu" | "custom";

export interface CeremonyConfig {
  ceremonyType?: CeremonyType;
  date?: string;
  time?: string;
  venueName?: string;
  address?: string;
  googleMapsUrl?: string;
  familyMessage?: string;
  ceremonyDescription?: string;
  // Sikh-specific
  showLaavanExplanation?: boolean;
  religiousQuote?: string;
  // Hindu-specific
  shubhMuhurat?: string;
  showPherasExplanation?: boolean;
}

interface Props {
  ceremonyConfig?: CeremonyConfig;
  defaultDateText?: string;
  coupleNames?: string;
}

export const PunjabiCeremonySection: React.FC<Props> = ({
  ceremonyConfig,
  defaultDateText = "Sunday, December 21, 2026",
  coupleNames = "Simran & Harpreet",
}) => {
  // Determine ceremony type (default to "sikh", or "hindu", or "custom")
  const ceremonyType: CeremonyType = ceremonyConfig?.ceremonyType || "sikh";
  const [expandedLaav, setExpandedLaav] = useState<number | null>(null);

  // Four Sacred Laavan Data (Dignified & Respectful Translation)
  const laavanDetails = [
    {
      round: "Pehli Laav",
      title: "The First Circumambulation & Foundation of Righteous Life",
      meaning:
        "The Lord instructs the couple to embark upon the household life with moral discipline, remembering the divine Name and walking in righteousness.",
    },
    {
      round: "Dooji Laav",
      title: "The Second Circumambulation & Divine Love and Reverence",
      meaning:
        "The Lord leads the soul to true devotion and awe. Through reverence, the mind is cleansed of ego, recognizing the Divine presence everywhere.",
    },
    {
      round: "Teeji Laav",
      title: "The Third Circumambulation & Holy Detachment and Joy",
      meaning:
        "The heart is filled with pure divine love and joyous contentment. In the company of the holy congregation, the soul sings songs of divine praise.",
    },
    {
      round: "Chauthi Laav",
      title: "The Fourth Circumambulation & Attainment of Eternal Oneness",
      meaning:
        "The mind reaches tranquility and eternal spiritual balance. The couple is united in mind, heart, and soul — living as one soul in two bodies.",
    },
  ];

  // Seven Sacred Pheras (Saptapadi for Punjabi Hindu Vivah)
  const pherasDetails = [
    {
      step: "First Phera",
      blessing: "For nourishment, health, and providing for the family together.",
    },
    {
      step: "Second Phera",
      blessing: "For mental, physical, and spiritual strength through all life’s seasons.",
    },
    {
      step: "Third Phera",
      blessing: "For prosperity, righteous wealth, and wise stewardship of our home.",
    },
    {
      step: "Fourth Phera",
      blessing: "For mutual love, respect, harmony, and joy between both families.",
    },
    {
      step: "Fifth Phera",
      blessing: "For noble, compassionate children and generations of virtue.",
    },
    {
      step: "Sixth Phera",
      blessing: "For longevity, peace of mind, and shared inner happiness.",
    },
    {
      step: "Seventh Phera",
      blessing: "For eternal companionship, lifelong devotion, and spiritual union.",
    },
  ];

  /* --------------------------------------------------------------------------
   * OPTION A: SIKH ANAND KARAJ CEREMONY PRESENTATION
   * Calm, dignified atmosphere, refined ivory & antique gold palette,
   * Gurdwara reference, four Laavan explanation.
   * -------------------------------------------------------------------------- */
  if (ceremonyType === "sikh") {
    return (
      <section
        id="ceremony-section"
        aria-label="The Sacred Anand Karaj Ceremony"
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-[#FFFDF9] text-[#2A060E] overflow-hidden border-y border-[#D4AF37]/40"
      >
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <TraditionalHaveliArch className="mb-4">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#B45309] block mb-2 font-bold">
              ੴ &bull; SACRED SPIRITUAL UNION
            </span>
          </TraditionalHaveliArch>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#2A060E] mb-4">
            The Sacred Anand Karaj
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-[#78350F] max-w-2xl mx-auto leading-relaxed mb-8">
            &ldquo;They are not said to be husband and wife, who merely sit together. Rather, they alone are called husband and wife, who have one soul in two bodies.&rdquo;
          </p>

          {/* Gurdwara & Ceremony Information Card */}
          <div className="rounded-3xl bg-white border-2 border-[#D4AF37]/50 p-7 sm:p-10 shadow-xl text-left max-w-2xl mx-auto space-y-6">
            <div className="border-b border-[#D4AF37]/25 pb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] font-bold block mb-1">
                GURDWARA CEREMONY VENUE
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2A060E]">
                {ceremonyConfig?.venueName || "Gurdwara Sri Guru Tegh Bahadur Sahib, Amritsar"}
              </h3>
              <p className="text-xs text-[#78350F] mt-1 font-sans">
                {ceremonyConfig?.address || "Heritage Marg, Amritsar, Punjab 143001"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-[#4A0E17]">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#D4AF37] shrink-0" />
                <span>{ceremonyConfig?.date || defaultDateText}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#D4AF37] shrink-0" />
                <span>{ceremonyConfig?.time || "10:30 AM (Baraat) • 11:30 AM (Anand Karaj)"}</span>
              </div>
            </div>

            <div className="bg-[#FAF5EB] p-4 rounded-2xl border border-[#D4AF37]/30 text-xs font-sans text-[#78350F] leading-relaxed">
              <p className="font-semibold text-[#2A060E] mb-1">Gurdwara Reverence &amp; Etiquette Notice:</p>
              <p>
                Guests are kindly requested to cover their heads with a rumal, chunni, or turban, remove footwear before entering the Darbar Sahib, and join in the blessed Guru Ka Langar feast following the ceremony.
              </p>
            </div>

            {/* Directions Link */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#78350F] font-mono">
                {ceremonyConfig?.familyMessage || "With deepest gratitude and family blessings"}
              </span>
              <a
                href={
                  ceremonyConfig?.googleMapsUrl ||
                  `https://maps.google.com/?q=${encodeURIComponent(
                    ceremonyConfig?.address || "Gurdwara Amritsar Punjab"
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-bold bg-[#E5A910] hover:bg-[#FBBF24] text-[#2A060E] shadow-sm transition"
              >
                <span>Gurdwara Directions</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Optional: The Four Sacred Laavan Explanation */}
          {ceremonyConfig?.showLaavanExplanation !== false && (
            <div className="mt-12 text-left max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h4 className="font-serif font-bold text-xl text-[#2A060E]">
                  The Four Sacred Laavan (The Four Vows)
                </h4>
                <p className="text-xs text-[#78350F] font-sans mt-1">
                  Composed by Guru Ram Das Ji, these four rounds describe the soul&apos;s journey toward spiritual oneness.
                </p>
              </div>

              <div className="space-y-3">
                {laavanDetails.map((laav, idx) => {
                  const isOpen = expandedLaav === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#D4AF37]/40 bg-white/90 overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedLaav(isOpen ? null : idx)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF5EB] transition cursor-pointer"
                      >
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#B45309] font-bold block">
                            {laav.round}
                          </span>
                          <span className="font-serif font-bold text-sm text-[#2A060E]">{laav.title}</span>
                        </div>
                        {isOpen ? <ChevronUp size={16} className="text-[#B45309]" /> : <ChevronDown size={16} className="text-[#B45309]" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-[#78350F] font-sans leading-relaxed border-t border-[#D4AF37]/20">
                          {laav.meaning}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <PhulkariDiamondBorder />
        </div>
      </section>
    );
  }

  /* --------------------------------------------------------------------------
   * OPTION B: PUNJABI HINDU WEDDING CEREMONY PRESENTATION
   * Warm marigold, vermillion red & sunset gold palette, traditional mandap,
   * sacred havan kunda & Vedic pheras, auspicious Shubh Muhurat.
   * -------------------------------------------------------------------------- */
  if (ceremonyType === "hindu") {
    return (
      <section
        id="ceremony-section"
        aria-label="The Punjabi Hindu Wedding Ceremony"
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2B060F] via-[#3E0A16] to-[#2B060F] text-[#FFFDF9] overflow-hidden border-y border-[#E5A910]/40"
      >
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <TraditionalHaveliArch className="mb-4">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block mb-2 font-bold">
              ॥ श्री गणेशाय नमः ॥ &bull; SHUBH VIVAH
            </span>
          </TraditionalHaveliArch>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] mb-4">
            The Sacred Vivah &amp; Pheras
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-amber-200/90 max-w-2xl mx-auto leading-relaxed mb-8">
            &ldquo;Dharmecha Arthecha Kaamecha Mokshecha Naaticharaami&rdquo; &bull; Seven sacred steps around the holy fire, uniting two souls and their families for seven lifetimes.
          </p>

          {/* Mandap & Ceremony Information Card */}
          <div className="rounded-3xl bg-[#4A0E17] border-2 border-[#E5A910]/60 p-7 sm:p-10 shadow-2xl text-left max-w-2xl mx-auto space-y-6">
            <div className="border-b border-[#E5A910]/30 pb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FBBF24] font-bold block mb-1">
                MANDAP &amp; CEREMONY VENUE
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#FFFDF9]">
                {ceremonyConfig?.venueName || "The Floral Mandap Pavilion, The Heritage Haveli, Amritsar"}
              </h3>
              <p className="text-xs text-amber-200/90 mt-1 font-sans">
                {ceremonyConfig?.address || "GT Road, Amritsar, Punjab 143001"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-amber-100">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#FBBF24] shrink-0" />
                <span>{ceremonyConfig?.date || defaultDateText}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#FBBF24] shrink-0" />
                <span>{ceremonyConfig?.time || "11:30 AM (Varmala) • 01:15 PM (Shubh Muhurat Pheras)"}</span>
              </div>
            </div>

            {ceremonyConfig?.shubhMuhurat && (
              <div className="p-3.5 rounded-xl bg-[#26050C] border border-[#E5A910]/40 flex items-center gap-2 text-xs text-[#FDE68A] font-serif">
                <Sparkles size={14} className="text-[#FBBF24] shrink-0" />
                <span>
                  Auspicious Lagna Muhurat: <strong>{ceremonyConfig.shubhMuhurat}</strong>
                </span>
              </div>
            )}

            <div className="bg-[#26050C]/90 p-4 rounded-2xl border border-amber-900/40 text-xs font-sans text-amber-100/90 leading-relaxed">
              <p className="font-semibold text-[#FBBF24] mb-1">Sacred Rituals &amp; Celebrations:</p>
              <p>
                The ceremony commences with the grand Varmala garland exchange, followed by Kanyadaan, the sacred Saptapadi around the Agni, and the heartfelt blessings of all elders.
              </p>
            </div>

            {/* Directions Link */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-amber-200 font-mono">
                {ceremonyConfig?.familyMessage || "With deepest love and family blessings"}
              </span>
              <a
                href={
                  ceremonyConfig?.googleMapsUrl ||
                  `https://maps.google.com/?q=${encodeURIComponent(
                    ceremonyConfig?.address || "Amritsar Punjab"
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-serif font-bold bg-[#E5A910] hover:bg-[#FBBF24] text-[#2A060E] shadow-sm transition"
              >
                <span>Mandap Directions</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Saptapadi Explanation Cards */}
          {ceremonyConfig?.showPherasExplanation !== false && (
            <div className="mt-12 text-left max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h4 className="font-serif font-bold text-xl text-[#FFFDF9]">
                  The Seven Sacred Pheras (Saptapadi)
                </h4>
                <p className="text-xs text-amber-200/80 font-sans mt-1">
                  Seven lifelong vows exchanged around the sacred fire.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pherasDetails.map((phera, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#3E0A16] border border-[#E5A910]/35 text-xs text-amber-100 font-sans"
                  >
                    <span className="font-serif font-bold text-[#FBBF24] block mb-0.5">
                      {phera.step}
                    </span>
                    <p className="text-[11px] leading-relaxed text-amber-100/90">{phera.blessing}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <PhulkariDiamondBorder />
        </div>
      </section>
    );
  }

  /* --------------------------------------------------------------------------
   * OPTION C: CUSTOM / OTHER CEREMONY
   * -------------------------------------------------------------------------- */
  return (
    <section
      id="ceremony-section"
      aria-label="Wedding Ceremony"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2B060F] to-[#3E0A16] text-[#FFFDF9] overflow-hidden border-y border-[#E5A910]/40"
    >
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#FBBF24] block mb-2 font-bold">
          AUSPICIOUS CEREMONY
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] mb-4">
          The Wedding Ceremony
        </h2>
        <p className="font-serif italic text-base text-amber-200/90 max-w-xl mx-auto mb-8">
          {ceremonyConfig?.ceremonyDescription ||
            "Two families united by love, laughter, and lifelong devotion. We invite you to join us as our children step into their holy union."}
        </p>

        <div className="rounded-3xl bg-[#4A0E17] border border-[#E5A910]/50 p-8 shadow-xl max-w-xl mx-auto text-left space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#FFFDF9]">
            {ceremonyConfig?.venueName || "Celebration Hall, Amritsar"}
          </h3>
          <p className="text-xs text-amber-200">{ceremonyConfig?.address || "Amritsar, Punjab, India"}</p>
          <div className="pt-2 text-xs text-amber-100 space-y-1">
            <p><strong>Date:</strong> {ceremonyConfig?.date || defaultDateText}</p>
            <p><strong>Timing:</strong> {ceremonyConfig?.time || "11:00 AM onwards"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
