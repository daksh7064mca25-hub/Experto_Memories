"use client";

import React, { useState, useRef } from "react";
import { Music, Play, Pause, Heart, Disc, Volume2, Sparkles, ExternalLink } from "lucide-react";
import { LovePlaylistConfig, LovePlaylistTrack } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LovePlaylistConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
}

export function LovePlaylistSection({
  config,
  recipientName,
  senderName,
  theme,
}: Props) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = config.tracks || [
    {
      id: "tr-1",
      title: "Until I Found You",
      artist: "Stephen Sanchez",
      audioUrl: "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
      personalNote: "The song playing when you first rested your head on my shoulder during our long drive.",
      duration: "3:14",
    },
    {
      id: "tr-2",
      title: "Lover",
      artist: "Taylor Swift",
      audioUrl: "https://cdn.freesound.org/previews/515/515823_11239841-lq.mp3",
      personalNote: "Because my heart's been borrowed and yours has been blue, but now everything is ours.",
      duration: "3:41",
    },
    {
      id: "tr-3",
      title: "Perfect",
      artist: "Ed Sheeran",
      audioUrl: "https://cdn.freesound.org/previews/450/450821_9236166-lq.mp3",
      personalNote: "Dancing in the kitchen at 1 AM with no shoes on. You looked like home.",
      duration: "4:23",
    },
  ];

  const handlePlayToggle = (track: LovePlaylistTrack) => {
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id);
      if (audioRef.current && track.audioUrl) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section id="sec-love-playlist" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Hidden Audio Player for audio previews */}
        <audio
          ref={audioRef}
          onEnded={() => setPlayingTrackId(null)}
          className="hidden"
        />

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-amber-400/30 text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-3 shadow-md">
            <Disc size={11} className="text-amber-300 animate-spin-slow" />
            <span>Soundtrack of Our Hearts</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-50 mb-3">
            {config.headline || "Songs That Remind Me of You"}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 font-serif max-w-md mx-auto">
            {config.subtext ||
              "Melodies that hold our memories. Whenever I hear these notes, I close my eyes and see your smile."}
          </p>
        </div>

        {/* Playlist Cards Grid */}
        <div className="space-y-4">
          {tracks.map((track, idx) => {
            const isPlaying = playingTrackId === track.id;

            return (
              <div
                key={track.id || idx}
                className={`group bg-[#2a070e]/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border transition-all duration-300 shadow-xl ${
                  isPlaying
                    ? "border-amber-400/80 shadow-2xl shadow-rose-950/80 bg-[#350912]"
                    : "border-amber-400/30 hover:border-amber-400/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Vinyl Icon, Song & Artist */}
                  <div className="flex items-center gap-4">
                    {/* Vinyl Record Wheel */}
                    <div
                      onClick={() => handlePlayToggle(track)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-950 border-2 border-amber-400/50 shadow-md flex items-center justify-center cursor-pointer shrink-0 group-hover:scale-105 transition-transform ${
                        isPlaying ? "animate-spin" : ""
                      }`}
                      style={{ animationDuration: "6s" }}
                      title={isPlaying ? "Pause Song" : "Play Song Preview"}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#881337] border border-amber-300/60 flex items-center justify-center">
                        {isPlaying ? (
                          <Pause size={12} className="text-white fill-current" />
                        ) : (
                          <Play size={12} className="text-white fill-current ml-0.5" />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-rose-100 group-hover:text-amber-200 transition-colors">
                          {track.title}
                        </h3>
                        {track.duration && (
                          <span className="text-[10px] font-mono text-amber-400/80 bg-rose-950/60 px-2 py-0.5 rounded-full border border-amber-400/20">
                            {track.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-rose-300/80 font-serif">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Right: Play/Pause Action Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayToggle(track)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-serif font-bold transition-all shadow-md self-start sm:self-auto ${
                      isPlaying
                        ? "bg-amber-400 text-stone-950"
                        : "bg-rose-950/80 hover:bg-rose-900 text-amber-200 border border-amber-400/30"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={13} />
                        <span>Playing Audio</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        <span>Play Preview</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Personal Note From Partner */}
                {track.personalNote && (
                  <div className="mt-4 pt-3 border-t border-amber-400/20 flex items-start gap-2 text-xs text-rose-200/90 font-serif italic">
                    <Heart size={13} className="text-rose-400 fill-current shrink-0 mt-0.5" />
                    <span>&ldquo;{track.personalNote}&rdquo;</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
