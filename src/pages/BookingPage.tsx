import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BarberSelectionModal from '../components/booking/BarberSelectionModal';
import ServiceSelectionModal from '../components/booking/ServiceSelectionModal';
import DateTimeSelectionModal from '../components/booking/DateTimeSelectionModal';
import BookingSummary from '../components/booking/BookingSummary';
import BookingStep from '../components/booking/BookingStep';
import LoginModal from '../components/auth/LoginModal';

interface LocationState {
  from?: string;
  selectedBarberId?: string;
  selectedServiceId?: string;
}

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
  const [activeModal, setActiveModal] = useState<'barber' | 'service' | 'datetime' | 'login' | null>(null);

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
      
      if (selectedBarber.workingDays.includes(dayOfWeek)) {
        const [startHour, startMinute] = selectedBarber.workingHours.start.split(':').map(Number);
        const [endHour, endMinute] = selectedBarber.workingHours.end.split(':').map(Number);
        
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
        
        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
      }
    }
  }, [selectedDate, selectedBarberId, barbers]);

  const getAvailableDates = () => {
    const selectedBarber = barbers.find(b => b.id === selectedBarberId);
    if (!selectedBarber) return [];

    const dates: Date[] = [];
    const today = new Date();
    let currentDate = new Date();

    while (dates.length < 30) {
      const dayOfWeek = currentDate.getDay();
      if (selectedBarber.workingDays.includes(dayOfWeek) && currentDate >= today) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

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
      await createAppointment();
    } catch (error) {
      setError('Failed to create appointment');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async () => {
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    await appointmentService.createAppointment({
      userId: currentUser!.uid,
      barberId: selectedBarberId,
      serviceId: selectedServiceId,
      date: dateTime,
      status: 'pending'
    });

    navigate('/dashboard');
  };

  if (loadingBarbers || loadingServices) {
    return <LoadingSpinner />;
  }

  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId);

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.colors.text.primary }}>
          Book Your Appointment
        </h1>

        {error && (
          <div className="p-4 rounded-lg flex items-center gap-3 mb-6" 
            style={{ backgroundColor: theme.colors.status.error, color: theme.colors.text.primary }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BookingStep stepNumber={1} title="Choose Barber">
            {selectedBarber ? (
              <div className="flex items-center gap-4">
                <img
                  src={selectedBarber.image}
                  alt={selectedBarber.translations.en.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                    {selectedBarber.translations.en.name}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    {selectedBarber.translations.en.specialties}
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
                    ${selectedService.price}
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

          <BookingStep stepNumber={3} title="Choose Date & Time">
            {selectedDate && selectedTime ? (
              <div>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
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
        </div>

        {selectedBarber && selectedService && selectedDate && selectedTime && (
          <BookingSummary
            barber={{
              ...selectedBarber,
              id: selectedBarber.id || '',
              image: selectedBarber.image || '',
              createdAt: new Date(),
              translations: selectedBarber.translations || {
                en: { name: '', bio: '', description: '', specialties: '' },
                de: { name: '', bio: '', description: '', specialties: '' },
                ar: { name: '', bio: '', description: '', specialties: '' }
              }
            }}
            service={{
              ...selectedService,
              id: selectedService.id || '',
              image: selectedService.image || '',
              createdAt: new Date(),
              name: selectedService.name || '',
              translations: {
                en: { 
                  name: selectedService.translations?.en?.name || selectedService.name || '',
                  duration: selectedService.translations?.en?.duration || selectedService.duration?.toString() || ''
                },
                de: { 
                  name: selectedService.translations?.de?.name || selectedService.name || '',
                  duration: selectedService.translations?.de?.duration || selectedService.duration?.toString() || ''
                },
                ar: { 
                  name: selectedService.translations?.ar?.name || selectedService.name || '',
                  duration: selectedService.translations?.ar?.duration || selectedService.duration?.toString() || ''
                }
              },
              duration: typeof selectedService.duration === 'string' ? parseInt(selectedService.duration) : (selectedService.duration || 0)
            }}
            date={selectedDate}
            time={selectedTime}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}

        {activeModal === 'barber' && (
          <BarberSelectionModal
            barbers={barbers.map(barber => ({
              ...barber,
              id: barber.id || '',
              image: barber.image || '',
              createdAt: new Date(),
              translations: barber.translations || {
                en: { name: '', bio: '', description: '', specialties: '' },
                de: { name: '', bio: '', description: '', specialties: '' },
                ar: { name: '', bio: '', description: '', specialties: '' }
              }
            }))}
            onSelect={(id) => {
              setSelectedBarberId(id);
              setActiveModal(null);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'service' && (
          <ServiceSelectionModal
            services={services.map(service => ({
              ...service,
              id: service.id || '',
              image: service.image || '',
              createdAt: new Date(),
              name: service.name || '',
              translations: {
                en: { 
                  name: service.translations?.en?.name || service.name || '',
                  duration: service.translations?.en?.duration || service.duration?.toString() || ''
                },
                de: { 
                  name: service.translations?.de?.name || service.name || '',
                  duration: service.translations?.de?.duration || service.duration?.toString() || ''
                },
                ar: { 
                  name: service.translations?.ar?.name || service.name || '',
                  duration: service.translations?.ar?.duration || service.duration?.toString() || ''
                }
              },
              duration: typeof service.duration === 'string' ? parseInt(service.duration) : (service.duration || 0)
            }))}
            onSelect={(id) => {
              setSelectedServiceId(id);
              setActiveModal(null);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'datetime' && (
          <DateTimeSelectionModal
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            availableDates={getAvailableDates()}
            availableTimes={availableTimes}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onConfirm={() => setActiveModal(null)}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'login' && (
          <LoginModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onSuccess={async () => {
              setActiveModal(null);
              // Wait for a short delay to ensure auth state is updated
              await new Promise(resolve => setTimeout(resolve, 500));
              
              if (!currentUser) {
                setError('Please try booking again');
                return;
              }

              setLoading(true);
              try {
                await createAppointment();
              } catch (error) {
                setError('Failed to create appointment');
                console.error('Booking error:', error);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
} 