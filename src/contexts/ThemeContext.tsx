// Import necessary dependencies from React
import { createContext, useContext, ReactNode } from 'react';
// Import theme-related configurations
import { theme, componentStyles, combineStyles } from '../config/theme';

// Create a context for the theme
// This context will hold the theme, componentStyles, and combineStyles
const ThemeContext = createContext({
  theme,
  componentStyles,
  combineStyles
});

// Define the ThemeProvider component
// This component will wrap other components that need access to the theme
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    // Provide the theme context to all child components
    <ThemeContext.Provider value={{ theme, componentStyles, combineStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Create a custom hook to easily access the theme context
// This allows components to consume the theme without explicitly using useContext
export const useTheme = () => useContext(ThemeContext)
