"use client";

import React, { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Volume2, Sparkles, Disc, RotateCw } from "lucide-react";
import { AnniversarySoundtrackConfig, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversarySoundtrackConfig;
  theme: ThemeId;
}

export function AnniversarySoundtrackSection({ config, theme }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [currentTime, setCurrentTime] = useState("0:00");
  const [durationTime, setDurationTime] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const themeConfig = getThemeConfig(theme, "anniversary");
  const audioUrl =
    config.audioUrl || "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3";

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Playback error:", e));
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(pct);

      const curM = Math.floor(audio.currentTime / 60);
      const curS = Math.floor(audio.currentTime % 60);
      setCurrentTime(`${curM}:${curS < 10 ? "0" : ""}${curS}`);

      const durM = Math.floor(audio.duration / 60);
      const durS = Math.floor(audio.duration % 60);
      setDurationTime(`${durM}:${durS < 10 ? "0" : ""}${durS}`);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const seekPct = parseFloat(e.target.value);
    audio.currentTime = (seekPct / 100) * audio.duration;
    setProgress(seekPct);
  };

  return (
    <section id="anniv-sec-soundtrack" className="py-16 px-4 max-w-xl mx-auto text-center">
      {/* Hidden audio element (strictly no autoplay) */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className={`${themeConfig.cardBgClass} rounded-3xl p-6 sm:p-10 shadow-2xl border relative overflow-hidden select-none`}>
        {/* Section Pill */}
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-amber-100 dark:bg-purple-950 text-amber-800 dark:text-purple-300 mb-2 border border-amber-200/80 dark:border-purple-800">
          The Melody of Us 🎵
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-purple-100 mb-2">
          {config.headline || "Our Soundtrack"}
        </h2>
        <p className="text-sm opacity-80 max-w-sm mx-auto font-sans mb-8 leading-relaxed">
          {config.subtext || "Every love story has an anthem. This is the melody that holds our memories."}
        </p>

        {/* 3D Turntable / Vinyl Record Player */}
        <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 mb-8 flex items-center justify-center">
          {/* Vinyl Disc Body */}
          <div
            className={`w-full h-full rounded-full shadow-2xl flex items-center justify-center transition-transform duration-700 ${
              isPlaying ? "animate-spin-record" : ""
            }`}
            style={{
              background:
                "radial-gradient(circle, #291f1a 18%, #140d0a 40%, #2b1f1a 60%, #0d0705 90%)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {/* Center Label */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-rose-400 to-amber-600 border-2 border-stone-800 flex flex-col items-center justify-center text-stone-900 shadow-inner p-1">
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase">OUR SONG</span>
              <span className="text-xs">💖</span>
            </div>
          </div>

          {/* Turntable Tonearm (Pivots over record when playing) */}
          <div
            className={`absolute top-2 right-2 w-12 h-24 origin-top-right transition-transform duration-500 pointer-events-none ${
              isPlaying ? "rotate-[-10deg]" : "rotate-[-45deg]"
            }`}
          >
            <div className="w-1.5 h-20 bg-stone-400 rounded-full mx-auto shadow" />
            <div className="w-3 h-4 bg-amber-600 rounded-sm mx-auto mt-[-2px] shadow-sm" />
          </div>
        </div>

        {/* Track Title & Artist */}
        <div className="mb-4">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-purple-100">
            {config.songTitle || "Golden Acoustic Melody"}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-amber-700 dark:text-purple-300 font-medium mt-0.5">
            {config.artist || "Romantic Piano Strings"}
          </p>
        </div>

        {/* Personal Explanation Note */}
        {config.personalExplanation && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-purple-950/40 border border-amber-200/70 dark:border-purple-800 text-left mb-6">
            <span className="font-serif italic text-xs font-semibold text-amber-800 dark:text-purple-300 block mb-1">
              Why this song belongs to us:
            </span>
            <p className="font-sans text-xs text-stone-700 dark:text-purple-200 leading-relaxed">
              &ldquo;{config.personalExplanation}&rdquo;
            </p>
          </div>
        )}

        {/* Progress Slider */}
        <div className="space-y-1 mb-6">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            aria-label="Seek audio position"
            className="w-full h-2 bg-stone-200 dark:bg-purple-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />
          <div className="flex justify-between text-[11px] font-mono text-stone-400">
            <span>{currentTime}</span>
            <span>{durationTime}</span>
          </div>
        </div>

        {/* Play / Pause Interactive Button (Min 44px touch target) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
            className={`min-h-[48px] px-8 py-3.5 rounded-full font-serif font-bold text-sm flex items-center gap-2.5 transition-all shadow-xl active:scale-95 ${themeConfig.primaryButtonClass}`}
          >
            {isPlaying ? (
              <>
                <Pause size={16} />
                <span>Pause Melody</span>
              </>
            ) : (
              <>
                <Play size={16} className="fill-current" />
                <span>Play Our Melody</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spinRecord {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-record {
          animation: spinRecord 5s linear infinite;
        }
      `}</style>
    </section>
  );
}

