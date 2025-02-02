import { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { reviewService } from '../services/review.service';
import type { Review } from '../types';
import ReviewCard from '../components/reviewsPage/ReviewCard';

export default function ReviewsPage() {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAll();
      setReviews(data);
      setError(null);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / total || 0;
    const services = [...new Set(reviews.map(review => review.serviceId))];
    
    return {
      total,
      avgRating: avgRating.toFixed(1),
      services
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Apply filters
    if (selectedRating !== 'all') {
      result = result.filter(review => review.rating === selectedRating);
    }
    if (selectedService !== 'all') {
      result = result.filter(review => review.serviceId === selectedService);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.rating - a.rating;
    });

    return result;
  }, [reviews, selectedRating, selectedService, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" 
          style={{ borderColor: theme.colors.accent.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            Customer Reviews
          </h1>
          {stats.total > 0 && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-400 text-2xl">{'★'.repeat(Math.round(Number(stats.avgRating)))}</span>
              <span style={{ color: theme.colors.text.secondary }}>
                {stats.avgRating} average from {stats.total} reviews
              </span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            className="px-4 py-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border.primary}`
            }}
          >
            <option value="date">Most Recent</option>
            <option value="rating">Highest Rated</option>
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-4 py-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border.primary}`
            }}
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-4 py-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border.primary}`
            }}
          >
            <option value="all">All Services</option>
            {stats.services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Error State */}
        {error && (
          <div 
            className="text-center p-4 rounded-lg mb-8"
            style={{ backgroundColor: theme.colors.status.error, color: 'white' }}
          >
            {error}
            <button
              onClick={loadReviews}
              className="ml-4 px-4 py-1 rounded-lg bg-white text-red-600 hover:bg-gray-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div 
            className="text-center py-12 rounded-lg"
            style={{ backgroundColor: theme.colors.background.card }}
          >
            <p style={{ color: theme.colors.text.secondary }}>
              No reviews found with the selected filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map(review => (
                <ReviewCard 
                key={review.id} 
                review={review}
                userName={review.userName}
                barberName={review.barberName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 