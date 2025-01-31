import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Service } from '../types';

export function useServices(queryConstraints: QueryConstraint[] = []) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create query with constraints
    const q = query(collection(db, 'services'), ...queryConstraints);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const items: Service[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching services:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [JSON.stringify(queryConstraints)]);

  return { services, loading, error };
}

// Helper hooks for specific queries
export function useServiceById(id: string | null) {
  const constraints = id ? [where('id', '==', id)] : [];
  return useServices(constraints);
}

export function useServicesByPriceRange(minPrice: number, maxPrice: number) {
  const constraints = [
    where('price', '>=', minPrice),
    where('price', '<=', maxPrice),
    orderBy('price', 'asc')
  ];
  return useServices(constraints);
} 