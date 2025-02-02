import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { reviewService } from '../../services/review.service';
import { Review } from '../../types';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

export default function ReviewsPreview() {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAll();
      // Get top 3 most recent verified reviews with rating >= 4
      const topReviews = data
        .filter(review => review.isVerified && review.rating >= 4)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      setReviews(topReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className="h-32 bg-gray-200 rounded-lg mb-4"
            style={{ backgroundColor: theme.colors.background.secondary }}
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-12" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 
            className="text-3xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            What Our Customers Say
          </h2>
          <Link
            to="/reviews"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            View All Reviews
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: theme.colors.background.card }}
            >
              {/* Rating and Date */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl mr-2">{'★'.repeat(review.rating)}</span>
                  <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    {review.rating}/5
                  </span>
                </div>
                <span 
                  className="text-sm"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {formatDate(review.date)}
                </span>
              </div>

              {/* Comment */}
              <p 
                className="mb-4 line-clamp-3"
                style={{ color: theme.colors.text.primary }}
              >
                {review.comment}
              </p>

              {/* Service and User */}
              <div className="flex justify-between items-center">
                <span 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.accent.primary }}
                >
                  {review.serviceId}
                </span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ 
                      backgroundColor: theme.colors.accent.primary,
                      color: theme.colors.background.primary
                    }}
                  >
                    {review.userId.charAt(0).toUpperCase()}
                  </div>
                  {review.isVerified && (
                    <svg 
                      className="w-4 h-4"
                      style={{ color: theme.colors.status.success }}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 