import { Address, Language } from './common.types';

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
  theme: string;
  currency: string;
  timeZone: string;
}

/** User profile data */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  address: Address;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  profile: UserProfile;
  loyalty: LoyaltyInfo;
  appointments: AppointmentStats;
  payment: PaymentInfo;
  security: SecuritySettings;
  role: 'user' | 'admin' | 'barber';
  status: UserStatus;
  metadata: UserMetadata;
  marketing: MarketingInfo;
  reviews: UserReviews;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
  appointments: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export interface UserProfile {
  avatar: string;
  bio: string;
  favoriteBarbers: string[];
  preferredBranch: string;
  preferredServices: string[];
}

export interface LoyaltyInfo {
  points: number;
  tier: string;
  joinDate: string;
  totalSpent: number;
  visitsCount: number;
  lastReward: string;
  referralCode: string;
}

export interface AppointmentStats {
  upcoming: number;
  total: number;
  cancelled: number;
  noShow: number;
  lastAppointment: string;
  nextAppointment: string;
}

export interface PaymentInfo {
  defaultMethod: string;
  stripeCustomerId: string;
  savedCards: string[];
  autoReload: boolean;
  giftCardBalance: number;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginAttempts: number;
  recoveryEmail: string;
  securityQuestions: number;
}

export interface UserStatus {
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  accountLocked: boolean;
}

export interface UserMetadata {
  createdAt: string;
  lastLogin: string;
  lastUpdated: string;
  platform: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
}

export interface MarketingInfo {
  source: string;
  campaign: string;
  referredBy: string;
  tags: string[];
}

export interface UserReviews {
  count: number;
  averageRating: number;
  lastReview: string;
} 