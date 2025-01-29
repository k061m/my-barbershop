import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';

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

  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Format date for input value
  const formatDateForValue = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarberId || !selectedServiceId || !selectedDate || !selectedTime) {
      setError('Please fill in all fields');
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

  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId);

  if (loadingBarbers || loadingServices) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-8">Book Your Appointment</h2>

          {/* Booking Steps Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Barber Selection Card */}
            <div 
              onClick={() => setActiveModal('barber')}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">1. Choose Barber</h3>
                <button className="text-primary hover:text-primary-dark">
                  {selectedBarber ? 'Change' : 'Select'}
                </button>
              </div>
              {selectedBarber ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedBarber.image}
                    alt={selectedBarber.translations.en.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedBarber.translations.en.name}</p>
                    <p className="text-sm text-gray-500">{selectedBarber.translations.en.description}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select your preferred barber</p>
              )}
            </div>

            {/* Service Selection Card */}
            <div 
              onClick={() => setActiveModal('service')}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">2. Choose Service</h3>
                <button className="text-primary hover:text-primary-dark">
                  {selectedService ? 'Change' : 'Select'}
                </button>
              </div>
              {selectedService ? (
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedService.image}
                    alt={selectedService.translations.en.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedService.translations.en.name}</p>
                    <p className="text-sm text-gray-500">${selectedService.price}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select your desired service</p>
              )}
            </div>

            {/* Date & Time Selection Card */}
            <div 
              onClick={() => setActiveModal('datetime')}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">3. Choose Date & Time</h3>
                <button className="text-primary hover:text-primary-dark">
                  {selectedDate && selectedTime ? 'Change' : 'Select'}
                </button>
              </div>
              {selectedDate && selectedTime ? (
                <div>
                  <p className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-500">at {selectedTime}</p>
                </div>
              ) : (
                <p className="text-gray-500">Select your preferred date and time</p>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          {selectedBarber && selectedService && selectedDate && selectedTime && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-lg mb-4">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Total Price</p>
                  <p className="font-medium text-xl">${selectedService.price}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Duration</p>
                  <p className="font-medium">{selectedService.translations.en.duration}</p>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-4 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        {activeModal === 'barber' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Choose Your Barber</h3>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarberId(barber.id || '');
                        setActiveModal(null);
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedBarberId === barber.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={barber.image}
                          alt={barber.translations.en.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{barber.translations.en.name}</h3>
                          <p className={selectedBarberId === barber.id ? 'text-white' : 'text-gray-600'}>
                            {barber.translations.en.description}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{barber.rating?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'service' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Choose Your Service</h3>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedServiceId(service.id || '');
                        setActiveModal(null);
                      }}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedServiceId === service.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={service.image}
                          alt={service.translations.en.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{service.translations.en.name}</h3>
                          <p className={selectedServiceId === service.id ? 'text-white' : 'text-gray-600'}>
                            {service.translations.en.description}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span>{service.translations.en.duration}</span>
                            <span className="font-bold">${service.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'datetime' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
              <div className="p-6">
                {/* Header with month navigation */}
                <div className="flex justify-between items-center mb-6">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-xl font-semibold">
                    {new Date(selectedDate || new Date()).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                  </h3>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                {/* Weekday headers */}
                  <div className="grid grid-cols-7 mb-2">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div key={day} className="text-center text-sm text-gray-400 font-medium py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg p-1">
                  {getAvailableDates().map((date, index) => {
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isSelected = selectedDate === formatDateForValue(date);
                    const isAvailable = true; // You can add availability logic here

                      return (
                        <button
                          key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(formatDateForValue(date));
                          setSelectedTime('');
                        }}
                          disabled={!isAvailable}
                          className={`
                          aspect-square p-1 relative rounded-lg
                          ${isSelected ? 'bg-primary text-white' : 'bg-white'}
                          ${!isAvailable ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'}
                          ${isToday && !isSelected ? 'text-primary font-semibold' : ''}
                          `}
                        >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-sm">{date.getDate()}</span>
                        </div>
                        </button>
                      );
                    })}
                  </div>

                {/* Time selection */}
                {selectedDate && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Available Times</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setActiveModal(null);
                          }}
                          className={`
                            py-2 px-3 rounded-lg text-sm font-medium
                            ${selectedTime === time 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                </div>
                  )}

                {/* Bottom buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedDate && selectedTime) {
                        setActiveModal(null);
                      }
                    }}
                    disabled={!selectedDate || !selectedTime}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-lg
                      ${selectedDate && selectedTime
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 