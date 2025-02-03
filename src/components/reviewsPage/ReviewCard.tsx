import { Review } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import Card from '../common/Card';

// Define the props interface for the ReviewCard component
interface ReviewCardProps {
  review: Review;
  userName: string;
  barberName: string;
}

// Define the ReviewCard component
export default function ReviewCard({ review }: ReviewCardProps) {
  // Create the header section of the card
  const header = (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {/* User avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium bg-accent-primary text-background-primary">
          {review.userId.charAt(0).toUpperCase()}
        </div>
        <div>
          {/* Rating display */}
          <div className="flex items-center">
            <span className="text-yellow-400 text-lg mr-1">{'★'.repeat(review.rating)}</span>
            <span className="text-sm text-text-secondary">
              ({review.rating}/5)
            </span>
          </div>
          {/* Review date */}
          <span className="text-sm text-text-secondary">
            {formatDate(review.date)}
          </span>
        </div>
      </div>
      {/* Verified badge */}
      {review.isVerified && (
        <div className="flex items-center gap-1 text-status-success">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Verified</span>
        </div>
      )}
    </div>
  );

  // Create the footer section of the card (if there's a response)
  const footer = review.response && (
    <div className="bg-background-secondary rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary">
          Response from {review.response.by}
        </span>
        <span className="text-xs text-text-secondary">
          {formatDate(review.response.date)}
        </span>
      </div>
      <p className="text-sm text-text-secondary">
        {review.response.message}
      </p>
    </div>
  );

  // Return the Card component with header, footer, and content
  return (
    <Card
      header={header}
      footer={footer}
      hover
    >
      <div className="space-y-3 px-4">
        {/* Review comment */}
        <p className="text-base text-text-primary">
          {review.comment}
        </p>
        {/* Service information */}
        <div className="text-sm font-medium text-accent-primary">
          Service: {review.serviceId}
        </div>
      </div>
    </Card>
  );
}
