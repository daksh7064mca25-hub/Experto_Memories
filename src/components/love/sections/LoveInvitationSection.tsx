"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, ChevronDown, Lock, KeyRound, Volume2, Music, CheckCircle2 } from "lucide-react";
import { LoveInvitationConfig } from "@/types/website";
import { ThemeConfig } from "@/config/themes";

interface Props {
  config: LoveInvitationConfig;
  recipientName: string;
  senderName: string;
  theme: ThemeConfig;
  onEnterWorld?: () => void;
}

export function LoveInvitationSection({
  config,
  recipientName,
  senderName,
  theme,
  onEnterWorld,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [displayedHeadline, setDisplayedHeadline] = useState("");
  const [displayedIntro, setDisplayedIntro] = useState("");
  const [typewriterDone, setTypewriterDone] = useState(false);

  const headlineText = config.headline || "The Secret World of Us";
  const introMessageText =
    config.introMessage ||
    `A private universe created for one person. Beyond ordinary moments and passing days, this is where our story lives forever.`;

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    // Audio cue if audio context is permitted
    try {
      if (typeof window !== "undefined" && (window as any).AudioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5 note
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {}

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 700);
  };

  // Typewriter effect when envelope is opened
  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setDisplayedHeadline("");
        setDisplayedIntro("");
        setTypewriterDone(false);
      });
      return;
    }

    let currentHeadIdx = 0;
    const headlineInterval = setInterval(() => {
      if (currentHeadIdx <= headlineText.length) {
        setDisplayedHeadline(headlineText.slice(0, currentHeadIdx));
        currentHeadIdx++;
      } else {
        clearInterval(headlineInterval);

        // Start typing intro message
        let currentIntroIdx = 0;
        const introInterval = setInterval(() => {
          if (currentIntroIdx <= introMessageText.length) {
            setDisplayedIntro(introMessageText.slice(0, currentIntroIdx));
            currentIntroIdx++;
          } else {
            clearInterval(introInterval);
            setTypewriterDone(true);
          }
        }, 12);
      }
    }, 35);

    return () => {
      clearInterval(headlineInterval);
    };
  }, [isOpen, headlineText, introMessageText]);

  const handleScrollDown = () => {
    if (onEnterWorld) {
      onEnterWorld();
    } else {
      const nextSec =
        document.getElementById("sec-love-question") ||
        document.getElementById("sec-love-reasons");
      if (nextSec) {
        nextSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="min-h-[88vh] sm:min-h-[92vh] flex flex-col items-center justify-center px-4 py-12 relative text-center">
      {/* Decorative ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-rose-600/15 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-xl w-full mx-auto flex flex-col items-center">
        {/* Confidential Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-[#2d0810]/80 backdrop-blur-md text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase shadow-lg mb-6">
          <Sparkles size={11} className="text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span>{config.badgeText || "STRICTLY FOR YOUR EYES ONLY"}</span>
          <Sparkles size={11} className="text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
        </div>

        {/* The Luxury Envelope Container */}
        <div className="w-full max-w-md perspective-1000 mb-6">
          <div
            className={`relative w-full rounded-3xl transition-all duration-700 select-none overflow-hidden ${
              !isOpen
                ? "shadow-2xl shadow-rose-950/90 border-2 border-amber-400/45 bg-gradient-to-b from-[#3d0b15] via-[#24060c] to-[#160307]"
                : "shadow-2xl shadow-rose-950/80 border-2 border-amber-400/60 bg-[#2d0810]/95"
            }`}
          >
            {!isOpen ? (
              /* Sealed Envelope State with 3D Flap */
              <div
                onClick={handleOpen}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpen();
                  }
                }}
                className="p-8 sm:p-10 flex flex-col items-center text-center relative cursor-pointer group"
              >
                {/* Envelope Flap Lines & Shading */}
                <div
                  className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#5c1322] via-[#420d18] to-transparent opacity-60 pointer-events-none transition-transform duration-700 origin-top ${
                    isOpening ? "scale-y-0 opacity-0" : "scale-y-100"
                  }`}
                />
                <div className="w-full border-b border-amber-400/25 absolute top-20 inset-x-0" />

                {/* Secret Key Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 flex items-center justify-center text-rose-950 shadow-md mb-4 group-hover:scale-110 transition-transform">
                  <Lock size={20} className={isOpening ? "animate-spin" : ""} />
                </div>

                {/* Cute Girlfriend/Boyfriend Greeting */}
                <span className="text-xs font-serif font-bold text-amber-300/90 tracking-wide mb-1 block">
                  Hey, My Favourite Person ❤️
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-100 tracking-tight mb-2 group-hover:text-amber-200 transition-colors">
                  {config.headline || "The Secret World of Us"}
                </h2>

                <p className="text-xs sm:text-sm text-rose-300/90 font-serif italic mb-2">
                  Someone made something special exclusively for <strong className="text-amber-300 font-semibold">{recipientName}</strong>
                </p>

                {/* Realistic Wax Seal Stamped Emblem */}
                <div className="relative my-3">
                  <div
                    className={`w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#881337] via-[#9f1239] to-[#4c0519] border-2 border-amber-400/90 shadow-[0_0_25px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center text-amber-200 transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
                      isOpening ? "scale-125 rotate-12 blur-xs opacity-75" : ""
                    }`}
                  >
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border border-dashed border-amber-400/60 flex flex-col items-center justify-center">
                      <Heart size={22} className="fill-amber-300 text-amber-300 mb-0.5 animate-pulse" />
                      <span className="text-[9px] font-mono font-bold tracking-widest text-amber-200 uppercase">
                        SEALED
                      </span>
                    </div>
                  </div>
                  <div className="absolute -inset-2 rounded-full bg-amber-400/25 blur-md group-hover:bg-amber-400/40 transition-colors pointer-events-none" />
                </div>

                <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300 font-mono">
                  <KeyRound size={13} className="text-amber-300" />
                  <span>{isOpening ? "Breaking Wax Seal..." : (config.sealText || "Break The Wax Seal 💌")}</span>
                </div>

                {config.hint && (
                  <p className="mt-3 text-[11px] text-rose-300/70 italic">
                    {config.hint}
                  </p>
                )}
              </div>
            ) : (
              /* Unfolded Luxury Letter / Invitation Card with Typewriter Effect */
              <div className="p-8 sm:p-10 flex flex-col items-center text-center animate-fadeIn relative">
                {/* Deckle Edge Gold Accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 border border-amber-400/40 text-[10px] font-mono text-amber-300 mb-5 shadow-sm">
                  <CheckCircle2 size={11} className="text-amber-300" />
                  <span>SEAL BROKEN • WELCOME TO OUR WORLD</span>
                </div>

                {/* Typewriter Headline */}
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-rose-50 mb-3 leading-tight min-h-[44px]">
                  {displayedHeadline}
                  {!typewriterDone && (
                    <span className="inline-block w-0.5 h-6 bg-amber-400 ml-1 animate-pulse" />
                  )}
                </h1>

                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent my-3" />

                {/* Typewriter Intro Message */}
                <p className="font-serif text-sm sm:text-base text-rose-200/95 leading-relaxed max-w-md my-4 min-h-[60px]">
                  {displayedIntro}
                  {displayedHeadline.length === headlineText.length && !typewriterDone && (
                    <span className="inline-block w-0.5 h-4 bg-rose-300 ml-1 animate-pulse" />
                  )}
                </p>

                {/* Couple Attribution */}
                <div className="mt-4 pt-4 border-t border-amber-400/25 w-full flex items-center justify-between text-xs font-serif text-rose-300/90 px-3">
                  <span>For: <strong className="text-amber-300 font-semibold">{recipientName}</strong></span>
                  <span>From: <strong className="text-amber-300 font-semibold">{senderName}</strong></span>
                </div>

                {/* Enter Button */}
                <button
                  type="button"
                  onClick={handleScrollDown}
                  className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-500 hover:to-rose-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-rose-900/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Our Secret World</span>
                  <ChevronDown size={14} className="animate-bounce" />
                </button>

                {/* Re-seal Option */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-[11px] font-mono text-rose-400/70 hover:text-amber-300 underline transition-colors cursor-pointer"
                >
                  Fold back &amp; re-seal envelope
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
