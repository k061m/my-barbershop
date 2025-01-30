import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { combineStyles } from '../../config/theme';
import { layout } from '../../config/ui.config';
import { memo } from 'react';

interface NavbarProps {
  setIsDrawerOpen: (isOpen: boolean) => void;
}

interface NavButtonProps {
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
}

// Memoized NavButton component for better performance
const NavButton = memo(({ onClick, color, children }: NavButtonProps) => (
  <button 
    className="btn btn-ghost btn-sm hover:opacity-90 text-sm whitespace-nowrap"
    style={{ color }}
    onClick={onClick}
  >
    {children}
  </button>
));

NavButton.displayName = 'NavButton';

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
      show: true, // Always show
    },
    {
      label: 'Book',
      path: '/booking',
      show: true, // Always show
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
      show: true, // Always show
    },
  ];

  return (
    <nav 
      className={combineStyles(
        'navbar border-b sticky top-0 z-20 w-full max-w-[100vw] overflow-x-hidden',
        'backdrop-blur-md bg-opacity-95'
      )}
      style={{ 
        height: layout.navbar.height,
        backgroundColor: theme.colors.background.primary,
        borderColor: theme.colors.background.secondary
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-2 sm:px-4">
        {/* Drawer Toggle */}
        <div className="flex-none">
          <label 
            htmlFor="my-drawer" 
            className={combineStyles(
              'btn btn-square btn-ghost drawer-button',
              'hover:bg-[' + theme.colors.background.hover + ']'
            )}
            style={{ color: theme.colors.text.primary }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8 overflow-x-auto">
          {navigationItems
            .filter(item => item.show)
            .map((item) => (
              <NavButton
                key={item.label}
                onClick={item.action || (() => handleAuthRedirect(item.path!))}
                color={item.color || theme.colors.text.primary}
              >
                {item.label}
              </NavButton>
            ))
          }
        </div>
      </div>
    </nav>
  );
};

// Memoize the entire Navbar component
export default memo(Navbar); 