import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dbService, Barber, Service, Appointment } from '../services/database.service';
import { Timestamp } from 'firebase/firestore';

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isBarberModalOpen, setIsBarberModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Load barbers and services data
  useEffect(() => {
    loadData();
  }, []);

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const barberId = params.get('barber');
    const serviceId = params.get('service');

    if (barberId) setSelectedBarber(barberId);
    if (serviceId) setSelectedService(serviceId);
  }, [location]);

  const loadData = async () => {
    try {
      const [barbersData, servicesData] = await Promise.all([
        dbService.getBarbers(),
        dbService.getServices()
      ]);
      setBarbers(barbersData);
      setServices(servicesData);
    } catch (err) {
      setError('Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };

  const selectedBarberData = barbers.find(b => b.id === selectedBarber);
  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Combine date and time
      const [year, month, day] = selectedDate.split('-').map(Number);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDate = new Date(year, month - 1, day, hours, minutes);

      // Check if the appointment date is in the future
      if (appointmentDate <= new Date()) {
        setError('Please select a future date and time');
        return;
      }

      const appointment: Omit<Appointment, 'id'> = {
        userId: currentUser.uid,
        barberId: selectedBarber,
        serviceId: selectedService,
        date: Timestamp.fromDate(appointmentDate),
        status: 'pending',
        notes: notes.trim()
      };

      await dbService.addAppointment(appointment);
      setSuccess('Appointment booked successfully!');
      
      // Reset form
      setSelectedBarber(null);
      setSelectedService(null);
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');

      // Navigate to profile page after short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Book an Appointment</h1>
        
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <span>{success}</span>
          </div>
        )}

        <div className="grid gap-8">
          {/* Barber Selection Card */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-primary">Your Barber</h2>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsBarberModalOpen(true)}
                >
                  {selectedBarber ? 'Change Barber' : 'Select Barber'}
                </button>
              </div>
              
              {selectedBarberData ? (
                <div className="flex items-center gap-4 mt-4">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full">
                      <img src={selectedBarberData.image} alt={selectedBarberData.name} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{selectedBarberData.name}</h3>
                    <p className="text-sm text-neutral">{selectedBarberData.speciality}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral">
                  Please select a barber
                </div>
              )}
            </div>
          </div>

          {/* Service Selection Card */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-primary">Selected Service</h2>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsServiceModalOpen(true)}
                >
                  {selectedService ? 'Change Service' : 'Select Service'}
                </button>
              </div>
              
              {selectedServiceData ? (
                <div className="flex items-center gap-4 mt-4">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-lg">
                      <img src={selectedServiceData.image} alt={selectedServiceData.name} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">{selectedServiceData.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-neutral">{selectedServiceData.duration}</p>
                      <p className="text-sm font-semibold text-accent">${selectedServiceData.price}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral">
                  Please select a service
                </div>
              )}
            </div>
          </div>

          {/* Date and Time Selection */}
          <form onSubmit={handleBooking}>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">Choose Date and Time</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-neutral">Date</span>
                    </label>
                    <input 
                      type="date" 
                      className="input input-bordered" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-neutral">Time</span>
                    </label>
                    <input 
                      type="time" 
                      className="input input-bordered" 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text text-neutral">Notes (Optional)</span>
                    </label>
                    <textarea 
                      className="textarea textarea-bordered" 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or notes for your appointment?"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Booking */}
            <button 
              type="submit"
              className={`btn btn-primary btn-lg w-full mt-6 ${loading ? 'loading' : ''}`}
              disabled={!selectedBarber || !selectedService || !selectedDate || !selectedTime || loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>

      {/* Barber Selection Modal */}
      <dialog className={`modal ${isBarberModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg mb-4">Choose your Barber</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barbers.map(barber => (
              <div 
                key={barber.id}
                className={`card bg-base-100 cursor-pointer hover:shadow-lg transition-all duration-200
                  ${selectedBarber === barber.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
                onClick={() => {
                  setSelectedBarber(barber.id || null);
                  setIsBarberModalOpen(false);
                }}
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full">
                        <img src={barber.image} alt={barber.name} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{barber.name}</h3>
                      <p className="text-sm text-neutral">{barber.speciality}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsBarberModalOpen(false)}>Close</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsBarberModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Service Selection Modal */}
      <dialog className={`modal ${isServiceModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg mb-4">Choose your Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(service => (
              <div 
                key={service.id}
                className={`card bg-base-100 cursor-pointer hover:shadow-lg transition-all duration-200
                  ${selectedService === service.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
                onClick={() => {
                  setSelectedService(service.id || null);
                  setIsServiceModalOpen(false);
                }}
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-lg">
                        <img src={service.image} alt={service.name} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">{service.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-neutral">{service.duration}</p>
                        <p className="text-sm font-semibold text-accent">${service.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsServiceModalOpen(false)}>Close</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsServiceModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
} 