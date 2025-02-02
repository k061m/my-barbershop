import { where } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import type { Review, ReviewStatus } from '../types';

/** Interface for creating new reviews */
interface CreateReviewData {
  userId: string;
  barberId: string;
  serviceId: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
  barberName: string;
  createdAt: string;
}

/**
 * Service for managing barber reviews in Firestore
 */
class ReviewService extends FirestoreService<Review> {
  constructor() {
    super('reviews');
  }

  /**
   * Retrieves approved reviews
   * @returns Promise with array of approved reviews
   */
  async getAll(): Promise<Review[]> {
    const reviews = await this.query([where('status', '==', 'approved')]);
    return this.sortByDateDesc(reviews, 'lastUpdated');
  }

  /**
   * Gets approved reviews for a specific barber
   * @param barberId - ID of the barber
   * @returns Promise with array of barber's reviews
   */
  async getReviewsByBarberId(barberId: string): Promise<Review[]> {
    const reviews = await this.query([
      where('barberId', '==', barberId),
      where('status', '==', 'approved')
    ]);
    return this.sortByDateDesc(reviews, 'lastUpdated').slice(0, 50);
  }

  /**
   * Creates a new review
   * @param data - Review data
   * @returns Promise with created review
   */
  async createReview(data: CreateReviewData): Promise<Review> {
    const now = new Date().toISOString();
    const review = {
      ...data,
      status: 'pending' as ReviewStatus,
      isVerified: false,
      lastUpdated: now
    };

    const id = await this.create(review);
    return { id, ...review };
  }

  /**
   * Updates review status
   * @param reviewId - ID of the review
   * @param status - New status
   * @param isVerified - Verification status
   */
  async updateReviewStatus(
    reviewId: string, 
    status: ReviewStatus, 
    isVerified = true
  ): Promise<void> {
    await this.update(reviewId, { status, isVerified });
  }

  /**
   * Adds a barber's response to a review
   * @param reviewId - ID of the review
   * @param barberName - Name of the responding barber
   * @param message - Response message
   */
  async respondToReview(
    reviewId: string, 
    barberName: string, 
    message: string
  ): Promise<void> {
    await this.update(reviewId, {
      response: {
        by: barberName,
        message,
        date: new Date().toISOString()
      },
      status: 'approved' as ReviewStatus
    });
  }

  /**
   * Verifies a review
   * @param reviewId - ID of the review
   */
  async verifyReview(reviewId: string): Promise<void> {
    await this.update(reviewId, {
      isVerified: true,
      status: 'approved'
    });
  }

  /**
   * Rejects a review
   * @param reviewId - ID of the review
   */
  async rejectReview(reviewId: string): Promise<void> {
    await this.update(reviewId, { status: 'rejected' });
  }
}

export const reviewService = new ReviewService(); 