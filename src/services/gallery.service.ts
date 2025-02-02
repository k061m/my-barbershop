import { orderBy, limit } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import type { GalleryItem } from '../types';

// Import backup data
const backupGalleryData = [
  {
    "id": "anchorBeard",
    "category": "beards",
    "url": "/images/gallery/gallery1.jpg",
    "altText": "Anchor Beard Style",
    "title": {
      "ar": "لحية أنكر",
      "en": "Anchor Beard",
      "de": "Ankerbart"
    },
    "description": {
      "ar": "لحية أنكر مميزة",
      "en": "Distinctive anchor beard style",
      "de": "Besonderer Ankerbart-Stil"
    },
    "relatedServices": ["/services/beardTrim","/services/traditionalShave"],
    "isFeatured": true,
    "lastUpdated": "2025-01-30T14:30:00Z",
    "appointmentId": "appointmentId",
    "barberId": "alexJohnson",
    "userId": "PStWOAzzMbb8gQV24tHgPkJI11x1"
  },
  {
    "id": "modernFade",
    "category": "haircuts",
    "url": "/images/gallery/gallery2.jpg",
    "altText": "Modern Fade Haircut",
    "title": {
      "ar": "قصة شعر فيد عصرية",
      "en": "Modern Fade",
      "de": "Moderner Fade"
    },
    "description": {
      "ar": "قصة شعر فيد عصرية مع تدرج مثالي",
      "en": "Contemporary fade haircut with perfect gradient",
      "de": "Zeitgenössischer Fade-Haarschnitt mit perfektem Farbverlauf"
    },
    "relatedServices": ["/services/modernFade","/services/styleDesign"],
    "isFeatured": true,
    "lastUpdated": "2025-01-29T15:45:00Z",
    "appointmentId": "appointment2",
    "barberId": "robertChen",
    "userId": "user2"
  },
  {
    "id": "classicPompadour",
    "category": "haircuts",
    "url": "/images/gallery/gallery3.jpg",
    "altText": "Classic Pompadour Style",
    "title": {
      "ar": "تسريحة بومبادور كلاسيكية",
      "en": "Classic Pompadour",
      "de": "Klassischer Pompadour"
    },
    "description": {
      "ar": "تسريحة بومبادور كلاسيكية أنيقة",
      "en": "Elegant classic pompadour hairstyle",
      "de": "Eleganter klassischer Pompadour-Haarschnitt"
    },
    "relatedServices": ["/services/classicCut","/services/styleDesign"],
    "isFeatured": false,
    "lastUpdated": "2025-01-28T16:20:00Z",
    "appointmentId": "appointment3",
    "barberId": "thomasWright",
    "userId": "user3"
  },
  {
    "id": "vanDykeBeard",
    "category": "beards",
    "url": "/images/gallery/gallery4.jpg",
    "altText": "Van Dyke Beard Style",
    "title": {
      "ar": "لحية فان دايك",
      "en": "Van Dyke Beard",
      "de": "Van-Dyke-Bart"
    },
    "description": {
      "ar": "لحية فان دايك الكلاسيكية مع شارب",
      "en": "Classic Van Dyke beard with mustache",
      "de": "Klassischer Van-Dyke-Bart mit Schnurrbart"
    },
    "relatedServices": ["/services/beardTrim","/services/traditionalShave"],
    "isFeatured": true,
    "lastUpdated": "2025-01-27T12:15:00Z",
    "appointmentId": "appointment4",
    "barberId": "davidMiller",
    "userId": "user4"
  },
  {
    "id": "texturedCrop",
    "category": "haircuts",
    "url": "/images/gallery/gallery5.jpg",
    "altText": "Textured Crop Haircut",
    "title": {
      "ar": "قصة شعر كروب منسقة",
      "en": "Textured Crop",
      "de": "Strukturierter Crop"
    },
    "description": {
      "ar": "قصة شعر كروب عصرية مع ملمس مميز",
      "en": "Modern textured crop with distinctive texture",
      "de": "Moderner strukturierter Crop mit markanter Textur"
    },
    "relatedServices": ["/services/textureStyle","/services/trendyCut"],
    "isFeatured": false,
    "lastUpdated": "2025-01-26T11:30:00Z",
    "appointmentId": "appointment5",
    "barberId": "robertChen",
    "userId": "user5"
  },
  {
    "id": "luxuryGrooming",
    "category": "grooming",
    "url": "/images/gallery/gallery6.jpg",
    "altText": "Luxury Grooming Service",
    "title": {
      "ar": "خدمة العناية الفاخرة",
      "en": "Luxury Grooming",
      "de": "Luxus-Pflege"
    },
    "description": {
      "ar": "تجربة عناية فاخرة شاملة",
      "en": "Complete luxury grooming experience",
      "de": "Komplettes Luxus-Pflegeerlebnis"
    },
    "relatedServices": ["/services/luxuryCut","/services/vipGrooming"],
    "isFeatured": true,
    "lastUpdated": "2025-01-25T10:45:00Z",
    "appointmentId": "appointment6",
    "barberId": "jamesWilson",
    "userId": "user6"
  },
  {
    "id": "asianFusion",
    "category": "haircuts",
    "url": "/images/gallery/gallery7.jpg",
    "altText": "Asian Fusion Hairstyle",
    "title": {
      "ar": "تسريحة فيوجن آسيوية",
      "en": "Asian Fusion",
      "de": "Asiatische Fusion"
    },
    "description": {
      "ar": "مزيج مبتكر من الأساليب الآسيوية الحديثة",
      "en": "Innovative blend of modern Asian styles",
      "de": "Innovative Mischung moderner asiatischer Stile"
    },
    "relatedServices": ["/services/asianHaircut","/services/textureStyle"],
    "isFeatured": true,
    "lastUpdated": "2025-01-24T09:30:00Z",
    "appointmentId": "appointment7",
    "barberId": "minaLee",
    "userId": "user7"
  },
  {
    "id": "artisticBeard",
    "category": "beards",
    "url": "/images/gallery/gallery8.jpg",
    "altText": "Artistic Beard Design",
    "title": {
      "ar": "تصميم لحية فني",
      "en": "Artistic Beard",
      "de": "Künstlerischer Bart"
    },
    "description": {
      "ar": "تصميم لحية إبداعي مع لمسات فنية",
      "en": "Creative beard design with artistic touches",
      "de": "Kreatives Bartdesign mit künstlerischen Akzenten"
    },
    "relatedServices": ["/services/artisticDesign","/services/beardTrim"],
    "isFeatured": false,
    "lastUpdated": "2025-01-23T14:20:00Z",
    "appointmentId": "appointment8",
    "barberId": "marcusBlack",
    "userId": "user8"
  },
  {
    "id": "vintageStyle",
    "category": "haircuts",
    "url": "/images/gallery/gallery9.jpg",
    "altText": "Vintage Haircut Style",
    "title": {
      "ar": "قصة شعر كلاسيكية",
      "en": "Vintage Style",
      "de": "Vintage-Stil"
    },
    "description": {
      "ar": "قصة شعر كلاسيكية بلمسة عصرية",
      "en": "Classic haircut with a modern twist",
      "de": "Klassischer Haarschnitt mit modernem Touch"
    },
    "relatedServices": ["/services/classicCut","/services/vintageStyle"],
    "isFeatured": true,
    "lastUpdated": "2025-01-22T13:15:00Z",
    "appointmentId": "appointment9",
    "barberId": "thomasWright",
    "userId": "user9"
  },
  {
    "id": "premiumStyling",
    "category": "styling",
    "url": "/images/gallery/gallery10.jpg",
    "altText": "Premium Hair Styling",
    "title": {
      "ar": "تصفيف شعر فاخر",
      "en": "Premium Styling",
      "de": "Premium-Styling"
    },
    "description": {
      "ar": "تصفيف شعر فاخر مع لمسات احترافية",
      "en": "Premium hair styling with professional touches",
      "de": "Premium-Haarstyling mit professionellen Akzenten"
    },
    "relatedServices": ["/services/luxuryCut","/services/styleDesign"],
    "isFeatured": true,
    "lastUpdated": "2025-01-21T15:45:00Z",
    "appointmentId": "appointment10",
    "barberId": "jamesWilson",
    "userId": "user10"
  }
];

