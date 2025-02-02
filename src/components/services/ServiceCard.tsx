import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Service } from '../../types';
import ServiceDetailsModal from './ServiceDetailsModal';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleImageOrNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleBookNow = () => {
    navigate(`/booking?service=${service.id}`);
  };

  return (
    <>
      <div 
        className="p-4 rounded-lg shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: theme.colors.background.card }}
      >
        <div className="relative">
          <img 
            src={service.image} 
            alt={service.name[currentLanguage]}
            className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer"
            onClick={handleImageOrNameClick}
          />
          {service.isPopular && (
            <span 
              className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold"
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
            >
              Popular
            </span>
          )}
        </div>

        <h3 
          className="text-lg font-semibold mb-2 cursor-pointer hover:opacity-80"
          style={{ color: theme.colors.text.primary }}
          onClick={handleImageOrNameClick}
        >
          {service.name[currentLanguage]}
        </h3>
        <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>
          {service.description[currentLanguage]}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold" style={{ color: theme.colors.accent.primary }}>
            ${service.basePrice}
          </span>
          <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {service.baseDuration} {service.durationUnit}
          </span>
        </div>

        <button
          onClick={handleBookNow}
          className="w-full py-2 rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ 
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.primary
          }}
        >
          Book Now
        </button>
      </div>

      <ServiceDetailsModal
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 