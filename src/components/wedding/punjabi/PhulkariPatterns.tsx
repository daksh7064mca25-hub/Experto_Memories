import React from "react";

/**
 * Reusable authentic Phulkari geometric embroidery patterns and cultural ornaments.
 * Designed with traditional geometric diamond weaves, vibrant silk threads (crimson, mustard, magenta, emerald),
 * and antique gold borders. Zero external image dependencies.
 */

export const PhulkariDiamondBorder: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`w-full overflow-hidden flex items-center justify-center select-none ${className}`}>
    <svg
      viewBox="0 0 800 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-5 max-w-4xl"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="phulkari-diamonds" width="40" height="24" patternUnits="userSpaceOnUse">
          {/* Background diamond */}
          <path d="M20 0 L40 12 L20 24 L0 12 Z" fill="#8B1229" />
          {/* Inner gold thread diamond */}
          <path d="M20 3 L35 12 L20 21 L5 12 Z" fill="#E5A910" />
          {/* Core magenta accent diamond */}
          <path d="M20 6 L30 12 L20 18 L10 12 Z" fill="#C2185B" />
          {/* Tiny center emerald dot */}
          <circle cx="20" cy="12" r="2" fill="#044E36" />
          {/* Small corner triangles in mustard */}
          <path d="M0 0 L8 0 L0 8 Z" fill="#FBBF24" />
          <path d="M40 0 L32 0 L40 8 Z" fill="#FBBF24" />
          <path d="M0 24 L8 24 L0 16 Z" fill="#FBBF24" />
          <path d="M40 24 L32 24 L40 16 Z" fill="#FBBF24" />
        </pattern>
      </defs>
      <rect width="800" height="24" fill="url(#phulkari-diamonds)" />
      {/* Top & Bottom gold embroidery border stitch */}
      <line x1="0" y1="1" x2="800" y2="1" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="0" y1="23" x2="800" y2="23" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  </div>
);

export const PhulkariCornerOrnament: React.FC<{
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}> = ({ position, className = "" }) => {
  const rotationClass = {
    "top-left": "",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  }[position];

  return (
    <div className={`pointer-events-none select-none ${rotationClass} ${className}`}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer embroidered triangle */}
        <path d="M0 0 L64 0 L0 64 Z" fill="#4A0E17" opacity="0.85" />
        {/* Geometric layered Phulkari stitches */}
        <path d="M4 4 L54 4 L4 54 Z" fill="#C2185B" opacity="0.9" />
        <path d="M8 8 L44 8 L8 44 Z" fill="#E5A910" />
        <path d="M12 12 L34 12 L12 34 Z" fill="#8B1229" />
        <path d="M16 16 L24 16 L16 24 Z" fill="#044E36" />
        {/* Gold thread dotted edge */}
        <line x1="0" y1="2" x2="62" y2="2" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="2" y1="0" x2="2" y2="62" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Accent flower motif */}
        <circle cx="28" cy="28" r="4" fill="#FBBF24" />
        <circle cx="28" cy="28" r="2" fill="#8B1229" />
      </svg>
    </div>
  );
};

export const MarigoldToranGarland: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`w-full overflow-hidden select-none ${className}`}>
    <svg
      viewBox="0 0 800 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-8 sm:h-12"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="marigold-swag" width="80" height="48" patternUnits="userSpaceOnUse">
          {/* Swag string */}
          <path d="M0 8 Q40 38 80 8" stroke="#166534" strokeWidth="2.5" fill="none" />
          {/* Mango leaves (Ashoka / Aam ke patte) */}
          <path d="M20 18 C20 28 24 34 24 34 C24 34 28 28 28 18 Z" fill="#15803D" />
          <path d="M40 24 C40 34 44 40 44 40 C44 40 48 34 48 24 Z" fill="#166534" />
          <path d="M60 18 C60 28 64 34 64 34 C64 34 68 28 68 18 Z" fill="#15803D" />
          {/* Marigold Flowers (Genda Phool) along the swag */}
          {/* Center yellow marigold */}
          <circle cx="44" cy="22" r="7" fill="#F59E0B" />
          <circle cx="44" cy="22" r="5" fill="#FBBF24" />
          <circle cx="44" cy="22" r="2.5" fill="#D97706" />
          {/* Orange marigold left */}
          <circle cx="24" cy="16" r="6" fill="#EA580C" />
          <circle cx="24" cy="16" r="4" fill="#F97316" />
          {/* Orange marigold right */}
          <circle cx="64" cy="16" r="6" fill="#EA580C" />
          <circle cx="64" cy="16" r="4" fill="#F97316" />
          {/* Top connecting yellow flowers */}
          <circle cx="4" cy="8" r="6.5" fill="#F59E0B" />
          <circle cx="4" cy="8" r="4.5" fill="#FDE047" />
          <circle cx="76" cy="8" r="6.5" fill="#F59E0B" />
          <circle cx="76" cy="8" r="4.5" fill="#FDE047" />
        </pattern>
      </defs>
      <rect width="800" height="48" fill="url(#marigold-swag)" />
    </svg>
  </div>
);

export const TraditionalHaveliArch: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`relative ${className}`}>
    {/* Stylized Punjabi Haveli Jharokha / Cusped Arch Header */}
    <div className="w-full flex items-center justify-center mb-3">
      <svg width="180" height="28" viewBox="0 0 180 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 28 C25 28 40 20 60 12 C75 6 85 2 90 0 C95 2 105 6 120 12 C140 20 155 28 180 28"
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M15 28 C35 28 50 20 68 14 C80 10 88 5 90 3 C92 5 100 10 112 14 C130 20 145 28 165 28"
          stroke="#FDE68A"
          strokeWidth="1"
          strokeDasharray="3 2"
          fill="none"
        />
        <circle cx="90" cy="12" r="3" fill="#E5A910" />
      </svg>
    </div>
    {children}
  </div>
);
