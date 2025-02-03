import React from 'react';
import { componentStyles } from '../../config/theme';
import { ButtonVariant } from '../../types';

// Define the props interface for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;  // Determines the visual style of the button
  fullWidth?: boolean;      // Whether the button should take up full width
  isLoading?: boolean;      // Whether to show a loading state
  children: React.ReactNode; // The content of the button
}

export default function Button({
  variant = 'primary',  // Default to primary variant if not specified
  fullWidth = false,    // Default to not full width
  isLoading = false,    // Default to not loading
  children,
  className = '',       // Allow additional classes to be passed
  disabled,
  ...props              // Spread operator to allow any other button props
}: ButtonProps) {
  // Compose the button's styles
  const baseStyles = componentStyles.button.base;
  const variantStyles = componentStyles.button[variant];
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <button
      // Combine all the styles
      className={`${baseStyles} ${variantStyles} ${widthStyles} ${className}`}
      // Disable the button if it's loading or explicitly disabled
      disabled={disabled || isLoading}
      {...props}  // Spread any additional props onto the button element
    >
      {isLoading ? (
        // Show loading spinner and text when in loading state
        <div className="flex items-center justify-center gap-2">
          <div className={componentStyles.loading.spinner} />
          <span>Loading...</span>
        </div>
      ) : children}  // Show the button's content when not loading
    </button>
  );
}
