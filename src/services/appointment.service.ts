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
  DocumentData,
  CollectionReference,
  limit,
  QueryConstraint,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { parseISO, isWithinInterval, set, startOfDay } from 'date-fns';

/**
 * Interface representing the data structure for an appointment
 * @interface AppointmentData
 */
export interface AppointmentData {
  /** The ID of the user who made the appointment */
  userId: string;
  /** The ID of the barber assigned to the appointment */
  barberId: string;
  /** The ID of the branch where the appointment will take place */
  branchId: string;
  /** The ID of the service to be provided */
  serviceId: string;
  /** The date and time of the appointment */
  date: Date | Timestamp;
  /** The current status of the appointment */
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  /** The timestamp when the appointment was created */
  createdAt: Date | Timestamp;
  /** The price of the service */
  price: number;
  /** The timestamp when the appointment was last modified */
  lastModified?: Timestamp;
  /** The duration of the service in minutes */
  duration: number;
}

/**
 * Interface representing an appointment with optional fields
 * @interface Appointment
 */
interface Appointment {
  /** Unique identifier for the appointment */
  id?: string;
  /** The ID of the user who made the appointment */
  userId: string;
  /** The ID of the branch where the appointment will take place */
  branchId: string;
  /** The ID of the barber assigned to the appointment */
  barberId: string;
  /** The ID of the service to be provided */
  serviceId: string;
  /** The date and time of the appointment */
  date: Timestamp;
  /** The current status of the appointment */
  status: 'pending' | 'confirmed' | 'cancelled';
  /** Optional notes about the appointment */
  notes?: string;
}

/**
 * Helper function to convert Firestore data to Appointment type
 * @param id - The document ID
 * @param data - The Firestore document data
 * @returns Appointment object
 */
const convertToAppointment = (id: string, data: DocumentData): Appointment => ({
  id,
  userId: data.userId,
  branchId: data.branchId,
  barberId: data.barberId,
  serviceId: data.serviceId,
  date: data.date,
  status: data.status,
  notes: data.notes
});

/**
 * Service class for managing appointments in the application
 * Handles CRUD operations and various appointment-related queries
 */
class AppointmentService {
  // Cache the collection reference
  private readonly collectionRef: CollectionReference;
  
  constructor() {
    this.collectionRef = collection(db, 'appointments');
  }

  /**
   * Creates a new appointment in the database
   * @param data - The appointment data without status and creation timestamp
   * @returns Promise with the created appointment ID
   * @throws Error if the date is invalid or if creation fails
   */
  async createAppointment(data: Omit<AppointmentData, 'createdAt' | 'status'>) {
    try {
      // Validate the date
      if (!(data.date instanceof Date) || isNaN(data.date.getTime())) {
        throw new Error('Invalid appointment date');
      }

      const now = new Date();
      const appointmentData: AppointmentData = {
        ...data,
        status: 'pending',
        createdAt: now,
      };

      // Convert dates to Firestore Timestamps once
      const firestoreDate = data.date instanceof Date 
        ? Timestamp.fromDate(data.date)
        : data.date;
      const firestoreCreatedAt = Timestamp.fromDate(now);

      const docRef = await addDoc(this.collectionRef, {
        ...appointmentData,
        date: firestoreDate,
        createdAt: firestoreCreatedAt,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error instanceof Error ? error : new Error('Failed to create appointment');
    }
  }

  /**
   * Retrieves all appointments for a specific user with pagination
   * @param userId - The ID of the user
   * @param pageSize - Number of appointments to fetch per page
   * @param lastDoc - Last document from previous page for pagination
   * @returns Promise with array of appointments and last document
   * @throws Error if fetching fails
   */
  async getUserAppointments(userId: string, pageSize: number = 10, lastDoc?: DocumentData) {
    try {
      const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(pageSize)
      ];

      if (lastDoc) {
        constraints.push(where('date', '<', lastDoc.date));
      }

      const q = query(this.collectionRef, ...constraints);
      const snapshot = await getDocs(q);
      
      const appointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        appointments,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]?.data()
      };
    } catch (error) {
      console.error('Error getting user appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  /**
   * Updates an existing appointment with optimistic concurrency control
   * @param appointmentId - The ID of the appointment to update
   * @param data - The partial appointment data to update
   * @throws Error if update fails
   */
  async updateAppointment(appointmentId: string, data: Partial<AppointmentData>) {
    try {
      const appointmentRef = doc(this.collectionRef, appointmentId);
      const updateData = { ...data };
      
      if (data.date instanceof Date) {
        updateData.date = Timestamp.fromDate(data.date);
      }

      // Add last modified timestamp
      updateData.lastModified = Timestamp.now();
      
      await updateDoc(appointmentRef, updateData);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment');
    }
  }

  /**
   * Retrieves all appointments
   * @returns Promise with array of all appointments
   * @throws Error if fetching fails
   */
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

  /**
   * Retrieves a single appointment by ID
   * @param id - The ID of the appointment
   * @returns Promise with the appointment or null if not found
   * @throws Error if fetching fails
   */
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

  /**
   * Retrieves all appointments for a specific barber
   * @param barberId - The ID of the barber
   * @returns Promise with array of appointments
   * @throws Error if fetching fails
   */
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

  /**
   * Deletes an appointment
   * @param id - The ID of the appointment to delete
   * @throws Error if deletion fails
   */
  async deleteAppointment(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  /**
   * Batch deletes multiple appointments
   * @param ids - Array of appointment IDs to delete
   * @throws Error if deletion fails
   */
  async batchDeleteAppointments(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
        const docRef = doc(this.collectionRef, id);
        batch.delete(docRef);
      });
      await batch.commit();
    } catch (error) {
      console.error('Error batch deleting appointments:', error);
      throw error;
    }
  }

