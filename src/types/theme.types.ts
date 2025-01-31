/** Font configuration */
export interface FontConfig {
  family: {
    primary: string;
    secondary: string;
    mono: string;
  };
  size: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  weight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
}

/** Spacing configuration */
export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

/** Border configuration */
export interface BorderConfig {
  width: {
    none: string;
    thin: string;
    normal: string;
    thick: string;
  };
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  style: {
    solid: string;
    dashed: string;
    dotted: string;
  };
}

/** Shadow configuration */
export interface ShadowConfig {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
}

/** Color palette configuration */
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

/** Color configuration */
export interface ColorConfig {
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: ColorPalette;
  neutral: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  info: ColorPalette;
}

/** Semantic colors for different contexts */
export interface SemanticColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    modal: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    divider: string;
  };
  action: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    disabled: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

/** Animation configuration */
export interface AnimationConfig {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
  };
}

/** Breakpoint configuration */
export interface BreakpointConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/** Z-index configuration */
export interface ZIndexConfig {
  dropdown: number;
  sticky: number;
  fixed: number;
  modal: number;
  popover: number;
  tooltip: number;
}

/** Theme configuration */
export interface Theme {
  name: string;
  colors: ColorConfig;
  semanticColors: SemanticColors;
  fonts: FontConfig;
  spacing: SpacingConfig;
  borders: BorderConfig;
  shadows: ShadowConfig;
  animations: AnimationConfig;
  breakpoints: BreakpointConfig;
  zIndices: ZIndexConfig;
  isDark: boolean;
}

/** Available theme names */
export type ThemeName = 'light' | 'dark' | 'system' | 'custom'; 