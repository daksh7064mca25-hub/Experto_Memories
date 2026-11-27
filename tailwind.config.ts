import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
        handwriting: ["var(--font-handwriting)", "Caveat", "cursive"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(3deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        pageFlipForward: {
          "0%": { transform: "perspective(1800px) rotateY(0deg) scale(1)", opacity: "1", filter: "brightness(1)" },
          "50%": { transform: "perspective(1800px) rotateY(-35deg) scale(0.97)", opacity: "0.88", filter: "brightness(0.92)" },
          "100%": { transform: "perspective(1800px) rotateY(0deg) scale(1)", opacity: "1", filter: "brightness(1)" },
        },
        pageFlipBackward: {
          "0%": { transform: "perspective(1800px) rotateY(0deg) scale(1)", opacity: "1", filter: "brightness(1)" },
          "50%": { transform: "perspective(1800px) rotateY(35deg) scale(0.97)", opacity: "0.88", filter: "brightness(0.92)" },
          "100%": { transform: "perspective(1800px) rotateY(0deg) scale(1)", opacity: "1", filter: "brightness(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        pageFlipForward: "pageFlipForward 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        pageFlipBackward: "pageFlipBackward 0.42s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        fadeIn: "fadeIn 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

