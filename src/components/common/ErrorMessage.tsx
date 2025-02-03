// Import the useTheme hook from the ThemeContext
import { useTheme } from '../../contexts/ThemeContext';
// Import the exclamation circle icon from react-icons
import { FaExclamationCircle } from 'react-icons/fa';

// Define the props interface for the ErrorMessage component
interface ErrorMessageProps {
  message: string;  // The error message to display
}

// Define the ErrorMessage component as a default export
export default function ErrorMessage({ message }: ErrorMessageProps) {
  // Use the useTheme hook to access the current theme
  const { theme } = useTheme();

  return (
    // Container div for the error message
    <div 
      // Apply Tailwind classes for styling
      className="rounded-lg p-4 flex items-center gap-3"
      // Use inline style to apply the theme's secondary background color
      style={{ backgroundColor: theme.colors.background.secondary }}
    >
      {/* Exclamation circle icon */}
      <FaExclamationCircle 
        // Style the icon using Tailwind classes
        className="w-5 h-5 flex-shrink-0 text-red-500"
      />
      {/* Error message text */}
      <p className="text-red-500">
        {message}  {/* Display the error message passed as a prop */}
      </p>
    </div>
  );
}
