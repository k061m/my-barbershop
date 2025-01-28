import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService, UserCredentials, UserProfile } from '../services/auth.service';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  register: (credentials: UserCredentials) => Promise<User>;
  login: (credentials: UserCredentials) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (credentials: UserCredentials) => {
    return authService.register(credentials);
  };

  const login = async (credentials: UserCredentials) => {
    return authService.login(credentials);
  };

  const logout = async () => {
    return authService.logout();
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const updateProfile = async (profile: UserProfile) => {
    if (!currentUser) throw new Error('No user logged in');
    return authService.updateUserProfile(currentUser, profile);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 