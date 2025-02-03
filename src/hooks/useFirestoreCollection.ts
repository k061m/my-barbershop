import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

// Define a type that includes an 'id' field
type WithId = { id: string };

// Generic custom hook to fetch and listen to Firestore collections
export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
) {
  // State variables for data, loading status, and error handling
  const [data, setData] = useState<(T & WithId)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create a Firestore query with the given collection name and constraints
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // Map the snapshot documents to an array of objects with data and id
        const items = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          ...doc.data(),
          id: doc.id
        })) as (T & WithId)[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        // Handle any errors that occur during the snapshot listener
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [collectionName, JSON.stringify(queryConstraints)]); // Dependencies for the effect

  // Return an object with the fetched data, loading state, and any error
  return { data, loading, error };
}
