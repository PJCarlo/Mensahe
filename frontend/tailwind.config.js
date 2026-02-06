import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        neumorphic: "8px 8px 16px rgba(0,0,0,0.7), -6px -6px 12px rgba(255,255,255,0.04)",
        insetneumorphic: "inset 6px 6px 12px rgba(0,0,0,0.7), inset -4px -4px 8px rgba(255,255,255,0.03)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        darksoft: {
          "base-100": "#0f0f10",
          "base-200": "#141414",
          "base-300": "#1a1a1c",
          "neutral": "#1f1f22",
          "primary": "#1db954",
          "secondary": "#3a3a3d",
          "accent": "#22c55e",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#facc15",
          "error": "#ef4444",
        }
      },
    ],
  },
}
