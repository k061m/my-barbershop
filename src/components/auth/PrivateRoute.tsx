// Import necessary components and hooks
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Define the props interface for PrivateRoute component
interface PrivateRouteProps {
  children: React.ReactNode;
}

// Define the PrivateRoute component
export default function PrivateRoute({ children }: PrivateRouteProps) {
  // Use the useAuth hook to get current user and loading state
  const { currentUser, loading } = useAuth();

  // If the authentication state is still loading, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // If user is authenticated, render the children components
  // Otherwise, redirect to the login page
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}
