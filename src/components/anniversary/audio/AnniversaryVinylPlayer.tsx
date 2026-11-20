"use client";

import React, { useState, useRef } from "react";
import { Music, Play, Pause, Volume2, Sparkles, Disc } from "lucide-react";
import { AudioSettings } from "@/types/website";

interface Props {
  audioSettings?: AudioSettings;
  customAudioUrl?: string;
  customTitle?: string;
  customArtist?: string;
  previewMode?: boolean;
}

export function AnniversaryVinylPlayer({
  audioSettings,
  customAudioUrl,
  customTitle,
  customArtist,
  previewMode = false,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl =
    customAudioUrl ||
    audioSettings?.backgroundMusicUrl ||
    "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3";

  const songTitle = customTitle || audioSettings?.title || "Golden Acoustic Melody";
  const artistName = customArtist || audioSettings?.artist || "Our Forever Soundtrack";

  if (audioSettings && audioSettings.enabled === false && !customAudioUrl) {
    return null;
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio playback error:", e));
    }
  };

  return (
    <div
      className={`${
        previewMode
          ? "absolute bottom-3 right-3 z-30"
          : "fixed bottom-4 right-4 z-50"
      } select-none transition-all duration-300 pointer-events-auto`}
    >
      <audio ref={audioRef} src={audioUrl} loop preload="none" />

      {isMinimized ? (
        /* Minimized disc button (ultra-compact, avoids blocking preview content) */
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand soundtrack player"
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-amber-300/80 shadow-lg text-amber-600 hover:scale-105 active:scale-95 transition-all"
          title={`${songTitle} (Click to expand)`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 text-amber-200 shadow-inner ${
              isPlaying ? "animate-spin-slow" : ""
            }`}
            style={{
              background:
                "radial-gradient(circle, #3a2e28 35%, #1c1511 70%, #0a0604 100%)",
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-stone-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-900" />
            </div>
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? `Pause ${songTitle}` : `Play romantic soundtrack: ${songTitle}`}
            className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-amber-200/80 dark:border-purple-800 shadow-xl shadow-amber-900/10 hover:scale-105 active:scale-95 transition-all text-xs font-medium group min-h-[44px]"
          >
            {/* Animated Rotating Vinyl Icon */}
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 text-amber-200 shadow-inner ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
              style={{
                background:
                  "radial-gradient(circle, #3a2e28 35%, #1c1511 70%, #0a0604 100%)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-stone-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-stone-900" />
              </div>
            </div>

            {/* Track Metadata */}
            <div className="flex flex-col text-left leading-tight pr-1">
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs truncate max-w-[100px] sm:max-w-[130px]">
                {isPlaying ? songTitle : "Our Soundtrack"}
              </span>
              <span className="text-[10px] text-amber-700 dark:text-purple-300 truncate max-w-[100px] sm:max-w-[130px]">
                {isPlaying ? artistName : "Tap to Play 🎶"}
              </span>
            </div>

            {/* Dynamic Equalizer / Play indicator */}
            <div className="flex items-center gap-1.5 pl-1">
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 h-full bg-amber-500 animate-pulse" />
                  <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-100" />
                  <span className="w-0.5 h-3 bg-amber-500 animate-pulse delay-200" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-purple-950 text-amber-700 dark:text-purple-300 flex items-center justify-center">
                  <Play size={12} className="ml-0.5 fill-current" />
                </div>
              )}
            </div>
          </button>

          {/* Minimize toggle button */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize soundtrack player"
            className="w-7 h-7 rounded-full bg-white/90 dark:bg-stone-800/90 border border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-xs transition-colors"
            title="Minimize player"
          >
            ✕
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spinSlow 6s linear infinite;
        }
      `}</style>
    </div>
  );
}

