import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import type { FirebaseOptions } from 'firebase/app';

// Firebase configuration using environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required config values
const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const;
for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    console.error(`Missing required Firebase config key: ${key}`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only if supported and in production
let analytics = null;
if (import.meta.env.PROD) {
  isSupported()
    .then(yes => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    })
    .catch(error => {
      console.warn('Firebase Analytics initialization failed:', error);
    });
}

export { analytics };
export default app; 