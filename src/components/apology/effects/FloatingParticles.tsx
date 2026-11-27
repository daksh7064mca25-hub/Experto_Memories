"use client";

import React, { useEffect, useState } from "react";
import { ThemeId } from "@/types/website";
import { THEMES } from "@/config/themes";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
  opacity: number;
}

export function FloatingParticles({ theme }: { theme: ThemeId }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const themeConfig = THEMES[theme] || THEMES["cotton-candy"];

  useEffect(() => {
    // Generate gentle lightweight decorative particles
    const symbols =
      theme === "midnight-hearts"
        ? ["💜", "✨", "💖", "🌙", "⭐"]
        : theme === "lavender-dreams"
        ? ["✨", "💜", "⭐", "🌸"]
        : theme === "peachy-love"
        ? ["🍑", "✨", "🧡", "🌸"]
        : ["💖", "🎀", "✨", "🌸", "💕"];

    const items: Particle[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95, // %
      size: Math.floor(Math.random() * 12) + 14, // px
      duration: Math.floor(Math.random() * 8) + 10, // seconds
      delay: Math.random() * 5, // seconds
      symbol: symbols[i % symbols.length],
      opacity: Math.random() * 0.4 + 0.25,
    }));

    requestAnimationFrame(() => {
      setParticles(items);
    });
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none transition-transform"
          style={{
            left: `${p.x}%`,
            bottom: "-30px",
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.symbol}
        </span>
      ))}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

