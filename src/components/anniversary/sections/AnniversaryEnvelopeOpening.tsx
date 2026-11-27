"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { AnniversaryEnvelopeConfig } from "@/types/website";

interface Props {
  config?: AnniversaryEnvelopeConfig;
  recipientName: string;
  senderName: string;
  onOpen: () => void;
  isOpen: boolean;
}

export function AnniversaryEnvelopeOpening({
  config,
  recipientName,
  senderName,
  onOpen,
  isOpen,
}: Props) {
  const [isOpening, setIsOpening] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);

  const displayRecipient = config?.recipientName || recipientName || "My Love";
  const displaySender = config?.senderName || senderName || "Forever Yours";
  const headline = config?.headline || "A Celebration of Our Love";
  const teaserText = config?.teaserText || "Every love story is beautiful, but ours is my absolute favorite.";
  const buttonText = config?.buttonText || "Open Your Surprise";
  const sealInitial = config?.waxSealInitial || displayRecipient.charAt(0).toUpperCase() || "❤️";

  const handleOpenClick = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Subtle audio chime
    try {
      if (typeof window !== "undefined" && (window as any).AudioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.6); // G5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      }
    } catch {}

    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  const handleSkip = () => {
    setHasSkipped(true);
    onOpen();
  };

  if (isOpen || hasSkipped) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#FFF5F6] via-[#FAF6F0] to-[#FFF0F2] overflow-hidden"
      >
        {/* Soft Floating Rose Petals / Stardust Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-300/40 select-none text-sm"
              initial={{
                x: `${(i * 9 + 4) % 100}vw`,
                y: "-10vh",
                rotate: 0,
                opacity: 0.2 + (i % 4) * 0.15,
              }}
              animate={{
                y: "110vh",
                x: `${((i * 9 + 4) % 100) + (i % 2 === 0 ? 8 : -8)}vw`,
                rotate: 360,
              }}
              transition={{
                duration: 12 + (i % 6) * 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.8,
              }}
            >
              🌸
            </motion.div>
          ))}
        </div>

        {/* Top-Right Quick Skip Button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-full text-xs font-serif font-medium text-[#6B2D38]/80 hover:text-[#6B2D38] bg-white/80 hover:bg-white backdrop-blur-md border border-[#E8B4B8]/50 shadow-sm transition-all flex items-center gap-1.5"
            aria-label="Skip envelope animation to main story"
          >
            <span>Skip to Story</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 3D Envelope Container */}
        <div className="relative w-full max-w-md sm:max-w-lg mx-auto flex flex-col items-center">
          {/* Subtle Glow Behind Envelope */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#E8B4B8]/20 via-[#C46879]/15 to-[#E8B4B8]/20 rounded-3xl blur-2xl -z-10" />

          {/* Envelope Card */}
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 180 }}
            className="relative w-full min-h-[290px] sm:min-h-0 sm:aspect-[16/11] max-w-md bg-[#FFF5F6] rounded-2xl border border-[#E8B4B8]/80 shadow-2xl shadow-[#6B2D38]/15 overflow-hidden flex flex-col justify-between p-5 sm:p-8"
            style={{
              boxShadow: "0 25px 50px -12px rgba(107, 45, 56, 0.18), 0 0 0 1px rgba(232, 180, 184, 0.6)",
            }}
          >
            {/* Top Flap Graphic Simulation */}
            <motion.div
              animate={isOpening ? { rotateX: -140, opacity: 0.3 } : { rotateX: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#FAF0F2] via-[#FFF5F6] to-[#FCE8EB] border-b border-[#E8B4B8]/60 [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-md z-10 pointer-events-none"
            />

            {/* Vintage Postmark Stamp Top-Right */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center rotate-6 opacity-75">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#C46879]/70 flex flex-col items-center justify-center p-1 text-center">
                <span className="text-[8px] font-mono tracking-widest text-[#6B2D38] uppercase">ANNIVERSARY</span>
                <Heart size={14} className="text-[#C46879] fill-[#C46879]/30 my-0.5" />
                <span className="text-[7px] font-mono text-[#6B2D38]">ALWAYS & FOREVER</span>
              </div>
            </div>

            {/* Inside Content Preview (Reveals when opening) */}
            <div className="relative z-0 text-center my-auto px-2">
              <motion.div
                animate={isOpening ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E8B4B8]/60 text-[#6B2D38] text-[11px] font-medium tracking-wide">
                  <Sparkles size={12} className="text-[#C46879]" />
                  <span>{headline}</span>
                </div>

                <div className="pt-2">
                  <p className="text-xs uppercase font-mono tracking-widest text-[#C46879]">
                    Personalized For
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D262A] tracking-tight mt-1">
                    {displayRecipient}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm font-serif italic text-[#6B2D38]/85 max-w-xs mx-auto leading-relaxed">
                  &ldquo;{teaserText}&rdquo;
                </p>

                <p className="text-[11px] font-mono text-[#6B2D38]/70">
                  With all my love, <span className="font-semibold text-[#3D262A]">{displaySender}</span>
                </p>
              </motion.div>

              {/* Emerging Letter on opening */}
              {isOpening && (
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#FAF6F0] rounded-xl border border-[#E8B4B8] shadow-lg"
                >
                  <Sparkles className="w-8 h-8 text-[#C46879] animate-spin" />
                  <p className="mt-2 font-serif text-sm font-semibold text-[#6B2D38]">
                    Unfolding Our Memories...
                  </p>
                </motion.div>
              )}
            </div>

            {/* Wax Seal Center Button */}
            <div className="relative z-20 flex flex-col items-center mt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenClick}
                disabled={isOpening}
                className="relative group flex items-center justify-center"
                aria-label="Open anniversary envelope"
              >
                {/* Wax Seal Medallion */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#8C3A49] via-[#6B2D38] to-[#4A1D25] border-2 border-[#E8B4B8] shadow-xl shadow-[#6B2D38]/40 flex items-center justify-center text-white transition-all group-hover:shadow-[#C46879]/50">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-200/40 flex items-center justify-center font-serif font-bold text-sm sm:text-base text-rose-100 shadow-inner">
                    {sealInitial}
                  </div>
                </div>

                {/* Pulse Ring */}
                <div className="absolute -inset-1 rounded-full bg-[#C46879]/20 animate-ping pointer-events-none" />
              </motion.button>

              <button
                onClick={handleOpenClick}
                disabled={isOpening}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-serif font-semibold text-[#6B2D38] hover:text-[#3D262A] transition-colors"
              >
                <span>{buttonText}</span>
                <Heart size={12} className="text-[#C46879] fill-[#C46879]" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
