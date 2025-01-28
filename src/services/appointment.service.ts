import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  orderBy,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface Appointment {
  id?: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: Timestamp;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

interface AppointmentInput {
  userId: string;
  barberId: string;
  serviceId: string;
  date: Date | Timestamp;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

// Helper function to convert Firestore data to Appointment
function convertToAppointment(id: string, data: DocumentData): Appointment {
  return {
    id,
    userId: data.userId,
    barberId: data.barberId,
    serviceId: data.serviceId,
    date: data.date,
    status: data.status,
    notes: data.notes
  };
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, 'appointments'),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        convertToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  },

  async getAppointment(id: string): Promise<Appointment | null> {
    try {
      const docRef = doc(db, 'appointments', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      
      return convertToAppointment(docSnap.id, docSnap.data());
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw error;
    }
  },

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        convertToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting user appointments:', error);
      throw error;
    }
  },

  async getBarberAppointments(barberId: string): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('barberId', '==', barberId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        convertToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting barber appointments:', error);
      throw error;
    }
  },

  async createAppointment(data: AppointmentInput): Promise<string> {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const appointmentData = {
        ...data,
        date: data.date instanceof Date ? Timestamp.fromDate(data.date) : data.date,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(appointmentsRef, appointmentData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  async updateAppointment(appointmentId: string, updates: Partial<AppointmentInput>): Promise<void> {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const updateData = { ...updates };
      if (updates.date) {
        updateData.date = updates.date instanceof Date ? Timestamp.fromDate(updates.date) : updates.date;
      }
      await updateDoc(appointmentRef, updateData);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  async deleteAppointment(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => 
        convertToAppointment(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting appointments by date range:', error);
      throw error;
    }
  }
}; 
