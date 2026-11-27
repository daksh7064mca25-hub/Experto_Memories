"use client";

import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

interface Chapter {
  id: string;
  year?: string;
  title: string;
  story: string;
  photoUrl?: string;
}

interface DestinationCoupleStoryProps {
  groomName: string;
  brideName: string;
  groomTitle?: string;
  groomBio?: string;
  groomPhotoUrl?: string;
  brideTitle?: string;
  brideBio?: string;
  bridePhotoUrl?: string;
  destinationWhyNarrative?: string;
  chapters?: Chapter[];
  venueCity?: string;
}

export const DestinationCoupleStory: React.FC<DestinationCoupleStoryProps> = ({
  groomName,
  brideName,
  groomTitle,
  groomBio,
  groomPhotoUrl,
  brideTitle,
  brideBio,
  bridePhotoUrl,
  destinationWhyNarrative,
  chapters,
  venueCity = "South Goa, India",
}) => {
  const finalGroom = groomName || "Kabir";
  const finalBride = brideName || "Natasha";

  const defaultWhyNarrative =
    destinationWhyNarrative ||
    `“From the very first trip we took together along the Arabian coastline, we fell in love with the unhurried rhythm of South Goa. We wanted our wedding not just to be a single ceremonial day, but an intimate holiday where our cherished families and closest friends could slow down, walk barefoot in the sand, laugh under swaying palm trees, and celebrate the adventure of our two lives becoming one.”`;

  const displayChapters: Chapter[] = chapters && chapters.length > 0 ? chapters : [
    {
      id: "chap-1",
      year: "December 2021",
      title: "The Unplanned First Hello",
      story: "Introduced by mutual friends during a winter evening in Mumbai, our conversation flowed effortlessly until the cafe chairs were being stacked around us.",
      photoUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "chap-2",
      year: "Spring 2023",
      title: "Adventures Across Coastlines",
      story: "Spontaneous coastal road trips, sharing secret sunset spots, and realizing that no matter where in the world we went, we were already home with each other.",
      photoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "chap-3",
      year: "Autumn 2025",
      title: "The Sunset Cliffside Promise",
      story: "On a quiet cliffside overlooking the ocean, under a canopy of twilight stars, he whispered the question she had long carried in her heart.",
      photoUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section
      id="sec-couple-story"
      className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-16"
      aria-label="The Couple & Our Destination Story"
    >
      {/* 1. Why We Chose This Destination Editorial Callout */}
      <div className="w-full bg-[#FAF8F5] rounded-2xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-lg p-5 sm:p-10 mb-8 sm:mb-14 relative overflow-hidden text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/50 bg-[#F4EFE6] flex items-center justify-center text-[#996515] mx-auto mb-3 shadow-xs">
          <Quote size={18} className="text-[#A47E3B]" />
        </div>

        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#A47E3B] font-semibold block mb-1.5">
          WHY WE CHOSE {venueCity.toUpperCase()}
        </span>

        <h3 className="text-xl sm:text-3xl font-serif font-normal text-[#0F2336] mb-3">
          A Celebration Designed as a Journey
        </h3>

        <p className="text-xs sm:text-base font-serif italic text-stone-700 leading-relaxed max-w-2xl mx-auto px-1">
          {defaultWhyNarrative}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]/40" />
          <span className="text-xs font-serif text-[#C5A36A] font-semibold">
            {finalBride} &amp; {finalGroom}
          </span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]/40" />
        </div>
      </div>

      {/* 2. Couple Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-10 sm:mb-16">
        {/* Bride Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-8 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md mb-3">
            <Image
              src={bridePhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={finalBride}
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#A47E3B] font-semibold">
            THE BRIDE
          </span>
          <h4 className="text-lg sm:text-2xl font-serif font-semibold text-[#0F2336] mt-0.5">
            {finalBride}
          </h4>
          {brideTitle && (
            <p className="text-xs font-serif text-stone-500 mt-0.5">{brideTitle}</p>
          )}
          {brideBio && (
            <p className="text-xs font-serif text-stone-600 mt-2 leading-relaxed">
              {brideBio}
            </p>
          )}
        </div>

        {/* Groom Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-8 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md mb-3">
            <Image
              src={groomPhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"}
              alt={finalGroom}
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#A47E3B] font-semibold">
            THE GROOM
          </span>
          <h4 className="text-lg sm:text-2xl font-serif font-semibold text-[#0F2336] mt-0.5">
            {finalGroom}
          </h4>
          {groomTitle && (
            <p className="text-xs font-serif text-stone-500 mt-0.5">{groomTitle}</p>
          )}
          {groomBio && (
            <p className="text-xs font-serif text-stone-600 mt-2 leading-relaxed">
              {groomBio}
            </p>
          )}
        </div>
      </div>

      {/* 3. Story Chapters */}
      <div className="text-center mb-6">
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#A47E3B] font-semibold block mb-1">
          CHAPTERS OF LOVE
        </span>
        <h3 className="text-xl sm:text-3xl font-serif text-[#0F2336]">
          How Our Story Unfolded
        </h3>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {displayChapters.map((chap, idx) => (
          <div
            key={chap.id || `chap-${idx}`}
            className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-7 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center"
          >
            {chap.photoUrl && (
              <div className="relative w-full sm:w-44 h-36 sm:h-36 rounded-xl overflow-hidden shrink-0 shadow-xs">
                <Image
                  src={chap.photoUrl}
                  alt={chap.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 200px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left min-w-0">
              {chap.year && (
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#A47E3B] font-semibold bg-[#F5EFE6] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {chap.year}
                </span>
              )}
              <h4 className="text-base sm:text-lg font-serif font-bold text-[#0F2336]">
                {chap.title}
              </h4>
              <p className="text-xs sm:text-sm font-serif text-stone-600 mt-1.5 leading-relaxed">
                {chap.story}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
