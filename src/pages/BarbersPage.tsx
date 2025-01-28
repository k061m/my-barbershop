import { useNavigate } from 'react-router-dom';

const barbers = [
  {
    id: 1,
    name: "John Doe",
    speciality: "Classic Cuts",
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1988&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Jane Smith",
    speciality: "Modern Styles",
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1780&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Mike Johnson",
    speciality: "Beard Grooming",
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Sarah Williams",
    speciality: "Precision Fades",
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "David Chen",
    speciality: "Asian Hair Specialist",
    experience: "9 years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function BarbersPage() {
  const navigate = useNavigate();
  
  const handleBooking = (barberId: number) => {
    navigate(`/booking?barber=${barberId}`);
  };
  
  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Our Expert Barbers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map(barber => (
            <div key={barber.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <figure className="relative h-64">
                <img 
                  src={barber.image} 
                  alt={barber.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="card-title text-white">{barber.name}</h2>
                  <p className="text-accent">{barber.speciality}</p>
                </div>
              </figure>
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <p className="text-neutral"><span className="font-semibold">Experience:</span> {barber.experience}</p>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleBooking(barber.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 