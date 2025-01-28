import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService, Review } from '../services/database.service';
import { Timestamp } from 'firebase/firestore';

interface ReviewFormProps {
  barberId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ barberId, onSuccess, onCancel }: ReviewFormProps) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      const review: Omit<Review, 'id'> = {
        userId: currentUser.uid,
        barberId,
        rating,
        comment: comment.trim(),
        date: Timestamp.now()
      };

      await dbService.addReview(review);
      onSuccess?.();
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Rating</span>
        </label>
        <div className="rating rating-lg">
          {[1, 2, 3, 4, 5].map((value) => (
            <input
              key={value}
              type="radio"
              name="rating"
              className="mask mask-star-2 bg-orange-400"
              checked={rating === value}
              onChange={() => setRating(value)}
            />
          ))}
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Your Review</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          Submit Review
        </button>
      </div>
    </form>
  );
} 