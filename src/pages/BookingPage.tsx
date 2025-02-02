import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Branch, Service, Barber } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useBranches } from '../hooks/useBranches';
import { useServices } from '../hooks/useServices';
import { useBarbers } from '../hooks/useBarbers';
import { useAuth } from '../contexts/AuthContext';
import BranchSelectionStep from '../components/bookingPage/BranchSelectionStep';
import ServiceSelectionStep from '../components/bookingPage/ServiceSelectionStep';
import BarberSelectionStep from '../components/bookingPage/BarberSelectionStep';
import DateTimeSelectionStep from '../components/bookingPage/DateTimeSelectionStep';
import ConfirmationStep from '../components/bookingPage/ConfirmationStep';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { appointmentService } from '../services/appointment.service';
import { format } from 'date-fns';

type BookingStep = 'branch' | 'service' | 'barber' | 'datetime' | 'confirmation';

interface PendingAppointment {
  barberId: string;
  userId: string;
  serviceId: string;
  branchId: string;
  date: Date;
  price: number;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>('branch');
  
  // State for each step
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Fetch data using custom hooks
  const { branches, isLoading: branchesLoading, error: branchesError } = useBranches();
  const { services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { barbers, isLoading: barbersLoading, error: barbersError } = useBarbers();

  useEffect(() => {
    // Retrieve booking state from local storage
    const storedBookingState = localStorage.getItem('bookingState');
    if (storedBookingState) {
      const { selectedBranch, selectedService, selectedBarber, selectedDate, selectedTime } = JSON.parse(storedBookingState);
      setSelectedBranch(selectedBranch);
      setSelectedService(selectedService);
      setSelectedBarber(selectedBarber);
      setSelectedDate(selectedDate);
      setSelectedTime(selectedTime);
      
      // Clear booking state from local storage
      localStorage.removeItem('bookingState');
    }
  }, []);

  const handleNext = () => {
    const steps: BookingStep[] = ['branch', 'service', 'barber', 'datetime', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ['branch', 'service', 'barber', 'datetime', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleBookingConfirmation = async () => {
    if (!selectedBranch || !selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      throw new Error('Please select all required fields');
    }

    try {
      setIsSubmitting(true);

      // Check if user is authenticated first
      if (!currentUser) {
        // Save booking state to local storage
        const bookingState = {
          selectedBranch,
          selectedService,
          selectedBarber,
          selectedDate,
          selectedTime
        };
        localStorage.setItem('bookingState', JSON.stringify(bookingState));
        navigate('/login?redirect=/booking');
        return;
      }

      // Format the date and time properly
      const [hours, minutes] = selectedTime.split(':');
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      // Validate the date
      if (isNaN(appointmentDate.getTime())) {
        throw new Error('Invalid date or time selected');
      }
      
      // Create appointment only if user is authenticated
      const pendingAppointment: PendingAppointment = {
        barberId: selectedBarber.id,
        userId: currentUser.uid,
        serviceId: selectedService.id,
        branchId: selectedBranch.id,
        date: appointmentDate,
        price: selectedService.basePrice
      };

      const appointmentId = await appointmentService.createAppointment(pendingAppointment);

      // Navigate to success page with booking details
      navigate('/booking/success', {
        state: {
          id: appointmentId,
          branch: selectedBranch,
          service: selectedService,
          barber: selectedBarber,
          date: format(appointmentDate, 'yyyy-MM-dd'),
          time: format(appointmentDate, 'HH:mm')
        }
      });
    } catch (error) {
      console.error('Booking failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const isLoading = branchesLoading || servicesLoading || barbersLoading;
    const error = branchesError || servicesError || barbersError;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    switch (currentStep) {
      case 'branch':
        return (
          <BranchSelectionStep
            branches={branches}
            selectedBranchId={selectedBranch?.id || ''}
            onSelect={(branchId) => {
              const branch = branches.find(b => b.id === branchId);
              setSelectedBranch(branch || null);
            }}
          />
        );
      case 'service':
        return (
          <ServiceSelectionStep
            services={services}
            selectedServiceId={selectedService?.id || ''}
            onSelect={(serviceId) => {
              const service = services.find(s => s.id === serviceId);
              setSelectedService(service || null);
            }}
          />
        );
      case 'barber':
        return (
          <BarberSelectionStep
            barbers={barbers}
            selectedBarberId={selectedBarber?.id || ''}
            selectedBranchId={selectedBranch?.id || ''}
            onSelect={(barberId) => {
              const barber = barbers.find(b => b.id === barberId);
              setSelectedBarber(barber || null);
            }}
          />
        );
      case 'datetime':
        return (
          <DateTimeSelectionStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
          />
        );
      case 'confirmation':
        return selectedBranch && selectedService && selectedBarber ? (
          <ConfirmationStep
            branch={selectedBranch}
            service={selectedService}
            barber={selectedBarber}
            date={selectedDate}
            time={selectedTime}
          />
        ) : null;
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'branch':
        return !!selectedBranch;
      case 'service':
        return !!selectedService;
      case 'barber':
        return !!selectedBarber;
      case 'datetime':
        return !!selectedDate && !!selectedTime;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
        <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: theme.colors.text.primary }}
        >
          Book an Appointment
        </h1>
        <p 
          className="text-sm"
          style={{ color: theme.colors.text.secondary }}
        >
          select your branch, service, barber, date and time
        </p>
                </div>

      <AnimatePresence mode="wait" custom={currentStep}>
        <motion.div
          key={currentStep}
          custom={currentStep}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

          <div className="mt-8 flex justify-between">
        {currentStep !== 'branch' && (
              <button
            onClick={handleBack}
            className="px-6 py-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary
            }}
          >
            Back
              </button>
            )}
        {currentStep !== 'confirmation' && (
              <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-2 rounded-lg ml-auto ${
              !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
              >
                Next
              </button>
        )}
        {currentStep === 'confirmation' && (
              <button
            onClick={handleBookingConfirmation}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg ml-auto"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            )}
      </div>
    </div>
  );
} 