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

export type BrandConfig = typeof brand; 