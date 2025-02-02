import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Service } from '../../types';
import ServiceDetailsModal from './ServiceDetailsModal';
import Card from '../common/Card';
import ServiceBookButton from './ServiceBookButton';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { currentLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const header = (
    <div className="relative">
      <img 
        src={service.image} 
        alt={service.name[currentLanguage]}
        className="w-full h-48 object-cover"
      />
      {service.isPopular && (
        <span className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-accent-primary text-background-primary">
          Popular
        </span>
      )}
    </div>
  );

  const footer = (
    <ServiceBookButton serviceId={service.id} />
  );

  return (
    <>
      <Card
        header={header}
        footer={footer}
        hover
        onClick={handleCardClick}
      >
        <div className="space-y-4">
          <div>
            <h3 
              className="text-lg font-semibold text-text-primary"
            >
              {service.name[currentLanguage]}
            </h3>
            <p className="text-sm text-text-secondary mt-2">
              {service.description[currentLanguage]}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-accent-primary">
              ${service.basePrice}
            </span>
            <span className="text-sm text-text-secondary">
              {service.baseDuration} {service.durationUnit}
            </span>
          </div>
        </div>
      </Card>

      <ServiceDetailsModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 