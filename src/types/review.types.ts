import { TimeStamps } from './common.types';

/** Review status type */
export type ReviewStatus = 'approved' | 'pending' | 'rejected';

/** Review response structure */
export interface ReviewResponse {
  by: string;
  message: string;
  date: string;
}

/** Review data structure */
export interface Review extends TimeStamps {
  id: string;
  barberId: string;
  userId: string;
  serviceId: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
  response?: ReviewResponse;
  isVerified: boolean;
} 