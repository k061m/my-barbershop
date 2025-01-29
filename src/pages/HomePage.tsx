import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';

export default function HomePage() {
  const navigate = useNavigate();

  // Example coordinates - replace with your barbershop's actual location
  const shopLocation: [number, number] = [51.0658369, 13.7562182]; // London coordinates
  const shopAddress = "Louisenstraße 73, 01099 Dresden";
  const shopName = "Barbier Beirut";

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div 
        className="relative h-[50vh] bg-cover bg-center" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop")',
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="absolute inset-0 bg-primary bg-opacity-60 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Barbier Beirut
            </h1>
            <p className="text-lg text-white opacity-90">
              Where tradition meets excellence
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 -mt-8 relative z-10 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <button 
            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full max-w-xs"
            onClick={() => navigate('/booking')}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-12 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Cards */}
            <div 
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/barbers')}
            >
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" 
                  alt="Expert Barbers" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-primary">Expert Barbers</h2>
                <p className="text-neutral">Meet our skilled professionals</p>
                <div className="card-actions">
                  <button className="btn btn-ghost btn-sm">View All Barbers →</button>
                </div>
              </div>
            </div>

            <div 
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/services')}
            >
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
                  alt="Premium Services" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-primary">Premium Services</h2>
                <p className="text-neutral">Explore our range of services</p>
                <div className="card-actions">
                  <button className="btn btn-ghost btn-sm">View All Services →</button>
                </div>
              </div>
            </div>

            <div 
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/gallery')}
            >
              <figure className="px-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Style Gallery" 
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-primary">Style Gallery</h2>
                <p className="text-neutral">Get inspired by trending styles</p>
                <div className="card-actions">
                  <button className="btn btn-ghost btn-sm">View Gallery →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="py-12 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Find Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">{shopName}</h3>
              <p className="mb-4">{shopAddress}</p>
              <div className="space-y-2">
                <p><strong>Hours:</strong></p>
                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                <p>Saturday: 10:00 AM - 6:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
              <div className="mt-6">
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${shopLocation[0]},${shopLocation[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Get Directions
                </a>
              </div>
            </div>
            <div>
              <Map 
                position={shopLocation}
                address={shopAddress}
                shopName={shopName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 