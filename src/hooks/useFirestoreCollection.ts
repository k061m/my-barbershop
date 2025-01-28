import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

type WithId = { id: string };

export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<(T & WithId)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create query with constraints
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          ...doc.data(),
          id: doc.id
        })) as (T & WithId)[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
} 