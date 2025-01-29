import { logger } from '../utils/debug';

export const brand = {
  name: 'My Barbershop',
  logo: {
    default: '/images/stock/logo.png',
    dark: '/images/stock/logo.png',
    light: '/images/stock/logo.png',
    small: '/images/stock/logo.png'
  },
  colors: {
    primary: '#1a1a1a',
    secondary: '#4a4a4a',
    accent: '#ffd700'
  }
} as const;

export const layout = {
  navbar: {
    height: '4rem',
    mobileHeight: '3.5rem'
  },
  sidebar: {
    width: '16rem',
    collapsedWidth: '4rem'
  },
  footer: {
    height: '12rem'
  }
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Validate configuration on import in development
if (import.meta.env.DEV) {
  const validateConfig = () => {
    // Validate logo paths
    Object.entries(brand.logo).forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      img.onerror = () => {
        logger.error(`Failed to load ${key} logo from path: ${path}`, {
          component: 'UIConfig'
        });
      };
    });

    // Validate color formats
    Object.entries(brand.colors).forEach(([key, color]) => {
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        logger.error(`Invalid color format for ${key}: ${color}`, {
          component: 'UIConfig'
        });
      }
    });
  };

  validateConfig();
}

export type BrandConfig = typeof brand;
export type LayoutConfig = typeof layout;
export type BreakpointConfig = typeof breakpoints; 