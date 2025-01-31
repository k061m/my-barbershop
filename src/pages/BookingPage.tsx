import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// Hooks
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';

// Services
import { appointmentService } from '../services/appointment.service';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';
import BarberSelectionModal from '../components/booking/BarberSelectionModal';
import ServiceSelectionModal from '../components/booking/ServiceSelectionModal';
import DateTimeSelectionModal from '../components/booking/DateTimeSelectionModal';
import BookingSummary from '../components/booking/BookingSummary';
import BookingStep from '../components/booking/BookingStep';
import LoginModal from '../components/auth/LoginModal';

// Types
import { dateToTimestamp, Barber, Service } from '../types';

interface LocationState {
  from?: string;
  selectedBarberId?: string;
  selectedServiceId?: string;
}

type ModalType = 'barber' | 'service' | 'datetime' | 'login' | null;

const generateTimeSlots = (startTime: string, endTime: string): string[] => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const times: string[] = [];
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    times.push(timeString);
    
    currentMinute += 15;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute = 0;
    }
  }
  
  return times;
};

const getAvailableDates = (barber: Barber | undefined): Date[] => {
  if (!barber) return [];

  const dates: Date[] = [];
  const today = new Date();
  let currentDate = new Date();

  while (dates.length < 30) {
    const dayOfWeek = currentDate.getDay();
    if (barber.availability.workingDays.includes(dayOfWeek) && currentDate >= today) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const normalizeService = (service: Service): Service => ({
  ...service,
  id: service.id || '',
  image: service.image || '',
  createdAt: dateToTimestamp(new Date()),
  translations: {
    en: { 
      name: service.translations?.en?.name || '',
      description: service.translations?.en?.description || ''
    },
    de: { 
      name: service.translations?.de?.name || '',
      description: service.translations?.de?.description || ''
    },
    ar: { 
      name: service.translations?.ar?.name || '',
      description: service.translations?.ar?.description || ''
    }
  },
  basePrice: service.basePrice || 0,
  baseDuration: service.baseDuration || 0,
  durationUnit: service.durationUnit || 'minutes',
  category: service.category || 'general',
  skillLevel: service.skillLevel || 'junior',
  isActive: service.isActive ?? true
});

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { barbers, loading: loadingBarbers } = useBarbers();
  const { services, loading: loadingServices } = useServices();
  const { theme } = useTheme();
  
  const state = location.state as LocationState;

  const [selectedBarberId, setSelectedBarberId] = useState<string>(state?.selectedBarberId || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(state?.selectedServiceId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    if (state?.from === 'barbers' && state.selectedBarberId) {
      setSelectedBarberId(state.selectedBarberId);
    } else if (state?.from === 'services' && state.selectedServiceId) {
      setSelectedServiceId(state.selectedServiceId);
    }
  }, [state]);

  useEffect(() => {
    if (selectedDate && selectedBarberId) {
      const selectedBarber = barbers.find(b => b.id === selectedBarberId);
      if (!selectedBarber) return;

      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay();
      
      if (selectedBarber.availability.workingDays.includes(dayOfWeek)) {
        const times = generateTimeSlots(
          selectedBarber.availability.workingHours.start,
          selectedBarber.availability.workingHours.end
        );
        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
      }
    }
  }, [selectedDate, selectedBarberId, barbers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarberId || !selectedServiceId || !selectedDate || !selectedTime) {
      setError('Please complete all selections');
      return;
    }

    if (!currentUser) {
      setError('Please sign in to complete your booking');
      setActiveModal('login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      await appointmentService.createAppointment({
        userId: currentUser.uid,
        barberId: selectedBarberId,
        serviceId: selectedServiceId,
        date: dateTime,
        status: 'pending'
      });

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create appointment');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingBarbers || loadingServices) {
    return <LoadingSpinner />;
  }

  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId);

  const renderError = () => error && (
    <div className="p-4 rounded-lg flex items-center gap-3 mb-6" 
      style={{ backgroundColor: theme.colors.status.error, color: theme.colors.text.primary }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  );

  const renderBarberStep = () => (
    <BookingStep stepNumber={1} title="Choose Barber">
      {selectedBarber ? (
        <div className="flex items-center gap-4">
          <img
            src={selectedBarber.image}
            alt={`${selectedBarber.personalInfo.firstName} ${selectedBarber.personalInfo.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="font-medium" style={{ color: theme.colors.text.primary }}>
              {`${selectedBarber.personalInfo.firstName} ${selectedBarber.personalInfo.lastName}`}
            </p>
            <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
              {selectedBarber.translations.en.title}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setActiveModal('barber')}
          className="w-full py-3 rounded-lg transition-colors hover:opacity-90"
          style={{ 
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.primary
          }}
        >
          Select Barber
        </button>
      )}
    </BookingStep>
  );

  const renderServiceStep = () => (
    <BookingStep stepNumber={2} title="Choose Service">
      {selectedService ? (
        <div className="flex items-center gap-4">
          <img
            src={selectedService.image}
            alt={selectedService.translations.en.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium" style={{ color: theme.colors.text.primary }}>
              {selectedService.translations.en.name}
            </p>
            <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
              ${selectedService.basePrice}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setActiveModal('service')}
          className="w-full py-3 rounded-lg transition-colors hover:opacity-90"
          style={{ 
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.primary
          }}
        >
          Select Service
        </button>
      )}
    </BookingStep>
  );

  const renderDateTimeStep = () => (
    <BookingStep stepNumber={3} title="Choose Date & Time">
      {selectedDate && selectedTime ? (
        <div>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {new Date(selectedDate).toLocaleDateString()}
          </p>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {selectedTime}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setActiveModal('datetime')}
          className="w-full py-3 rounded-lg transition-colors hover:opacity-90"
          style={{ 
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.primary
          }}
        >
          Select Date & Time
        </button>
      )}
    </BookingStep>
  );

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.colors.text.primary }}>
          Book Your Appointment
        </h1>

        {renderError()}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {renderBarberStep()}
          {renderServiceStep()}
          {renderDateTimeStep()}
        </div>

        {selectedBarber && selectedService && selectedDate && selectedTime && (
          <BookingSummary
            barber={selectedBarber}
            service={normalizeService(selectedService)}
            date={selectedDate}
            time={selectedTime}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}

        {activeModal === 'barber' && (
          <BarberSelectionModal
            barbers={barbers}
            onSelect={(id) => {
              setSelectedBarberId(id);
              setActiveModal(null);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'service' && (
          <ServiceSelectionModal
            services={services}
            onSelect={(id) => {
              setSelectedServiceId(id);
              setActiveModal(null);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'datetime' && selectedBarberId && (
          <DateTimeSelectionModal
            availableDates={getAvailableDates(selectedBarber)}
            availableTimes={availableTimes}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onConfirm={() => setActiveModal(null)}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'login' && (
          <LoginModal
            isOpen={true}
            onSuccess={() => {
              setActiveModal(null);
              handleSubmit(new Event('submit', { cancelable: true }) as unknown as React.FormEvent);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    </div>
  );
} 