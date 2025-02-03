// Import the logger utility for debugging purposes
import { logger } from '../utils/debug';

// Define the brand object with constant properties
export const brand = {
  // The name of the barbershop
  name: 'My Barbershop',
  // Logo variations for different contexts
  logo: {
    default: '/images/stock/logo.png',
    dark: '/images/stock/logo.png',
    light: '/images/stock/logo.png',
    small: '/images/stock/logo.png'
  },
  // Brand color scheme
  colors: {
    primary: '#0D0D0D',    // Very dark gray, almost black
    secondary: '#1A1A1A',  // Dark gray
    accent: '#FFD700'      // Gold color
  }
} as const;  // 'as const' makes all properties read-only

// Define layout specifications
export const layout = {
  // Navbar dimensions
  navbar: {
    height: '4rem',
    mobileHeight: '3.5rem'
  },
  // Sidebar dimensions
  sidebar: {
    width: '16rem',
    collapsedWidth: '4rem'
  },
  // Footer height
  footer: {
    height: '12rem'
  },
  // Spacing specifications for containers and sections
  spacing: {
    container: {
      padding: '1rem',
      maxWidth: '1280px'
    },
    section: {
      padding: '2rem'
    }
  }
} as const;  // 'as const' makes all properties read-only

// Define responsive design breakpoints
export const breakpoints = {
  sm: '640px',   // Small screens
  md: '768px',   // Medium screens
  lg: '1024px',  // Large screens
  xl: '1280px',  // Extra large screens
  '2xl': '1536px'  // Double extra large screens
} as const  // 'as const' makes all properties read-only



// This block only runs in development mode
if (import.meta.env.DEV) {
  const validateConfig = () => {
    // Validate logo paths
    Object.entries(brand.logo).forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      // If the image fails to load, log an error
      img.onerror = () => {
        logger.error(`Failed to load ${key} logo from path: ${path}`, {
          component: 'UIConfig'
        });
      };
    });

    // Validate color formats
    Object.entries(brand.colors).forEach(([key, color]) => {
      // Check if the color is a valid hex code (3 or 6 digits)
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        logger.error(`Invalid color format for ${key}: ${color}`, {
          component: 'UIConfig'
        });
      }
    });
  };

  // Execute the validation function
  validateConfig();
}

// Export type definitions based on the configuration objects
export type BrandConfig = typeof brand;
export type LayoutConfig = typeof layout;
export type BreakpointConfig = typeof breakpoints;
