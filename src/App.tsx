import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { theme } from './config/theme';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ForgotPasswordViaEmailPage from './pages/ForgotPasswordViaEmailPage';
import ForgotPasswordViaSmsPage from './pages/ForgotPasswordViaSmsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PasswordResetSuccessPage from './pages/PasswordResetSuccessPage';
import CodeSentPage from './pages/CodeSentPage';
import VerifyCodePage from './pages/VerifyCodePage';
import DashboardPage from './pages/DashboardPage';
import BarbersPage from './pages/BarbersPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/common/LoadingSpinner';
import BranchesPage from './pages/BranchesPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import AboutPage from './pages/AboutPage';

// Lazy load routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
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
                  <Route path="about" element={<AboutPage />} />
                  
                  {/* Forgot Password Flow */}
                  <Route path="forgot-password">
                    <Route index element={<ForgotPasswordPage />} />
                    <Route path="email" element={<ForgotPasswordViaEmailPage />} />
                    <Route path="sms" element={<ForgotPasswordViaSmsPage />} />
                    <Route path="code-sent" element={<CodeSentPage />} />
                    <Route path="verify" element={<VerifyCodePage />} />
                    <Route path="reset" element={<ResetPasswordPage />} />
                    <Route path="success" element={<PasswordResetSuccessPage />} />
                  </Route>

                  {/* Redirect /reset-password to /forgot-password/reset */}
                  <Route 
                    path="reset-password" 
                    element={<Navigate to="/forgot-password/reset" replace />} 
                  />
                  <Route 
                    path="reset-password/success" 
                    element={<Navigate to="/forgot-password/success" replace />} 
                  />

                  <Route path="barbers" element={<BarbersPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="gallery" element={<GalleryPage />} />
                  <Route path="branches" element={<BranchesPage />} />
                  <Route path="reviews" element={<ReviewsPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  
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
                      <Suspense fallback={<LoadingSpinner />}>
                        <BookingPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="booking/success" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <BookingSuccessPage />
                      </Suspense>
                    } 
                  />
                  <Route path="/booking/:id" element={<AppointmentDetailsPage />} />
                  
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
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
} 