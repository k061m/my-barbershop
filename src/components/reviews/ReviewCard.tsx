import { useTheme } from '../../contexts/ThemeContext';
import { Review } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface ReviewCardProps {
  review: Review;
  userName: string;
  barberName: string;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-105"
      style={{ backgroundColor: theme.colors.background.card }}
    >
      <div className="p-6">
        {/* User Info and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium"
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
            >
              {review.userId.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-yellow-400 text-lg mr-1">{'★'.repeat(review.rating)}</span>
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                  ({review.rating}/5)
                </span>
              </div>
              <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                {formatDate(review.date)}
              </span>
            </div>
          </div>
          {review.isVerified && (
            <div 
              className="flex items-center gap-1"
              style={{ color: theme.colors.status.success }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="space-y-3">
          <p 
            className="text-base"
            style={{ color: theme.colors.text.primary }}
          >
            {review.comment}
          </p>
          <div 
            className="text-sm font-medium"
            style={{ color: theme.colors.accent.primary }}
          >
            Service: {review.serviceId}
          </div>
        </div>

        {/* Barber Response */}
        {review.response && (
          <div 
            className="mt-4 p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.background.secondary }}
          >
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                Response from {review.response.by}
              </span>
              <span 
                className="text-xs"
                style={{ color: theme.colors.text.secondary }}
              >
                {formatDate(review.response.date)}
              </span>
            </div>
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              {review.response.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 