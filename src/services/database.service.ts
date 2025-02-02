import {
  doc,
  getDoc,
  updateDoc,
  where,
  setDoc,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreService } from './firestore.service';
import type { 
  Barber as BarberType, 
  Service as ServiceType, 
  Review as ReviewType 
} from '../types';

/** Translation interface for multilingual content */
interface Translation {
  name: string;
  bio?: string;
  description?: string;
  specialties?: string;
}

/** Barber interface for barber data */
export interface Barber extends DocumentData {
  id?: string;
  image?: string;
  workingDays: number[];
  workingHours: { start: string; end: string };
  available: boolean;
  translations: Record<'en' | 'de' | 'ar', Translation>;
  rating?: number;
}

/** Service interface for service data */
export interface Service extends DocumentData {
  id?: string;
  name: string;
  duration: string;
  price: number;
  image?: string;
  description?: string;
}

/** Review interface for review data */
export interface Review extends DocumentData {
  id?: string;
  userId: string;
  barberId: string;
  rating: number;
  comment: string;
  date: Timestamp;
}

/** User role type definition */
export type UserRole = 'user' | 'admin' | 'barber';

/** User profile with role */
interface UserProfileWithRole extends DocumentData {
  email: string;
  createdAt: string;
  role: UserRole;
  lastUpdated: string;
}

/** Retry configuration for error handling */
const RETRY_CONFIG = { attempts: 3, delay: 1000 };

/**
 * Concrete implementation of FirestoreService for Barber type
 */
class BarberService extends FirestoreService<BarberType> {
  constructor() {
    super('barbers');
  }

  getActive = (): Promise<BarberType[]> => this.queryActive();
  getById = (id: string): Promise<BarberType | null> => this.getById(id);
  createBarber = (data: Omit<BarberType, 'id'>): Promise<string> => this.create(data);
  updateBarber = (id: string, data: Partial<BarberType>): Promise<void> => this.update(id, data);
  deleteBarber = (id: string): Promise<void> => this.delete(id);
}

/**
 * Concrete implementation of FirestoreService for Service type
 */
class ServiceDbService extends FirestoreService<ServiceType> {
  constructor() {
    super('services');
  }

  getActive = (): Promise<ServiceType[]> => this.queryActive();
  getById = (id: string): Promise<ServiceType | null> => this.getById(id);
  createService = (data: Omit<ServiceType, 'id'>): Promise<string> => this.create(data);
  updateService = (id: string, data: Partial<ServiceType>): Promise<void> => this.update(id, data);
  deleteService = (id: string): Promise<void> => this.delete(id);
}

/**
 * Concrete implementation of FirestoreService for Review type
 */
class ReviewDbService extends FirestoreService<ReviewType> {
  constructor() {
    super('reviews');
  }

  getApproved = (barberId?: string): Promise<ReviewType[]> => 
    barberId 
      ? this.query([
          where('barberId', '==', barberId),
          where('status', '==', 'approved')
        ])
      : this.query([where('status', '==', 'approved')]);
  
  getById = (id: string): Promise<ReviewType | null> => this.getById(id);
  createReview = (data: Omit<ReviewType, 'id'>): Promise<string> => this.create(data);
  updateReview = (id: string, data: Partial<ReviewType>): Promise<void> => this.update(id, data);
  deleteReview = (id: string): Promise<void> => this.delete(id);
}

/**
 * Database service class for managing all collections
 */
class DatabaseService {
  private barbers = new BarberService();
  private services = new ServiceDbService();
  private reviews = new ReviewDbService();

  /** Barber Methods */
  getBarbers = () => this.barbers.getActive();
  getBarber = (id: string) => this.barbers.getById(id);
  addBarber = (barber: Omit<BarberType, 'id'>) => this.barbers.createBarber(barber);
  updateBarber = (id: string, barber: Partial<BarberType>) => this.barbers.updateBarber(id, barber);
  deleteBarber = (id: string) => this.barbers.deleteBarber(id);

  /** Service Methods */
  getServices = () => this.services.getActive();
  getService = (id: string) => this.services.getById(id);
  addService = (service: Omit<ServiceType, 'id'>) => this.services.createService(service);
  updateService = (id: string, service: Partial<ServiceType>) => this.services.updateService(id, service);
  deleteService = (id: string) => this.services.deleteService(id);

  /** Review Methods */
  getReviews = (barberId?: string) => this.reviews.getApproved(barberId);
  getReview = (id: string) => this.reviews.getById(id);
  addReview = (review: Omit<ReviewType, 'id'>) => this.reviews.createReview(review);
  updateReview = (id: string, review: Partial<ReviewType>) => this.reviews.updateReview(id, review);
  deleteReview = (id: string) => this.reviews.deleteReview(id);

  /**
   * Creates a user profile with retry mechanism
   * @param uid - User ID
   * @param email - User email
   */
  async createUserProfile(uid: string, email: string): Promise<void> {
    let lastError;
    for (let attempt = 0; attempt < RETRY_CONFIG.attempts; attempt++) {
      try {
        const userData: UserProfileWithRole = {
          email,
          createdAt: new Date().toISOString(),
          role: 'user',
          lastUpdated: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', uid), userData);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < RETRY_CONFIG.attempts - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.delay));
        }
      }
    }
    throw lastError;
  }

  /**
   * Gets a user profile by ID
   * @param uid - User ID
   */
  async getUserProfile(uid: string): Promise<UserProfileWithRole | null> {
    try {
      const userSnap = await getDoc(doc(db, 'users', uid));
      return userSnap.exists() ? userSnap.data() as UserProfileWithRole : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Updates a user profile
   * @param uid - User ID
   * @param profile - Profile data to update
   */
  async updateUserProfile(uid: string, profile: Partial<UserProfileWithRole>): Promise<void> {
    let lastError;
    for (let attempt = 0; attempt < RETRY_CONFIG.attempts; attempt++) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          ...profile,
          lastUpdated: new Date().toISOString()
        });
        return;
      } catch (error) {
        lastError = error;
        if (attempt < RETRY_CONFIG.attempts - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.delay));
        }
      }
    }
    throw lastError;
  }

  /**
   * Checks if a user has admin role
   * @param uid - User ID
   * @returns Promise resolving to boolean indicating admin status
   */
  async isUserAdmin(uid: string): Promise<boolean> {
    const profile = await this.getUserProfile(uid);
    return profile?.role === 'admin';
  }
}

export const dbService = new DatabaseService(); 