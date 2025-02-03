import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Barber } from '../../types/barber.types';
import BarberDetailsModal from './BarberDetailsModal';

// Define the props interface for the BarberCard component
interface BarberCardProps {
  barber: Barber;
  onClick?: () => void;
}

export default function BarberCard({ barber }: BarberCardProps) {
  // State to control the visibility of the barber details modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Get the current language from the LanguageContext
  const { currentLanguage } = useLanguage();

  return (
    <>
      {/* Clickable container for the barber card */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
      >
        {/* Image section */}
        <div className="relative">
          <img 
            src={barber.image} 
            alt={`${barber.firstName} ${barber.lastName}`}
            className="w-full h-48 object-cover"
          />
          {/* Display "Top Rated" badge for highly rated barbers */}
          {barber.rating >= 4.5 && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-accent-primary text-text-inverse rounded text-xs font-medium">
              Top Rated
            </span>
          )}
        </div>

        {/* Barber information section */}
        <div className="p-4">
          <div className="space-y-2">
            {/* Barber name with title */}
            <h3 className="text-lg font-semibold text-text-primary">
              {barber.title[currentLanguage]} {barber.firstName} {barber.lastName}
            </h3>
            {/* Barber bio in the current language */}
            <p className="text-sm text-text-secondary mt-2">
              {barber.bio[currentLanguage]}
            </p>
          </div>

          {/* Rating and experience section */}
          <div className="flex justify-between items-center mt-4">
            {/* Star rating display */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-accent-primary">{barber.rating.toFixed(1)}</span>
            </div>
            {/* Years of experience */}
            <span className="text-sm text-text-secondary">
              {barber.experienceYears} years exp.
            </span>
          </div>
        </div>
      </div>

      {/* Modal component for displaying detailed barber information */}
      <BarberDetailsModal
        barber={barber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
