import { useTheme } from '../../contexts/ThemeContext';
import { Review } from '../../types/data.types';
import ReviewsList from './ReviewsList';

interface ReviewsSectionProps {
  /** Array of review objects to display */
  reviews: Review[];
  /** Function to get barber's name from their ID */
  getBarberName: (barberId: string) => string;
  /** Function to get user's name from their ID */
  getUserName: (userId: string) => string;
  /** Optional className for additional styling */
  className?: string;
  /** Optional section title */
  title?: string;
}

/**
 * ReviewsSection Component
 * 
 * A section component that displays a list of reviews in a contained area.
 * Provides a consistent layout and spacing for the reviews list.
 * 
 * @component
 * @example
 * ```tsx
 * <ReviewsSection
 *   reviews={reviews}
 *   getBarberName={getBarberName}
 *   getUserName={getUserName}
 *   title="What Our Customers Say"
 * />
 * ```
 */
export default function ReviewsSection({ 
  reviews, 
  getBarberName, 
  getUserName,
  className = '',
  title = 'Customer Reviews'
}: ReviewsSectionProps) {
  const { theme } = useTheme();

  return (
    <section 
      className={`py-12 ${className}`}
      style={{ backgroundColor: theme.colors.background.primary }}
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2 
            className="text-2xl font-bold text-center mb-8"
            style={{ color: theme.colors.text.primary }}
          >
            {title}
          </h2>
        )}
        <ReviewsList
          reviews={reviews}
          getBarberName={getBarberName}
          getUserName={getUserName}
        />
      </div>
    </section>
  );
} 