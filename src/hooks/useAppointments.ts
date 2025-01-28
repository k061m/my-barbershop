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
import { Appointment } from '../services/database.service';

function convertTimestamp(doc: DocumentSnapshot): Appointment {
  const data = doc.data();
  if (!data) throw new Error('Document data is undefined');
  
  return {
    id: doc.id,
    userId: data.userId,
    barberId: data.barberId,
    serviceId: data.serviceId,
    date: data.date,  // Keep as Timestamp
    status: data.status,
    notes: data.notes
  };
}

export function useAppointments(queryConstraints: QueryConstraint[] = []) {
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
  }, [JSON.stringify(queryConstraints)]);

  return { appointments, loading, error };
}

// Helper hooks for specific queries
export function useUserAppointments(userId: string | null) {
  const constraints = userId ? [where('userId', '==', userId)] : [];
  return useAppointments(constraints);
}

export function useBarberAppointments(barberId: string | null) {
  const constraints = barberId ? [where('barberId', '==', barberId)] : [];
  return useAppointments(constraints);
}

export function useAppointmentsByDateRange(startDate: Date | null, endDate: Date | null) {
  const constraints = [];
  if (startDate) {
    constraints.push(where('date', '>=', Timestamp.fromDate(startDate)));
  }
  if (endDate) {
    constraints.push(where('date', '<=', Timestamp.fromDate(endDate)));
  }
  return useAppointments(constraints);
}

export function useAppointmentById(id: string | null) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setAppointment(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Set up real-time listener for single document
    const unsubscribe = onSnapshot(
      doc(db, 'appointments', id),
      (docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          setAppointment(convertTimestamp(docSnapshot));
        } else {
          setAppointment(null);
        }
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.error('Error fetching appointment:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  return { appointment, loading, error };
} 
