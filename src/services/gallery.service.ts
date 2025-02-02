import { orderBy, limit } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import type { GalleryItem } from '../types';

/**
 * Service for managing gallery items in Firestore
 * Extends FirestoreService with read-only gallery functionality
 */
export class GalleryService extends FirestoreService<GalleryItem> {
  constructor() {
    super('gallery');
  }

  /**
   * Retrieves gallery images ordered by last update
   * @returns Promise with array of gallery items
   */
  async getImages(): Promise<GalleryItem[]> {
    const querySnapshot = await this.query([
      orderBy('lastUpdated', 'desc'), 
      limit(50)
    ]);
    
    return querySnapshot.map(doc => ({
      id: doc.id || '',
      category: doc.category || 'haircuts',
      url: doc.url || '',
      altText: doc.altText || '',
      title: doc.title || { en: '', de: '', ar: '' },
      description: doc.description || { en: '', de: '', ar: '' },
      relatedServices: doc.relatedServices || [],
      isFeatured: doc.isFeatured || false,
      lastUpdated: doc.lastUpdated || new Date().toISOString(),
      appointmentId: doc.appointmentId || '',
      barberId: doc.barberId || '',
      userId: doc.userId || ''
    }));
  }

  // Override parent methods to enforce read-only access
  async create(): Promise<string> {
    throw new Error('Gallery images can only be added through admin backend');
  }

  async update(): Promise<void> {
    throw new Error('Gallery images can only be updated through admin backend');
  }

  async delete(): Promise<void> {
    throw new Error('Gallery images can only be removed through admin backend');
  }
}

export const galleryService = new GalleryService(); 