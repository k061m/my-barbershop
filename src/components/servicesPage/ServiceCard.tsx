// Import necessary hooks and components
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Service } from '../../types/Service';
import ServiceDetailsModal from './ServiceDetailsModal';

// Define the props interface for the ServiceCard component
interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

// Define the ServiceCard component
export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Get the current language from the LanguageContext
  const { currentLanguage } = useLanguage();

  // Handle click event on the card
  const handleClick = () => {
    if (onClick) {
      // If onClick prop is provided, call it
      onClick();
    } else {
      // Otherwise, open the modal
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Main card container */}
      <div 
        onClick={handleClick}
        className="cursor-pointer"
      >
        {/* Image container */}
        <div className="relative">
          <img 
            src={service.image} 
            alt={service.name[currentLanguage]}
            className="w-full h-48 object-cover"
          />
          {/* Conditional rendering of "Popular" badge */}
          {service.isPopular && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-accent-primary text-text-inverse rounded text-xs font-medium">
              Popular
            </span>
          )}
        </div>

        {/* Service details container */}
        <div className="p-4">
          <div className="space-y-2">
            {/* Service name */}
            <h3 className="text-lg font-semibold text-text-primary">
              {service.name[currentLanguage]}
            </h3>
            {/* Service description */}
            <p className="text-sm text-text-secondary mt-2">
              {service.description[currentLanguage]}
            </p>
          </div>

          {/* Price and duration container */}
          <div className="flex justify-between items-center mt-4">
            {/* Service price */}
            <span className="font-bold text-accent-primary">
              ${service.basePrice}
            </span>
            {/* Service duration */}
            <span className="text-sm text-text-secondary">
              {service.baseDuration} {service.durationUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Service details modal */}
      <ServiceDetailsModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
