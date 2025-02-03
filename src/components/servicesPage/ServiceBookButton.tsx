// Import necessary dependencies
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import Button from '../common/Button'; // Custom Button component

// Define the props interface for the ServiceBookButton component
interface ServiceBookButtonProps {
  serviceId: string; // Unique identifier for the service
  fullWidth?: boolean; // Optional prop to make the button full width
  className?: string; // Optional CSS class name for additional styling
}

// Define the ServiceBookButton component
export default function ServiceBookButton({ 
  serviceId, 
  fullWidth = true, // Default value is true
  className = '' // Default value is an empty string
}: ServiceBookButtonProps) {
  // Use the useNavigate hook to get the navigation function
  const navigate = useNavigate();

  // Handler function for the button click event
  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent elements
    // Navigate to the booking page with the service ID as a query parameter
    navigate(`/booking?service=${serviceId}`);
  };

  // Render the Button component
  return (
    <Button
      variant="primary" // Set the button variant to primary
      fullWidth={fullWidth} // Pass the fullWidth prop
      onClick={handleBookNow} // Attach the click event handler
      className={className} // Pass any additional CSS classes
    >
      Book Now {/* Button text */}
    </Button>
  );
}
