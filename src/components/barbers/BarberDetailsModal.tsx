import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Barber } from '../../types';
import StarRating from '../common/StarRating';
import { useServices } from '../../hooks/useServices';
import { motion, AnimatePresence } from 'framer-motion';

interface BarberDetailsModalProps {
  barber: Barber;
  onClose: () => void;
  isOpen: boolean;
}

export default function BarberDetailsModal({ barber, onClose, isOpen }: BarberDetailsModalProps) {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const { services } = useServices();

  const formatWorkingDays = (days: number[]) => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => dayNames[day - 1]).join(', ');
  };

  const getServicesList = (servicePaths: string[]) => {
    if (!services || services.length === 0) return 'No services available';
    
    return servicePaths
      .map(path => {
        const serviceId = path.split('/').pop();
        if (!serviceId) return null;
        
        const service = services.find(s => s.id === serviceId);
        if (!service) return null;
        
        return `${service.name[currentLanguage]} ($${service.basePrice})`;
      })
      .filter(Boolean)
      .join(' • ');
  };

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
                  src={barber.image} 
                  alt={`${barber.firstName} ${barber.lastName}`}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                    {`${barber.firstName} ${barber.lastName}`}
                  </h2>
                  <p className="text-xl" style={{ color: theme.colors.text.secondary }}>
                    {barber.title[currentLanguage]}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={barber.rating} size="md" />
                    <span style={{ color: theme.colors.text.secondary }}>
                      ({barber.rating})
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
                  About
                </h3>
                <p className="text-lg" style={{ color: theme.colors.text.secondary }}>
                  {barber.bio[currentLanguage]}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Email:</span> {barber.email}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Phone:</span> {barber.phone}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Employee ID:</span> {barber.employeeId}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Experience:</span> {barber.experienceYears} years
                    </p>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Professional Information
                  </h3>
                  <div className="space-y-2">
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Languages:</span> {barber.languages.join(', ').toUpperCase()}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Certifications:</span> {barber.certifications.join(', ')}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Specialties:</span> {barber.specialties.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Availability
                  </h3>
                  <div className="space-y-2">
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Working Days:</span> {formatWorkingDays(barber.workingDays)}
                    </p>
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Working Hours:</span>
                    </p>
                    <ul className="list-disc list-inside" style={{ color: theme.colors.text.secondary }}>
                      {barber.workingHours.map((timeRange, index) => (
                        <li key={index}>
                          {timeRange.start} - {timeRange.end}
                        </li>
                      ))}
                    </ul>
                    <div style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Break Times:</span>
                      <ul className="list-disc list-inside ml-4">
                        {barber.breaks.map((breakTime, index) => (
                          <li key={index}>{breakTime.start} - {breakTime.end}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Services
                  </h3>
                  <p style={{ color: theme.colors.text.secondary }}>
                    {getServicesList(barber.services)}
                  </p>
                </div>
              </div>

              {/* Book Now Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    onClose();
                    // Add navigation to booking page
                  }}
                  className="px-8 py-3 rounded-lg font-medium text-lg transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.primary
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 