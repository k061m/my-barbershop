import { where } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import type { Service } from '../types';

/**
 * Service for managing barbershop services in Firestore
 */
class ServiceService extends FirestoreService<Service> {
  constructor() {
    super('services');
  }

  /**
   * Gets all active services
   * @returns Promise with array of active services
   */
  async getAll(): Promise<Service[]> {
    const services = await this.queryActive();
    return this.sortByStringPath(services, 'name.en');
  }

  /**
   * Gets a specific service by ID
   * @param serviceId - ID of the service
   * @returns Promise with service data or null if not found
   */
  async getService(serviceId: string): Promise<Service | null> {
    return this.getById(serviceId);
  }

  /**
   * Gets services by category
   * @param category - Service category
   * @returns Promise with array of services in the category
   */
  async getServicesByCategory(category: string): Promise<Service[]> {
    const services = await this.query([
      where('category', '==', category),
      where('isActive', '==', true)
    ]);
    return services.sort((a, b) => a.basePrice - b.basePrice);
  }

  /**
   * Updates service base price
   * @param serviceId - ID of the service
   * @param basePrice - New base price
   */
  async updatePrice(serviceId: string, basePrice: number): Promise<void> {
    await this.update(serviceId, { basePrice });
  }

  /**
   * Updates service base duration
   * @param serviceId - ID of the service
   * @param baseDuration - Duration in minutes
   */
  async updateDuration(serviceId: string, baseDuration: number): Promise<void> {
    await this.update(serviceId, { baseDuration });
  }
}

export const serviceService = new ServiceService(); 