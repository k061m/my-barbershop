import React from 'react';
import { reviews } from '../data/siteData';
import ReviewCard from './ReviewCard';

export default function ReviewsSection() {
  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Customer Reviews</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
} 