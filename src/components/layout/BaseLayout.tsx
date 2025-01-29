import { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Header from './Header';

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.primary }}>
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
} 