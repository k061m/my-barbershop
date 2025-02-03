// Import necessary dependencies and components
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useReviews } from '../../hooks/useReviews';
import ReviewCard from './ReviewCard';
import { cardVariants, transitions } from '../../config/transitions';

export default function ReviewsMenu() {
  // Hook to programmatically navigate
  const navigate = useNavigate();
  // Hook to access the current theme
  const { theme } = useTheme();
  // Custom hook to fetch reviews, limiting to 10
  const { reviews, isLoading } = useReviews(10);

  // Display a loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded mb-8"></div>
        <div className="flex gap-6 overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-none w-[300px]">
              <div className="h-32 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="w-full">
      {/* Header section with title, review count, and "View All" button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h2 
            className="text-4xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            All reviews
          </h2>
          <span 
            className="text-xl"
            style={{ color: theme.colors.text.secondary }}
          >
            ({reviews.length})
          </span>
        </div>
        <button
          onClick={() => navigate('/reviews')}
          className="text-lg font-medium hover:opacity-80 transition-opacity"
          style={{ color: theme.colors.text.secondary }}
        >
          View All
        </button>
      </div>

      {/* Horizontally scrollable review cards container */}
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
          {/* Map through reviews and render ReviewCard components */}
          {reviews?.slice(0, 8).map((review, index) => (
            <motion.div
              key={review.id}
              className="flex-none w-[300px]"
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ ...transitions.defaultTransition, delay: index * transitions.staggerChildren }}
            >
              <ReviewCard 
                review={review} 
                userName={review.userName}
                barberName={review.barberName}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
