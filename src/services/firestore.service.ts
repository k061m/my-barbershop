import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  QueryConstraint,
  DocumentData,
  Timestamp,
  CollectionReference
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Base service class for Firestore operations
 * Provides common CRUD operations and query functionality
 */
export abstract class FirestoreService<T extends { id?: string }> {
  protected collectionRef: CollectionReference;

  /**
   * Creates a new FirestoreService instance
   * @param collectionName - Name of the Firestore collection
   */
  constructor(protected collectionName: string) {
    this.collectionRef = collection(db, collectionName);
  }

  /**
   * Sorts documents by date field in descending order
   * @param docs - Documents to sort
   * @param dateField - Field containing the date
   */
  protected sortByDateDesc<D extends { [key: string]: any }>(
    docs: D[],
    dateField: keyof D
  ): D[] {
    return [...docs].sort((a, b) => 
      new Date(b[dateField]).getTime() - new Date(a[dateField]).getTime()
    );
  }

  /**
   * Sorts documents by string field, supporting nested paths
   * @param docs - Documents to sort
   * @param path - Path to the string field (e.g., 'name' or 'name.en')
   * @param locale - Locale for string comparison
   */
  protected sortByStringPath<D extends { [key: string]: any }>(
    docs: D[],
    path: string,
    locale = 'en'
  ): D[] {
    return [...docs].sort((a, b) => {
      const aValue = this.getNestedValue(a, path) || '';
      const bValue = this.getNestedValue(b, path) || '';
      return aValue.localeCompare(bValue, locale);
    });
  }

  /**
   * Sorts documents by string field
   * @param docs - Documents to sort
   * @param field - Field to sort by
   * @param locale - Locale for string comparison
   */
  protected sortByString<D extends { [key: string]: any }>(
    docs: D[],
    field: keyof D,
    locale = 'en'
  ): D[] {
    return [...docs].sort((a, b) => {
      const aValue = String(a[field] || '');
      const bValue = String(b[field] || '');
      return aValue.localeCompare(bValue, locale);
    });
  }

  /**
   * Gets a nested object value using dot notation
   * @param obj - Object to get value from
   * @param path - Path to value using dot notation
   */
  private getNestedValue(obj: any, path: string | number | symbol): any {
    if (typeof path !== 'string') return obj[path];
    return path.split('.').reduce((curr, key) => curr?.[key], obj);
  }

  /**
   * Converts Firestore Timestamps to Dates recursively
   * @param data - Data to convert
   */
  protected convertTimestamp(data: any): any {
    if (data instanceof Timestamp) return data.toDate();
    if (Array.isArray(data)) return data.map(item => this.convertTimestamp(item));
    if (data instanceof Object) {
      return Object.entries(data).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: this.convertTimestamp(value)
      }), {});
    }
    return data;
  }

  /**
   * Converts Dates to Firestore Timestamps recursively
   * @param data - Data to convert
   */
  protected toFirestore(data: any): any {
    return Object.entries(data).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value instanceof Date ? Timestamp.fromDate(value) 
        : Array.isArray(value) ? value.map(item => 
          item instanceof Date ? Timestamp.fromDate(item) : item)
        : value
    }), {});
  }

  /**
   * Gets all active documents
   * @returns Promise with array of active documents
   */
  protected async queryActive(): Promise<T[]> {
    try {
      const docs = await this.query([where('isActive', '==', true)]);
      return docs;
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      return [];
    }
  }

  /**
   * Gets a document by ID
   * @param id - Document ID
   * @returns Promise with document data or null if not found
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as T;
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      return null;
    }
  }

  /**
   * Queries documents with given constraints
   * @param constraints - Query constraints
   * @returns Promise with array of documents
   */
  protected async query(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const q = query(this.collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error querying ${this.collectionName}:`, error);
      return [];
    }
  }

  /**
   * Creates a new document
   * @param data - Document data
   * @returns Promise with created document ID
   */
  protected async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw new Error(`Failed to create ${this.collectionName}. Please try again later.`);
    }
  }

  /**
   * Updates a document
   * @param id - Document ID
   * @param data - Update data
   */
  protected async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const updateData = {
        ...data,
        lastUpdated: new Date().toISOString()
      };
      await updateDoc(doc(db, this.collectionName, id), updateData as DocumentData);
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw new Error(`Failed to update ${this.collectionName}. Please try again later.`);
    }
  }

  /**
   * Deletes a document
   * @param id - Document ID
   */
  protected async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw new Error(`Failed to delete ${this.collectionName}. Please try again later.`);
    }
  }
} 