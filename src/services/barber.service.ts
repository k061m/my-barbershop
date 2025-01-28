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
  setDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Barber {
  id: string;
  name: string;
  speciality: string;
  bio: string;
  image: string;
  rating: number;
  experience: number;
}

export const initialBarbers: Omit<Barber, 'id'>[] = [
  {
    name: 'James Wilson',
    speciality: 'Classic Cuts & Fades',
    bio: 'Master barber with 8 years of experience in traditional and modern styles.',
    image: '/images/barbers/barber1.jpg',
    rating: 4.9,
    experience: 8
  },
  {
    name: 'Michael Rodriguez',
    speciality: 'Modern Styling & Beard Grooming',
    bio: 'Specializes in contemporary cuts and expert beard sculpting.',
    image: '/images/barbers/barber2.jpg',
    rating: 4.8,
    experience: 6
  },
  {
    name: 'David Thompson',
    speciality: 'Precision Fades & Design',
    bio: 'Known for creating perfect fades and unique hair designs.',
    image: '/images/barbers/barber3.jpg',
    rating: 4.9,
    experience: 7
  },
  {
    name: 'Robert Chen',
    speciality: 'Asian Hair Specialist',
    bio: 'Expert in Asian hair textures and modern Asian styles.',
    image: '/images/barbers/barber4.jpg',
    rating: 4.7,
    experience: 5
  },
  {
    name: 'Marcus Johnson',
    speciality: 'Textured Hair Expert',
    bio: 'Specialized in working with all hair textures and curl patterns.',
    image: '/images/barbers/barber5.jpg',
    rating: 4.8,
    experience: 9
  },
  {
    name: 'Christopher Lee',
    speciality: 'Creative Color & Style',
    bio: 'Innovative stylist skilled in color treatments and trendy cuts.',
    image: '/images/barbers/barber6.jpg',
    rating: 4.7,
    experience: 4
  },
  {
    name: 'William Parker',
    speciality: 'Traditional Barbering',
    bio: 'Old-school barber bringing classic techniques to modern styles.',
    image: '/images/barbers/barber7.jpg',
    rating: 4.9,
    experience: 12
  },
  {
    name: 'Daniel Martinez',
    speciality: 'Trendy Cuts & Styling',
    bio: 'Keeping up with the latest trends in men\'s hairstyling.',
    image: '/images/barbers/barber8.jpg',
    rating: 4.8,
    experience: 5
  }
];

interface NewBarber {
  name: string;
  speciality: string;
  bio: string;
  image: string;
  rating: number;
  experience: number;
}

class BarberService {
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
  }

  async getBarber(id: string): Promise<Barber | null> {
    try {
      const docRef = doc(db, 'barbers', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Barber : null;
    } catch (error) {
      console.error('Error getting barber:', error);
      throw error;
    }
  }

  async addBarber(barber: Omit<Barber, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'barbers'), barber);
      return docRef.id;
    } catch (error) {
      console.error('Error adding barber:', error);
      throw error;
    }
  }

  async updateBarber(id: string, barber: Partial<Barber>): Promise<void> {
    try {
      const docRef = doc(db, 'barbers', id);
      await updateDoc(docRef, barber);
    } catch (error) {
      console.error('Error updating barber:', error);
      throw error;
    }
  }

  async deleteBarber(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'barbers', id));
    } catch (error) {
      console.error('Error deleting barber:', error);
      throw error;
    }
  }

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

  async initializeBarbers() {
    try {
      console.log('Starting barbers initialization...');
      const barbersRef = collection(db, 'barbers');
      
      // Force update by creating all barbers
      const promises = initialBarbers.map(async (barber, index) => {
        const barberId = `barber${index + 1}`;
        console.log(`Creating barber: ${barber.name} with ID: ${barberId}`);
        await setDoc(doc(barbersRef, barberId), {
          ...barber,
          createdAt: Timestamp.now()
        });
      });
      
      await Promise.all(promises);
      console.log('Barbers initialized successfully');
    } catch (error) {
      console.error('Error initializing barbers:', error);
      throw error;
    }
  }

  async addNewBarber(barberData: NewBarber) {
    try {
      console.log('Starting addNewBarber with data:', barberData);
      const barbersRef = collection(db, 'barbers');
      console.log('Created barbers collection reference');
      
      const newBarberDoc = await addDoc(barbersRef, {
        ...barberData,
        createdAt: serverTimestamp(),
      });
      
      console.log('Successfully added barber document with ID:', newBarberDoc.id);
      
      // Verify the document was created
      const docSnap = await getDoc(newBarberDoc);
      if (docSnap.exists()) {
        console.log('Verified document exists with data:', docSnap.data());
      } else {
        console.warn('Document was created but cannot be read back');
      }
      
      return newBarberDoc.id;
    } catch (error) {
      console.error('Error in addNewBarber:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      throw error;
    }
  }
}

export const barberService = new BarberService(); 