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
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );

  const selectedBarber = barbers.find(b => b.id === selectedBarberId);
  const selectedService = services.find(s => s.id === selectedServiceId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Book Your Appointment</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Booking Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Barber Selection Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-medium text-gray-500 mb-2">Step 1</h3>
            <h2 className="text-xl font-bold mb-4">Choose Barber</h2>
            {selectedBarber ? (
              <div className="flex items-center space-x-4">
                <img
                  src={selectedBarber.image}
                  alt={selectedBarber.translations.en.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{selectedBarber.translations.en.name}</p>
                  <p className="text-sm text-gray-500">{selectedBarber.translations.en.specialties}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveModal('barber')}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Select Barber
              </button>
            )}
          </div>

          {/* Service Selection Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-medium text-gray-500 mb-2">Step 2</h3>
            <h2 className="text-xl font-bold mb-4">Choose Service</h2>
            {selectedService ? (
              <div>
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedService.image}
                    alt={selectedService.translations.en.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedService.translations.en.name}</p>
                    <p className="text-sm text-gray-500">${selectedService.price}</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveModal('service')}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Select Service
              </button>
            )}
          </div>

          {/* Date & Time Selection Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-medium text-gray-500 mb-2">Step 3</h3>
            <h2 className="text-xl font-bold mb-4">Choose Date & Time</h2>
            {selectedDate && selectedTime ? (
              <div>
                <p className="font-medium">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-500">{selectedTime}</p>
              </div>
            ) : (
              <button
                onClick={() => setActiveModal('datetime')}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Select Date & Time
              </button>
            )}
          </div>
        </div>

        {/* Booking Summary and Submit */}
        {selectedBarber && selectedService && selectedDate && selectedTime && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500">Barber</p>
                <p className="font-medium">{selectedBarber.translations.en.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Service</p>
                <p className="font-medium">{selectedService.translations.en.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                  {' '}at {selectedTime}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-medium">${selectedService.price}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {/* Modal: Barber Selection */}
        {activeModal === 'barber' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Choose Your Barber</h2>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarberId(barber.id || '');
                        setActiveModal(null);
                      }}
                      className="p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={barber.image}
                          alt={barber.translations.en.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{barber.translations.en.name}</h3>
                          <p className="text-gray-600">{barber.translations.en.description}</p>
                          <p className="text-gray-600">{barber.translations.en.specialties}</p>
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

        {/* Modal: Service Selection */}
        {activeModal === 'service' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Choose Your Service</h2>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedServiceId(service.id || '');
                        setActiveModal(null);
                      }}
                      className="p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={service.image}
                          alt={service.translations.en.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{service.translations.en.name}</h3>
                          <p className="text-gray-600">{service.translations.en.duration}</p>
                          <p className="text-gray-600">{service.translations.en.description}</p>
                          <p className="font-bold mt-1">${service.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Date & Time Selection */}
        {activeModal === 'datetime' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Choose Date & Time</h2>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-6">
                  {/* Date Selection */}
                  <div className="w-1/2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Select Date
                    </label>
                    <div className="grid grid-cols-7 gap-1 max-h-[280px] overflow-y-auto p-2 bg-gray-50 rounded-lg">
                      {getAvailableDates().map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => {
                            setSelectedDate(formatDateForValue(date));
                            setSelectedTime('');
                          }}
                          className={`p-2 rounded text-center transition-all text-sm hover:bg-gray-100
                            ${selectedDate === formatDateForValue(date)
                              ? 'bg-primary text-white hover:bg-primary'
                              : 'bg-white'
                            }
                            ${date.toDateString() === new Date().toDateString() ? 'ring-1 ring-primary' : ''}
                          `}
                        >
                          <div className="text-xs mb-1 font-medium">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="font-semibold">
                            {date.getDate()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="w-1/2">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Select Time
                    </label>
                    {selectedDate ? (
                      availableTimes.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1 max-h-[280px] overflow-y-auto p-2 bg-gray-50 rounded-lg">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              onClick={() => {
                                setSelectedTime(time);
                                setActiveModal(null);
                              }}
                              className={`p-2 rounded text-center text-sm transition-all hover:bg-gray-100
                                ${selectedTime === time
                                  ? 'bg-primary text-white hover:bg-primary'
                                  : 'bg-white'
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="h-[280px] flex items-center justify-center bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">No available times</p>
                        </div>
                      )
                    ) : (
                      <div className="h-[280px] flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Select a date first</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 