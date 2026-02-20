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
        bg: "#08080e",
        surface: "#0f0f17",
        surface2: "#16161f",
        surface3: "#1c1c28",
        accent: "#6366f1",
        "accent-bright": "#818cf8",
        accent2: "#06d6a0",
        accent3: "#ef4444",
        gold: "#f59e0b",
        muted: "#64638a",
        "text-primary": "#eae9fc",
        "text-secondary": "#a5a3c8",
        border: "rgba(99,102,241,0.12)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accent-gradient": "linear-gradient(135deg, #6366f1 0%, #06d6a0 100%)",
      },
      boxShadow: {
        card: "0 2px 16px rgba(99,102,241,0.06)",
        "card-hover":
          "0 8px 32px rgba(99,102,241,0.14), 0 0 0 1px rgba(99,102,241,0.15)",
        glow: "0 0 20px rgba(99,102,241,0.3)",
        "glow-sm": "0 0 10px rgba(99,102,241,0.2)",
        "glow-accent2": "0 0 20px rgba(6,214,160,0.3)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "toast-in": "toastIn 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "copy-burst": "copyBurst 0.6s ease-out forwards",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        copyBurst: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};

export default config;
