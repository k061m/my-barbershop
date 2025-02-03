import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useServices } from '../../hooks/useServices';
import ServiceCard from './ServiceCard';
import { cardVariants, transitions } from '../../config/transitions';

export default function ServicesMenu() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { services } = useServices();


  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 
          className="text-4xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Services
        </h2>
        <button
          onClick={() => navigate('/services')}
          className="text-lg font-medium hover:opacity-80 transition-opacity"
          style={{ color: theme.colors.text.secondary }}
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
          {services?.slice(0, 8).map((service, index) => (
            <motion.div
              key={service.id}
              className="flex-none w-[300px]"
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ ...transitions.defaultTransition, delay: index * transitions.staggerChildren }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 