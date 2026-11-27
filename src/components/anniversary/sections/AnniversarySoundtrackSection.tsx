"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Music, Play, Pause, Volume2, Sparkles, ExternalLink, Disc, Heart } from "lucide-react";
import { AnniversarySoundtrackConfig, AnniversaryPlaylistTrack, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";
import { isProtectedMediaUrl } from "@/lib/media-utils";

interface Props {
  config: AnniversarySoundtrackConfig & {
    tracks?: AnniversaryPlaylistTrack[];
  };
  theme?: ThemeId;
}

const DEFAULT_TRACKS: AnniversaryPlaylistTrack[] = [
  {
    id: "track-1",
    title: "Golden Acoustic Melody",
    artist: "Romantic Piano Strings",
    audioUrl: "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
    albumArtUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
    spotifyUrl: "https://open.spotify.com",
    appleMusicUrl: "https://music.apple.com",
    youtubeUrl: "https://youtube.com",
    notes: "Our first kitchen slow dance track while dinner was simmering.",
  },
  {
    id: "track-2",
    title: "Forever in Starlight",
    artist: "Acoustic Sunset Ensemble",
    albumArtUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80",
    spotifyUrl: "https://open.spotify.com",
    youtubeUrl: "https://youtube.com",
    notes: "The song playing in the car the night you whispered 'I love you'.",
  },
  {
    id: "track-3",
    title: "Sunday Morning Rain",
    artist: "Coffee & Vinyl Duo",
    albumArtUrl: "https://images.unsplash.com/photo-1445985543469-433ec45754ac?auto=format&fit=crop&w=300&q=80",
    spotifyUrl: "https://open.spotify.com",
    notes: "Lazy Sunday mornings in bed with coffee and absolutely nowhere to rush to.",
  },
];

export function AnniversarySoundtrackSection({ config, theme = "pink-paradise" }: Props) {
  const themeConfig = getThemeConfig(theme, "anniversary");

  const tracks: AnniversaryPlaylistTrack[] =
    config.tracks && config.tracks.length > 0
      ? config.tracks
      : [
          {
            id: "main-track",
            title: config.songTitle || "Golden Acoustic Melody",
            artist: config.artist || "Romantic Piano Strings",
            audioUrl: config.audioUrl || "https://cdn.freesound.org/previews/612/612095_11861866-lq.mp3",
            notes: config.personalExplanation,
            albumArtUrl:
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
          },
          ...DEFAULT_TRACKS.slice(1),
        ];

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [durationTime, setDurationTime] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[activeTrackIndex] || tracks[0];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSelectTrack = (index: number) => {
    setActiveTrackIndex(index);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime("0:00");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    setProgress(pct);

    const curM = Math.floor(audio.currentTime / 60);
    const curS = Math.floor(audio.currentTime % 60);
    setCurrentTime(`${curM}:${curS < 10 ? "0" : ""}${curS}`);

    const durM = Math.floor(audio.duration / 60);
    const durS = Math.floor(audio.duration % 60);
    setDurationTime(`${durM}:${durS < 10 ? "0" : ""}${durS}`);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const seekPct = parseFloat(e.target.value);
    audio.currentTime = (seekPct / 100) * audio.duration;
    setProgress(seekPct);
  };

  return (
    <section id="anniv-sec-soundtrack" className="py-14 sm:py-20 px-4 max-w-2xl mx-auto text-center select-none">
      {/* Audio Element */}
      {currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          preload="none"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Main Container Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E8B4B8]/80 shadow-[#6B2D38]/10 relative overflow-hidden">
        {/* Section Pill */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-[#FFF5F6] text-[#6B2D38] border border-[#E8B4B8]/70 shadow-sm mb-3">
          <Music size={13} className="text-[#C46879]" />
          <span>Our Love Soundtrack</span>
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3D262A] mb-2">
          {config.headline || "Songs That Remind Me of You"}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#6B2D38]/85 max-w-sm mx-auto mb-8 leading-relaxed">
          {config.subtext || "Every love story has an anthem. This is the soundtrack that holds our memories."}
        </p>

        {/* 3D Vinyl Turntable Preview */}
        <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 mb-6 flex items-center justify-center">
          {/* Vinyl Disc */}
          <div
            className={`w-full h-full rounded-full shadow-2xl flex items-center justify-center transition-all ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{
              animationDuration: "4s",
              animationTimingFunction: "linear",
              background: "radial-gradient(circle, #2C181D 20%, #15080B 45%, #2A171C 65%, #0F0507 90%)",
              boxShadow: "0 15px 35px rgba(107, 45, 56, 0.25), 0 0 0 4px rgba(232, 180, 184, 0.4)",
            }}
          >
            {/* Center Label / Circular Album Art */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#FAF6F0] flex flex-col items-center justify-center text-white shadow-inner">
              {currentTrack.albumArtUrl ? (
                <Image
                  src={currentTrack.albumArtUrl}
                  alt={currentTrack.title}
                  fill
                  sizes="(max-width: 640px) 64px, 80px"
                  unoptimized={isProtectedMediaUrl(currentTrack.albumArtUrl)}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#C46879] via-[#E8B4B8] to-[#6B2D38] flex flex-col items-center justify-center">
                  <span className="text-[7px] font-mono font-bold tracking-wider uppercase text-rose-100">
                    OUR SONG
                  </span>
                  <Heart size={10} className="fill-white text-white my-0.5" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Track Info & Equalizer */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3D262A]">
              {currentTrack.title}
            </h3>
            {/* Animated Equalizer Bars */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-4 px-1" title="Playing">
                <span className="w-1 bg-[#C46879] rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
                <span className="w-1 bg-[#8C3A49] rounded-full animate-[bounce_0.8s_ease-in-out_infinite_0.1s] h-4" />
                <span className="w-1 bg-[#C46879] rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.2s] h-2" />
                <span className="w-1 bg-[#8C3A49] rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.15s] h-3.5" />
              </div>
            )}
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#6B2D38] font-medium">
            {currentTrack.artist}
          </p>

          {currentTrack.notes && (
            <p className="font-serif italic text-xs text-[#6B2D38]/85 mt-2 max-w-sm mx-auto">
              &ldquo;{currentTrack.notes}&rdquo;
            </p>
          )}
        </div>

        {/* Audio Player Controls */}
        {currentTrack.audioUrl ? (
          <div className="max-w-xs mx-auto mb-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6B2D38]/80 mb-1.5">
              <span>{currentTime}</span>
              <span>{durationTime}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#FAF6F0] rounded-lg appearance-none cursor-pointer accent-[#C46879]"
              aria-label="Seek track"
            />
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C46879] to-[#6B2D38] text-white flex items-center justify-center shadow-lg shadow-[#C46879]/30 hover:scale-105 active:scale-95 transition-transform"
                aria-label={isPlaying ? "Pause audio preview" : "Play audio preview"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs font-serif italic text-[#6B2D38]/80 mb-6">
            Listen on your favorite streaming service:
          </p>
        )}

        {/* Streaming External Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {currentTrack.spotifyUrl && (
            <a
              href={currentTrack.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors border border-[#1DB954]/30"
            >
              <span>Spotify</span>
              <ExternalLink size={11} />
            </a>
          )}
          {currentTrack.appleMusicUrl && (
            <a
              href={currentTrack.appleMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FA243C]/10 text-[#FA243C] hover:bg-[#FA243C]/20 transition-colors border border-[#FA243C]/30"
            >
              <span>Apple Music</span>
              <ExternalLink size={11} />
            </a>
          )}
          {currentTrack.youtubeUrl && (
            <a
              href={currentTrack.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000]/20 transition-colors border border-[#FF0000]/30"
            >
              <span>YouTube</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Horizontal Playlist Rows */}
        {tracks.length > 1 && (
          <div className="pt-6 border-t border-[#E8B4B8]/50 text-left">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#6B2D38] mb-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#C46879]" />
              <span>Full Relationship Playlist ({tracks.length} Songs)</span>
            </h4>
            <div className="space-y-2">
              {tracks.map((track, idx) => {
                const isSelected = idx === activeTrackIndex;
                const trackNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

                return (
                  <div
                    key={track.id || idx}
                    onClick={() => handleSelectTrack(idx)}
                    className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all border ${
                      isSelected
                        ? "bg-[#FFF5F6] border-[#E8B4B8] shadow-sm text-[#3D262A]"
                        : "bg-white/70 hover:bg-white border-[#E8B4B8]/40 text-[#6B2D38]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Track Number */}
                      <span className="w-6 text-center text-xs font-mono font-bold text-[#8C3A49] shrink-0">
                        {trackNum}
                      </span>

                      {/* Circular Album Art */}
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E8B4B8] shrink-0 bg-[#FAF6F0] flex items-center justify-center">
                        {track.albumArtUrl ? (
                          <Image
                            src={track.albumArtUrl}
                            alt={track.title}
                            fill
                            sizes="40px"
                            unoptimized={isProtectedMediaUrl(track.albumArtUrl)}
                            className="object-cover"
                          />
                        ) : (
                          <Music size={16} className="text-[#C46879]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-serif font-bold text-xs sm:text-sm truncate">
                          {track.title}
                        </p>
                        <p className="text-[11px] text-[#6B2D38]/70 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-3 px-1">
                          <span className="w-0.5 bg-[#C46879] rounded-full animate-pulse h-2" />
                          <span className="w-0.5 bg-[#8C3A49] rounded-full animate-pulse h-3" />
                          <span className="w-0.5 bg-[#C46879] rounded-full animate-pulse h-2" />
                        </div>
                      ) : (
                        <Disc size={15} className={isSelected ? "text-[#C46879]" : "text-[#E8B4B8]"} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
