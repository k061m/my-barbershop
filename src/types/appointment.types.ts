import { Timestamp } from 'firebase/firestore';

/** Appointment status type */
export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no-show';

/** Payment method type */
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'gift_card';

/** Payment status type */
export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded';

/** Cancellation initiator type */
export type CancellationInitiator = 'client' | 'barber' | 'system';

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
export interface Appointment {
  id: string;
  barberId: string;
  userId: string;
  serviceId: string;
  branchId: string;
  date: Date | Timestamp;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  cancellationreason?: string;
  cancellationinitiatedBy?: CancellationInitiator;
  notes?: string;
  price: number;
  paymentstatus: PaymentStatus;
  paymentmethod?: PaymentMethod;
  paymenttransactionId?: string;
  services: string[];
  allergies?: string;
  preferredProducts?: string;
  reminderemailSent: boolean;
  remindersmsSent: boolean;
  feedbacksubmitted: boolean;
  feedbackrating?: number;
  feedbackcomment?: string;
} 