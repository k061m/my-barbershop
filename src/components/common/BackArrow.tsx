import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { fadeInVariants } from '../../config/transitions';
import { FaChevronLeft } from 'react-icons/fa';

export default function BackArrow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // Hide on homepage
  if (location.pathname === '/') return null;

  return (
    <motion.button
      onClick={() => navigate(-1)}
      className="fixed top-6 left-6 p-2 rounded-full hover:opacity-80 z-50"
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      style={{ color: theme.colors.text.primary }}
    >
      <FaChevronLeft />
    </motion.button>
  );
} 