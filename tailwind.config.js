/** 
 * Tailwind CSS configuration file
 * This file defines the design system for the entire application
  */
 * @type {import('tailwindcss').Config} 

export default {
  // Specify files to scan for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // Theme customization
  theme: {
    extend: {
      // Custom color palette
      colors: {
        // Background colors for different surfaces
        background: {
          primary: '#0D0D0D',   // Main app background (Black)
          secondary: '#1A1A1A', // Secondary containers (Dark Gray)
          card: '#242424',      // Card and elevated surfaces (Charcoal)
          hover: '#2A2A2A',     // Hover state for interactive elements (Dark Charcoal)
          active: '#383838',    // Active/pressed state (Medium Gray)
          modal: 'rgba(0, 0, 0, 0.75)',  // Modal backdrop (Transparent Black)
          overlay: 'rgba(0, 0, 0, 0.5)'  // General overlay (Semi-transparent Black)
        },
        // Typography colors
        text: {
          primary: '#EAEAEA',   // Main text color (Off-White)
          secondary: '#B3B3B3', // Secondary/supporting text (Light Gray)
          muted: '#7A7A7A',     // Subdued text (Medium Gray)
          inverse: '#0D0D0D',   // Text on colored backgrounds (Black)
          disabled: '#4A4A4A'   // Disabled state text (Dark Gray)
        },
        // Brand accent colors
        accent: {
          primary: '#48BB78',   // Primary brand color (Green)
          secondary: '#D4A976', // Secondary brand color (Light Gold)
          hover: '#FFC000'      // Hover state for accent elements (Bright Gold)
        },
        // Status/feedback colors
        status: {
          success: '#48BB78',   // Success messages and states (Green)
          error: '#E53E3E',     // Error messages and states (Red)
          warning: '#ECC94B',   // Warning messages and states (Yellow)
          info: '#3182CE'       // Informational messages and states (Blue)
        }
      },

      // Typography configuration
      fontFamily: {
        // Font families for different purposes
        primary: ['Inter', 'system-ui', 'sans-serif'],      // Main text
        secondary: ['Playfair Display', 'serif']            // Headings and accents
      },
      // Font size scale (in rem)
      fontSize: {
        xs: '0.75rem',     // 12px - Small labels
        sm: '0.875rem',    // 14px - Secondary text
        base: '1rem',      // 16px - Body text
        lg: '1.125rem',    // 18px - Large text
        xl: '1.25rem',     // 20px - Small headings
        '2xl': '1.5rem',   // 24px - Medium headings
        '3xl': '1.875rem', // 30px - Large headings
        '4xl': '2.25rem'   // 36px - Extra large headings
      }
    }
  },

  // Plugin configuration
  plugins: [
    require("daisyui") // UI component library
  ],

  // DaisyUI theme configuration
  daisyui: {
    themes: [
      {
        // Custom theme definition
        mytheme: {
          // Primary colors
          "primary": "#FFD700",           // Primary actions and highlights (Gold)
          "primary-content": "#0D0D0D",   // Text on primary color (Black)
          "secondary": "#D4A976",         // Secondary actions (Light Gold)
          "accent": "#FFC000",            // Accents and focus states (Bright Gold)
          
          // Neutral colors
          "neutral": "#4A5568",           // Neutral elements (Slate Gray)
          
          // Base colors for surfaces
          "base-100": "#0D0D0D",         // Main background (Black)
          "base-200": "#1A1A1A",         // Elevated surfaces (Dark Gray)
          "base-300": "#242424",         // Higher elevation surfaces (Charcoal)
          
          // Status colors
          "info": "#3182CE",             // Informational elements (Blue)
          "success": "#48BB78",          // Success states (Green)
          "warning": "#ECC94B",          // Warning states (Yellow)
          "error": "#E53E3E",            // Error states (Red)
        },
      },
    ],
  },
}
