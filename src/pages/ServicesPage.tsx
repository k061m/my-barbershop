import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 1,
    name: "Classic Haircut",
    description: "Traditional haircut with precision and style",
    duration: "30 min",
    price: 30,
    image: "https://images.unsplash.com/photo-1635273051937-a0d1aea8c7fc?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Beard Trim",
    description: "Professional beard grooming and shaping",
    duration: "15 min",
    price: 20,
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Haircut & Beard Combo",
    description: "Complete grooming package for hair and beard",
    duration: "45 min",
    price: 45,
    image: "https://images.unsplash.com/photo-1593702295094-ac9a661c3d7d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Premium Fade",
    description: "Precision fade with detailed line-up",
    duration: "40 min",
    price: 35,
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Hot Towel Shave",
    description: "Luxurious traditional straight razor shave",
    duration: "30 min",
    price: 40,
    image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function ServicesPage() {
  const navigate = useNavigate();

  const handleBooking = (serviceId: number) => {
    navigate(`/booking?service=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <figure className="relative h-48">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="card-title text-white">{service.name}</h2>
                  <p className="text-accent">${service.price}</p>
                </div>
              </figure>
              <div className="card-body">
                <p className="text-neutral">{service.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-neutral">Duration: {service.duration}</p>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleBooking(service.id)}
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