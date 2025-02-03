import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { Logo } from '../common/Logo';
import { theme } from '../../config/theme';
import Navbar from './Navbar';
import BackArrow from '../common/BackArrow';

export default function Layout() {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Hook to access current location
  const location = useLocation();
  // Custom hook to access authentication context
  const { currentUser, logout } = useAuth();
  // State to control drawer open/close
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to check if a given path is currently active
  const isActive = (path: string) => location.pathname === path;

  // Function to handle navigation with authentication check
  const handleAuthRedirect = (path: string) => {
    if (currentUser) {
      navigate(path);
    } else {
      // Redirect to login if user is not authenticated, saving the intended destination
      navigate('/login', { state: { from: location.pathname } });
    }
    setIsDrawerOpen(false);
  };

  // Function to handle user logout
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
      {/* Checkbox input to control drawer state */}
      <input 
        id="my-drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={isDrawerOpen}
        onChange={(e) => setIsDrawerOpen(e.target.checked)}
      />
      
      <div className="drawer-content flex flex-col">
        {/* Back Arrow component */}
        <BackArrow />
   
        {/* Main Content */}
<main 
  className="flex-1 relative pb-20" 
  style={{ backgroundColor: theme.colors.background.primary }}
>
  {/* Outlet is likely a React Router component for rendering nested routes */}
  <Outlet />
</main>

{/* Navbar component */}
<Navbar />

{/* Footer section */}
<footer 
  className="py-8"
  style={{ backgroundColor: theme.colors.background.secondary }}
>
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0 w-full max-w-[200px]">
        {/* Logo component with various props */}
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

{/* Drawer Side - likely part of a responsive sidebar or menu */}
<div className="drawer-side z-50">
  {/* Label acting as an overlay for the drawer */}
  <label htmlFor="my-drawer" className="drawer-overlay"></label>
  {/* Menu list for the drawer */}
  <ul 
    className="menu p-4 w-80 min-h-full text-base-content"
    style={{ 
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary
    }}
  >
// Navigation menu title
<li className="menu-title" style={{ color: theme.colors.text.secondary }}>Navigation</li>

// Home menu item
<li>
  <a 
    // Apply 'active' class if current route is home
    className={isActive('/') ? 'active' : ''}
    style={{ 
      // Set text color from theme
      color: theme.colors.text.primary,
      // Set background color based on active state
      backgroundColor: isActive('/') ? theme.colors.background.hover : 'transparent'
    }}
    // Navigate to home and close drawer on click
    onClick={() => { navigate('/'); setIsDrawerOpen(false); }}
  >
    {/* Home icon SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
    Home
  </a>
</li>

// Services menu item
<li>
  <a 
    // Apply 'active' class if current route is services
    className={isActive('/services') ? 'active' : ''}
    style={{ 
      // Set text color from theme
      color: theme.colors.text.primary,
      // Set background color based on active state
      backgroundColor: isActive('/services') ? theme.colors.background.hover : 'transparent'
    }}
    // Navigate to services and close drawer on click
    onClick={() => { navigate('/services'); setIsDrawerOpen(false); }}
  >
    {/* Services icon SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    Services
  </a>
</li>

// Barbers menu item
<li>
  <a 
    // Apply 'active' class if current route is barbers
    className={isActive('/barbers') ? 'active' : ''}
    style={{ 
      // Set text color from theme
      color: theme.colors.text.primary,
      // Set background color based on active state
      backgroundColor: isActive('/barbers') ? theme.colors.background.hover : 'transparent'
    }}
    // Navigate to barbers and close drawer on click
    onClick={() => { navigate('/barbers'); setIsDrawerOpen(false); }}
  >
    {/* Barbers icon SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    Barbers
  </a>
</li>

{/* List item for Gallery page */}
<li>
  <a 
    className={isActive('/gallery') ? 'active' : ''} {/* Applies 'active' class if current page is Gallery */}
    style={{ 
      color: theme.colors.text.primary, {/* Sets text color based on theme */}
      backgroundColor: isActive('/gallery') ? theme.colors.background.hover : 'transparent' {/* Changes background color if active */}
    }}
    onClick={() => { navigate('/gallery'); setIsDrawerOpen(false); }} {/* Navigates to Gallery and closes drawer on click */}
  >
    {/* SVG icon for Gallery */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    Gallery
  </a>
</li>

{/* List item for Reviews page (similar structure to Gallery) */}
<li>
  <a 
    className={isActive('/reviews') ? 'active' : ''}
    style={{ 
      color: theme.colors.text.primary,
      backgroundColor: isActive('/reviews') ? theme.colors.background.hover : 'transparent'
    }}
    onClick={() => { navigate('/reviews'); setIsDrawerOpen(false); }}
  >
    {/* SVG icon for Reviews */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
    Reviews
  </a>
</li>

{/* List item for About Us page (similar structure to Gallery and Reviews) */}
<li>
  <a 
    className={isActive('/about') ? 'active' : ''}
    style={{ 
      color: theme.colors.text.primary,
      backgroundColor: isActive('/about') ? theme.colors.background.hover : 'transparent'
    }}
    onClick={() => { navigate('/about'); setIsDrawerOpen(false); }}
  >
    {/* SVG icon for About Us */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    About Us
  </a>
</li>

{/* Divider line */}
<div className="divider" style={{ borderColor: theme.colors.background.hover }}></div>

{/* Account section title */}
<li className="menu-title" style={{ color: theme.colors.text.secondary }}>Account</li>

{/* Book Appointment button */}
<li>
  <a 
    onClick={() => handleAuthRedirect('/booking')} {/* Handles authentication before redirecting to booking */}
    style={{ color: theme.colors.accent.primary }} {/* Sets text color to accent color */}
    className="font-semibold" {/* Applies semi-bold font weight */}
  >
    {/* SVG icon for Book Appointment */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Book Appointment
  </a>
</li>

{currentUser ? (
  <>
    {/* This block is rendered only if a user is logged in */}
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
        {/* SVG icon for the profile link */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile
      </a>
    </li>
    
    {/* Conditional rendering for admin-only link */}
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
          {/* SVG icon for the admin dashboard link */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Admin Dashboard
        </a>
      </li>
    )}
    
    {/* This is a duplicate of the first profile link, likely an error in the original code */}
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
        {/* SVG icon for the profile link (duplicate) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile
      </a>
    </li>

{/* Conditional rendering based on user authentication status */}
{isAuthenticated ? (
  <>
    {/* Logout option for authenticated users */}
    <li>
      <a 
        onClick={handleLogout} // Function to handle logout process
        style={{ color: theme.colors.status.error }} // Styling the logout text in error color
      >
        {/* SVG icon for logout */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {/* Path defining the logout icon shape */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </a>
    </li>
  </>
) : (
  // Sign In option for non-authenticated users
  <li>
    <a 
      onClick={() => { 
        navigate('/login'); // Navigate to login page
        setIsDrawerOpen(false); // Close the drawer/menu
      }}
      style={{ color: theme.colors.text.primary }} // Styling the sign in text in primary color
    >
      {/* SVG icon for sign in */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {/* Path defining the sign in icon shape */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      Sign In
    </a>
  </li>
)}
