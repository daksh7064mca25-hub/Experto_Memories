"use client";

import React, { useEffect, useState } from "react";
import { ThemeId } from "@/types/website";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
  opacity: number;
}

export function AnniversaryParticles({ theme }: { theme: ThemeId }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      // Check reduced motion preference
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);
      }

      // Curate symbols according to anniversary themes
      let symbols = ["💖", "✨", "🌸", "💕"];

      if (theme === "golden-forever") {
        symbols = ["✨", "🌟", "🥂", "🌹", "✦"];
      } else if (theme === "our-universe") {
        symbols = ["⭐", "🌌", "✨", "✦", "💫"];
      } else if (theme === "sunset-love") {
        symbols = ["🌅", "🧡", "✨", "🍑", "🌸"];
      } else if (theme === "pink-paradise") {
        symbols = ["🎀", "💕", "🌸", "✨", "💖"];
      }

      // Generate lightweight, non-intensive particle set (12 items)
      const items: Particle[] = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.floor(Math.random() * 92) + 4,
        size: Math.floor(Math.random() * 12) + 14,
        duration: Math.floor(Math.random() * 8) + 12,
        delay: Math.random() * 6,
        symbol: symbols[i % symbols.length],
        opacity: Math.random() * 0.35 + 0.25,
      }));

      setParticles(items);
    });
  }, [theme]);

  if (prefersReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute transition-transform"
          style={{
            left: `${p.x}%`,
            bottom: "-30px",
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `annivFloatUp ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.symbol}
        </span>
      ))}
      <style jsx>{`
        @keyframes annivFloatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.55;
          }
          85% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(-112vh) rotate(35deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

