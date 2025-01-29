import { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  const { theme } = useTheme();

  return (
    <div 
      className={`rounded-lg shadow-lg p-4 ${className}`}
      style={{ backgroundColor: theme.colors.background.card }}
    >
      {children}
    </div>
  );
} 