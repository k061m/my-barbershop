export const theme = {
  colors: {
    background: {
      primary: '#0D0D0D',    // Main background color, very dark for a sleek, modern look
      secondary: '#1A1A1A',  // Slightly lighter background for secondary elements, creating depth
      card: '#242424',       // Even lighter background for card elements, improving readability
      hover: '#2A2A2A',      // Subtle highlight color for hoverable elements
      active: '#383838'      // Darker shade for active elements, providing clear user feedback
    },
    text: {
      primary: '#EAEAEA',    // Main text color, light grey for high contrast on dark backgrounds
      secondary: '#B3B3B3',  // Slightly darker text for less important information
      muted: '#7A7A7A',      // Even darker text for tertiary information or placeholders
      inverse: '#0D0D0D',    // Dark text color for use on light backgrounds
      disabled: '#4A4A4A'    // Greyed out text color for disabled elements
    },
    accent: {
      primary: '#007BFF',    // Bright blue for primary interactive elements and highlights
      secondary: '#D4A976',  // Warm gold tone for secondary accents, adding visual interest
      hover: '#FFC000'       // Bright yellow for hover states, drawing attention to interactive elements
    },
    status: {
      success: '#48BB78',    // Green color for success messages or positive states
      error: '#E53E3E',      // Red color for error messages or negative states
      warning: '#ECC94B',    // Yellow color for warning messages or cautionary states
      info: '#3182CE'        // Blue color for informational messages or neutral states
    },
    border: {
      primary: '#2A2A2A',    // Subtle border color for primary divisions
      secondary: '#383838',  // Slightly darker border for secondary divisions
      focus: '#FFD700',      // Bright yellow for focus states, improving accessibility
      divider: '#1E1E1E'     // Very dark color for subtle dividing lines
    }
  },
  spacing: {
    xs: '0.25rem',   // 4px - Extra small spacing
    sm: '0.5rem',    // 8px - Small spacing
    md: '1rem',      // 16px - Medium spacing (default)
    lg: '1.5rem',    // 24px - Large spacing
    xl: '2rem',      // 32px - Extra large spacing
    '2xl': '3rem'    // 48px - Double extra large spacing
  },
  borderRadius: {
    sm: '0.25rem',   // Small border radius
    md: '0.5rem',    // Medium border radius
    lg: '1rem',      // Large border radius
    full: '9999px'   // Fully rounded (circular) border radius
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',    // Main font for body text
      secondary: 'Playfair Display, serif'        // Accent font for headings or special text
    },
    fontSize: {
      xs: '0.75rem',    // 12px - Extra small text
      sm: '0.875rem',   // 14px - Small text
      base: '1rem',     // 16px - Base text size (default)
      lg: '1.125rem',   // 18px - Large text
      xl: '1.25rem',    // 20px - Extra large text
      '2xl': '1.5rem',  // 24px - Double extra large text
      '3xl': '1.875rem',// 30px - Triple extra large text
      '4xl': '2.25rem'  // 36px - Quadruple extra large text
    },
    fontWeight: {
      normal: '400',    // Normal font weight
      medium: '500',    // Medium font weight
      semibold: '600',  // Semi-bold font weight
      bold: '700'       // Bold font weight
    }
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',  // Small shadow
    md: '0 4px 6px rgba(0, 0, 0, 0.16)',  // Medium shadow
    lg: '0 10px 20px rgba(0, 0, 0, 0.19)' // Large shadow
  },
  transitions: {
    default: '150ms ease-in-out',  // Default transition speed and easing
    slow: '300ms ease-in-out',     // Slow transition speed
    fast: '100ms ease-in-out'      // Fast transition speed
  }
} as const;