class GalleryService extends FirestoreService<GalleryItem> {
  constructor() {
    super('gallery');
  }

  private transformGalleryData(data: any): GalleryItem | null {
    try {
      console.log('Raw data item:', data); // Log raw data

      // If the data already matches our GalleryItem structure
      if (data.title && typeof data.title === 'object' && !data.translations) {
        console.log('Using direct structure for:', data.id);
        return data as GalleryItem;
      }

      // If the data uses the translations structure
      console.log('Using translations structure for:', data.id);
      const transformed = {
        id: data.id || '',
        category: data.category || 'haircuts',
        url: data.url || '',
        altText: data.translations?.en?.title || data.altText || '',
        title: {
          en: data.translations?.en?.title || '',
          de: data.translations?.de?.title || '',
          ar: data.translations?.ar?.title || ''
        },
        description: {
          en: data.translations?.en?.description || '',
          de: data.translations?.de?.description || '',
          ar: data.translations?.ar?.description || ''
        },
        relatedServices: data.relatedServices || [],
        isFeatured: data.isFeatured || false,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        appointmentId: data.appointmentId || '',
        barberId: data.barberId || '',
        userId: data.userId || ''
      };
      console.log('Transformed (translations):', transformed);
      return transformed;
    } catch (error) {
      console.error('Error transforming gallery item:', data?.id, error);
      return null;
    }
  }

  async getImages(): Promise<GalleryItem[]> {
    try {
      console.log('Fetching gallery images...'); // Debug log
      const querySnapshot = await this.query([orderBy('lastUpdated', 'desc'), limit(50)]); // Increased limit
      console.log('Total items in querySnapshot:', querySnapshot.length);
      
      if (querySnapshot.length === 0) {
        console.log('No images found in Firestore, using backup data');
        return this.getBackupData();
      }
      
      const transformedImages = querySnapshot
        .map(doc => this.transformGalleryData(doc))
        .filter((item): item is GalleryItem => item !== null);
      
      console.log('Final transformed images count:', transformedImages.length);
      
      if (transformedImages.length === 0) {
        console.log('No valid images after transformation, using backup data');
        return this.getBackupData();
      }
      
      return transformedImages;
    } catch (error) {
      console.error('Error getting gallery images:', error);
      console.log('Falling back to backup data');
      return this.getBackupData();
    }
  }

  private getBackupData(): GalleryItem[] {
    try {
      console.log('Loading backup data...');
      const backupData = backupGalleryData.map(item => this.transformGalleryData(item))
        .filter((item): item is GalleryItem => item !== null);
      console.log('Backup data count:', backupData.length);
      return backupData;
    } catch (error) {
      console.error('Error loading backup data:', error);
      return [];
    }
  }

  // Override parent methods to remove modification abilities
  async create(_data: Omit<GalleryItem, 'id'>): Promise<string> {
    throw new Error('Access denied: Gallery images can only be added through the admin backend');
  }

  async update(_id: string, _data: Partial<GalleryItem>): Promise<void> {
    throw new Error('Access denied: Gallery images can only be updated through the admin backend');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Access denied: Gallery images can only be removed through the admin backend');
  }
}

export const galleryService = new GalleryService(); 