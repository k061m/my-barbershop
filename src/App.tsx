import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { theme } from './config/theme';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import BarbersPage from './pages/BarbersPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col" style={{ 
            backgroundColor: theme.colors.background.primary,
            color: theme.colors.text.primary,
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}>
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
                  element={<Navigate to="/dashboard" replace />} 
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
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
} 