import { motion, AnimatePresence } from 'framer-motion'; // Importing animation components from Framer Motion
import { useNavigate } from 'react-router-dom'; // Importing navigation hook from React Router
import { Branch } from '../../types'; // Importing the Branch type definition for type safety

// Defining the props for the BranchDetailsModal component
interface BranchDetailsModalProps {
  branch: Branch; // The branch object containing details like name, image, etc.
  isOpen: boolean; // A boolean to determine if the modal is open
  onClose: () => void; // A callback function to handle closing the modal
}

// The main functional component for displaying branch details in a modal
export default function BranchDetailsModal({ branch, isOpen, onClose }: BranchDetailsModalProps) {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // Function to handle the "Book Now" action
  const handleBookNow = () => {
    navigate('/booking', { state: { selectedBranch: branch } }); 
    // Navigates to the booking page and passes the selected branch as state
  };

  return (
    <AnimatePresence>
      {/* AnimatePresence handles mounting/unmounting animations for conditional rendering */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} // Initial state of the backdrop (completely transparent)
            animate={{ opacity: 1 }} // Animation state when the modal is open (fully visible)
            exit={{ opacity: 0 }} // Exit animation when the modal closes (fade out)
            onClick={onClose} // Clicking on the backdrop will close the modal
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            // Styling for a semi-transparent black backdrop with a blur effect
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }} 
            // Initial state of the modal (hidden and positioned off-screen at the bottom)
            animate={{ opacity: 1, y: 0 }} 
            // Animation state when the modal is open (fully visible and positioned at the bottom of the viewport)
            exit={{ opacity: 0, y: '100%' }} 
            // Exit animation when closing (fade out and slide down)
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            // Smooth spring-based animation for natural movement
            className="fixed bottom-0 inset-x-0 z-50 bg-background-card rounded-t-3xl overflow-hidden max-h-[90vh]"
            // Styling for a bottom-aligned modal with rounded top corners and a max height of 90% of the viewport
          >
            {/* Close button */}
            <button
              onClick={onClose} 
              // Clicking this button will trigger the `onClose` callback to close the modal
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
              // Styling for a close button positioned at the top-right corner with hover effects
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* SVG icon for a close (X) symbol */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto h-full pb-24">
              {/* Ensures that content inside the modal is scrollable if it exceeds available height */}
              
              {/* Branch image */}
              <div className="relative h-64 w-full">
                {/* Container for displaying an image with a fixed height */}
                <img
                  src={branch.image} 
                  // Displays the image of the branch passed as a prop
                  alt={branch.name} 
                  // Alt text for accessibility using the branch name
                  className="w-full h-full object-cover"
                  // Ensures that the image covers its container without distortion
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-card/80 to-transparent" />
                {/* Gradient overlay on top of the image for better text readability */}
              </div>


{/* Content */}
<div className="p-6 space-y-8">
  {/* Title and Rating badge */}
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {/* Branch name */}
      <h2 className="text-3xl font-bold text-text-primary">
        {branch.name}
      </h2>
      {/* Conditional "Top Rated" badge for high ratings */}
      {branch.rating >= 4.5 && (
        <span className="px-2 py-1 bg-accent-primary text-text-inverse rounded text-xs font-medium">
          Top Rated
        </span>
      )}
    </div>
  </div>

  {/* Address */}
  <div className="space-y-2">
    <p className="text-text-secondary leading-relaxed">
      {branch.address.street}, {branch.address.city}, {branch.address.state} {branch.address.zipCode}
    </p>
  </div>

  {/* Contact Information */}
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-text-primary">Contact Information</h3>
    <div className="grid grid-cols-2 gap-4">
      {/* Phone number (if available) */}
      {branch.phone && (
        <div className="flex items-center space-x-2 text-text-secondary">
          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{branch.phone}</span>
        </div>
      )}
      {/* Email (if available) */}
      {branch.email && (
        <div className="flex items-center space-x-2 text-text-secondary">
          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{branch.email}</span>
        </div>
      )}
    </div>
  </div>

  {/* Working Hours */}
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-text-primary">Working Hours</h3>
    <div className="grid grid-cols-2 gap-4">
      {/* Map through working hours for each day */}
      {Object.entries(branch.workingHours).map(([day, hours]) => (
        <div key={day} className="flex items-center space-x-2 text-text-secondary">
          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="capitalize">{day}: {hours.open} - {hours.close}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Facilities (if available) */}
  {branch.facilities.length > 0 && (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-text-primary">Facilities</h3>
      <div className="grid grid-cols-2 gap-4">
        {branch.facilities.map((facility, index) => (
          <div key={index} className="flex items-center space-x-2 text-text-secondary">
            <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{facility}</span>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Services (if available) */}
  {branch.services.length > 0 && (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-text-primary">Available Services</h3>
      <div className="grid grid-cols-2 gap-4">
        {branch.services.map((service, index) => (
          <div key={index} className="flex items-center space-x-2 text-text-secondary">
            <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{service}</span>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

{/* Fixed bottom bar */}
<div className="absolute bottom-0 inset-x-0 p-4 bg-background-card border-t border-background-hover">
  <div className="flex items-center justify-between">
    {/* Rating and review count */}
    <div className="space-y-1">
      <div className="flex items-center space-x-1">
        <svg className="w-5 h-5 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-lg font-semibold text-text-primary">
          {branch.rating.toFixed(1)}
        </span>
      </div>
      <p className="text-sm text-text-secondary">
        {branch.reviews} reviews
      </p>
    </div>
    {/* Book Now button with animation */}
    <motion.button
      onClick={handleBookNow}
      whileTap={{ scale: 0.98 }}
      className="px-8 py-3 bg-accent-primary text-text-inverse rounded-lg font-medium hover:bg-accent-hover transition-colors"
    >
      BOOK NOW
    </motion.button>
  </div>
</div>
