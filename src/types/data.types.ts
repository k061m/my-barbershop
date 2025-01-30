/** Supported languages in the application */
export type Language = 'en' | 'de' | 'ar';

/** Available user roles */
export type UserRole = 'user' | 'admin' | 'barber';

/** Possible appointment statuses */
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

/** Rating scale for reviews */
export type Rating = 1 | 2 | 3 | 4 | 5;

/** Base interface for timestamps */
export interface TimeStamps {
  createdAt: Date;
  updatedAt?: Date;
}

/** Translation key-value pairs */
export interface Translation {
  name: string;
  bio?: string;
  description?: string;
  specialties?: string;
  duration?: string;
  title?: string;  // Added for gallery images
}

/** Base interface for multilingual content */
export interface MultilingualContent {
  translations: {
    [key in Language]: Translation;
  };
}

/** Working hours structure */
export interface WorkingHours {
  start: string; // Format: "HH:mm"
  end: string;   // Format: "HH:mm"
}

/** User profile data */
export interface User extends TimeStamps {
  id: string;
  uid: string;  // Firebase user ID
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  preferences?: {
    language: Language;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

/** Barber profile data */
export interface Barber extends MultilingualContent, TimeStamps {
  id: string;
  image: string;
  workingDays: number[];
  workingHours: WorkingHours;
  available: boolean;
  specialties?: string[];
  rating?: number;
  reviewCount?: number;
}

/** Service offering data */
export interface Service extends MultilingualContent, TimeStamps {
  id: string;
  name: string;
  duration: number;
  price: number;
  image: string;
  description?: string;
  category?: string;
  available?: boolean;
}

/** Appointment booking data */
export interface Appointment extends TimeStamps {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: Date;
  status: AppointmentStatus;
  notes?: string;
  duration?: number;
  price?: number;
}

/** Customer review data */
export interface Review extends TimeStamps {
  id: string;
  userId: string;
  barberId: string;
  rating: Rating;
  comment: string;
  appointmentId?: string;
  helpful?: number;
  reported?: boolean;
}

/** Gallery image data */
export interface GalleryImage extends MultilingualContent, TimeStamps {
  id: string;
  url: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  order?: number;
} 