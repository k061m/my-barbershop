import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useBarbers } from '../hooks/useBarbers';
import BarberCard from '../components/barbers/BarberCard';
import { motion } from 'framer-motion';
import { 
  pageVariants, 
  sectionVariants, 
  cardVariants,
  transitions 
} from '../config/transitions';

export default function BarbersPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { barbers, isLoading } = useBarbers();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        <div 
          className="loading loading-spinner loading-lg"
          style={{ color: theme.colors.accent.primary }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ backgroundColor: theme.colors.background.primary }}
    >
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={sectionVariants}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        <motion.div 
          className="text-center mb-12"
          variants={sectionVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            Our Expert Barbers
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.colors.text.secondary }}
          >
            Meet our team of professional barbers dedicated to providing you with the best grooming experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers?.map((barber, index) => (
            <motion.div
              key={barber.id}
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ ...transitions.defaultTransition, delay: index * 0.1 }}
            >
              <BarberCard
                key={barber.id}
                barber={barber}
                onClick={() => navigate(`/booking?barber=${barber.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
} 
