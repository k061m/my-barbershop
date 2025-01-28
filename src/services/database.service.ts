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
  DocumentData,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from './auth.service';

// Interfaces
export interface Barber extends DocumentData {
  id?: string;
  name: string;
  speciality: string;
  image?: string;
  bio?: string;
  rating?: number;
}

export interface Service extends DocumentData {
  id?: string;
  name: string;
  duration: string;
  price: number;
  image?: string;
  description?: string;
}

export interface Appointment extends DocumentData {
  id?: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: Timestamp;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Review extends DocumentData {
  id?: string;
  userId: string;
  barberId: string;
  rating: number;
  comment: string;
  date: Timestamp;
}

// Add UserRole type
export type UserRole = 'user' | 'admin' | 'barber';

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

// Database Service
export const dbService = {
  // Barbers
  async getBarbers(): Promise<Barber[]> {
    const querySnapshot = await getDocs(collection(db, 'barbers'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Barber[];
  },

  async getBarber(id: string): Promise<Barber | null> {
    const docRef = doc(db, 'barbers', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Barber : null;
  },

  async addBarber(barber: Omit<Barber, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'barbers'), barber);
    return docRef.id;
  },

  async updateBarber(id: string, barber: Partial<Barber>): Promise<void> {
    await updateDoc(doc(db, 'barbers', id), barber);
  },

  async deleteBarber(id: string): Promise<void> {
    await deleteDoc(doc(db, 'barbers', id));
  },

  // Services
  async getServices(): Promise<Service[]> {
    const querySnapshot = await getDocs(collection(db, 'services'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
  },

  async getService(id: string): Promise<Service | null> {
    const docRef = doc(db, 'services', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Service : null;
  },

  async addService(service: Omit<Service, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'services'), service);
    return docRef.id;
  },

  async updateService(id: string, service: Partial<Service>): Promise<void> {
    await updateDoc(doc(db, 'services', id), service);
  },

  async deleteService(id: string): Promise<void> {
    await deleteDoc(doc(db, 'services', id));
  },

  // Appointments
  async getAppointments(userId?: string): Promise<Appointment[]> {
    const appointmentsRef = collection(db, 'appointments');
    const q = userId 
      ? query(appointmentsRef, where('userId', '==', userId))
      : appointmentsRef;
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
  },

  async getAppointment(id: string): Promise<Appointment | null> {
    const docRef = doc(db, 'appointments', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Appointment : null;
  },

  async addAppointment(appointment: Omit<Appointment, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'appointments'), appointment);
    return docRef.id;
  },

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<void> {
    await updateDoc(doc(db, 'appointments', id), appointment);
  },

  async deleteAppointment(id: string): Promise<void> {
    await deleteDoc(doc(db, 'appointments', id));
  },

  // Reviews
  async getReviews(barberId?: string): Promise<Review[]> {
    const reviewsRef = collection(db, 'reviews');
    const q = barberId 
      ? query(reviewsRef, where('barberId', '==', barberId))
      : reviewsRef;
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
  },

  async getReview(id: string): Promise<Review | null> {
    const docRef = doc(db, 'reviews', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Review : null;
  },

  async addReview(review: Omit<Review, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'reviews'), review);
    return docRef.id;
  },

  async updateReview(id: string, review: Partial<Review>): Promise<void> {
    await updateDoc(doc(db, 'reviews', id), review);
  },

  async deleteReview(id: string): Promise<void> {
    await deleteDoc(doc(db, 'reviews', id));
  },

  // User Profile Methods
  async createUserProfile(uid: string, email: string): Promise<void> {
    let lastError;
    for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
      try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          email,
          createdAt: new Date().toISOString(),
          role: 'user'
        });
        return;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error;
        if (attempt < RETRY_ATTEMPTS - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    throw lastError;
  },

  async getUserProfile(uid: string) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    let lastError;
    for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
      try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
          ...profile,
          updatedAt: new Date().toISOString()
        });
        return;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        lastError = error;
        if (attempt < RETRY_ATTEMPTS - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    throw lastError;
  },

  async isUserAdmin(uid: string): Promise<boolean> {
    const profile = await this.getUserProfile(uid);
    return profile?.role === 'admin';
  }
}; 