import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-base-100 pb-16">
      {/* Main Content */}
      <main className="safe-area-inset-bottom">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar - Fixed at bottom */}
      <nav className="btm-nav bg-base-100 border-t border-base-200 fixed bottom-0 h-16">
        <button 
          className={isActive('/') ? 'active text-primary' : ''}
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="btm-nav-label">Home</span>
        </button>
        
        <button 
          className={isActive('/services') ? 'active text-primary' : ''}
          onClick={() => navigate('/services')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="btm-nav-label">Services</span>
        </button>

        <button 
          className="relative"
          onClick={() => navigate('/booking')}
        >
          <div className="absolute -top-8 p-4 bg-primary rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="btm-nav-label mt-4">Book</span>
        </button>

        <button 
          className={isActive('/barbers') ? 'active text-primary' : ''}
          onClick={() => navigate('/barbers')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="btm-nav-label">Barbers</span>
        </button>

        <button 
          className={isActive('/dashboard') ? 'active text-primary' : ''}
          onClick={() => isLoggedIn ? navigate('/dashboard') : navigate('/login')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="btm-nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
} 