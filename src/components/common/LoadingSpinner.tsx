import { useTheme } from '../../contexts/ThemeContext';

export default function LoadingSpinner() {
  // Access the current theme from the ThemeContext
  const { theme } = useTheme();

  return (
    // Container for the spinner, centered both horizontally and vertically
    <div className="flex justify-center items-center min-h-[200px]">
      <div 
        // Spinner element with animation and styling
        className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
        style={{ 
          // Dynamic border color based on the current theme
          // Only the top border is transparent, creating the spinning effect
          borderColor: `${theme.colors.accent.primary} transparent transparent transparent`
        }}
      />
    </div>
  );
}
