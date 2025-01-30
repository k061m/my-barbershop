import { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Review } from '../../types/data.types';
import ReviewCard from './ReviewCard';
import { Card } from '../common/Card';

type SortOption = 'date' | 'rating';

interface ReviewsListProps {
  /** Array of review objects to display */
  reviews: Review[];
  /** Function to get barber's name from their ID */
  getBarberName: (barberId: string) => string;
  /** Function to get user's name from their ID */
  getUserName: (userId: string) => string;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * ReviewsList Component
 * 
 * Displays a list of reviews with sorting capabilities.
 * Reviews can be sorted by date or rating.
 * 
 * @component
 * @example
 * ```tsx
 * <ReviewsList
 *   reviews={reviews}
 *   getBarberName={(id) => barbers.find(b => b.id === id)?.name || 'Unknown'}
 *   getUserName={(id) => users.find(u => u.id === id)?.name || 'Anonymous'}
 * />
 * ```
 */
export default function ReviewsList({ 
  reviews, 
  getBarberName, 
  getUserName,
  className = ''
}: ReviewsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const { theme } = useTheme();

  const sortedReviews = useMemo(() => 
    [...reviews].sort((a, b) => {
      if (sortBy === 'date') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      return b.rating - a.rating;
    }),
    [reviews, sortBy]
  );

  return (
    <Card className={className}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
            Customer Reviews ({reviews.length})
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="select select-sm"
            style={{ 
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.primary
            }}
            aria-label="Sort reviews by"
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        <div className="space-y-4" role="list">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <div key={review.id} role="listitem">
                <ReviewCard
                  review={review}
                  userName={getUserName(review.userId)}
                  barberName={getBarberName(review.barberId)}
                />
              </div>
            ))
          ) : (
            <p 
              className="text-center py-4" 
              style={{ color: theme.colors.text.secondary }}
              role="status"
            >
              No reviews yet. Be the first to leave a review!
            </p>
          )}
        </div>
      </div>
    </Card>
  );
} 