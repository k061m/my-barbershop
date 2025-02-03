// Import necessary dependencies
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { fadeInVariants } from '../../config/transitions';
import { FaChevronLeft } from 'react-icons/fa';

export default function BackArrow() {
  // Hook to programmatically navigate
  const navigate = useNavigate();
  // Hook to get current location
  const location = useLocation();
  // Custom hook to access theme context
  const { theme } = useTheme();

  // Hide the back arrow on the homepage
  if (location.pathname === '/') return null;

  return (
    // Use Framer Motion for animations
    <motion.button
      // Navigate back when clicked
      onClick={() => navigate(-1)}
      // Styling classes
      className="fixed top-6 left-6 p-2 rounded-full hover:opacity-80 z-50"
      // Animation variants from config
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      // Inline style for dynamic theming
      style={{ color: theme.colors.text.primary }}
    >
      {/* Chevron left icon */}
      <FaChevronLeft />
    </motion.button>
  );
}
