import React from 'react';
import { componentStyles } from '../../config/theme';

interface CardProps {
  /** The content to be rendered inside the card */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Optional onClick handler */
  onClick?: () => void;
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
export default function Card({ 
  children, 
  className = '', 
  header, 
  footer, 
  hover = false,
  onClick
}: CardProps) {
  return (
    <div 
      className={`
        ${componentStyles.card.base}
        ${hover ? componentStyles.card.hover : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {header && (
        <div className={componentStyles.card.header}>
          {header}
        </div>
      )}
      <div className={componentStyles.card.body}>
        {children}
      </div>
      {footer && (
        <div className={componentStyles.card.footer}>
          {footer}
        </div>
      )}
    </div>
  );
} 