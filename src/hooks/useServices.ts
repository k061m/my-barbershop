import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Service } from '../types';

// Custom hook to fetch services from Firestore
export function useServices(additionalConstraints: QueryConstraint[] = []) {
  // State variables to manage services data, loading state, and errors
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Combine default constraints with any additional constraints
        const queryConstraints: QueryConstraint[] = [
          where('isActive', '==', true),
          ...additionalConstraints
        ];
        
        // Create a query to fetch services from Firestore
        const servicesQuery = query(
          collection(db, 'services'),
          ...queryConstraints
        );
        
        // Execute the query and get the results
        const snapshot = await getDocs(servicesQuery);
        // Map the document data to Service objects
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];

        setServices(servicesData);
      } catch (err) {
        // Handle and set any errors that occur during fetching
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        // Set loading to false regardless of success or failure
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []); // Empty dependency array means this effect runs once on mount

  return { services, isLoading, error };
}

// Helper hook to fetch a service by its ID
export function useServiceById(id: string | null) {
  const constraints = id ? [where('id', '==', id)] : [];
  return useServices(constraints);
}

// Helper hook to fetch services within a specific price range
export function useServicesByPriceRange(minPrice: number, maxPrice: number) {
  const constraints = [
    where('price', '>=', minPrice),
    where('price', '<=', maxPrice),
    orderBy('price', 'asc')
  ];
  return useServices(constraints);
}
