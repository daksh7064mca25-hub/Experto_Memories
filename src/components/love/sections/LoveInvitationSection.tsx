"use client";

import React, { useState } from "react";
import { Sparkles, Heart, ChevronDown, Lock, KeyRound } from "lucide-react";
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleScrollDown = () => {
    if (onEnterWorld) {
      onEnterWorld();
    } else {
      const nextSec = document.getElementById("sec-love-question");
      if (nextSec) {
        nextSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 relative text-center">
      {/* Decorative ambient background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-rose-600/15 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-xl w-full mx-auto flex flex-col items-center">
        {/* Confidential Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-[#2d0810]/70 backdrop-blur-md text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase shadow-lg mb-6">
          <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
          <span>{config.badgeText || "STRICTLY FOR YOUR EYES ONLY"}</span>
        </div>

        {/* The Luxury Envelope Visual */}
        <div className="w-full max-w-md perspective-1000 mb-6">
          <div
            onClick={!isOpen ? handleOpen : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isOpen) {
                e.preventDefault();
                handleOpen();
              }
            }}
            className={`relative w-full rounded-3xl transition-all duration-700 select-none overflow-hidden ${
              !isOpen
                ? "cursor-pointer hover:scale-[1.02] shadow-2xl shadow-rose-950/80 border border-amber-400/40 bg-gradient-to-b from-[#3d0b15] via-[#24060c] to-[#160307]"
                : "shadow-2xl border border-amber-400/50 bg-[#2d0810]/95"
            }`}
          >
            {!isOpen ? (
              /* Sealed Envelope State */
              <div className="p-8 sm:p-10 flex flex-col items-center text-center relative">
                {/* Envelope Flap Lines */}
                <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#4e101d] to-transparent opacity-40 pointer-events-none" />
                <div className="w-full border-b border-amber-400/20 absolute top-20 inset-x-0" />

                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-rose-950 shadow-md mb-5">
                  <Lock size={20} />
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-rose-100 tracking-tight mb-2">
                  {config.headline || "The Secret World of Us"}
                </h2>

                <p className="text-xs sm:text-sm text-rose-300/90 font-serif italic mb-6">
                  To my beloved {recipientName}
                </p>

                {/* Wax Seal Button */}
                <div className="relative group my-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-2 border-amber-400/80 shadow-xl shadow-rose-950 flex flex-col items-center justify-center text-amber-200 transition-transform duration-300 group-hover:scale-110 active:scale-95">
                    <Heart size={20} className="fill-amber-300 text-amber-300 mb-0.5" />
                    <span className="text-[9px] font-mono font-bold tracking-widest text-amber-200 uppercase">
                      SEALED
                    </span>
                  </div>
                  <div className="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm group-hover:bg-amber-400/40 transition-colors pointer-events-none" />
                </div>

                <p className="mt-5 text-xs text-amber-300/80 font-mono flex items-center gap-1.5">
                  <KeyRound size={12} />
                  <span>{config.sealText || "Break The Wax Seal 💌"}</span>
                </p>

                {config.hint && (
                  <p className="mt-2 text-[11px] text-rose-400/70 italic">
                    {config.hint}
                  </p>
                )}
              </div>
            ) : (
              /* Opened Letter / Invitation Card */
              <div className="p-8 sm:p-10 flex flex-col items-center text-center animate-fadeIn">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-amber-400/30 text-[10px] font-mono text-amber-300 mb-4">
                  <Heart size={10} className="fill-current" />
                  <span>SEAL BROKEN • WELCOME TO OUR WORLD</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-rose-50 mb-3 leading-tight">
                  {config.headline || "The Secret World of Us"}
                </h1>

                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent my-3" />

                <p className="font-serif text-sm sm:text-base text-rose-200/90 leading-relaxed max-w-md my-4">
                  {config.introMessage ||
                    `A private universe created for one person. Beyond ordinary moments and passing days, this is where our story lives forever.`}
                </p>

                <div className="mt-4 pt-4 border-t border-amber-400/20 w-full flex items-center justify-between text-xs font-serif text-rose-300/80 px-2">
                  <span>For: <strong className="text-amber-200">{recipientName}</strong></span>
                  <span>From: <strong className="text-amber-200">{senderName}</strong></span>
                </div>

                {/* Enter Button */}
                <button
                  type="button"
                  onClick={handleScrollDown}
                  className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-500 hover:to-rose-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Enter Our Secret World</span>
                  <ChevronDown size={14} className="animate-bounce" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
