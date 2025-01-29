import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { combineStyles } from '../../config/theme';
import { layout } from '../../config/ui.config';

interface NavbarProps {
  setIsDrawerOpen: (isOpen: boolean) => void;
}

const Navbar = ({ setIsDrawerOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();

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

  // Navigation items configuration
  const navigationItems = [
    {
      label: 'Home',
      path: '/',
      show: true,
    },
    {
      label: 'Book',
      path: '/booking',
      show: true,
    },
    {
      label: 'Profile',
      path: '/dashboard',
      show: !!currentUser,
    },
    {
      label: currentUser ? 'Sign out' : 'Sign in',
      action: currentUser ? handleLogout : () => navigate('/login'),
      color: currentUser ? theme.colors.accent.primary : theme.colors.text.primary,
      show: true,
    },
  ];

  return (
    <nav className="flex items-center space-x-4">
      {navigationItems
        .filter(item => item.show)
        .map((item) => (
          <button
            key={item.label}
            onClick={item.action || (() => handleAuthRedirect(item.path!))}
            className="btn btn-ghost btn-sm hover:opacity-90"
            style={{ color: item.color || theme.colors.text.primary }}
          >
            {item.label}
          </button>
        ))}
    </nav>
  );
};

export default Navbar; 