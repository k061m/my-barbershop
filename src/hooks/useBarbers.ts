import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Barber } from '../types';

// Custom hook to fetch barbers based on branch ID
export function useBarbers(branchId?: string) {
  // State variables to manage barbers data, loading state, and errors
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize query constraints with active barbers
        const queryConstraints: QueryConstraint[] = [
          where('isActive', '==', true)
        ];
        
        // Add branch constraint if branchId is provided
        if (branchId) {
          queryConstraints.push(where('branches', 'array-contains', branchId));
        }
        
        // Create a query to fetch barbers based on constraints
        const barbersQuery = query(
          collection(db, 'barbers'),
          ...queryConstraints
        );
        
        // Execute the query and get the snapshot
        const snapshot = await getDocs(barbersQuery);
        // Map the snapshot data to Barber objects
        const barbersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Barber[];

        setBarbers(barbersData);
      } catch (err) {
        // Handle errors and set error message
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBarbers();
  }, [branchId]); // Re-run effect when branchId changes

  return { barbers, isLoading, error };
}

// Helper hook to fetch a barber by email
export function useBarberByEmail(email: string | null) {
  // State variables similar to useBarbers hook
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBarbers() {
      // If no email is provided, reset state and return
      if (!email) {
        setBarbers([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Create a query to fetch barbers by email
        const barbersQuery = query(
          collection(db, 'barbers'),
          where('personalInfo.email', '==', email)
        );
        
        // Execute the query and map results to Barber objects
        const snapshot = await getDocs(barbersQuery);
        const barbersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Barber[];

        setBarbers(barbersData);
      } catch (err) {
        // Handle errors
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBarbers();
  }, [email]) // Re-run effect when email changes

  return { barbers, isLoading, error };
}


// This function is a custom React hook that fetches barber data based on a given `id`.
export function useBarberById(id: string | null) {
  // State to store the list of barbers that match the given `id`.
  const [barbers, setBarbers] = useState<Barber[]>([]);

  // State to track whether the data is currently being loaded.
  const [isLoading, setIsLoading] = useState(true);

  // State to store any error message if something goes wrong during data fetching.
  const [error, setError] = useState<string | null>(null);

  // `useEffect` is used to perform a side effect (fetching data) when the `id` changes.
  useEffect(() => {
    // Define an asynchronous function to fetch barbers from the database.
    async function fetchBarbers() {
      // If no `id` is provided, clear the barbers list and stop loading.
      if (!id) {
        setBarbers([]);
        setIsLoading(false);
        return;
      }

      try {
        // Start loading and reset any previous errors.
        setIsLoading(true);
        setError(null);

        // Create a Firestore query to fetch barbers whose `id` matches the given `id`.
        const barbersQuery = query(
          collection(db, 'barbers'), // Refers to the 'barbers' collection in Firestore.
          where('id', '==', id)     // Adds a condition to filter documents where `id` matches the given `id`.
        );

        // Execute the query and get the matching documents (snapshots).
        const snapshot = await getDocs(barbersQuery);

        // Map over the documents in the snapshot and extract their data.
        const barbersData = snapshot.docs.map(doc => ({
          id: doc.id,       // Include the document ID in the result.
          ...doc.data()     // Spread the rest of the document's fields into the object.
        })) as Barber[];    // Type assertion to indicate that this is an array of `Barber`.

        // Update state with the fetched barber data.
        setBarbers(barbersData);
      } catch (err) {
        // If an error occurs, update the error state with a descriptive message.
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers');
      } finally {
        // Stop loading regardless of whether fetching succeeded or failed.
        setIsLoading(false);
      }
    }

    // Call the asynchronous function to fetch barbers when `id` changes.
    fetchBarbers();
  }, [id]); // Dependency array ensures this effect runs only when `id` changes.

  // Return an object containing the fetched barbers, loading status, and any error message.
  return { barbers, isLoading, error };
}

// This function is another custom hook that reuses functionality from `useBarberById`.
// It allows fetching barbers based on a branch ID instead of an individual barber ID.
export function useBarbersByBranch(branchId: string | null) {
  return useBarberById(branchId || undefined); 
  // If `branchId` is null, pass `undefined` to avoid unnecessary queries.
}
