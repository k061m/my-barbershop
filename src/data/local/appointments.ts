export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  date: string; // ISO date string
  time: string; // 24h format
  status: AppointmentStatus;
  notes: string;
  created: string;
  updated: string;
}

// Template for creating new appointments
export const appointmentTemplate: Appointment = {
  id: '',
  userId: '',
  barberId: '',
  serviceId: '',
  date: '',
  time: '',
  status: 'pending',
  notes: '',
  created: new Date().toISOString(),
  updated: new Date().toISOString()
}; 