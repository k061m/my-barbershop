/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2A3342",
        secondary: "#8B4513",
        accent: "#FFD700",
        neutral: "#4A5568",
        background: {
          primary: '#0D0D0D',
          secondary: '#1A1A1A',
          card: '#242424',
          hover: '#2A2A2A',
          active: '#383838'
        },
        text: {
          primary: '#EAEAEA',
          secondary: '#B3B3B3',
          muted: '#7A7A7A'
        },
        status: {
          success: '#48BB78',
          error: '#E53E3E',
          warning: '#ECC94B',
          info: '#3182CE'
        }
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        secondary: ['Playfair Display', 'serif']
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2A3342",
          "primary-content": "#ffffff",
          "secondary": "#8B4513",
          "accent": "#FFD700",
          "neutral": "#4A5568",
          "base-100": "#0D0D0D",
          "base-200": "#1A1A1A",
          "base-300": "#242424",
          "info": "#3182CE",
          "success": "#48BB78",
          "warning": "#ECC94B",
          "error": "#E53E3E",
        },
      },
    ],
  },
} 