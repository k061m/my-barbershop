import { TimeStamps } from './common.types';

/** Appointment status type */
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

/** Payment method type */
export type PaymentMethod = 'credit_card' | 'cash' | 'bank_transfer';

/** Payment status type */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/** Cancellation initiator type */
export type CancellationInitiator = 'client' | 'barber';

/** Cancellation information */
export interface AppointmentCancellation {
  reason: string;
  initiatedBy: CancellationInitiator;
}

/** Payment information */
export interface AppointmentPayment {
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
}

/** Client preferences */
export interface ClientPreferences {
  allergies?: string;
  preferredProducts?: string;
}

/** Reminder status */
export interface ReminderStatus {
  emailSent: boolean;
  smsSent: boolean;
}

/** Feedback information */
export interface AppointmentFeedback {
  submitted: boolean;
  rating: number | null;
  comment: string | null;
}

/** Appointment data */
export interface Appointment extends TimeStamps {
  id: string;
  barberId: string;
  userId: string;
  serviceId: string;
  date: string;
  endTime: string;
  status: AppointmentStatus;
  cancellation?: AppointmentCancellation;
  notes?: string;
  price: number;
  payment: AppointmentPayment;
  additionalServices?: string[];
  clientPreferences?: ClientPreferences;
  reminders: ReminderStatus;
  feedback: AppointmentFeedback;
} 