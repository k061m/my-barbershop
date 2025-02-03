// Import necessary hooks and functions from React and Firebase
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Define the structure of a user profile
interface UserProfile {
  email: string;
  displayName?: string;
  photoURL?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Custom hook to fetch and manage user data
export function useUser(userId: string | null) {
  // State variables to manage user data, loading state, and errors
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Effect hook to fetch user data when userId changes
  useEffect(() => {
    // If no userId is provided, reset user state and exit
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Async function to fetch user data from Firestore
    const fetchUser = async () => {
      try {
        // Attempt to get the user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          // If the document exists, set the user state
          setUser(userDoc.data() as UserProfile);
        } else {
          // If the document doesn't exist, set user to null
          setUser(null);
        }
      } catch (err) {
        // Handle any errors that occur during fetching
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        // Set loading to false, regardless of the outcome
        setLoading(false);
      }
    };

    // Call the fetchUser function
    fetchUser();
  }, [userId]); // This effect runs when userId changes

  // Return an object with user data, loading state, and any error
  return { user, loading, error };
}
