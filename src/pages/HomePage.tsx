import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleAuthRedirect = (path: string) => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section with Image */}
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
              Classic Cuts, Modern Style
            </h1>
            <p className="text-lg text-white opacity-90">
              Where tradition meets excellence
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 -mt-8 relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <button 
            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/booking')}
          >
            Book Now
          </button>
          <button 
            className="btn bg-accent hover:bg-accent/90 text-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => handleAuthRedirect('/login')}
          >
            {isLoggedIn ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-12 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </div>
  );
} 