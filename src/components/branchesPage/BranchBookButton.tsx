import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface BranchBookButtonProps {
  branchId: string;
  fullWidth?: boolean;
  className?: string;
}

export default function BranchBookButton({ 
  branchId, 
  fullWidth = true,
  className = ''
}: BranchBookButtonProps) {
  const navigate = useNavigate();

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent onClick from firing
    navigate(`/booking?branch=${branchId}`);
  };

  return (
    <Button
      variant="primary"
      fullWidth={fullWidth}
      onClick={handleBookNow}
      className={className}
    >
      Book at this Location
    </Button>
  );
} 