// Import necessary dependencies
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Barber } from '../../types/barber.types';
import StarRating from '../common/StarRating';

// Define the props interface for the component
interface BarberDetailsModalProps {
  barber: Barber;
  isOpen: boolean;
  onClose: () => void;
}

// Define the main component
export default function BarberDetailsModal({ barber, isOpen, onClose }: BarberDetailsModalProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  // Function to handle booking action
  const handleBookNow = () => {
    navigate('/booking', { state: { selectedBarber: barber } });
  };

  // Function to format working days into a readable string
  const formatWorkingDays = (days: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => dayNames[day]).join(', ');
  };

  // Function to format services into a readable string
  const getServicesList = (serviceIds: string[]) => {
    return serviceIds.join(', ');
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
              {/* Barber image */}
              <div className="relative h-64 w-full">
                <img
                  src={barber.image}
                  alt={`${barber.firstName} ${barber.lastName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-card/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Title and Rating */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-text-primary">
                      {barber.title[currentLanguage]} {barber.firstName} {barber.lastName}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={barber.rating} size="md" />
                      <span className="font-bold text-accent-primary">
                        ({barber.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <p className="text-text-secondary leading-relaxed">
                    {barber.bio[currentLanguage]}
                  </p>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-text-primary">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-text-secondary">Email</p>
                      <p className="text-text-primary">{barber.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-text-secondary">Phone</p>
                      <p className="text-text-primary">{barber.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-text-secondary">Employee ID</p>
                      <p className="text-text-primary">{barber.employeeId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-text-secondary">Gender</p>
                      <p className="text-text-primary">{barber.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                {barber.languages.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {barber.languages.map((language, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-background-hover text-text-secondary rounded-full text-sm"
                        >
                          {language.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {barber.specialties.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary">Specialties</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {barber.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center space-x-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {barber.certifications?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary">Certifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {barber.certifications.map((certification, index) => (
                        <div key={index} className="flex items-center space-x-2 text-text-secondary">
                          <svg className="w-5 h-5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{certification}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Working Hours */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-text-primary">Working Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-text-secondary">Days</p>
                      <p className="text-text-primary">{formatWorkingDays(barber.workingDays)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-text-secondary">Hours</p>
                      <p className="text-text-primary">
                        {barber.workingHours[0]?.start} - {barber.workingHours[0]?.end}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-text-primary">Services</h3>
                  <p className="text-text-secondary">
                    {getServicesList(barber.services)}
                  </p>
                </div>
              </div>
            </div>

            {/* Fixed bottom bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-background-card border-t border-background-hover">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary">Experience</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {barber.experienceYears} years
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
