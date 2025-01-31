// ============= Basic Types =============
/** Supported languages in the application */
export type Language = 'en' | 'de' | 'ar';

/** Available user roles */
export type UserRole = 'user' | 'admin' | 'barber';

/** Rating scale for reviews */
export type Rating = 1 | 2 | 3 | 4 | 5;

// ============= Firestore Types =============
/** Firestore timestamp structure */
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
}

/** Base interface for timestamps */
export interface TimeStamps {
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

// ============= Translation Types =============
/** Base translation interface */
export interface Translation {
  name: string;
  title?: string;
  bio?: string;
  description?: string;
  duration?: string;
  specialties?: string;
}

/** Base interface for multilingual content */
export interface MultilingualContent {
  translations: {
    [key in Language]: Translation;
  };
}

// ============= Helper Functions =============
/** Helper function to convert Date to Firestore timestamp */
export const dateToTimestamp = (date: Date): FirestoreTimestamp => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanoseconds: (date.getTime() % 1000) * 1000000
});

/** Helper function to convert Firestore timestamp to Date */
export const timestampToDate = (timestamp: FirestoreTimestamp): Date => {
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}; 