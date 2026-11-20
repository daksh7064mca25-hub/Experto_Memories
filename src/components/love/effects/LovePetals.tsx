"use client";

import React, { useEffect, useState } from "react";

interface LovePetalsProps {
  theme?: string;
}

interface PetalItem {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  opacity: number;
  type: "petal" | "sparkle";
}

export function LovePetals({ theme }: LovePetalsProps) {
  const [petals, setPetals] = useState<PetalItem[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPrefersReducedMotion(true);
      return;
    }

    const items: PetalItem[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2, // 2% to 98%
      size: Math.floor(Math.random() * 12) + 10, // 10px to 22px
      duration: Math.floor(Math.random() * 10) + 12, // 12s to 22s slow drift
      delay: Math.random() * 8, // 0 to 8s delay
      rotation: Math.floor(Math.random() * 360),
      opacity: Math.random() * 0.35 + 0.15,
      type: i % 4 === 0 ? "sparkle" : "petal",
    }));

    setPetals(items);
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
    >
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: `${p.left}%`,
            top: "-5%",
            opacity: p.opacity,
            animation: `driftPetal ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.type === "petal" ? (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 24 32"
              fill="none"
              style={{
                transform: `rotate(${p.rotation}deg)`,
              }}
            >
              <path
                d="M12 0C18 8 24 16 22 24C20 30 14 32 12 32C10 32 4 30 2 24C0 16 6 8 12 0Z"
                fill="url(#petal-gradient)"
              />
              <defs>
                <linearGradient id="petal-gradient" x1="0" y1="0" x2="24" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#e11d48" stopOpacity="0.8" />
                  <stop offset="0.6" stopColor="#f43f5e" stopOpacity="0.6" />
                  <stop offset="1" stopColor="#fda4af" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <div
              className="rounded-full bg-amber-300 blur-[0.5px] animate-pulse"
              style={{
                width: `${Math.max(4, p.size / 3)}px`,
                height: `${Math.max(4, p.size / 3)}px`,
                boxShadow: "0 0 8px rgba(251, 191, 36, 0.8)",
              }}
            />
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes driftPetal {
          0% {
            transform: translateY(0vh) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(35vh) translateX(25px) rotate(120deg);
          }
          66% {
            transform: translateY(70vh) translateX(-20px) rotate(240deg);
          }
          100% {
            transform: translateY(110vh) translateX(15px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
