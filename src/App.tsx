import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginModal from './components/LoginModal';

// Public Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import BarbersPage from './pages/BarbersPage';
import GalleryPage from './pages/GalleryPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

// Database initialization
import { initializeDatabase, isDatabaseInitialized } from './config/initializeDatabase';

function AppContent() {
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkAndInitializeDatabase = async () => {
      try {
        const isInitialized = await isDatabaseInitialized();
        if (!isInitialized) {
          console.log('Initializing database...');
          await initializeDatabase();
          console.log('Database initialized successfully');
        }
      } catch (error) {
        console.error('Error checking/initializing database:', error);
      }
    };

    checkAndInitializeDatabase();
  }, []);

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLoginModalOpen(true);
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route path="/barbers" element={<Layout><BarbersPage /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<Navigate to={location.state?.from || '/'} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Layout><DashboardPage /></Layout>
            ) : (
              <Navigate to="/login" state={{ from: '/dashboard' }} />
            )
          }
        />
        <Route
          path="/booking"
          element={
            currentUser ? (
              <Layout><BookingPage /></Layout>
            ) : (
              <Navigate to="/login" state={{ from: '/booking' }} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            currentUser ? (
              <Layout><ProfilePage /></Layout>
            ) : (
              <Navigate to="/login" state={{ from: '/profile' }} />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            currentUser ? (
              <Layout><AdminPage /></Layout>
            ) : (
              <Navigate to="/login" state={{ from: '/admin' }} />
            )
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
} 