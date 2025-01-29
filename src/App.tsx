import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BarbersPage from './pages/BarbersPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { useEffect, lazy, Suspense, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

export default function App() {
  const { currentUser } = useAuth();
  const [firebaseBlocked, _] = useState(false);

  useEffect(() => {
    if (currentUser) {
      console.log('Auth state changed:', currentUser.email);
    }
  }, [currentUser]);


  if (firebaseBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Connection Blocked</h2>
          <p className="text-gray-600">
            It seems your ad blocker is preventing the app from connecting to our services. 
            Please whitelist this site or disable your ad blocker to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="barbers" element={<BarbersPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfilePage />
                </Suspense>
              </PrivateRoute>
            } 
          />
          <Route 
            path="booking" 
            element={
              <PrivateRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <BookingPage />
                </Suspense>
              </PrivateRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="admin/*" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
} 