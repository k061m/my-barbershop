import { useState, useEffect } from 'react';
import { Branch } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranches() {
      try {
        console.log('Fetching branches...');
        setIsLoading(true);
        setError(null);
        
        const branchesRef = collection(db, 'branches');
        console.log('Branches collection reference:', branchesRef);
        
        const snapshot = await getDocs(branchesRef);
        console.log('Total branches found:', snapshot.size);
        
        const branchesData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Branch document data:', { id: doc.id, data });
          return {
            id: doc.id,
            ...data
          } as Branch;
        });

        console.log('Processed branch data:', branchesData);
        setBranches(branchesData);
      } catch (err) {
        console.error('Error in fetchBranches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch branches');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBranches();
  }, []);

  return { branches, isLoading, error };
} 