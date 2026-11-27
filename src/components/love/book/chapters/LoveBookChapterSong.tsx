"use client";

import React, { useState, useRef } from "react";
import { Music, Play, Pause, Heart, Disc, Volume2, ExternalLink } from "lucide-react";
import { ThemeConfig } from "@/config/themes";

interface Props {
  recipientName: string;
  senderName: string;
  config: {
    headline?: string;
    subtext?: string;
    songTitle?: string;
    artistName?: string;
    audioUrl?: string;
    personalNote?: string;
    externalLink?: string;
  };
  theme: ThemeConfig;
}

export function LoveBookChapterSong({
  recipientName,
  senderName,
  config,
  theme,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const headline = config.headline || "Chapter VII • Our Song";
  const subtext =
    config.subtext || "The soundtrack to all our quiet moments and long drives.";
  const title = config.songTitle || "Until I Found You";
  const artist = config.artistName || "Stephen Sanchez";
  const audioUrl =
    config.audioUrl ||
    "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3";
  const personalNote =
    config.personalNote ||
    "The song that was playing when you first rested your head on my shoulder during our long night drive.";

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 font-serif text-stone-900 select-text overflow-y-auto">
      {/* Chapter Title */}
      <div className="mb-3">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-800 font-bold block mb-1">
          Our Soundtrack
        </span>
        <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-[#3a0d15] leading-tight">
          {headline}
        </h2>
        <p className="font-serif text-[11px] sm:text-xs text-stone-600 italic mt-0.5 leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Main Gramophone / Spinning Vinyl Record Spread */}
      <div className="my-auto max-w-sm mx-auto w-full text-center">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Vinyl Record Visual */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-4">
          <div
            className={`w-full h-full rounded-full bg-stone-950 border-4 border-stone-800 shadow-xl flex items-center justify-center transition-all ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
          >
            {/* Record Grooves */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-stone-800 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-stone-700 flex items-center justify-center">
                {/* Center Record Label */}
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-rose-700 border-2 border-amber-300 flex items-center justify-center text-amber-200">
                  <Heart size={14} className="fill-amber-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Central Play/Pause Floating Trigger */}
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
            aria-label={isPlaying ? "Pause music preview" : "Play music preview"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
        </div>

        {/* Track Metadata */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#3a0d15] mb-0.5">
          {title}
        </h3>
        <p className="font-mono text-xs text-stone-600 mb-3">{artist}</p>

        {/* Personal Intimate Partner Note */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-left mb-3">
          <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-amber-800 font-bold mb-1">
            <Heart size={9} className="fill-rose-500 text-rose-500" />
            <span>Why This Song Is Ours</span>
          </div>
          <p className="font-serif text-[11px] text-stone-700 italic leading-relaxed">
            &ldquo;{personalNote}&rdquo;
          </p>
        </div>

        {config.externalLink && (
          <a
            href={config.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-700 hover:text-rose-900 underline"
          >
            <span>Listen on Spotify / Apple Music</span>
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* Bottom Annotation */}
      <div className="mt-2 pt-2 border-t border-amber-900/10 flex items-center justify-between text-[10px] text-stone-500 italic">
        <span className="font-handwriting text-xs text-rose-800">
          &ldquo;Where words fail, music speaks for us.&rdquo;
        </span>
        <span className="font-mono text-[9px]">Page 8</span>
      </div>
    </div>
  );
}
