import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { reviewService } from '../../services/review.service';
import { Rating } from '../../types';

interface ReviewFormProps {
  barberId: string;
  serviceId: string;
  onSubmit?: () => void;
}

export default function ReviewForm({ barberId, serviceId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      await reviewService.createReview({
        userId: currentUser.uid,
        barberId,
        serviceId,
        rating: rating as Rating,
        comment,
        createdAt: new Date(),
      });
      setComment('');
      setRating(5);
      onSubmit?.();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.primary }}>
          Rating
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="select w-full"
          style={{ 
            backgroundColor: theme.colors.background.primary,
            color: theme.colors.text.primary
          }}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} star{value !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.primary }}>
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="textarea w-full"
          placeholder="Share your experience..."
          style={{ 
            backgroundColor: theme.colors.background.primary,
            color: theme.colors.text.primary
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !comment.trim()}
        className="btn w-full transition-colors hover:opacity-90 disabled:opacity-50"
        style={{ 
          backgroundColor: theme.colors.accent.primary,
          color: theme.colors.background.primary
        }}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
} 