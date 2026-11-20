"use client";

import React, { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX, Sparkles } from "lucide-react";
import { AudioSettings } from "@/types/website";

export function BackgroundAudioPlayer({
  audioSettings,
  previewMode = false,
}: {
  audioSettings?: AudioSettings;
  previewMode?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl =
    audioSettings?.backgroundMusicUrl ||
    "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3";

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
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

  if (!audioSettings?.enabled) return null;

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
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand background music player"
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-rose-300/80 shadow-lg text-rose-600 hover:scale-105 active:scale-95 transition-all"
          title={`${audioSettings?.title || "Music"} (Click to expand)`}
        >
          <div className={`flex items-center justify-center w-7 h-7 rounded-full ${isPlaying ? "bg-rose-500 text-white animate-spin-slow" : "bg-rose-100 text-rose-600"}`}>
            {isPlaying ? <Volume2 size={13} /> : <Music size={13} />}
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
            aria-label={isPlaying ? "Mute background music" : "Play romantic background music"}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-rose-200/80 shadow-lg shadow-rose-200/40 text-rose-800 hover:scale-105 active:scale-95 transition-all text-xs font-medium group min-h-[44px]"
          >
            <div className={`relative flex items-center justify-center w-6 h-6 rounded-full ${isPlaying ? "bg-rose-500 text-white animate-spin-slow" : "bg-rose-100 text-rose-600"}`}>
              {isPlaying ? <Volume2 size={13} /> : <Music size={13} />}
            </div>

            <div className="flex flex-col text-left leading-none pr-1">
              <span className="font-semibold text-rose-950">
                {isPlaying ? "Music Playing" : "Tap for Music"}
              </span>
              <span className="text-[10px] text-rose-600/80 truncate max-w-[100px]">
                {audioSettings?.title || "Gentle Melody"}
              </span>
            </div>

            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3 ml-0.5">
                <span className="w-0.5 h-full bg-rose-500 animate-pulse" />
                <span className="w-0.5 h-2 bg-rose-400 animate-pulse delay-75" />
                <span className="w-0.5 h-2.5 bg-rose-500 animate-pulse delay-150" />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize music player"
            className="w-7 h-7 rounded-full bg-white/90 border border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs shadow-xs transition-colors"
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
          animation: spinSlow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

