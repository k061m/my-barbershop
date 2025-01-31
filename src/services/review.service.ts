import { Review, Rating, dateToTimestamp } from '../types';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface CreateReviewData {
  userId: string;
  barberId: string;
  serviceId: string;
  rating: Rating;
  comment: string;
  createdAt: Date;
}

class ReviewService {
  async createReview(data: CreateReviewData): Promise<Review> {
    const { createdAt, ...rest } = data;
    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      ...rest,
      createdAt: Timestamp.fromDate(createdAt),
      date: Timestamp.fromDate(createdAt).toDate().toISOString(),
      status: 'pending',
      isVerified: false,
      updatedAt: Timestamp.fromDate(new Date())
    };
    
    return review;
  }

  updateReview = async (reviewId: string, data: Partial<Review>) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        ...data,
        updatedAt: dateToTimestamp(new Date())
      });
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  };
}

export const reviewService = new ReviewService(); 