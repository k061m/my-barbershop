import { useTheme } from '../../contexts/ThemeContext';
import { Review } from '../../types/data.types';

interface ReviewCardProps {
  review: Review;
  userName: string;
  barberName: string;
}

export default function ReviewCard({ review, userName, barberName }: ReviewCardProps) {
  const { theme } = useTheme();

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold" style={{ color: theme.colors.text.primary }}>{userName}</h3>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>Review for {barberName}</p>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-semibold" style={{ color: theme.colors.accent.primary }}>
            {review.rating}/5
          </span>
        </div>
      </div>
      <p className="text-sm" style={{ color: theme.colors.text.primary }}>{review.comment}</p>
    </div>
  );
} 