export const theme = {
  colors: {
    background: {
      primary: '#0D0D0D',    // Main background
      secondary: '#1A1A1A',  // Secondary surfaces
      card: '#242424',       // Card backgrounds
      hover: '#2A2A2A',      // Hover states
      active: '#383838'      // Active states
    },
    text: {
      primary: '#EAEAEA',    // Main text
      secondary: '#B3B3B3',  // Secondary text
      muted: '#7A7A7A',      // Muted text
      inverse: '#0D0D0D',    // Inverse text (on dark backgrounds)
      disabled: '#4A4A4A'    // Disabled text
    },
    accent: {
      primary: '#007BFF',    // Primary accent (Blue)
      secondary: '#D4A976',  // Secondary accent (Light Gold)
      hover: '#FFC000'       // Hover state for accents
    },
    status: {
      success: '#48BB78',    // Success states
      error: '#E53E3E',      // Error states
      warning: '#ECC94B',    // Warning states
      info: '#3182CE'        // Info states
    },
    border: {
      primary: '#2A2A2A',    // Primary borders
      secondary: '#383838',  // Secondary borders
      focus: '#FFD700',      // Focus state borders
      divider: '#1E1E1E'     // Divider lines
    }
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem'    // 48px
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
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem'  // 36px
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
  // Layout components
  page: {
    base: 'min-h-screen bg-background-primary text-text-primary',
    container: 'container mx-auto px-4 py-8'
  },
  navbar: {
    base: 'bg-background-primary bg-opacity-95 backdrop-blur-md border-b border-border-primary sticky top-0 z-50',
    container: 'px-4 py-3 mx-auto flex items-center justify-between max-w-7xl',
    logo: 'text-2xl font-bold text-accent-primary',
    nav: 'flex items-center space-x-4',
    link: 'px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all duration-150'
  },
  card: {
    base: 'bg-background-card rounded-lg shadow-md overflow-hidden transition-all duration-150',
    hover: 'hover:bg-background-hover hover:-translate-y-1 hover:shadow-lg',
    header: 'p-4 border-b border-border-primary',
    body: 'p-4',
    footer: 'p-4 border-t border-border-primary'
  },
  modal: {
    overlay: 'fixed inset-0 bg-background-primary/75 backdrop-blur-sm z-50',
    container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    content: 'bg-background-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto',
    header: 'p-4 border-b border-border-primary',
    body: 'p-4',
    footer: 'p-4 border-t border-border-primary flex justify-end gap-2'
  },
  form: {
    base: 'space-y-4',
    group: 'space-y-2',
    label: 'block text-sm font-medium text-text-secondary',
    error: 'mt-1 text-sm text-status-error',
    hint: 'mt-1 text-sm text-text-muted'
  },
  input: {
    base: 'w-full px-4 py-2 rounded-md bg-background-secondary text-text-primary border border-border-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-150',
    error: 'border-status-error focus:ring-status-error',
    disabled: 'bg-background-secondary text-text-disabled cursor-not-allowed'
  },
  select: {
    base: 'w-full px-4 py-2 rounded-md bg-background-secondary text-text-primary border border-border-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-150',
    error: 'border-status-error focus:ring-status-error',
    disabled: 'bg-background-secondary text-text-disabled cursor-not-allowed'
  },
  button: {
    base: 'px-4 py-2 rounded-md font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'bg-accent-primary text-background-primary hover:bg-accent-hover active:bg-accent-hover focus:ring-2 focus:ring-accent-secondary focus:ring-opacity-50',
    secondary: 'bg-background-card text-text-primary hover:bg-background-hover active:bg-background-active focus:ring-2 focus:ring-border-primary focus:ring-opacity-50',
    danger: 'bg-status-error text-text-primary hover:bg-red-600 focus:ring-2 focus:ring-status-error focus:ring-opacity-50',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-background-hover'
  },
  badge: {
    base: 'px-2 py-1 rounded-full text-xs font-medium',
    success: 'bg-status-success/20 text-status-success',
    error: 'bg-status-error/20 text-status-error',
    warning: 'bg-status-warning/20 text-status-warning',
    info: 'bg-status-info/20 text-status-info'
  },
  table: {
    base: 'w-full',
    header: 'bg-background-secondary text-text-secondary',
    headerCell: 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider',
    row: 'border-b border-border-primary hover:bg-background-hover',
    cell: 'px-4 py-3 whitespace-nowrap'
  },
  loading: {
    spinner: 'animate-spin rounded-full border-2 border-border-primary border-t-accent-primary h-6 w-6',
    overlay: 'absolute inset-0 bg-background-primary/50 flex items-center justify-center'
  }
};

export function combineStyles(...styles: string[]): string {
  return styles.filter(Boolean).join(' ');
}
