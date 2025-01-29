import { createContext, useContext, ReactNode } from 'react';
import { theme, componentStyles, combineStyles } from '../config/theme';

const ThemeContext = createContext({
  theme,
  componentStyles,
  combineStyles
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme, componentStyles, combineStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 