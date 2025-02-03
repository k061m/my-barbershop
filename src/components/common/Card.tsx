import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Define the props interface for the Card component
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
 * A modern, reusable card component with glass morphism effects and smooth transitions.
 * Provides consistent styling and theming across the application.
 * 
 * @component
 * @example
 * ```
 * <Card className="p-4" hover>
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
  // Access the current theme from the ThemeContext
  const { theme } = useTheme();

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${hover ? 'hover:translate-y-[-4px] hover:shadow-xl' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        // Apply theme-based styles
        backgroundColor: `${theme.colors.background.card}dd`, // Semi-transparent background
        boxShadow: `0 4px 6px -1px ${theme.colors.text.muted}20, 
                    0 2px 4px -1px ${theme.colors.text.muted}10`, // Subtle shadow
        border: `1px solid ${theme.colors.border}15` // Light border
      }}
    >
      {/* Glass effect overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          // Create a gradient background for the glass effect
          background: `linear-gradient(
            135deg,
            ${theme.colors.background.card}05 0%,
            ${theme.colors.background.card}15 100%
          )`,
          borderRadius: 'inherit'
        }}
      />

      {/* Content container */}
      <div className="relative z-10">
        {/* Render header if provided */}
        {header && (
          <div className="overflow-hidden">
            {header}
          </div>
        )}
        
        {/* Main content area */}
        <div className="p-4">
          {children}
        </div>

        {/* Render footer if provided */}
        {footer && (
          <div 
            className="p-4 mt-2"
            style={{
              borderTop: `1px solid ${theme.colors.border}15`, // Light top border
              backgroundColor: `${theme.colors.background.secondary}20` // Slightly different background
            }}
          >
            {footer}
          </div>
        )}
      </div>

      {/* Hover highlight effect */}
      {hover && (
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            // Create a gradient background for the hover effect
            background: `linear-gradient(
              135deg,
              ${theme.colors.accent.primary}05 0%,
              ${theme.colors.accent.primary}10 100%
            )`,
            borderRadius: 'inherit'
          }}
        />
      )}
    </div>
  );
}
