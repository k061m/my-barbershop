import { useEffect, useState, useMemo, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, where, Timestamp, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';

interface Review {
  id: string;
  name: string;
  rating: number;
  service: string;
  date: Timestamp;
  image?: string; // Make image optional since it's not in Firestore
}

type SortOption = 'date' | 'rating';
type FilterOption = 'all' | number;

export default function ReviewsPage() {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterByRating, setFilterByRating] = useState<FilterOption>('all');
  const [selectedService, setSelectedService] = useState<string>('all');

  // Memoize query constraints
  const queryConstraints = useMemo(() => {
    const constraints: QueryConstraint[] = [
      orderBy(sortBy, 'desc'),
      limit(50)
    ];

    if (filterByRating !== 'all') {
      constraints.push(where('rating', '==', Number(filterByRating)));
    }

    if (selectedService !== 'all') {
      constraints.push(where('service', '==', selectedService));
    }

    return constraints;
  }, [sortBy, filterByRating, selectedService]);

  // Memoize fetch function
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const reviewsQuery = query(collection(db, 'reviews'), ...queryConstraints);
      const querySnapshot = await getDocs(reviewsQuery);
      
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];

      setReviews(reviewsData);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews');
      if (import.meta.env.DEV) {
        console.error('Error in fetchReviews:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [queryConstraints]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Memoize computed values
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const reviewStats = useMemo(() => ({
    totalReviews: reviews.length,
    averageRating,
    ratingDistribution: reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  }), [reviews, averageRating]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="loading loading-spinner loading-lg" 
          style={{ color: theme.colors.accent.primary }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="text-center p-4" style={{ color: theme.colors.status.error }}>
          {error}
          <button
            onClick={fetchReviews}
            className="block mt-4 underline"
            style={{ color: theme.colors.accent.primary }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              Customer Reviews
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-400 text-xl">{'★'.repeat(Math.round(Number(reviewStats.averageRating)))}</span>
              <span style={{ color: theme.colors.text.secondary }}>
                {reviewStats.averageRating} average based on {reviewStats.totalReviews} reviews
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.background.card,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.text.secondary}`
              }}
            >
              <option value="date">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Rating Filter */}
            <select
              value={filterByRating}
              onChange={(e) => setFilterByRating(e.target.value as FilterOption)}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.background.card,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.text.secondary}`
              }}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars ({reviewStats.ratingDistribution[5] || 0})</option>
              <option value="4">4 Stars ({reviewStats.ratingDistribution[4] || 0})</option>
              <option value="3">3 Stars ({reviewStats.ratingDistribution[3] || 0})</option>
              <option value="2">2 Stars ({reviewStats.ratingDistribution[2] || 0})</option>
              <option value="1">1 Star ({reviewStats.ratingDistribution[1] || 0})</option>
            </select>

            {/* Service Filter */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.background.card,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.text.secondary}`
              }}
            >
              <option value="all">All Services</option>
              {Array.from(new Set(reviews.map(review => review.service))).map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>

        {reviews.length === 0 ? (
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
            {reviews.map(review => (
              <div 
                key={review.id}
                className="bg-opacity-40 rounded-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-105"
                style={{ backgroundColor: theme.colors.background.card }}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl" style={{ color: theme.colors.text.primary }}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 
                        className="font-semibold"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {review.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                        <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: theme.colors.accent.primary }}>
                      {review.service}
                    </span>
                    <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                      {review.date.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 