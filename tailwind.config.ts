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
    },
  },
  plugins: [],
};

export default config;
