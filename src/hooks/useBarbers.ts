import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Barber } from '../types';

export function useBarbers(branchId?: string) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        setIsLoading(true);
        setError(null);
        
        const queryConstraints: QueryConstraint[] = [
          where('isActive', '==', true)
        ];
        
        // Only add branch constraint if branchId is provided
        if (branchId) {
          queryConstraints.push(where('branches', 'array-contains', branchId));
        }
        
        const barbersQuery = query(
          collection(db, 'barbers'),
          ...queryConstraints
        );
        
        const snapshot = await getDocs(barbersQuery);
        const barbersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Barber[];

        setBarbers(barbersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBarbers();
  }, [branchId]);

  return { barbers, isLoading, error };
}

// Helper hooks for specific queries
export function useBarberByEmail(email: string | null) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBarbers() {
      if (!email) {
        setBarbers([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const barbersQuery = query(
          collection(db, 'barbers'),
          where('personalInfo.email', '==', email)
        );
        
        const snapshot = await getDocs(barbersQuery);
        const barbersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Barber[];

        setBarbers(barbersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBarbers();
  }, [email]);

  return { barbers, isLoading, error };
}

export function useBarberById(id: string | null) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBarbers() {
      if (!id) {
        setBarbers([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const barbersQuery = query(
          collection(db, 'barbers'),
          where('id', '==', id)
        );
        
        const snapshot = await getDocs(barbersQuery);
        const barbersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Barber[];

        setBarbers(barbersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch barbers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBarbers();
  }, [id]);

  return { barbers, isLoading, error };
}

export function useBarbersByBranch(branchId: string | null) {
  return useBarbers(branchId || undefined);
} 