export const componentStyles = {
  // Layout components
  page: {
    // Styles for the main page container
    base: 'min-h-screen bg-background-primary text-text-primary', // Full height, background color, and text color
    container: 'container mx-auto px-4 py-8' // Centered container with padding
  },
  navbar: {
    // Styles for the navigation bar
    base: 'bg-background-primary bg-opacity-95 backdrop-blur-md border-b border-border-primary sticky top-0 z-50', // Background, border, sticky positioning
    container: 'px-4 py-3 mx-auto flex items-center justify-between max-w-7xl', // Padding, flex layout, max width
    logo: 'text-2xl font-bold text-accent-primary', // Logo text styling
    nav: 'flex items-center space-x-4', // Navigation items layout
    link: 'px-3 py-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-hover transition-all duration-150' // Navigation link styling with hover effects
  },
  card: {
    // Styles for card components
    base: 'bg-background-card rounded-lg shadow-md overflow-hidden transition-all duration-150', // Card base styling
    hover: 'hover:bg-background-hover hover:-translate-y-1 hover:shadow-lg', // Hover effects
    header: 'p-4 border-b border-border-primary', // Card header
    body: 'p-4', // Card body
    footer: 'p-4 border-t border-border-primary' // Card footer
  },
  modal: {
    // Styles for modal dialogs
    overlay: 'fixed inset-0 bg-background-primary/75 backdrop-blur-sm z-50', // Modal overlay
    container: 'fixed inset-0 z-50 flex items-center justify-center p-4', // Modal container
    content: 'bg-background-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto', // Modal content
    header: 'p-4 border-b border-border-primary', // Modal header
    body: 'p-4', // Modal body
    footer: 'p-4 border-t border-border-primary flex justify-end gap-2' // Modal footer
  },
  form: {
    // Styles for form elements
    base: 'space-y-4', // Vertical spacing between form elements
    group: 'space-y-2', // Spacing for form groups
    label: 'block text-sm font-medium text-text-secondary', // Form label styling
    error: 'mt-1 text-sm text-status-error', // Error message styling
    hint: 'mt-1 text-sm text-text-muted' // Hint text styling
  },
  input: {
    // Styles for input fields
    base: 'w-full px-4 py-2 rounded-md bg-background-secondary text-text-primary border border-border-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-150', // Input base styling
    error: 'border-status-error focus:ring-status-error', // Error state
    disabled: 'bg-background-secondary text-text-disabled cursor-not-allowed' // Disabled state
  },
  select: {
    // Styles for select dropdowns (similar to input)
    base: 'w-full px-4 py-2 rounded-md bg-background-secondary text-text-primary border border-border-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-150',
    error: 'border-status-error focus:ring-status-error',
    disabled: 'bg-background-secondary text-text-disabled cursor-not-allowed'
  },
  button: {
    // Styles for buttons
    base: 'px-4 py-2 rounded-md font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed', // Button base styling
    primary: 'bg-accent-primary text-background-primary hover:bg-accent-hover active:bg-accent-hover focus:ring-2 focus:ring-accent-secondary focus:ring-opacity-50', // Primary button
    secondary: 'bg-background-card text-text-primary hover:bg-background-hover active:bg-background-active focus:ring-2 focus:ring-border-primary focus:ring-opacity-50', // Secondary button
    danger: 'bg-status-error text-text-primary hover:bg-red-600 focus:ring-2 focus:ring-status-error focus:ring-opacity-50', // Danger button
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-background-hover' // Ghost button
  },
  badge: {
    // Styles for badges
    base: 'px-2 py-1 rounded-full text-xs font-medium', // Badge base styling
    success: 'bg-status-success/20 text-status-success', // Success badge
    error: 'bg-status-error/20 text-status-error', // Error badge
    warning: 'bg-status-warning/20 text-status-warning', // Warning badge
    info: 'bg-status-info/20 text-status-info' // Info badge
  },
  table: {
    // Styles for tables
    base: 'w-full', // Full width table
    header: 'bg-background-secondary text-text-secondary', // Table header
    headerCell: 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider', // Header cell
    row: 'border-b border-border-primary hover:bg-background-hover', // Table row
    cell: 'px-4 py-3 whitespace-nowrap' // Table cell
  },
  loading: {
    // Styles for loading indicators
    spinner: 'animate-spin rounded-full border-2 border-border-primary border-t-accent-primary h-6 w-6', // Spinning loader
    overlay: 'absolute inset-0 bg-background-primary/50 flex items-center justify-center' // Loading overlay
  }
};

export function combineStyles(...styles: string[]): string {
  return styles.filter(Boolean).join(' ');
}
