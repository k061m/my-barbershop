import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { dbService } from './database.service';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  displayName?: string;
  photoURL?: string;
}

const ADMIN_EMAIL = 'admin@admin.admin';
const googleProvider = new GoogleAuthProvider();

export const authService = {
  async register({ email, password }: UserCredentials): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await dbService.createUserProfile(user.uid, email);
    return user;
  },

  async login({ email, password }: UserCredentials): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // If this is the admin user, ensure they have admin privileges
    if (email === ADMIN_EMAIL) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: ADMIN_EMAIL,
        role: 'admin',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Admin privileges set up successfully');
    }
    
    return user;
  },

  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create or update user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        await setDoc(userRef, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async updateUserProfile(user: User, profile: UserProfile): Promise<void> {
    await updateProfile(user, profile);
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  async isUserAdmin(user: User | null): Promise<boolean> {
    if (!user) return false;
    if (user.email === ADMIN_EMAIL) {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() && userDoc.data()?.role === 'admin';
    }
    return false;
  }
};

export async function ensureUserIsAdmin() {
  const userRef = doc(db, 'users', 'admin');
  await setDoc(userRef, {
    email: ADMIN_EMAIL,
    role: 'admin',
    updatedAt: new Date().toISOString()
  }, { merge: true });
  return true;
}
