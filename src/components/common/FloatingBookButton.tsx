import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FloatingBookButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/booking');
  };

  return (
    <AnimatePresence>
      <motion.button
        onClick={handleClick}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 px-6 h-14 rounded-full bg-accent-primary text-text-inverse shadow-lg flex items-center justify-center gap-2 z-50 hover:bg-accent-hover transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
        <span className="font-medium text-sm whitespace-nowrap">Book Appointment</span>
      </motion.button>
    </AnimatePresence>
  );
} 