
import { ReactNode } from 'react';
import { theme } from '../../config/theme';

interface BaseLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function BaseLayout({ 
  children, 
  header, 
  footer,
  className = ''
}: BaseLayoutProps) {
  return (
    <div 
      className={`min-h-screen bg-[${theme.colors.background.primary}] text-[${theme.colors.text.primary}] ${className}`}
      style={{ 
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.text.primary 
      }}
    >
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/50">
          {header}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer style={{ backgroundColor: theme.colors.background.secondary }}>
          {footer}
        </footer>
      )}
    </div>
  );
} 