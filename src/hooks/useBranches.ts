// Importing necessary hooks and utilities
import { useState, useEffect } from 'react'; // React hooks for managing state and side effects
import { Branch } from '../types'; // Importing the `Branch` type definition (likely a TypeScript interface or type)
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore functions for querying collections and retrieving documents
import { db } from '../config/firebase'; // Firebase configuration object, which connects to the Firestore database

// Custom hook to fetch and manage branch data
export function useBranches() {
  // State to store the list of branches
  const [branches, setBranches] = useState<Branch[]>([]); 
  // State to track whether data is being loaded
  const [isLoading, setIsLoading] = useState(true); 
  // State to store any error messages that occur during data fetching
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to perform the data fetching when the component mounts
  useEffect(() => {
    // Asynchronous function to fetch branch data from Firestore
    async function fetchBranches() {
      try {
        console.log('Fetching branches...'); // Debug log for tracking execution
        setIsLoading(true); // Indicate that loading has started
        setError(null); // Clear any previous errors

        // Reference to the "branches" collection in Firestore
        const branchesRef = collection(db, 'branches'); 
        console.log('Branches collection reference:', branchesRef); // Debug log for collection reference

        // Fetch all documents in the "branches" collection
        const snapshot = await getDocs(branchesRef); 
        console.log('Total branches found:', snapshot.size); // Log the number of documents retrieved

        // Map over each document in the snapshot to extract its data and ID
        const branchesData = snapshot.docs.map(doc => {
          const data = doc.data(); // Extract document data
          console.log('Branch document data:', { id: doc.id, data }); // Debug log for each document's data and ID
          return {
            id: doc.id, // Include the document ID in the final object
            ...data     // Spread the rest of the document's fields into the object
          } as Branch;  // Type assertion to ensure it matches the `Branch` type
        });

        console.log('Processed branch data:', branchesData); // Log the final processed branch data array
        setBranches(branchesData); // Update state with the fetched branch data
      } catch (err) {
        console.error('Error in fetchBranches:', err); // Log any errors that occur during fetching
        setError(err instanceof Error ? err.message : 'Failed to fetch branches'); 
        // Set an error message in state, ensuring it is a string (if `err` is not an instance of `Error`, a default message is used)
      } finally {
        setIsLoading(false); // Indicate that loading has finished (whether successful or not)
      }
    }

    fetchBranches(); // Call the async function to start fetching data when the component mounts
  }, []); 
  // Empty dependency array ensures this effect runs only once when the component mounts

  return { branches, isLoading, error }; 
  // Return an object containing branch data, loading state, and any errors for use in components that call this hook
}
