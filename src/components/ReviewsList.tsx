import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService, Review } from '../services/database.service';
import { Timestamp } from 'firebase/firestore';
import ReviewForm from './ReviewForm';

interface ReviewsListProps {
  barberId: string;
}

export default function ReviewsList({ barberId }: ReviewsListProps) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [barberId]);

  useEffect(() => {
    if (currentUser && reviews.length > 0) {
      const hasReviewed = reviews.some(review => review.userId === currentUser.uid);
      setUserHasReviewed(hasReviewed);
    }
  }, [currentUser, reviews]);

  const loadReviews = async () => {
    try {
      const data = await dbService.getReviews(barberId);
      // Sort reviews by date (newest first)
      const sortedReviews = data.sort((a, b) => b.date.toMillis() - a.date.toMillis());
      setReviews(sortedReviews);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    loadReviews();
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium'
    }).format(date);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <div className="rating rating-md">
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  className="mask mask-star-2 bg-orange-400"
                  checked={Math.round(Number(getAverageRating())) === value}
                  readOnly
                />
              ))}
            </div>
            <span className="text-sm">
              ({getAverageRating()}) · {reviews.length} reviews
            </span>
          </div>
        </div>
        
        {currentUser && !userHasReviewed && !showReviewForm && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Write a Review</h3>
            <ReviewForm
              barberId={barberId}
              onSuccess={handleReviewSuccess}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div>
                  <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <input
                        key={value}
                        type="radio"
                        className="mask mask-star-2 bg-orange-400"
                        checked={review.rating === value}
                        readOnly
                      />
                    ))}
                  </div>
                  <p className="mt-2">{review.comment}</p>
                </div>
                <span className="text-sm text-neutral">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-neutral">
            No reviews yet
          </div>
        )}
      </div>
    </div>
  );
} 