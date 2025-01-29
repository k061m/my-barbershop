import { orderBy } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { GalleryImage } from '../data/types';

class GalleryService extends FirestoreService<GalleryImage> {
  constructor() {
    super('gallery');
  }

  async getImages() {
    try {
      return await this.query([orderBy('createdAt', 'desc')]);
    } catch (error) {
      console.error('Error getting gallery images:', error);
      throw new Error('Failed to fetch gallery images. Please try again later.');
    }
  }

  // Override parent methods to remove modification abilities
  async create(_data: Omit<GalleryImage, 'id'>): Promise<string> {
    throw new Error('Access denied: Gallery images can only be added through the admin backend');
  }

  async update(_id: string, _data: Partial<GalleryImage>): Promise<void> {
    throw new Error('Access denied: Gallery images can only be updated through the admin backend');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Access denied: Gallery images can only be removed through the admin backend');
  }
}

export const galleryService = new GalleryService(); 