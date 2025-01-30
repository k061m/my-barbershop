import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { Logo } from '../common/Logo';
import { theme } from '../../config/theme';
import Navbar from './Navbar';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleAuthRedirect = (path: string) => {
    if (currentUser) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="drawer relative" style={{ backgroundColor: theme.colors.background.primary }}>
      <input 
        id="my-drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isDrawerOpen}
        onChange={(e) => setIsDrawerOpen(e.target.checked)}
      />
      
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <Navbar setIsDrawerOpen={setIsDrawerOpen} />

        {/* Main Content */}
        <main className="flex-1 relative" style={{ backgroundColor: theme.colors.background.primary }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer 
          className="py-8"
          style={{ backgroundColor: theme.colors.background.secondary }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 w-full max-w-[200px]">
                <Logo 
                  variant="light" 
                  width="full"
                  height={50}
                  padding="0.5rem"
                  containerClassName="hover:opacity-90 transition-opacity"
                  fit="contain"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Drawer Side */}
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul 
          className="menu p-4 w-80 min-h-full text-base-content"
          style={{ 
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary
          }}
        >
          <li className="menu-title" style={{ color: theme.colors.text.secondary }}>Navigation</li>
          <li>
            <a 
              className={isActive('/') ? 'active' : ''}
              style={{ 
                color: theme.colors.text.primary,
                backgroundColor: isActive('/') ? theme.colors.background.hover : 'transparent'
              }}
              onClick={() => { navigate('/'); setIsDrawerOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
          </li>
          <li>
            <a 
              className={isActive('/services') ? 'active' : ''}
              style={{ 
                color: theme.colors.text.primary,
                backgroundColor: isActive('/services') ? theme.colors.background.hover : 'transparent'
              }}
              onClick={() => { navigate('/services'); setIsDrawerOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Services
            </a>
          </li>
          <li>
            <a 
              className={isActive('/barbers') ? 'active' : ''}
              style={{ 
                color: theme.colors.text.primary,
                backgroundColor: isActive('/barbers') ? theme.colors.background.hover : 'transparent'
              }}
              onClick={() => { navigate('/barbers'); setIsDrawerOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Barbers
            </a>
          </li>
          <li>
            <a 
              className={isActive('/gallery') ? 'active' : ''}
              style={{ 
                color: theme.colors.text.primary,
                backgroundColor: isActive('/gallery') ? theme.colors.background.hover : 'transparent'
              }}
              onClick={() => { navigate('/gallery'); setIsDrawerOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Gallery
            </a>
          </li>

          <div className="divider" style={{ borderColor: theme.colors.background.hover }}></div>

          <li className="menu-title" style={{ color: theme.colors.text.secondary }}>Account</li>
          <li>
            <a 
              onClick={() => handleAuthRedirect('/booking')}
              style={{ color: theme.colors.accent.primary }}
              className="font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book Appointment
            </a>
          </li>
          {currentUser ? (
            <>
              <li>
                <a 
                  className={`transition-colors hover:opacity-90 ${isActive('/dashboard') ? 'active' : ''}`}
                  style={{ 
                    color: theme.colors.text.primary,
                    backgroundColor: isActive('/dashboard') ? theme.colors.background.hover : 'transparent',
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                  }}
                  onClick={() => handleAuthRedirect('/dashboard')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </a>
              </li>
              {currentUser.email === 'admin@admin.admin' && (
                <li>
                  <a 
                    className={isActive('/admin') ? 'active' : ''}
                    style={{ 
                      color: theme.colors.text.primary,
                      backgroundColor: isActive('/admin') ? theme.colors.background.hover : 'transparent'
                    }}
                    onClick={() => handleAuthRedirect('/admin')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Dashboard
                  </a>
                </li>
              )}
              <li>
                <a 
                  className={`transition-colors hover:opacity-90 ${isActive('/dashboard') ? 'active' : ''}`}
                  style={{ 
                    color: theme.colors.text.primary,
                    backgroundColor: isActive('/dashboard') ? theme.colors.background.hover : 'transparent',
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                  }}
                  onClick={() => handleAuthRedirect('/dashboard')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </a>
              </li>
              <li>
                <a 
                  onClick={handleLogout}
                  style={{ color: theme.colors.status.error }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <li>
              <a 
                onClick={() => { navigate('/login'); setIsDrawerOpen(false); }}
                style={{ color: theme.colors.text.primary }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 