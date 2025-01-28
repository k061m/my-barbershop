import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  browserPopupRedirectResolver,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { dbService } from './database.service';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  displayName?: string;
  photoURL?: string;
}

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const authService = {
  // Sign up new user
  async register({ email, password }: UserCredentials): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Try to create user profile in Firestore
      try {
        await dbService.createUserProfile(user.uid, email);
      } catch (err) {
        console.error('Error creating user profile:', err);
        // Even if profile creation fails, we'll return the user
        // The profile can be created later when needed
      }
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Sign in existing user
  async login({ email, password }: UserCredentials): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user profile exists, if not create it
      try {
        const profile = await dbService.getUserProfile(user.uid);
        if (!profile) {
          await dbService.createUserProfile(user.uid, email);
        }
      } catch (err) {
        console.error('Error checking/creating user profile:', err);
      }
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      const user = result.user;
      
      // Check/create profile
      try {
        const profile = await dbService.getUserProfile(user.uid);
        if (!profile) {
          await dbService.createUserProfile(user.uid, user.email!);
        }
      } catch (err) {
        console.error('Error checking/creating user profile:', err);
      }
      
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  },

  // Sign in with Facebook
  async signInWithFacebook(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, facebookProvider, browserPopupRedirectResolver);
      const user = result.user;
      
      // Check/create profile
      try {
        const profile = await dbService.getUserProfile(user.uid);
        if (!profile) {
          await dbService.createUserProfile(user.uid, user.email!);
        }
      } catch (err) {
        console.error('Error checking/creating user profile:', err);
      }
      
      return user;
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      throw error;
    }
  },

  // Sign out
  async logout(): Promise<void> {
    await signOut(auth);
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Update user profile
  async updateUserProfile(user: User, profile: UserProfile): Promise<void> {
    await updateProfile(user, profile);
    // Update profile in Firestore as well
    try {
      if (profile.displayName || profile.photoURL) {
        await dbService.updateUserProfile(user.uid, profile);
      }
    } catch (err) {
      console.error('Error updating user profile in Firestore:', err);
      // Continue even if Firestore update fails
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}; 