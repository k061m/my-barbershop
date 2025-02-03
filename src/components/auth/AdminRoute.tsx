// Import necessary dependencies
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Define the AdminRoute component
export default function AdminRoute({ children }: { children: JSX.Element }) {
  // Get the current user from the AuthContext
  const { currentUser } = useAuth();
  // Get the current location
  const location = useLocation();
  // State to store the admin status
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Effect to check admin status when the component mounts or currentUser changes
  useEffect(() => {
    async function checkAdminStatus() {
      // If there's no current user, set isAdmin to false
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      try {
        // Fetch the user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        // Set isAdmin based on whether the document exists and the role is 'admin'
        setIsAdmin(userDoc.exists() && userDoc.data()?.role === 'admin');
      } catch (error) {
        // Log any errors and set isAdmin to false
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [currentUser]);

  // If admin status is still being checked, show a loading message
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // If user is not logged in or not an admin, redirect
  if (!currentUser || !isAdmin) {
    // Determine the redirect path based on whether the user is logged in
    const redirectTo = currentUser ? '/' : '/login';
    // Redirect, passing the current location for potential "return to" functionality
    return <Navigate to={redirectTo} state={{ from: location.pathname }} />;
  }

  // If user is an admin, render the children components
  return children;
}
