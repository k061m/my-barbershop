import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Navigation() {
  const { theme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/barbers', label: 'Barbers' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav 
      className="sticky top-0 z-50 shadow-lg"
      style={{ backgroundColor: theme.colors.background.card }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="text-xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            BarberShop
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path) ? 'font-bold' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isActive(path) ? theme.colors.accent.primary : 'transparent',
                  color: isActive(path) ? theme.colors.background.primary : theme.colors.text.primary,
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md"
              style={{ color: theme.colors.text.primary }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 