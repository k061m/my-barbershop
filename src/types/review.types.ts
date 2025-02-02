/** Review status type */
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/** Review response structure */
export interface ReviewResponse {
  by: string;
  message: string;
  date: string;
}

/** Review data structure matching Firestore */
export interface Review {
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
  lastUpdated: string;
  createdAt: string;
  userName: string;
  barberName: string;
} 