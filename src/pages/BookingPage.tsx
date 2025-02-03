import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { 
  pageVariants, 
  sectionVariants, 
  cardVariants,
  transitions 
} from '../config/transitions';

type BookingStep = 'branch' | 'service' | 'barber' | 'datetime' | 'confirmation';

interface PendingAppointment {
  barberId: string;
  userId: string;
  serviceId: string;
  branchId: string;
  date: Date;
  price: number;
  duration: number;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [currentStep, setCurrentStep] = useState<BookingStep>('branch');
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data using custom hooks
  const { branches, isLoading: branchesLoading, error: branchesError } = useBranches();
  const { services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { barbers, isLoading: barbersLoading, error: barbersError } = useBarbers();

  useEffect(() => {
    if (!branches.length || !services.length) return;

    // Handle service pre-selection from URL
    const serviceId = searchParams.get('service');
    if (serviceId && !selectedService) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        // Find branches that offer this service
        const availableBranches = branches.filter(branch => 
          branch.services.includes(serviceId)
        );
        
        // If only one branch offers the service, select it automatically
        if (availableBranches.length === 1) {
          setSelectedBranch(availableBranches[0]);
          setCurrentStep('barber');
        } else {
          setCurrentStep('branch');
        }
      }
    }

    // Handle branch pre-selection from URL
    const branchId = searchParams.get('branch');
    if (branchId && !selectedBranch) {
      const branch = branches.find(b => b.id === branchId);
      if (branch) {
        setSelectedBranch(branch);
        if (!selectedService) {
          setCurrentStep('service');
        } else {
          setCurrentStep('barber');
        }
      }
    }

    // Handle barber pre-selection from URL
    const barberId = searchParams.get('barber');
    if (barberId && !selectedBarber && barbers.length > 0) {
      const barber = barbers.find(b => b.id === barberId);
      if (barber) {
        setSelectedBarber(barber);
        // If the barber works at only one branch, select it automatically
        if (barber.branches?.length === 1) {
          const branch = branches.find(b => b.id === barber.branches[0]);
          if (branch) {
            setSelectedBranch(branch);
            setCurrentStep('service');
          }
        } else {
          setCurrentStep('branch');
        }
      }
    }

    // Retrieve booking state from local storage
    const storedBookingState = localStorage.getItem('bookingState');
    if (storedBookingState) {
      const { selectedBranch, selectedService, selectedBarber, selectedDate } = JSON.parse(storedBookingState);
      setSelectedBranch(selectedBranch);
      setSelectedService(selectedService);
      setSelectedBarber(selectedBarber);
      setSelectedDateTime(new Date(selectedDate));
      
      // Clear booking state from local storage
      localStorage.removeItem('bookingState');
    }
  }, [searchParams, branches, services, barbers, selectedBranch, selectedService, selectedBarber]);

  // Filter branches based on selected service
  const availableBranches = selectedService
    ? branches.filter(branch => branch.services.includes(selectedService.id))
    : branches;

  const handleStepChange = (newStep: BookingStep, dir: number) => {
    setDirection(dir);
    setCurrentStep(newStep);
  };

  const goToNextStep = () => {
    const steps: BookingStep[] = ['branch', 'service', 'barber', 'datetime', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      handleStepChange(steps[currentIndex + 1], 1);
    }
  };

  const goToPreviousStep = () => {
    const steps: BookingStep[] = ['branch', 'service', 'barber', 'datetime', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      handleStepChange(steps[currentIndex - 1], -1);
    }
  };

  const handleBookingConfirmation = async () => {
    if (!selectedBranch || !selectedService || !selectedBarber || !selectedDateTime) {
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
          selectedDate: selectedDateTime.toISOString().split('T')[0],
          selectedTime: selectedDateTime.toISOString().split('T')[1]
        };
        localStorage.setItem('bookingState', JSON.stringify(bookingState));
        navigate('/login?redirect=/booking');
        return;
      }

      // Format the date and time properly
      const [hours, minutes] = selectedDateTime.toISOString().split('T')[1].split(':');
      const appointmentDate = new Date(selectedDateTime);
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
        price: selectedService.basePrice,
        duration: selectedService.baseDuration
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
            branches={availableBranches}
            selectedBranchId={selectedBranch?.id || ''}
            onSelect={(branchId) => {
              const branch = branches.find(b => b.id === branchId);
              setSelectedBranch(branch || null);
              // If service is already selected, go to barber selection
              if (selectedService) {
                setCurrentStep('barber');
              } else {
                // Reset subsequent selections when branch changes
                setSelectedService(null);
                setSelectedBarber(null);
                setSelectedDateTime(null);
              }
            }}
          />
        );
      case 'service':
        return (
          <ServiceSelectionStep
            services={services}
            selectedServiceId={selectedService?.id || ''}
            selectedBranchId={selectedBranch?.id || ''}
            branches={branches}
            onSelect={(serviceId) => {
              const service = services.find(s => s.id === serviceId);
              setSelectedService(service || null);
              // Reset subsequent selections when service changes
              setSelectedBarber(null);
              setSelectedDateTime(null);
            }}
          />
        );
      case 'barber':
        return (
          <BarberSelectionStep
            barbers={barbers}
            selectedBarberId={selectedBarber?.id || ''}
            selectedBranchId={selectedBranch?.id || ''}
            selectedServiceId={selectedService?.id || ''}
            onSelect={(barberId) => {
              const barber = barbers.find(b => b.id === barberId);
              setSelectedBarber(barber || null);
              // Reset time selections when barber changes
              setSelectedDateTime(null);
            }}
          />
        );
      case 'datetime':
        return selectedBranch && selectedBarber && selectedService ? (
          <DateTimeSelectionStep
            selectedDate={selectedDateTime ? format(selectedDateTime, 'yyyy-MM-dd') : ''}
            selectedTime={selectedDateTime ? format(selectedDateTime, 'HH:mm') : ''}
            branchId={selectedBranch.id}
            barberId={selectedBarber.id}
            serviceDuration={selectedService.baseDuration}
            onSelectDate={(date) => {
              const newDateTime = selectedDateTime || new Date();
              newDateTime.setFullYear(new Date(date).getFullYear());
              newDateTime.setMonth(new Date(date).getMonth());
              newDateTime.setDate(new Date(date).getDate());
              setSelectedDateTime(newDateTime);
            }}
            onSelectTime={(time) => {
              const [hours, minutes] = time.split(':');
              const newDateTime = selectedDateTime || new Date();
              newDateTime.setHours(parseInt(hours), parseInt(minutes));
              setSelectedDateTime(newDateTime);
            }}
          />
        ) : null;
      case 'confirmation':
        return selectedBranch && selectedService && selectedBarber ? (
          <ConfirmationStep
            branch={selectedBranch}
            service={selectedService}
            barber={selectedBarber}
            date={selectedDateTime ? format(selectedDateTime, 'yyyy-MM-dd') : ''}
            time={selectedDateTime ? format(selectedDateTime, 'HH:mm') : ''}
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
        return !!selectedDateTime;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  // Step transition variants
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        ...transitions.defaultTransition,
        duration: 1.2
      }
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        ...transitions.defaultTransition,
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        ...transitions.defaultTransition,
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  };

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
        className="max-w-3xl mx-auto"
        variants={sectionVariants}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
      >
        {/* Header Section */}
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
            Book Your Appointment
          </h1>
          <p 
            className="text-lg"
            style={{ color: theme.colors.text.secondary }}
          >
            Follow the steps below to schedule your appointment
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="mb-8"
          variants={cardVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {/* ... existing progress steps code ... */}
        </motion.div>

        {/* Step Content */}
        <motion.div
          className="relative"
          style={{ minHeight: '400px' }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          className="flex justify-between mt-8"
          variants={cardVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {currentStep !== 'branch' && (
            <button
              onClick={goToPreviousStep}
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
              onClick={goToNextStep}
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 