import { TimeStamps, Language } from './common.types';

/** Service translation interface */
export interface ServiceTranslation {
  name: string;
  description: string;
}

/** Additional service option structure */
export interface ServiceOption {
  id: string;
  price: number;
  duration: number;
}

/** Service skill level type */
export type SkillLevel = 'junior' | 'senior' | 'master';

/** Duration unit type */
export type DurationUnit = 'minutes' | 'hours';

/** Service offering data */
export interface Service extends TimeStamps {
  id: string;
  category: string;
  basePrice: number;
  baseDuration: number;
  durationUnit: DurationUnit;
  skillLevel: SkillLevel;
  translations: {
    [key in Language]: ServiceTranslation;
  };
  image: string;
  additionalOptions?: ServiceOption[];
  products?: string[];
  isActive: boolean;
  isPopular: boolean;
} 