import { useTheme } from '../../contexts/ThemeContext';

// Define the props interface for the StarRating component
interface StarRatingProps {
  rating: number;  // The rating value (e.g., 4.5)
  size?: 'sm' | 'md' | 'lg';  // Optional size prop with predefined options
}

export default function StarRating({ rating, size = 'md' }: StarRatingProps) {
  // Use the theme from the ThemeContext
  const { theme } = useTheme();
  const starCount = 5;  // Total number of stars to display
  const filledStars = Math.round(rating);  // Number of filled stars (rounded to nearest integer)

  // Function to determine the CSS classes for star size
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';  // Small size
      case 'lg': return 'w-6 h-6';  // Large size
      default: return 'w-5 h-5';    // Medium size (default)
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Create an array of 5 elements and map over it to render stars */}
      {[...Array(starCount)].map((_, index) => (
        <svg
          key={index}
          // Apply size classes and color based on whether the star should be filled
          className={`${getStarSize()} ${index < filledStars ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {/* SVG path for a star shape */}
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
      {/* Display the numeric rating value */}
      <span 
        className="ml-1 text-sm font-medium" 
        style={{ color: theme.colors.text.secondary }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
