// Importing necessary hooks from react-router-dom for navigation
import { useNavigate, useLocation } from 'react-router-dom';
// Importing custom hooks for theme and authentication
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Hook to get current location/URL
  const location = useLocation();
  // Custom hook to access theme context
  const { theme } = useTheme();
  // Custom hook to access authentication context
  const { currentUser } = useAuth();

  // Function to check if a given path is currently active
  const isActive = (path: string) => location.pathname === path;

  return (
    // Navigation bar fixed to the bottom of the screen
    <nav 
      className="fixed bottom-0 left-0 right-0 h-16 px-4 flex items-center justify-between z-50"
      style={{ 
        backgroundColor: theme.colors.background.card,
        boxShadow: '0 -1px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Home button */}
      <button
        onClick={() => navigate('/')}
        className="flex flex-col items-center gap-1 w-16"
        style={{ color: isActive('/') ? theme.colors.accent.primary : theme.colors.text.secondary }}
      >
        {/* SVG icon for home */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-xs">Home</span>
      </button>

      {/* Services button */}
      <button
        onClick={() => navigate('/services')}
        className="flex flex-col items-center gap-1 w-16"
        style={{ color: isActive('/services') ? theme.colors.accent.primary : theme.colors.text.secondary }}
      >
        {/* SVG icon for services */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-xs">Services</span>
      </button>

      {/* Book Button - Centered and elevated */}
      <button
        onClick={() => navigate('/booking')}
        className="flex flex-col items-center justify-center w-20 h-20 rounded-full -mt-10 relative"
        style={{ 
          backgroundColor: theme.colors.accent.primary,
          color: theme.colors.text.inverse,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* SVG icon for booking (plus sign) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </nav>
  );
}


{/* Messages */}
<button
  onClick={() => navigate('/messages')}
  className="flex flex-col items-center gap-1 w-16"
  style={{ color: isActive('/messages') ? theme.colors.accent.primary : theme.colors.text.secondary }}
>
  {/* SVG icon for messages */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
  {/* Text label for messages */}
  <span className="text-xs">Messages</span>
</button>

{/* Profile */}
<button
  onClick={() => currentUser ? navigate('/dashboard') : navigate('/login')}
  className="flex flex-col items-center gap-1 w-16"
  style={{ color: isActive('/dashboard') ? theme.colors.accent.primary : theme.colors.text.secondary }}
>
  {/* Profile picture or default avatar */}
  <div className="w-6 h-6 rounded-full bg-center bg-cover"
    style={{ 
      backgroundImage: currentUser?.photoURL ? 
        `url(${currentUser.photoURL})` : 
        `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email})`,
      backgroundColor: theme.colors.background.secondary 
    }}
  />
  {/* Text label for profile */}
  <span className="text-xs">Profile</span>
</button>
