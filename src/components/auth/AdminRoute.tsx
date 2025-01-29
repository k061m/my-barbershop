import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if user is logged in and has admin role
  if (!currentUser || currentUser.role !== 'admin') {
    // Redirect to login if not logged in, or to home if logged in but not admin
    const redirectTo = currentUser ? '/' : '/login';
    return <Navigate to={redirectTo} state={{ from: location.pathname }} />;
  }

  return children;
} 