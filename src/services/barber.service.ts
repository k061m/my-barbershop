import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Barber } from './database.service';

export const barberService = {
  async getBarbers(): Promise<Barber[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'barbers'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Barber[];
    } catch (error) {
      console.error('Error getting barbers:', error);
      throw error;
    }
  },

  async getBarber(id: string): Promise<Barber | null> {
    try {
      const docRef = doc(db, 'barbers', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Barber : null;
    } catch (error) {
      console.error('Error getting barber:', error);
      throw error;
    }
  },

  async addBarber(barber: Omit<Barber, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'barbers'), barber);
      return docRef.id;
    } catch (error) {
      console.error('Error adding barber:', error);
      throw error;
    }
  },

  async updateBarber(id: string, barber: Partial<Barber>): Promise<void> {
    try {
      const docRef = doc(db, 'barbers', id);
      await updateDoc(docRef, barber);
    } catch (error) {
      console.error('Error updating barber:', error);
      throw error;
    }
  },

  async deleteBarber(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'barbers', id));
    } catch (error) {
      console.error('Error deleting barber:', error);
      throw error;
    }
  },

  async getBarberByEmail(email: string): Promise<Barber | null> {
    try {
      const q = query(collection(db, 'barbers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const doc = querySnapshot.docs[0];
      return doc ? { id: doc.id, ...doc.data() } as Barber : null;
    } catch (error) {
      console.error('Error getting barber by email:', error);
      throw error;
    }
  }
}; 