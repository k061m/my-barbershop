import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export class FirestoreService<T extends DocumentData> {
  constructor(protected collectionName: string) {}

  protected convertTimestamp(data: any): any {
    if (data instanceof Timestamp) {
      return data.toDate();
    } else if (Array.isArray(data)) {
      return data.map(item => this.convertTimestamp(item));
    } else if (data instanceof Object) {
      const result = { ...data };
      Object.keys(result).forEach(key => {
        result[key] = this.convertTimestamp(result[key]);
      });
      return result;
    }
    return data;
  }

  protected toFirestore(data: any): any {
    const result = { ...data };
    Object.keys(result).forEach(key => {
      if (result[key] instanceof Date) {
        result[key] = Timestamp.fromDate(result[key]);
      } else if (Array.isArray(result[key])) {
        result[key] = result[key].map((item: any) => 
          item instanceof Date ? Timestamp.fromDate(item) : item
        );
      }
    });
    return result;
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as T[];
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? { id: docSnap.id, ...this.convertTimestamp(docSnap.data()) } as T
        : null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...this.toFirestore(data),
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  async query(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamp(doc.data())
      })) as T[];
    } catch (error) {
      console.error(`Error querying ${this.collectionName}:`, error);
      throw error;
    }
  }
} 