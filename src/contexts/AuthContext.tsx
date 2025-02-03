// Import necessary dependencies from React and Firebase
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  GoogleAuthProvider,
  signInWithPopup,
  User,
  confirmPasswordReset
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService, UserCredentials, UserProfile } from '../services/auth.service';

// Define the shape of the AuthContext
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  register: (credentials: UserCredentials) => Promise<User>;
  login: (credentials: UserCredentials) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updatePassword: (code: string, newPassword: string) => Promise<void>;
}

// Create the AuthContext with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Props interface for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component to wrap the application and provide authentication context
export function AuthProvider({ children }: AuthProviderProps) {
  // State to hold the current user and loading status
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the listener
    return unsubscribe;
  }, []);

  // Function to register a new user
  const register = async (credentials: UserCredentials) => {
    return authService.register(credentials);
  };

  // Function to log in a user
  const login = async (credentials: UserCredentials) => {
    return authService.login(credentials);
  };

  // Function to log out the current user
  const logout = async () => {
    return authService.logout();
  }

// Function to initiate password reset process
const resetPassword = async (email: string) => {
  return authService.resetPassword(email);
};

// Function to update user profile
const updateProfile = async (profile: UserProfile) => {
  // Check if there's a logged-in user
  if (!currentUser) throw new Error('No user logged in');
  // Update the profile using the auth service
  return authService.updateUserProfile(currentUser, profile);
};

// Function to complete the password reset process
const updatePassword = async (code: string, newPassword: string) => {
  // Use Firebase's confirmPasswordReset function
  return confirmPasswordReset(auth, code, newPassword);
};

// Function to sign in with Google
async function signInWithGoogle() {
  // Create a new Google auth provider
  const provider = new GoogleAuthProvider();
  // Sign in using a popup window
  await signInWithPopup(auth, provider);
}

// Object containing all the authentication-related functions and state
const value = {
  currentUser,  // The currently logged-in user
  loading,      // Loading state of the auth context
  register,     // Function to register a new user
  login,        // Function to log in a user
  logout,       // Function to log out the current user
  resetPassword,
  updateProfile,
  signInWithGoogle,
  updatePassword
};

// Return the AuthContext.Provider with the value object
return (
  <AuthContext.Provider value={value}>
    {/* Render children only when not loading */}
    {!loading && children}
  </AuthContext.Provider>
);
