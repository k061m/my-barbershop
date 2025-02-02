import { orderBy, limit, query, collection, getDocs, addDoc, updateDoc, doc, where } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import type { Review, ReviewStatus } from '../types';
import { db } from '../config/firebase';

// Backup data matching exact Firestore structure
const backupReviewsData = [
  {
    "id": "review128",
    "barberId": "robertChen",
    "userId": "user6",
    "serviceId": "modernFade",
    "rating": 4,
    "comment": "Really cool fade and modern style. The cut grew out nicely.",
    "date": "2025-01-11T15:30:00Z",
    "status": "approved",
    "response": {
      "by": "robertChen",
      "message": "Appreciate the feedback! Glad to hear the cut is maintaining its shape.",
      "date": "2025-01-12T08:45:00Z"
    },
    "isVerified": true,
    "lastUpdated": "2025-01-25T08:45:00Z",
    "createdAt": "2025-01-11T15:30:00Z"
  }
];

interface CreateReviewData {
  userId: string;
  barberId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

class ReviewService extends FirestoreService<Review> {
  constructor() {
    super('reviews');
  }

  async getAll(): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('status', '==', 'approved')
      );

      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];

      // Sort in memory instead of using orderBy
      reviews.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

      if (reviews.length === 0) {
        console.log('No reviews found in Firestore, using backup data');
        return this.getBackupData();
      }

      return reviews;
    } catch (error) {
      console.error('Error getting reviews:', error);
      return this.getBackupData();
    }
  }

  async getReviewsByBarberId(barberId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('barberId', '==', barberId),
        where('status', '==', 'approved'),
        orderBy('lastUpdated', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];

      if (reviews.length === 0) {
        console.log('No reviews found for barber, using backup data');
        return this.getBackupData(barberId);
      }

      return reviews;
    } catch (error) {
      console.error('Error getting reviews for barber:', error);
      return this.getBackupData(barberId);
    }
  }

  async createReview(data: CreateReviewData): Promise<Review> {
    try {
      const review: Omit<Review, 'id'> = {
        ...data,
        date: new Date().toISOString(),
        status: 'pending',
        isVerified: false,
        lastUpdated: new Date().toISOString(),
        userName: 'User Name',
        barberName: 'Barber Name'
      };

      const docRef = await addDoc(collection(db, 'reviews'), review);
      return {
        id: docRef.id,
        ...review
      };
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error('Failed to create review. Please try again later.');
    }
  }

  async updateReview(reviewId: string, data: Partial<Review>): Promise<void> {
    try {
      const updateData = {
        ...data,
        lastUpdated: new Date().toISOString()
      };

      await updateDoc(doc(db, 'reviews', reviewId), updateData);
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error('Failed to update review. Please try again later.');
    }
  }

  async respondToReview(reviewId: string, barberName: string, message: string): Promise<void> {
    try {
      const response = {
        by: barberName,
        message,
        date: new Date().toISOString()
      };

      await this.updateReview(reviewId, {
        response,
        status: 'approved',
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error responding to review:', error);
      throw new Error('Failed to respond to review. Please try again later.');
    }
  }

  async verifyReview(reviewId: string): Promise<void> {
    try {
      await this.updateReview(reviewId, {
        isVerified: true,
        status: 'approved',
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error verifying review:', error);
      throw new Error('Failed to verify review. Please try again later.');
    }
  }

  async rejectReview(reviewId: string): Promise<void> {
    try {
      await this.updateReview(reviewId, {
        status: 'rejected',
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error rejecting review:', error);
      throw new Error('Failed to reject review. Please try again later.');
    }
  }

  private getBackupData(barberId?: string): Review[] {
    const reviews = backupReviewsData.map(review => ({
      ...review,
      status: review.status as ReviewStatus,
      userName: 'User Name',
      barberName: 'Barber Name'
    }));

    return barberId 
      ? reviews.filter(review => review.barberId === barberId)
      : reviews;
  }
}

export const reviewService = new ReviewService(); 