import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Service } from '../../types/Service';

interface ServiceDetailsModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceDetailsModal({ service, isOpen, onClose }: ServiceDetailsModalProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const handleBookNow = () => {
    navigate('/booking', { state: { selectedService: service } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-background-card rounded-t-3xl overflow-hidden max-h-[90vh]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto h-full pb-24">
              {/* Service image */}
              <div className="relative h-64 w-full">
                <img
                  src={service.image}
                  alt={service.name[currentLanguage]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-card/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Title and Popular badge */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold text-text-primary">
                      {service.name[currentLanguage]}
                    </h2>
                    {service.isPopular && (
                      <span className="px-2 py-1 bg-accent-primary text-text-inverse rounded text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-text-secondary leading-relaxed">
                    {service.description[currentLanguage]}
                  </p>
                </div>

                {/* Additional Options */}
                {service.additionalOptions && service.additionalOptions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary">Additional Options</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {service.additionalOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Used */}
                {service.products && service.products.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary">Products Used</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {service.products.map((product, index) => (
                        <div key={index} className="flex items-center space-x-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed bottom bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-background-card border-t border-background-hover">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-accent-primary">
                    ${service.basePrice}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {service.baseDuration} {service.durationUnit}
                  </p>
                </div>
                <motion.button
                  onClick={handleBookNow}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-accent-primary text-text-inverse rounded-lg font-medium hover:bg-accent-hover transition-colors"
                >
                  BOOK NOW
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 