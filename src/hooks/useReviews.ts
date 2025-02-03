import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Review } from '../types';

// Custom hook to fetch and manage reviews
export function useReviews(limitCount: number = 10) {
  // State variables to manage reviews, loading state, and error messages
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch reviews when the component mounts or limitCount changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Create a reference to the 'reviews' collection in Firestore
        const reviewsRef = collection(db, 'reviews');
        
        // Construct a query to fetch reviews, ordered by date descending and limited by limitCount
        const q = query(
          reviewsRef,
          orderBy('date', 'desc'),
          limit(limitCount)
        );
        
        // Execute the query and get the results
        const querySnapshot = await getDocs(q);
        
        // Map the query results to an array of Review objects
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];

        // Update the reviews state with the fetched data
        setReviews(reviewsData);
      } catch (err) {
        // Log any errors to the console and update the error state
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        // Set loading to false, regardless of success or failure
        setIsLoading(false);
      }
    };

    // Call the fetchReviews function
    fetchReviews();
  }, [limitCount]); // Re-run the effect if limitCount changes

  // Return an object with the reviews, loading state, and error message
  return { reviews, isLoading, error };
}
