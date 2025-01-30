import { Review, Rating } from '../types/data.types';

interface CreateReviewData {
  userId: string;
  barberId: string;
  rating: Rating;
  comment: string;
  createdAt: Date;
}

class ReviewService {
  async createReview(data: CreateReviewData): Promise<Review> {
    // TODO: Implement actual Firebase/backend call
    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      updatedAt: new Date()
    };
    
    return review;
  }
}

export const reviewService = new ReviewService(); 