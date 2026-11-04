import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#16a34a",
          "secondary": "#0d9488",
          "accent": "#f59e0b",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "info": "#0284c7",
          "success": "#16a34a",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#22c55e",
          "secondary": "#14b8a6",
          "accent": "#fbbf24",
          "neutral": "#111827",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
  },
};
export default config;

