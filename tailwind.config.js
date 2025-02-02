/** 
 * Tailwind CSS configuration file
 * This file defines the design system for the entire application
 * @type {import('tailwindcss').Config} 
 */
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
          primary: '#0D0D0D',   // Main app background
          secondary: '#1A1A1A', // Secondary containers
          card: '#242424',      // Card and elevated surfaces
          hover: '#2A2A2A',     // Hover state for interactive elements
          active: '#383838',    // Active/pressed state
          modal: 'rgba(0, 0, 0, 0.75)',  // Modal backdrop
          overlay: 'rgba(0, 0, 0, 0.5)'  // General overlay
        },
        // Typography colors
        text: {
          primary: '#EAEAEA',   // Main text color
          secondary: '#B3B3B3', // Secondary/supporting text
          muted: '#7A7A7A',     // Subdued text
          inverse: '#0D0D0D',   // Text on colored backgrounds
          disabled: '#4A4A4A'   // Disabled state text
        },
        // Brand accent colors
        accent: {
          primary: '#48BB78',   // Primary brand color (Gold)
          secondary: '#D4A976', // Secondary brand color
          hover: '#FFC000'      // Hover state for accent elements
        },
        // Status/feedback colors
        status: {
          success: '#48BB78',   // Success messages and states
          error: '#E53E3E',     // Error messages and states
          warning: '#ECC94B',   // Warning messages and states
          info: '#3182CE'       // Informational messages and states
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
          "primary": "#FFD700",           // Primary actions and highlights
          "primary-content": "#0D0D0D",   // Text on primary color
          "secondary": "#D4A976",         // Secondary actions
          "accent": "#FFC000",            // Accents and focus states
          
          // Neutral colors
          "neutral": "#4A5568",           // Neutral elements
          
          // Base colors for surfaces
          "base-100": "#0D0D0D",         // Main background
          "base-200": "#1A1A1A",         // Elevated surfaces
          "base-300": "#242424",         // Higher elevation surfaces
          
          // Status colors
          "info": "#3182CE",             // Informational elements
          "success": "#48BB78",          // Success states
          "warning": "#ECC94B",          // Warning states
          "error": "#E53E3E",            // Error states
        },
      },
    ],
  },
} 