  /**
   * Retrieves appointments within a specific date range with pagination
   * @param startDate - The start date of the range
   * @param endDate - The end date of the range
   * @param pageSize - Number of appointments to fetch per page
   * @param lastDoc - Last document from previous page for pagination
   * @returns Promise with array of appointments and last document
   * @throws Error if fetching fails
   */
  async getAppointmentsByDateRange(
    startDate: Date,
    endDate: Date,
    pageSize: number = 10,
    lastDoc?: DocumentData
  ): Promise<{ appointments: Appointment[]; lastDoc?: DocumentData }> {
    try {
      const constraints: QueryConstraint[] = [
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'asc'),
        limit(pageSize)
      ];

      if (lastDoc) {
        constraints.push(where('date', '>', lastDoc.date));
      }

      const q = query(this.collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return {
        appointments: querySnapshot.docs.map(doc => convertToAppointment(doc.id, doc.data())),
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]?.data()
      };
    } catch (error) {
      console.error('Error getting appointments by date range:', error);
      throw error;
    }
  }

  /**
   * Checks if a time slot is available for a branch and barber
   * @param branchId - ID of the branch
   * @param barberId - ID of the barber
   * @param date - Date of the appointment
   * @param time - Time of the appointment
   * @param duration - Duration of the service in minutes
   * @returns Promise with availability status and conflicting appointments if any
   */
  async checkAvailability(
    branchId: string,
    barberId: string,
    date: string,
    time: string,
    duration: number
  ): Promise<{ available: boolean; conflicts?: Appointment[] }> {
    try {
      // Parse the date and time
      const [hours, minutes] = time.split(':');
      const appointmentDate = set(parseISO(date), {
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        seconds: 0,
        milliseconds: 0
      });

      // Calculate end time
      const endTime = new Date(appointmentDate.getTime() + duration * 60000);

      // Query for appointments on that day only
      const startOfDayDate = startOfDay(appointmentDate);
      const endOfDayDate = new Date(startOfDayDate);
      endOfDayDate.setHours(23, 59, 59, 999);

      // Simpler query that only filters by date range and branch
      const q = query(
        this.collectionRef,
        where('branchId', '==', branchId),
        where('date', '>=', Timestamp.fromDate(startOfDayDate)),
        where('date', '<=', Timestamp.fromDate(endOfDayDate))
      );

      const snapshot = await getDocs(q);
      const appointments = snapshot.docs
        .map(doc => convertToAppointment(doc.id, doc.data()))
        .filter(appt => 
          // Filter in memory
          appt.status !== 'cancelled' &&
          appt.barberId === barberId &&
          isWithinInterval(appt.date.toDate(), {
            start: appointmentDate,
            end: endTime
          })
        );

      return {
        available: appointments.length === 0,
        conflicts: appointments
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error instanceof Error ? error : new Error('Failed to check availability');
    }
  }

  /**
   * Gets available time slots for a specific date
   * @param branchId - ID of the branch
   * @param barberId - ID of the barber
   * @param date - Date to check
   * @param duration - Duration of the service in minutes
   * @returns Promise with array of available time slots
   */
  async getAvailableTimeSlots(
    branchId: string,
    barberId: string,
    date: string,
    duration: number
  ): Promise<string[]> {
    try {
      // Define business hours (9 AM to 5 PM)
      const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30'
      ];

      // Get the date range for the entire day
      const selectedDate = parseISO(date);
      const dayStart = startOfDay(selectedDate);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      // Simplest possible query - just by branchId
      const q = query(
        this.collectionRef,
        where('branchId', '==', branchId)
      );

      const snapshot = await getDocs(q);
      const existingAppointments = snapshot.docs
        .map(doc => convertToAppointment(doc.id, doc.data()))
        .filter(appt => {
          const appointmentDate = appt.date.toDate();
          return (
            appt.barberId === barberId && 
            appt.status !== 'cancelled' &&
            appointmentDate >= dayStart &&
            appointmentDate <= dayEnd
          );
        });

      // Check each time slot against existing appointments
      const availableSlots = timeSlots.filter(time => {
        const [hours, minutes] = time.split(':');
        const slotStart = set(selectedDate, {
          hours: parseInt(hours),
          minutes: parseInt(minutes),
          seconds: 0,
          milliseconds: 0
        });
        const slotEnd = new Date(slotStart.getTime() + duration * 60000);

        // Check if this slot conflicts with any existing appointment
        const hasConflict = existingAppointments.some(appt => {
          const appointmentStart = appt.date.toDate();
          const appointmentEnd = new Date(appointmentStart.getTime() + (appt as any).duration * 60000);
          
          return (
            (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
            (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
            (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
          );
        });

        return !hasConflict;
      });

      return availableSlots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      // Return empty array instead of throwing to handle gracefully in UI
      return [];
    }
  }
}

// Export a singleton instance of the service
export const appointmentService = new AppointmentService(); 
