interface LocalizedText {
  ar: string;
  en: string;
  de: string;
}

export interface Service {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  basePrice: number;
  baseDuration: number;
  durationUnit: string;
  category: string;
  skillLevel: string;
  isActive: boolean;
  isPopular: boolean;
  lastUpdated: string;
  additionalOptions?: string[];
  products?: string[];
} 