"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { AudioSettings } from "@/types/website";

interface Props {
  audioSettings?: AudioSettings;
  previewMode?: boolean;
}

export function BirthdayMusicPlayer({ audioSettings, previewMode = false }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = audioSettings?.backgroundMusicUrl;
  const isEnabled = audioSettings?.enabled !== false && Boolean(audioUrl);
  const songTitle = audioSettings?.title || "Happy Birthday Celebration";
  const artist = audioSettings?.artist || "ExpertoMemories Soundtrack";

  useEffect(() => {
    if (!isEnabled || !audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));

    // Respect browser autoplay policies
    if (audioSettings?.autoplay && !previewMode) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(() => {
            // Browser autoplay restricted; user will tap to play
            setIsPlaying(false);
          });
      }
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [audioUrl, isEnabled, audioSettings?.autoplay, previewMode]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio play prevented:", e));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]">
      <div
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            togglePlay();
          }
        }}
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-md shadow-lg border select-none ${
          isPlaying
            ? "bg-amber-500/90 text-white border-amber-300 shadow-amber-500/20"
            : "bg-white/90 text-stone-800 border-amber-200 shadow-stone-900/10 hover:bg-white"
        }`}
      >
        {/* Animated Disc / Icon */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
            isPlaying
              ? "bg-amber-600 text-white animate-spin [animation-duration:4s]"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {isPlaying ? <Music size={13} /> : <Play size={12} className="ml-0.5" />}
        </div>

        {/* Track Info */}
        <div className="flex flex-col text-left leading-tight pr-1 overflow-hidden max-w-[120px] sm:max-w-[180px]">
          <span className="text-[11px] font-serif font-bold truncate">
            {isPlaying ? songTitle : "Tap for Birthday Music"}
          </span>
          <span className="text-[9px] font-sans opacity-75 truncate">
            {isPlaying ? artist : "Play Melody 🎵"}
          </span>
        </div>

        {/* Mute button */}
        {isPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 rounded-full hover:bg-black/10 transition-colors text-white"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

