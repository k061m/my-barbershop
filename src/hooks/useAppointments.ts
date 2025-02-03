import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  QueryConstraint,
  Timestamp,
  doc,
  DocumentSnapshot,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Define the structure of an Appointment object
export interface Appointment {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  branchId: string;
  date: Timestamp;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

// Function to convert Firestore document to Appointment object
function convertTimestamp(doc: DocumentSnapshot): Appointment {
  const data = doc.data();
  if (!data) throw new Error('Document data is undefined');
  
  return {
    id: doc.id,
    userId: data.userId,
    barberId: data.barberId,
    serviceId: data.serviceId,
    branchId: data.branchId,
    date: data.date,  // Keep as Timestamp
    status: data.status,
    notes: data.notes
  };
}

// Custom hook to fetch and manage appointments
export function useAppointments(queryConstraints: QueryConstraint[] = []) {
  // State variables for appointments, loading status, and error
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create query with constraints
    const q = query(
      collection(db, 'appointments'),
      orderBy('date', 'desc'),
      ...queryConstraints
    );
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // Convert documents to Appointment objects
        const items: Appointment[] = snapshot.docs.map(convertTimestamp);
        setAppointments(items);
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.error('Error fetching appointments:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [JSON.stringify(queryConstraints)]); // Re-run effect if queryConstraints change

  return { appointments, loading, error };
}


// Helper hooks for specific queries

// This hook retrieves appointments for a specific user based on their userId.
export function useUserAppointments(userId: string | null) {
  // If a userId is provided, create a Firestore constraint to filter appointments by userId.
  const constraints = userId ? [where('userId', '==', userId)] : [];
  
  // Reuse the useAppointments hook with the specified constraints.
  return useAppointments(constraints);
}

// This hook retrieves appointments for a specific barber based on their barberId.
export function useBarberAppointments(barberId: string | null) {
  // If a barberId is provided, create a Firestore constraint to filter appointments by barberId.
  const constraints = barberId ? [where('barberId', '==', barberId)] : [];
  
  // Reuse the useAppointments hook with the specified constraints.
  return useAppointments(constraints);
}

// This hook retrieves appointments within a specific date range (startDate to endDate).
export function useAppointmentsByDateRange(startDate: Date | null, endDate: Date | null) {
  const constraints = []; // Initialize an empty array to hold Firestore constraints.

  // If startDate is provided, add a constraint to filter appointments with dates >= startDate.
  if (startDate) {
    constraints.push(where('date', '>=', Timestamp.fromDate(startDate)));
  }

  // If endDate is provided, add a constraint to filter appointments with dates <= endDate.
  if (endDate) {
    constraints.push(where('date', '<=', Timestamp.fromDate(endDate)));
  }

  // Reuse the useAppointments hook with the specified constraints.
  return useAppointments(constraints);
}

// This hook retrieves a single appointment by its unique ID and handles real-time updates.
export function useAppointmentById(id: string | null) {
  // State to store the fetched appointment data, loading status, and potential errors.
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // React's useEffect hook is used to handle side effects (e.g., fetching data).
  useEffect(() => {
    // If no ID is provided, reset the state and stop loading.
    if (!id) {
      setAppointment(null);
      setLoading(false);
      return;
    }

    // Set loading to true before starting the fetch process.
    setLoading(true);

    // Set up a real-time listener for a single document in the 'appointments' collection.
    const unsubscribe = onSnapshot(
      doc(db, 'appointments', id), // Reference to the Firestore document by its ID.
      
      // Callback when the document snapshot changes or is initially fetched.
      (docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          // If the document exists, convert its data (e.g., timestamps) and update state.
          setAppointment(convertTimestamp(docSnapshot));
        } else {
          // If the document does not exist, clear the appointment state.
          setAppointment(null);
        }
        setLoading(false); // Stop loading after fetching data.
        setError(null); // Clear any previous errors.
      },

      // Error callback in case of issues with fetching or listening to the document.
      (err: FirestoreError) => {
        console.error('Error fetching appointment:', err); // Log error for debugging purposes.
        setError(err); // Update state with error details.
        setLoading(false); // Stop loading even if there's an error.
      }
    );

    // Cleanup function to unsubscribe from the real-time listener when the component unmounts
    // or when the ID changes (to avoid memory leaks).
    return () => unsubscribe();
  }, [id]); // Dependency array ensures this effect runs only when `id` changes.

  // Return an object containing the fetched appointment data, loading status, and any errors encountered.
  return { appointment, loading, error };
}
