import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#09090f",
        surface: "#111118",
        surface2: "#1a1a26",
        accent: "#7c5cfc",
        accent2: "#00e5c3",
        accent3: "#ff6b6b",
        gold: "#f0c040",
        muted: "#6b6880",
        "text-primary": "#e8e6f0",
        border: "rgba(120,100,255,0.15)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Syne", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accent-gradient": "linear-gradient(135deg, #7c5cfc 0%, #00e5c3 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(124,92,252,0.08)",
        "card-hover": "0 8px 40px rgba(124,92,252,0.18)",
        glow: "0 0 24px rgba(124,92,252,0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "toast-in": "toastIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        toastIn: {
          "0%": { transform: "translateX(120%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
