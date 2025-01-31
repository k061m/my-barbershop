import { TimeStamps, Language } from './common.types';

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
export interface GalleryItem extends TimeStamps {
  id: string;
  category: string;
  image: GalleryImage;
  translations: {
    [key in Language]: GalleryTranslation;
  };
  relatedServices: string[];
  isFeatured: boolean;
} 