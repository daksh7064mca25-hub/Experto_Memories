"use client";

import React, { useEffect, useState } from "react";
import { ThemeId } from "@/types/website";
import { getBirthdayThemeConfig } from "@/config/birthday-themes";

interface Props {
  theme?: ThemeId;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  shape: "sparkle" | "star" | "confetti" | "heart";
  color: string;
}

export function BirthdayConfetti({ theme }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const themeConfig = getBirthdayThemeConfig(theme);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const colors = ["#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#3b82f6", "#fbbf24"];
    const shapes: Particle["shape"][] = ["sparkle", "star", "confetti", "heart"];

    const generated: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 6,
      duration: Math.random() * 8 + 7,
      delay: Math.random() * 5,
      shape: shapes[i % shapes.length],
      color: colors[i % colors.length],
    }));

    requestAnimationFrame(() => {
      setParticles(generated);
    });
  }, [theme]);

  if (particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none opacity-60"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.color,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `translate3d(0, 0, 0)`,
          }}
        >
          {p.shape === "star" ? "✦" : p.shape === "heart" ? "♥" : p.shape === "confetti" ? "▪" : "✧"}
        </span>
      ))}
    </div>
  );
}
