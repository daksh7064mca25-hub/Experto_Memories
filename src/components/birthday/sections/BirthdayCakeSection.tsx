"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Mic, MicOff, Cake, PartyPopper, Check, Utensils } from "lucide-react";
import { BirthdayCakeConfig, ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  config: BirthdayCakeConfig;
  recipientName: string;
  theme?: ThemeId;
}

export function BirthdayCakeSection({
  config,
  recipientName = "Birthday Superstar",
  theme,
}: Props) {
  const themeConfig = getBirthdayThemeConfig(theme);
  const totalCandles = Math.min(Math.max(config.candlesCount || 3, 1), 7);

  // Lit status of each candle
  const [litCandles, setLitCandles] = useState<boolean[]>(() =>
    Array(totalCandles).fill(true)
  );
  const [isMakeWishOpen, setIsMakeWishOpen] = useState(false);
  const [userWish, setUserWish] = useState("");
  const [wishSaved, setWishSaved] = useState(false);
  const [allExtinguished, setAllExtinguished] = useState(false);
  const [isCakeCut, setIsCakeCut] = useState(false);

  // Optional mic blowing
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Extinguish individual candle
  const extinguishCandle = (index: number) => {
    setLitCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  // Check if all candles are blown
  useEffect(() => {
    const unlit = litCandles.every((lit) => !lit);
    if (unlit && !allExtinguished) {
      setAllExtinguished(true);
      // Trigger festive celebration
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#fbbf24"],
      });
      // Stop mic if running
      stopMic();
    }
  }, [litCandles, allExtinguished]);

  // Optional Microphone Blow Handler
  const startMicBlowing = async () => {
    setMicError(null);
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicError("Microphone detection is not supported on this browser. Tap the candles instead!");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListeningMic(true);

      const checkBlow = () => {
        if (!analyser || !streamRef.current) return;
        analyser.getByteFrequencyData(dataArray);

        // Calculate average sound intensity
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Blow threshold detection
        if (average > 48) {
          // Extinguish candles in cascade
          setLitCandles((prev) => prev.map(() => false));
          stopMic();
          return;
        }

        requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err: any) {
      console.log("Mic access error:", err);
      setMicError("Microphone access was denied or unavailable. Tap the candles to blow them out!");
      setIsListeningMic(false);
    }
  };

  const stopMic = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListeningMic(false);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const handleRelight = () => {
    setLitCandles(Array(totalCandles).fill(true));
    setAllExtinguished(false);
    setIsCakeCut(false);
  };

  return (
    <section
      id="bday-sec-cake"
      className="relative min-h-[90vh] py-16 px-4 max-w-xl mx-auto flex flex-col items-center justify-center text-center select-none"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-serif font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-3">
        <Cake size={13} className="text-amber-600" />
        <span>The Centerpiece Moment</span>
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-2">
        {config.headline || "Blow The Candles & Make A Wish 🎂"}
      </h2>

      <p className="font-sans text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8">
        {config.subtext || "Close your eyes, make the secret wish of your heart, and tap each candle flame to extinguish it!"}
      </p>

      {/* Centerpiece Cake Illustration / Container */}
      <div className="relative w-72 sm:w-80 p-8 rounded-3xl bg-white/95 backdrop-blur-md border border-amber-200/80 shadow-2xl shadow-amber-900/10 flex flex-col items-center">
        {/* Candles Row */}
        <div className="flex items-end justify-center gap-4 sm:gap-6 mb-2">
          {litCandles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => isLit && extinguishCandle(idx)}
              className="flex flex-col items-center cursor-pointer group"
              title={isLit ? "Tap to blow out candle" : "Extinguished"}
            >
              {/* Flame */}
              {isLit ? (
                <div className="relative w-4 h-6 mb-1 flex items-center justify-center animate-pulse [animation-duration:1.5s]">
                  <div className="w-3.5 h-5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-white shadow-lg shadow-amber-400/80 group-hover:scale-125 transition-transform" />
                  <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xs opacity-75" />
                </div>
              ) : (
                <div className="h-6 mb-1 flex flex-col items-center justify-end">
                  {/* Smoke puff */}
                  <span className="text-[10px] text-stone-400 animate-fade-out font-mono font-bold">~</span>
                  <div className="w-1 h-1.5 bg-stone-700 rounded-xs" />
                </div>
              )}

              {/* Candle Stick */}
              <div
                className={`w-3 h-12 rounded-t-xs border border-stone-200 shadow-xs ${
                  idx % 2 === 0
                    ? "bg-gradient-to-b from-rose-300 to-pink-400"
                    : "bg-gradient-to-b from-amber-300 to-yellow-400"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Cake Tier 1 (Top) */}
        <div className="w-48 sm:w-56 h-14 rounded-t-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border border-pink-200 relative flex items-center justify-center shadow-xs">
          <div className="flex gap-2">
            <span className="text-xs">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-xs">🍓</span>
          </div>
          {/* Frosting Drips */}
          <div className="absolute -bottom-2 inset-x-0 flex justify-around">
            <div className="w-4 h-3 bg-pink-100 rounded-b-full border-b border-pink-200" />
            <div className="w-5 h-4 bg-pink-100 rounded-b-full border-b border-pink-200" />
            <div className="w-4 h-3 bg-pink-100 rounded-b-full border-b border-pink-200" />
          </div>
        </div>

        {/* Cake Tier 2 (Bottom) */}
        <div className="w-60 sm:w-68 h-20 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border border-amber-200 shadow-md relative flex items-center justify-center">
          <span className="font-serif font-bold text-xs sm:text-sm text-amber-900 tracking-wide">
            {recipientName} • Happy Birthday
          </span>
        </div>

        {/* Cake Platter */}
        <div className="w-72 sm:w-80 h-3 rounded-full bg-stone-200 border border-stone-300 shadow-inner mt-1" />

        {/* Instructions */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {!allExtinguished ? (
            <div className="space-y-2">
              <p className="text-xs font-serif text-amber-900 font-semibold">
                Tap each candle to blow it out!
              </p>
              {config.allowMicBlowing !== false && (
                <button
                  type="button"
                  onClick={isListeningMic ? stopMic : startMicBlowing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-sans font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                >
                  {isListeningMic ? (
                    <>
                      <MicOff size={12} className="text-rose-500 animate-pulse" />
                      <span>Listening... Blow into microphone!</span>
                    </>
                  ) : (
                    <>
                      <Mic size={12} className="text-amber-600" />
                      <span>Or Blow Using Microphone</span>
                    </>
                  )}
                </button>
              )}
              {micError && (
                <p className="text-[10px] text-stone-500 max-w-xs">{micError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3 animate-in zoom-in-95">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-bold bg-green-100 text-green-900 border border-green-200">
                <PartyPopper size={13} className="text-green-600" />
                <span>All Candles Extinguished! May Your Wish Come True! 🌟</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsMakeWishOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-serif font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all"
                >
                  {wishSaved ? "Wish Sealed ✨" : "Make A Secret Wish 💌"}
                </button>

                {!isCakeCut ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCakeCut(true);
                      confetti({ particleCount: 50, spread: 60 });
                    }}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-serif font-semibold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200 transition-all"
                  >
                    <Utensils size={12} />
                    <span>Cut The Cake 🍰</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-serif font-bold bg-pink-100 text-pink-900">
                    <span>First slice is for you! 🍰 Enjoy!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Relight button if all extinguished */}
      {allExtinguished && (
        <button
          type="button"
          onClick={handleRelight}
          className="mt-6 text-xs text-stone-400 hover:text-stone-700 underline font-serif"
        >
          Relight candles to blow again 🕯️
        </button>
      )}

      {/* Make a Wish Modal */}
      {isMakeWishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-amber-200 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
              Your Secret Birthday Wish
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Type your wish to lock it into the stars (kept strictly between you and the universe):
            </p>
            <textarea
              value={userWish}
              onChange={(e) => setUserWish(e.target.value)}
              placeholder="I wish for..."
              rows={3}
              className="w-full p-3 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsMakeWishOpen(false)}
                className="flex-1 py-2 rounded-full text-xs font-serif font-medium bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setWishSaved(true);
                  setIsMakeWishOpen(false);
                  confetti({ particleCount: 60, spread: 70 });
                }}
                className="flex-1 py-2 rounded-full text-xs font-serif font-bold bg-amber-500 hover:bg-amber-600 text-white"
              >
                Lock Into Stars ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
