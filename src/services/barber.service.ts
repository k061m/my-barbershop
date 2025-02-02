import { FirestoreService } from './firestore.service';
import type { Barber, TimeRange } from '../types';

/**
 * Service for managing barbers in Firestore
 */
class BarberService extends FirestoreService<Barber> {
  constructor() {
    super('barbers');
  }

  /**
   * Gets all active barbers
   * @returns Promise with array of active barbers
   */
  async getAll(): Promise<Barber[]> {
    const barbers = await this.queryActive();
    return this.sortByString(barbers, 'firstName');
  }

  /**
   * Gets a specific barber by ID
   * @param barberId - ID of the barber
   * @returns Promise with barber data or null if not found
   */
  async getBarber(barberId: string): Promise<Barber | null> {
    return this.getById(barberId);
  }

  /**
   * Updates barber active status
   * @param barberId - ID of the barber
   * @param isActive - New active status
   */
  async updateAvailability(barberId: string, isActive: boolean): Promise<void> {
    await this.update(barberId, { isActive });
  }

  /**
   * Updates barber working hours
   * @param barberId - ID of the barber
   * @param workingDays - Array of working days (0-6)
   * @param workingHours - Array of time ranges
   */
  async updateWorkingHours(
    barberId: string,
    workingDays: number[],
    workingHours: TimeRange[]
  ): Promise<void> {
    await this.update(barberId, { workingDays, workingHours });
  }
}

export const barberService = new BarberService(); 