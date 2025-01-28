import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Service } from './database.service';

export const serviceService = {
  async getServices(): Promise<Service[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error) {
      console.error('Error getting services:', error);
      throw error;
    }
  },

  async getService(id: string): Promise<Service | null> {
    try {
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Service : null;
    } catch (error) {
      console.error('Error getting service:', error);
      throw error;
    }
  },

  async addService(service: Omit<Service, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'services'), service);
      return docRef.id;
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  },

  async updateService(id: string, service: Partial<Service>): Promise<void> {
    try {
      const docRef = doc(db, 'services', id);
      await updateDoc(docRef, service);
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  async deleteService(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}; 