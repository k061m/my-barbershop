import { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  /** The content to be rendered inside the card */
  children: ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Optional onClick handler */
  onClick?: () => void;
  /** Whether to show hover effects */
  hoverable?: boolean;
  /** Optional image URL */
  image?: string;
}

/**
 * Card Component
 * 
 * A reusable card component that provides consistent styling and theming.
 * Can be used as a container for various types of content.
 * 
 * @component
 * @example
 * ```tsx
 * <Card className="p-4" hoverable>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export function Card({ 
  children, 
  className = '', 
  onClick,
  hoverable = false,
  image 
}: CardProps) {
  const { theme } = useTheme();

  return (
    <div 
      className={`
        rounded-lg shadow-lg
        ${hoverable ? 'transition-transform hover:scale-105 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{ backgroundColor: theme.colors.background.card }}
      role={onClick ? 'button' : 'article'}
    >
      {image && (
        <img 
          src={image} 
          alt=""
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
} 