import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { useTheme } from '../contexts/ThemeContext';

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
  const [activeModal, setActiveModal] = useState<'barber' | 'service' | 'datetime' | null>(null);

  useEffect(() => {
    if (state?.from === 'barbers' && state.selectedBarberId) {
      setSelectedBarberId(state.selectedBarberId);
    } else if (state?.from === 'services' && state.selectedServiceId) {
      setSelectedServiceId(state.selectedServiceId);
    }
  }, [state]);

  // Generate available times for the selected date
  useEffect(() => {
    if (selectedDate && selectedBarberId) {
      const selectedBarber = barbers.find(b => b.id === selectedBarberId);
      if (!selectedBarber) return;

      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
      
      // Check if the selected day is a working day
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

  // Get the next 30 available days
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

  // Format date for input value
  const formatDateForValue = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarberId || !selectedServiceId || !selectedDate || !selectedTime) {
      setError('Please complete all selections');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      await appointmentService.createAppointment({
        userId: currentUser!.uid,
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

  if (loadingBarbers || loadingServices) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="loading loading-spinner loading-lg" style={{ color: theme.colors.accent.primary }}></div>
    </div>
  );

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

        {/* Booking Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Barber Selection Card */}
          <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: theme.colors.background.card }}>
            <h3 className="font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Step 1</h3>
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Choose Barber</h2>
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
          </div>

          {/* Service Selection Card */}
          <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: theme.colors.background.card }}>
            <h3 className="font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Step 2</h3>
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Choose Service</h2>
            {selectedService ? (
              <div>
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
          </div>

          {/* Date & Time Selection Card */}
          <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: theme.colors.background.card }}>
            <h3 className="font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Step 3</h3>
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Choose Date & Time</h2>
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
          </div>
        </div>

        {/* Booking Summary and Submit */}
        {selectedBarber && selectedService && selectedDate && selectedTime && (
          <div className="rounded-lg shadow-lg p-6 mt-8" style={{ backgroundColor: theme.colors.background.card }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Booking Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p style={{ color: theme.colors.text.secondary }}>Barber</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {selectedBarber.translations.en.name}
                </p>
              </div>
              <div>
                <p style={{ color: theme.colors.text.secondary }}>Service</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {selectedService.translations.en.name}
                </p>
              </div>
              <div>
                <p style={{ color: theme.colors.text.secondary }}>Date & Time</p>
                <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })} at {selectedTime}
                </p>
              </div>
              <div>
                <p style={{ color: theme.colors.text.secondary }}>Price</p>
                <p className="font-medium" style={{ color: theme.colors.accent.primary }}>
                  ${selectedService.price}
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {/* Selection Modals */}
        {activeModal === 'barber' && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg shadow-lg p-6" 
              style={{ backgroundColor: theme.colors.background.card }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Select Barber</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {barbers.map(barber => (
                  <div
                    key={barber.id}
                    onClick={() => {
                      if (barber.id) {
                        setSelectedBarberId(barber.id);
                        setActiveModal(null);
                      }
                    }}
                    className="rounded-lg p-4 cursor-pointer transition-colors hover:opacity-90"
                    style={{ backgroundColor: theme.colors.background.primary }}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={barber.image}
                        alt={barber.translations.en.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                          {barber.translations.en.name}
                        </p>
                        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                          {barber.translations.en.specialties}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 w-full py-3 rounded-lg transition-colors hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.background.primary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.text.secondary}`
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeModal === 'service' && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg shadow-lg p-6" 
              style={{ backgroundColor: theme.colors.background.card }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Select Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => {
                      if (service.id) {
                        setSelectedServiceId(service.id);
                        setActiveModal(null);
                      }
                    }}
                    className="rounded-lg p-4 cursor-pointer transition-colors hover:opacity-90"
                    style={{ backgroundColor: theme.colors.background.primary }}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={service.image}
                        alt={service.translations.en.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                          {service.translations.en.name}
                        </p>
                        <p className="text-sm" style={{ color: theme.colors.accent.primary }}>
                          ${service.price}
                        </p>
                        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                          {service.translations.en.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="mt-4 w-full py-3 rounded-lg transition-colors hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.background.primary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.text.secondary}`
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeModal === 'datetime' && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-lg shadow-lg p-6" 
              style={{ backgroundColor: theme.colors.background.card }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Select Date & Time</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
                    Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: theme.colors.background.primary,
                      color: theme.colors.text.primary,
                      border: `1px solid ${theme.colors.text.secondary}`
                    }}
                  >
                    <option value="">Select a date</option>
                    {getAvailableDates().map(date => (
                      <option key={date.toISOString()} value={formatDateForValue(date)}>
                        {date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
                      Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimes.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className="p-2 rounded-lg transition-colors hover:opacity-90"
                          style={{ 
                            backgroundColor: time === selectedTime ? theme.colors.accent.primary : theme.colors.background.primary,
                            color: time === selectedTime ? theme.colors.background.primary : theme.colors.text.primary,
                            border: `1px solid ${time === selectedTime ? theme.colors.accent.primary : theme.colors.text.secondary}`
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    if (selectedDate && selectedTime) {
                      setActiveModal(null);
                    }
                  }}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 py-3 rounded-lg transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.primary,
                    opacity: (!selectedDate || !selectedTime) ? 0.5 : 1
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3 rounded-lg transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.text.secondary}`
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 