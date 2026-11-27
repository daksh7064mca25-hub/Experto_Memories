"use client";

import React, { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Volume2, VolumeX, Sparkles, Disc } from "lucide-react";
import { AudioSettings } from "@/types/website";

interface Props {
  audioSettings?: AudioSettings;
  customAudioUrl?: string;
  customTitle?: string;
  customArtist?: string;
  previewMode?: boolean;
}

export function LoveMusicPlayer({
  audioSettings,
  customAudioUrl,
  customTitle,
  customArtist,
  previewMode = false,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl =
    customAudioUrl ||
    audioSettings?.backgroundMusicUrl ||
    "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3";

  const songTitle = customTitle || audioSettings?.title || "Until I Found You (Acoustic)";
  const artistName = customArtist || audioSettings?.artist || "The Secret World of Us";

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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
  };

  return (
    <div
      className={`${
        previewMode
          ? "absolute bottom-3 right-3 z-30"
          : "fixed bottom-4 right-4 z-50"
      } select-none transition-all duration-300 pointer-events-auto`}
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand soundtrack player"
          className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-[#E8D5C4] shadow-xl text-rose-800 hover:scale-105 active:scale-95 transition-all"
          title={`${songTitle} (Click to expand)`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 text-amber-200 shadow-inner ${
              isPlaying ? "animate-spin-slow" : ""
            }`}
            style={{
              background: "radial-gradient(circle, #5e111d 35%, #3a0a12 70%, #1a0306 100%)",
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-stone-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-900" />
            </div>
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8D5C4] shadow-2xl shadow-rose-950/10 text-xs font-medium text-stone-800 min-h-[44px]">
            {/* Animated Rotating Vinyl Icon */}
            <button
              type="button"
              onClick={togglePlay}
              className="relative flex items-center justify-center w-8 h-8 rounded-full text-amber-200 shadow-inner cursor-pointer hover:scale-110 transition-transform shrink-0"
              style={{
                background: "radial-gradient(circle, #5e111d 35%, #3a0a12 70%, #1a0306 100%)",
                boxShadow: isPlaying ? "0 0 10px rgba(225, 29, 72, 0.4)" : "none",
              }}
            >
              <div className={`w-full h-full flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`}>
                <Disc size={20} className="text-amber-300/90" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isPlaying ? (
                  <Pause size={10} className="text-white fill-white" />
                ) : (
                  <Play size={10} className="text-white fill-white ml-0.5" />
                )}
              </div>
            </button>

            {/* Track Info */}
            <div className="flex flex-col text-left leading-tight pr-1 overflow-hidden max-w-[130px] sm:max-w-[190px]">
              <span className="font-serif font-bold text-[#3a0d15] truncate text-[12px] sm:text-[13px]">
                {songTitle}
              </span>
              <span className="text-[10px] text-rose-700/80 truncate">
                {artistName}
              </span>
              {/* Mini progress bar */}
              <div className="w-full bg-stone-200 rounded-full h-1 mt-1 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Audio volume/mute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>

            {/* Minimize button */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="text-[10px] text-stone-400 hover:text-stone-700 px-1 py-0.5 rounded transition-colors"
              title="Minimize player"
            >
              —
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
