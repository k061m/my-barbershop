import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface ServiceBookButtonProps {
  serviceId: string;
  fullWidth?: boolean;
  className?: string;
}

export default function ServiceBookButton({ 
  serviceId, 
  fullWidth = true,
  className = ''
}: ServiceBookButtonProps) {
  const navigate = useNavigate();

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent onClick from firing
    navigate(`/booking?service=${serviceId}`);
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