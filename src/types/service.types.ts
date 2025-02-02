import { LocalizedText } from './common.types';

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
export type SkillLevel = 
  | 'junior'
  | 'intermediate'
  | 'senior'
  | 'expert';

/** Duration unit type */
export type DurationUnit = 'minutes' | 'hours';

/** Service offering data */
export interface Service {
  id: string;
  category: ServiceCategory;
  basePrice: number;
  baseDuration: number;
  durationUnit: DurationUnit;
  skillLevel: SkillLevel;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  additionalOptions: string[];
  products: string[];
  isActive: boolean;
  lastUpdated: string;
  isPopular: boolean;
}

export type ServiceCategory = 
  | 'haircut'
  | 'color'
  | 'treatment'
  | 'styling'
  | 'special'; 