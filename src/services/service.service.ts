import { orderBy } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { Service } from '../data/types';

class ServiceService extends FirestoreService<Service> {
  constructor() {
    super('services');
  }

  async getActiveServices() {
    try {
      return this.query([orderBy('createdAt', 'desc')]);
    } catch (error) {
      console.error('Error getting active services:', error);
      throw new Error('Failed to fetch services. Please try again later.');
    }
  }

  // Override parent methods to remove modification abilities
  async create(): Promise<string> {
    throw new Error('Access denied: Services can only be added through the admin backend');
  }

  async update(): Promise<void> {
    throw new Error('Access denied: Services can only be updated through the admin backend');
  }

  async delete(): Promise<void> {
    throw new Error('Access denied: Services can only be removed through the admin backend');
  }
}

export const serviceService = new ServiceService(); 