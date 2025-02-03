// Import necessary dependencies
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

// Define the props interface for the component
interface BranchBookButtonProps {
  branchId: string;         // Unique identifier for the branch
  fullWidth?: boolean;      // Optional prop to make the button full width
  className?: string;       // Optional CSS class name for additional styling
}

// Define the BranchBookButton component
export default function BranchBookButton({ 
  branchId, 
  fullWidth = true,         // Default to full width if not specified
  className = ''            // Default to empty string if not provided
}: BranchBookButtonProps) {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Handler function for the button click event
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    // Navigate to the booking page with the branch ID as a query parameter
    navigate(`/booking?branch=${branchId}`);
  };

  // Render the button component
  return (
    <Button
      variant="primary"           // Use the primary button style
      fullWidth={fullWidth}       // Apply full width if specified
      onClick={handleBookNow}     // Attach the click handler
      className={className}       // Apply any additional CSS classes
    >
      Book at this Location        // Button text
    </Button>
  );
}
