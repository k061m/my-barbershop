import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface BarberBookButtonProps {
  barberId: string;
  fullWidth?: boolean;
  className?: string;
}

export default function BarberBookButton({ 
  barberId, 
  fullWidth = true,
  className = ''
}: BarberBookButtonProps) {
  const navigate = useNavigate();

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent onClick from firing
    navigate(`/booking?barber=${barberId}`);
  };

  return (
    <Button
      variant="primary"
      fullWidth={fullWidth}
      onClick={handleBookNow}
      className={className}
    >
      Book Now
    </Button>
  );
} 