export const theme = {
  colors: {
    background: {
      primary: '#0D0D0D', // Deep black for the main background
      secondary: '#1A1A1A', // Slightly lighter black for sections
      card: '#242424', // Dark gray for cards
      hover: '#2A2A2A', // Subtle hover effect
      active: '#383838', // Slightly brighter for active states
      modal: 'rgba(0, 0, 0, 0.75)',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    text: {
      primary: '#EAEAEA', // Off-white for better readability
      secondary: '#B3B3B3', // Light gray for secondary text
      muted: '#7A7A7A', // Muted gray for less prominent text
      inverse: '#0D0D0D',
      disabled: '#4A4A4A'
    },
    accent: {
      primary: '#FFD700', // Vibrant coral red for accents
      secondary: '#D4A976', // Warm golden yellow for highlights
      hover: '#FFC000' // Bright teal for interactive elements
    },
    status: {
      success: '#48BB78', // Green for success messages
      error: '#E53E3E', // Bright red for errors
      warning: '#ECC94B', // Orange for warnings
      info: '#3182CE' // Sky blue for informational messages
    },
    border: {
      primary: '#2A2A2A',
      secondary: '#383838',
      focus: '#FFD700',
      divider: '#1E1E1E'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px'
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Playfair Display, serif'
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
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.16)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19)'
  },
  transitions: {
    default: '150ms ease-in-out',
    slow: '300ms ease-in-out',
    fast: '100ms ease-in-out'
  }
} as const;

export const componentStyles = {
  navbar: {
    base:
      `bg-opacity-95 backdrop-blur-md border-b border-gray-800 transition-all duration-150`,
    container:
      `px-4 py-3 mx-auto flex items-center justify-between max-w-7xl`,
    logo:
      `text-2xl font-bold text-accent-primary`,
    nav:
      `flex items-center space-x-4`,
    link:
      `px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all duration-150`,
      button:
      `px-4 py-2 rounded-md font-medium bg-accent-primary text-background-primary hover:bg-accent-hover transition-all duration-150`
  },
  card: {
    base:
      `rounded-lg shadow-md bg-background-card overflow-hidden transition-all duration-150`,
    hover:
      `hover:bg-background-hover hover:-translate-y-1 hover:ring-2 ring-accent-primary`
  },
  input: {
    base:
      `w-full px-4 py-2 rounded-md bg-background-secondary text-text-primary border border-background-hover focus:outline-none focus:ring focus:ring-accent-primary transition-all duration-150`
  },
  button: {
    base: `px-4 py-2 rounded-md font-medium transition-all duration-150`,
    primary: `text-background-primary`,
    secondary: `text-text-primary`
  }
};

export function combineStyles(...styles: string[]): string {
  return styles.join(' ');
}
