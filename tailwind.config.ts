import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.ts",
  ],
  theme: {
    // Neo-brutalism: square corners everywhere.
    borderRadius: {
      none: "0",
    },
    extend: {
      colors: {
        cream: "#FFF4D6",
        ink: "#111111",
        white: "#FFFFFF",
        muted: "#3D3D3D",
        yellow: "#FFD23F",
        pink: "#FF6B9A",
        mint: "#7BE0AD",
        rose: "#FF8FA3",
        issue: "#B4235A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        // Hard offset shadows, never blurred.
        brut: "6px 6px 0 #111111",
        "brut-lg": "8px 8px 0 #111111",
        "brut-sm": "5px 5px 0 #111111",
        "brut-press": "2px 2px 0 #111111",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        sticker: {
          "0%, 100%": { transform: "rotate(7deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        pop: {
          "0%": { transform: "scale(.6) rotate(-4deg)", opacity: "0" },
          "70%": { transform: "scale(1.05) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "65%": { transform: "translateY(-6px)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".45" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        wiggle: "wiggle 2.4s ease-in-out infinite",
        sticker: "sticker 1.8s ease-in-out infinite",
        pop: "pop .55s cubic-bezier(.3,1.4,.5,1) both",
        "bounce-in": "bounce-in .7s cubic-bezier(.3,1.4,.5,1) both",
        shimmer: "shimmer 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
