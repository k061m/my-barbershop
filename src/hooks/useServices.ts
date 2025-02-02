import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Service } from '../types';

export function useServices(additionalConstraints: QueryConstraint[] = []) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        setError(null);
        
        const queryConstraints: QueryConstraint[] = [
          where('isActive', '==', true),
          ...additionalConstraints
        ];
        
        const servicesQuery = query(
          collection(db, 'services'),
          ...queryConstraints
        );
        
        const snapshot = await getDocs(servicesQuery);
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];

        setServices(servicesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  return { services, isLoading, error };
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