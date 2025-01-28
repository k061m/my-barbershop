import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              Barbershop
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/barbers" className="text-gray-700 hover:text-primary">
              Barbers
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-primary">
              Services
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/admin" className="text-gray-700 hover:text-primary">
                  Admin
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 