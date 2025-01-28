import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { Timestamp } from 'firebase/firestore';

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
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Set initial selections based on navigation source
    if (state?.from === 'barbers' && state.selectedBarberId) {
      setSelectedBarberId(state.selectedBarberId);
      setStep(2); // Move to service selection
    } else if (state?.from === 'services' && state.selectedServiceId) {
      setSelectedServiceId(state.selectedServiceId);
      setStep(1); // Stay on barber selection
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarberId || !selectedServiceId || !selectedDate || !selectedTime) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Combine date and time
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      // Create appointment
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

  const nextStep = () => {
    if ((step === 1 && !selectedBarberId) || 
        (step === 2 && !selectedServiceId) || 
        (step === 3 && (!selectedDate || !selectedTime))) {
      setError('Please make a selection before continuing');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {['Select Barber', 'Choose Service', 'Pick Date & Time'].map((title, index) => (
              <div key={title} className="flex-1 text-center">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 
                  ${step > index + 1 ? 'bg-primary text-white border-primary' : 
                    step === index + 1 ? 'border-primary text-primary' : 
                    'border-gray-300 text-gray-300'}`}>
                  {index + 1}
                </div>
                <div className={`mt-2 ${step >= index + 1 ? 'text-primary' : 'text-gray-300'}`}>
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Your Barber</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedBarberId === barber.id
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedBarberId(barber.id || '')}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={barber.image}
                        alt={barber.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{barber.name}</h3>
                        <p className={selectedBarberId === barber.id ? 'text-white' : 'text-gray-600'}>
                          {barber.speciality}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{barber.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Select Your Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedServiceId === service.id
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedServiceId(service.id || '')}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <p className={selectedServiceId === service.id ? 'text-white' : 'text-gray-600'}>
                          {service.duration}
                        </p>
                        <p className="font-bold mt-1">${service.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {selectedBarber && selectedService && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Barber</p>
                      <p className="font-semibold">{selectedBarber.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Service</p>
                      <p className="font-semibold">{selectedService.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold">{selectedService.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="font-semibold">${selectedService.price}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark ml-auto disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 