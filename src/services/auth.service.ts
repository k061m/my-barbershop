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

/** Admin email constant for role-based access control */
const ADMIN_EMAIL = 'admin@admin.admin';

/** Google authentication provider instance */
const googleProvider = new GoogleAuthProvider();

/** User credentials interface for authentication */
export interface UserCredentials {
  email: string;
  password: string;
}

/** User profile interface for profile updates */
export interface UserProfile {
  displayName?: string;
  photoURL?: string;
}

/**
 * Authentication service providing user management functionality
 * @namespace authService
 */
export const authService = {
  /**
   * Registers a new user with email and password
   * @param {UserCredentials} credentials - User email and password
   * @returns {Promise<User>} Firebase user object
   */
  async register({ email, password }: UserCredentials): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await dbService.createUserProfile(user.uid, email);
    return user;
  },

  /**
   * Authenticates user with email and password
   * @param {UserCredentials} credentials - User email and password
   * @returns {Promise<User>} Firebase user object
   */
  async login({ email, password }: UserCredentials): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (email === ADMIN_EMAIL) {
      await setDoc(doc(db, 'users', user.uid), {
        email: ADMIN_EMAIL,
        role: 'admin',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return user;
  },

  /**
   * Authenticates user with Google
   * @returns {Promise<User>} Firebase user object
   */
  async signInWithGoogle(): Promise<User> {
    const { user } = await signInWithPopup(auth, googleProvider);
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    await setDoc(userRef, {
      ...(userSnap.exists() ? {} : {
        email: user.email,
        role: 'user',
        createdAt: new Date().toISOString(),
      }),
      displayName: user.displayName,
      photoURL: user.photoURL,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return user;
  },

  /**
   * Signs out the current user
   * @returns {Promise<void>}
   */
  logout: () => signOut(auth),

  /**
   * Sends password reset email
   * @param {string} email - User's email address
   * @returns {Promise<void>}
   */
  resetPassword: (email: string) => sendPasswordResetEmail(auth, email),

  /**
   * Updates user profile information
   * @param {User} user - Firebase user object
   * @param {UserProfile} profile - Profile data to update
   * @returns {Promise<void>}
   */
  updateUserProfile: (user: User, profile: UserProfile) => updateProfile(user, profile),

  /**
   * Gets current authenticated user
   * @returns {User | null} Current user or null if not authenticated
   */
  getCurrentUser: () => auth.currentUser,

  /**
   * Checks if user has admin privileges
   * @param {User | null} user - Firebase user object
   * @returns {Promise<boolean>} True if user is admin
   */
  async isUserAdmin(user: User | null): Promise<boolean> {
    if (!user || user.email !== ADMIN_EMAIL) return false;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.exists() && userDoc.data()?.role === 'admin';
  }
};

/**
 * Ensures admin user exists in the database
 * @returns {Promise<boolean>} True if successful
 */
export async function ensureUserIsAdmin(): Promise<boolean> {
  await setDoc(doc(db, 'users', 'admin'), {
    email: ADMIN_EMAIL,
    role: 'admin',
    updatedAt: new Date().toISOString()
  }, { merge: true });
  return true;
}
