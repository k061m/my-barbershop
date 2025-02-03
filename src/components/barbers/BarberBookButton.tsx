// Import necessary dependencies
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

// Define the props interface for the component
interface BarberBookButtonProps {
  barberId: string;         // Unique identifier for the barber
  fullWidth?: boolean;      // Optional prop to make the button full width
  className?: string;       // Optional CSS class name for additional styling
}

// Define the BarberBookButton component
export default function BarberBookButton({ 
  barberId, 
  fullWidth = true,         // Default to full width if not specified
  className = ''            // Default to empty string if not provided
}: BarberBookButtonProps) {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Handler function for the button click event
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    // Navigate to the booking page with the barber ID as a query parameter
    navigate(`/booking?barber=${barberId}`);
  };

  // Render the button component
  return (
    <Button
      variant="primary"           // Use the primary style variant
      fullWidth={fullWidth}       // Apply full width if specified
      onClick={handleBookNow}     // Attach the click handler
      className={className}       // Apply any additional CSS classes
    >
      Book Now
    </Button>
  );
}
