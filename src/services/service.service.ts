import { orderBy, where } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { Service } from '../types';

class ServiceService extends FirestoreService<Service> {
  constructor() {
    super('services');
  }

  async getActiveServices() {
    try {
      return await this.query([
        where('available', '==', true),
        orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error getting active services:', error);
      throw new Error('Failed to fetch services. Please try again later.');
    }
  }

  // Override parent methods to remove modification abilities
  async create(_data: Omit<Service, 'id'>): Promise<string> {
    throw new Error('Access denied: Services can only be added through the admin backend');
  }

  async update(_id: string, _data: Partial<Service>): Promise<void> {
    throw new Error('Access denied: Services can only be updated through the admin backend');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Access denied: Services can only be removed through the admin backend');
  }
}

export const serviceService = new ServiceService(); 