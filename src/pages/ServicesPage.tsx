import { useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';

export default function ServicesPage() {
  const navigate = useNavigate();
  const { services, loading, error } = useServices();

  const handleServiceSelect = (serviceId: string) => {
    navigate('/booking', { 
      state: { 
        from: 'services',
        selectedServiceId: serviceId 
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Premium Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {services.map((service) => (
          <div 
            key={service.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => service.id && handleServiceSelect(service.id)}
          >
            <div className="relative">
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 right-0 mt-4 mr-4">
                <div className="bg-white px-2 py-1 rounded-full shadow flex items-center">
                  <span className="text-primary font-semibold">${service.price}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{service.name}</h2>
              <p className="text-primary font-medium mb-2">{service.duration}</p>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex justify-end">
                <button 
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    service.id && handleServiceSelect(service.id);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 