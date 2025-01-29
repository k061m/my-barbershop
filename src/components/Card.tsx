import { ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  image?: string;
}

export function Card({ 
  children, 
  className = '', 
  onClick,
  hover = true,
  image
}: CardProps) {
  const { theme, componentStyles, combineStyles } = useTheme();

  return (
    <div
      onClick={onClick}
      className={combineStyles(
        'card',
        hover ? componentStyles.card.hover : '',
        className
      )}
      style={{ 
        backgroundColor: theme.colors.background.card,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
            style={{ 
              background: `linear-gradient(to top, ${theme.colors.background.card}, transparent)` 
            }}
          />
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
} 