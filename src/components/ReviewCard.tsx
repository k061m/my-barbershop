import React from 'react';
import { type Review } from '../data/siteData';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="card w-80 bg-base-100 shadow-xl">
      <figure className="px-8 pt-8">
        <img src={review.image} alt={review.name} className="rounded-full h-24 w-24" />
      </figure>
      <div className="card-body items-center text-center">
        <h3 className="font-semibold text-lg">{review.name}</h3>
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`h-5 w-5 ${
                index < review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
        <p className="text-gray-400 text-xs mt-2">{review.date}</p>
      </div>
    </div>
  );
} 