import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Barber } from '../services/database.service';

export function useBarbers(queryConstraints: QueryConstraint[] = []) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create query with constraints
    const q = query(collection(db, 'barbers'), ...queryConstraints);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items: Barber[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Barber);
        });
        setBarbers(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching barbers:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [JSON.stringify(queryConstraints)]);

  return { barbers, loading, error };
}

// Helper hooks for specific queries
export function useBarberByEmail(email: string | null) {
  const constraints = email ? [where('email', '==', email)] : [];
  return useBarbers(constraints);
}

export function useBarberById(id: string | null) {
  const constraints = id ? [where('id', '==', id)] : [];
  return useBarbers(constraints);
} 