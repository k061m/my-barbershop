import { Address } from './common.types';

export interface Branch {
  id: string;
  name: string;
  address: Address;
  phoneNumber: string;
  email: string;
  workingHours: BranchWorkingHours;
  services: string[];
  facilities: string[];
  staff: number;
  chairs: number;
  isActive: boolean;
  rating: number;
  reviews: number;
  lastUpdated: string;
  image: string;
  description: string	;
  wheelchairAccessible: boolean;
  parkingAvailable: boolean;
  numberOfRatings: number;
}

export interface BranchWorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
} 