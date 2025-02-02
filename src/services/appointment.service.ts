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

export interface AppointmentData {
  userId: string;
  barberId: string;
  branchId: string;
  serviceId: string;
  date: Date | Timestamp;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date | Timestamp;
  price: number;
}

interface Appointment {
  id?: string;
  userId: string;
  branchId: string;
  barberId: string;
  serviceId: string;
  date: Timestamp;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

// Helper function to convert Firestore data to Appointment
function convertToAppointment(id: string, data: DocumentData): Appointment {
  return {
    id,
    userId: data.userId,
    branchId: data.branchId,
    barberId: data.barberId,
    serviceId: data.serviceId,
    date: data.date,
    status: data.status,
    notes: data.notes
  };
}

class AppointmentService {
  private collection = 'appointments';

  async createAppointment(data: Omit<AppointmentData, 'createdAt' | 'status'>) {
    try {
      // Validate the date
      if (!(data.date instanceof Date) || isNaN(data.date.getTime())) {
        throw new Error('Invalid appointment date');
      }

      const appointmentData: AppointmentData = {
        ...data,
        status: 'pending',
        createdAt: new Date(),
      };

      // Ensure we're creating new Date objects for Firestore
      const docRef = await addDoc(collection(db, this.collection), {
        ...appointmentData,
        date: appointmentData.date instanceof Date ? appointmentData.date : appointmentData.date.toDate(),
        createdAt: appointmentData.createdAt instanceof Date ? appointmentData.createdAt : appointmentData.createdAt.toDate(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error instanceof Error ? error : new Error('Failed to create appointment');
    }
  }

  async getUserAppointments(userId: string) {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date,
          createdAt: data.createdAt
        };
      });
    } catch (error) {
      console.error('Error getting user appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  async updateAppointment(appointmentId: string, data: Partial<AppointmentData>) {
    try {
      const appointmentRef = doc(db, this.collection, appointmentId);
      const updateData = { ...data };
      
      if (data.date instanceof Date) {
        updateData.date = Timestamp.fromDate(data.date);
      }
      
      await updateDoc(appointmentRef, updateData);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment');
    }
  }

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
  }

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
  }

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
  }

  async deleteAppointment(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

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
}

export const appointmentService = new AppointmentService(); 
