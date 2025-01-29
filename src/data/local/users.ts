export type UserRole = 'customer' | 'barber' | 'admin';
export type Language = 'en' | 'de' | 'ar';

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  preferredLanguage: Language;
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  created: string;
  updated: string;
}

// Template for creating new users
export const userTemplate: User = {
  id: '',
  email: '',
  role: 'customer',
  profile: {
    firstName: '',
    lastName: '',
    phone: '',
    preferredLanguage: 'en',
    notifications: {
      email: false,
      sms: false
    }
  },
  created: new Date().toISOString(),
  updated: new Date().toISOString()
}; 