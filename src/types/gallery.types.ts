import { LocalizedText } from './common.types';

/** Gallery image structure */
export interface GalleryImage {
  url: string;
  altText: string;
  photographer: string;
  license: string;
}

/** Gallery item translation */
export interface GalleryTranslation {
  title: string;
  description: string;
}

/** Gallery item data */
export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  url: string;
  altText: string;
  title: LocalizedText;
  description: LocalizedText;
  relatedServices: string[];
  isFeatured: boolean;
  lastUpdated: string;
  appointmentId: string;
  barberId: string;
  userId: string;
}

export type GalleryCategory = 
  | 'haircuts'
  | 'beards'
  | 'styling'
  | 'grooming'; 