/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2A3342",
          "primary-content": "#ffffff",
          "secondary": "#8B4513",
          "accent": "#D4A976",
          "neutral": "#4A5568",
          "base-100": "#F7F7F7",
          "base-200": "#EAEAEA",
          "base-300": "#DDDDDD",
          "info": "#3182CE",
          "success": "#48BB78",
          "warning": "#ECC94B",
          "error": "#E53E3E",
        },
      },
    ],
  },
} 