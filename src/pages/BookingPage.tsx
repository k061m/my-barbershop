import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Barber {
  id: number;
  name: string;
  speciality: string;
  image?: string;
}

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  image?: string;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBarberModalOpen, setIsBarberModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const barberId = params.get('barber');
    const serviceId = params.get('service');

    if (barberId) {
      setSelectedBarber(Number(barberId));
    }
    if (serviceId) {
      setSelectedService(Number(serviceId));
    }
  }, [location]);

  // Mock data - replace with actual data from your backend
  const barbers: Barber[] = [
    { id: 1, name: "John Doe", speciality: "Classic Cuts", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1988&auto=format&fit=crop" },
    { id: 2, name: "Jane Smith", speciality: "Modern Styles", image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1780&auto=format&fit=crop" },
    { id: 3, name: "Mike Johnson", speciality: "Beard Grooming", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
    { id: 4, name: "Sarah Williams", speciality: "Precision Fades", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop" },
    { id: 5, name: "David Chen", speciality: "Asian Hair Specialist", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
  ];

  const services: Service[] = [
    { id: 1, name: "Classic Haircut", duration: "30 min", price: 30, image: "https://images.unsplash.com/photo-1635273051937-a0d1aea8c7fc?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, name: "Beard Trim", duration: "15 min", price: 20, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop" },
    { id: 3, name: "Haircut & Beard Combo", duration: "45 min", price: 45, image: "https://images.unsplash.com/photo-1593702295094-ac9a661c3d7d?q=80&w=1974&auto=format&fit=crop" },
    { id: 4, name: "Premium Fade", duration: "40 min", price: 35, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop" },
    { id: 5, name: "Hot Towel Shave", duration: "30 min", price: 40, image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?q=80&w=2070&auto=format&fit=crop" },
  ];

  const selectedBarberData = barbers.find(b => b.id === selectedBarber);
  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleBooking = () => {
    alert('Booking confirmed!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Book an Appointment</h1>
        
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
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Booking */}
          <button 
            className="btn btn-primary btn-lg w-full"
            disabled={!selectedBarber || !selectedService || !selectedDate || !selectedTime}
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
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
                  setSelectedBarber(barber.id);
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
                  setSelectedService(service.id);
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