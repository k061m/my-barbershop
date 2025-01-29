import { query, orderBy } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { GalleryImage } from '../data/types';

class GalleryService extends FirestoreService<GalleryImage> {
  constructor() {
    super('gallery');
  }

  async getImages() {
    try {
      return this.query([orderBy('createdAt', 'desc')]);
    } catch (error) {
      console.error('Error getting gallery images:', error);
      throw new Error('Failed to fetch gallery images. Please try again later.');
    }
  }

  // Override parent methods to remove modification abilities
  async create(): Promise<string> {
    throw new Error('Access denied: Gallery images can only be added through the admin backend');
  }

  async update(): Promise<void> {
    throw new Error('Access denied: Gallery images can only be updated through the admin backend');
  }

  async delete(): Promise<void> {
    throw new Error('Access denied: Gallery images can only be removed through the admin backend');
  }
}

export const galleryService = new GalleryService(); 