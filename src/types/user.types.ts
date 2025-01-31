import { TimeStamps, Language, UserRole } from './common.types';

/** Personal information structure */
export interface UserPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
}

/** Notification preferences structure */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
}

/** User preferences structure */
export interface UserPreferences {
  language: Language;
  notification: NotificationPreferences;
}

/** User profile data */
export interface User extends TimeStamps {
  id: string;
  personalInfo: UserPersonalInfo;
  preferences: UserPreferences;
  role: UserRole;
  lastLogin: string;
  isActive: boolean;
} 