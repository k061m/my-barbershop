import { where, orderBy } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { Barber } from '../types';

class BarberService extends FirestoreService<Barber> {
  constructor() {
    super('barbers');
  }

  async getAvailableBarbers() {
    try {
      return await this.query([
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error getting available barbers:', error);
      throw new Error('Failed to fetch available barbers. Please try again later.');
    }
  }

  async getBarberByEmail(email: string): Promise<Barber | null> {
    try {
      const results = await this.query([where('personalInfo.email', '==', email)]);
      return results[0] || null;
    } catch (error) {
      console.error('Error getting barber by email:', error);
      throw new Error('Failed to fetch barber information. Please try again later.');
    }
  }

  // Override parent methods to remove modification abilities
  async create(_data: Omit<Barber, 'id'>): Promise<string> {
    throw new Error('Access denied: Barbers can only be added through the admin backend');
  }

  async update(_id: string, _data: Partial<Barber>): Promise<void> {
    throw new Error('Access denied: Barber information can only be updated through the admin backend');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Access denied: Barbers can only be removed through the admin backend');
  }
}

export const barberService = new BarberService(); 