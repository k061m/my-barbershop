import { LocalizedText, TimeRange, Language } from './common.types';

/** Working hours structure */
export interface WorkingHours {
  start: string; // Format: "HH:mm"
  end: string;   // Format: "HH:mm"
}

/** Break time structure */
export interface BreakTime {
  start: string; // Format: "HH:mm"
  end: string;   // Format: "HH:mm"
}

/** Personal information structure */
export interface BarberPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  hireDate: string;
  employeeId: string;
  gender: 'male' | 'female' | 'other';
}

/** Professional information structure */
export interface ProfessionalInfo {
  rating: number;
  specialties: string[];
  certifications: string[];
  experienceYears: number;
  languages: Language[];
}

/** Barber service structure */
export type BarberService = string; // e.g. "/services/buzzCut" or "services/fadeCut"

/** Barber translation interface */
export interface BarberTranslation {
  bio: string;
  title: string;
}

/** Barber profile data */
export interface Barber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  employeeId: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  hireDate: string;
  isActive: boolean;
  lastUpdated: string;
  rating: number;
  experienceYears: number;
  branches: string[];
  breaks: TimeRange[];
  workingDays: number[];
  workingHours: TimeRange[];
  certifications: string[];
  languages: string[];
  specialties: string[];
  services: string[];
  bio: LocalizedText;
  title: LocalizedText;
}

export interface BarberTranslations {
  [key: string]: {
    title: string;
    bio: string;
  };
}

export interface BarberAvailability {
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  workingHours: {
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
  breaks?: {
    start: string;
    end: string;
  }[];
} 