import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate required config values
const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const;
for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    throw new Error(`Missing required Firebase config key: ${key}`);
  }
}

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only in production
const initAnalytics = async () => {
  if (import.meta.env.PROD && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export const analytics = initAnalytics().catch(error => {
  if (import.meta.env.DEV) {
    console.warn('Firebase Analytics initialization failed:', error);
  }
  return null;
});

// Global error handler for Firebase operations
const handleFirebaseError = (error: unknown) => {
  if (error instanceof Error) {
    if (import.meta.env.DEV) {
      console.error('Firebase operation failed:', error);
    }
    // Add error reporting service integration here if needed
  }
};

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.toString().includes('Firebase')) {
    handleFirebaseError(event.reason);
  }
}); 