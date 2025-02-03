// Import necessary dependencies and components
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useBarbers } from '../../hooks/useBarbers';
import BarberCard from './BarberCard';
import { cardVariants, transitions } from '../../config/transitions';

export default function BarbersMenu() {
  // Hook to programmatically navigate
  const navigate = useNavigate();
  // Hook to access the current theme
  const { theme } = useTheme();
  // Custom hook to fetch barbers data
  const { barbers } = useBarbers();

  return (
    <div className="w-full">
      {/* Header section with title and "View All" button */}
      <div className="flex justify-between items-center mb-8">
        <h2 
          className="text-4xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Popular artist
        </h2>
        <button
          onClick={() => navigate('/barbers')}
          className="text-lg font-medium hover:opacity-80 transition-opacity"
          style={{ color: theme.colors.text.secondary }}
        >
          View All
        </button>
      </div>

      {/* Scrollable container for barber cards */}
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
          {/* Map through the first 8 barbers and render BarberCard components */}
          {barbers?.slice(0, 8).map((barber, index) => (
            // Wrap each BarberCard in a motion.div for animations
            <motion.div
              key={barber.id}
              className="flex-none w-[300px]"
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ ...transitions.defaultTransition, delay: index * transitions.staggerChildren }}
            >
              <BarberCard barber={barber} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
