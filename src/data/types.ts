import { Timestamp } from 'firebase/firestore';

export type Language = 'en' | 'de' | 'ar';
export type UserRole = 'user' | 'admin' | 'barber';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Translation {
  [key: string]: string;
}

export interface MultilingualContent {
  translations: {
    [key in Language]: Translation;
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Barber extends MultilingualContent {
  id: string;
  image: string;
  available: boolean;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service extends MultilingualContent {
  id: string;
  price: number;
  duration: number;  // in minutes
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Review {
  id: string;
  userId: string;
  barberId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GalleryImage extends MultilingualContent {
  id: string;
  url: string;
  category: string;
  createdAt: Date;
  updatedAt?: Date;
} 