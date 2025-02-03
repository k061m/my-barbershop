import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Service } from '../../types/Service';
import ServiceDetailsModal from './ServiceDetailsModal';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentLanguage } = useLanguage();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className="cursor-pointer"
      >
        <div className="relative">
          <img 
            src={service.image} 
            alt={service.name[currentLanguage]}
            className="w-full h-48 object-cover"
          />
          {service.isPopular && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-accent-primary text-text-inverse rounded text-xs font-medium">
              Popular
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {service.name[currentLanguage]}
            </h3>
            <p className="text-sm text-text-secondary mt-2">
              {service.description[currentLanguage]}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-bold text-accent-primary">
              ${service.basePrice}
            </span>
            <span className="text-sm text-text-secondary">
              {service.baseDuration} {service.durationUnit}
            </span>
          </div>
        </div>
      </div>

      <ServiceDetailsModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 