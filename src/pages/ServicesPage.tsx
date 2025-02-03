import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useServices } from '../hooks/useServices';
import ServiceCard from '../components/servicesPage/ServiceCard';
import { motion } from 'framer-motion';
import { 
  pageVariants, 
  sectionVariants, 
  cardVariants,
  transitions 
} from '../config/transitions';

export default function ServicesPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { services, isLoading } = useServices();

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
            Our Services
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.colors.text.secondary }}
          >
            Discover our range of professional grooming services designed to keep you looking your best.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service, index) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ ...transitions.defaultTransition, delay: index * 0.1 }}
            >
              <ServiceCard
                service={service}
                onClick={() => navigate(`/booking?service=${service.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
} 
