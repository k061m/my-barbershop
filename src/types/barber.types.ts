import { Language, TimeStamps } from './common.types';

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
export interface BarberService {
  id: string;
  price: number;
  duration: number;
}

/** Barber translation interface */
export interface BarberTranslation {
  bio: string;
  title: string;
}

/** Barber profile data */
export interface Barber extends TimeStamps {
  id: string;
  personalInfo: BarberPersonalInfo;
  professionalInfo: ProfessionalInfo;
  availability: {
    workingDays: number[];
    workingHours: WorkingHours;
    breaks: BreakTime[];
  };
  services: BarberService[];
  translations: {
    [key in Language]: BarberTranslation;
  };
  image: string;
  isActive: boolean;
} 