import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Service } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceBookButton from './ServiceBookButton';

interface ServiceDetailsModalProps {
  service: Service;
  onClose: () => void;
  isOpen: boolean;
}

export default function ServiceDetailsModal({ service, onClose, isOpen }: ServiceDetailsModalProps) {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
            style={{ backgroundColor: theme.colors.background.card }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-10"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-6">
                <img 
                  src={service.image} 
                  alt={service.name[currentLanguage]}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                    {service.name[currentLanguage]}
                  </h2>
                  {service.isPopular && (
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: theme.colors.accent.primary,
                        color: theme.colors.background.primary
                      }}
                    >
                      Popular
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: theme.colors.accent.primary }}
                    >
                      ${service.basePrice}
                    </span>
                    <span style={{ color: theme.colors.text.secondary }}>
                      • {service.baseDuration} {service.durationUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
                  Description
                </h3>
                <p className="text-lg" style={{ color: theme.colors.text.secondary }}>
                  {service.description[currentLanguage]}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Service Details
                  </h3>
                  <div className="space-y-2">
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Category:</span> {service.category}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Duration:</span> {service.baseDuration} {service.durationUnit}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Skill Level Required:</span> {service.skillLevel}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Status:</span> {service.isActive ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>

                {/* Additional Options */}
                {service.additionalOptions && service.additionalOptions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                      Additional Options
                    </h3>
                    <div className="space-y-2">
                      {service.additionalOptions.map((option, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: theme.colors.background.secondary }}
                        >
                          <p style={{ color: theme.colors.text.primary }}>
                            {option}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Used */}
                {service.products && service.products.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                      Products Used
                    </h3>
                    <ul className="list-disc list-inside" style={{ color: theme.colors.text.secondary }}>
                      {service.products.map((product, index) => (
                        <li key={index}>{product}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <div className="flex justify-center pt-4">
                <ServiceBookButton 
                  serviceId={service.id} 
                  fullWidth={false} 
                  className="px-8 py-3 text-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 