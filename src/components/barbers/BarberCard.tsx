import { useState } from 'react';
import { Barber } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import StarRating from '../common/StarRating';
import BarberDetailsModal from './BarberDetailsModal';
import Card from '../common/Card';
import BarberBookButton from './BarberBookButton';

interface BarberCardProps {
  barber: Barber;
  showActions?: boolean;
  onClick?: () => void;
}

export default function BarberCard({ barber, showActions = true }: BarberCardProps) {
  const { currentLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const header = (
    <div className="relative">
      <img 
        src={barber.image} 
        alt={`${barber.firstName} ${barber.lastName}`}
        className="w-full h-48 object-cover"
      />
      <div 
        className="absolute bottom-0 left-0 right-0 p-2 bg-background-card bg-opacity-50 backdrop-blur-sm"
      >
        <StarRating rating={barber.rating} size="sm" />
      </div>
    </div>
  );

  const footer = showActions && (
    <BarberBookButton barberId={barber.id} />
  );

  return (
    <>
      <Card
        header={header}
        footer={footer}
        hover
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          <div>
            <h3 
              className="text-xl font-bold text-text-primary"
            >
              {`${barber.firstName} ${barber.lastName}`}
            </h3>
            <p className="text-sm text-text-secondary">
              {barber.title[currentLanguage]}
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-sm font-semibold text-text-primary">
                Languages:
              </span>
              <span className="text-sm ml-2 text-text-secondary">
                {barber.languages.join(', ').toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold text-text-primary">
                Specialties:
              </span>
              <span className="text-sm ml-2 text-text-secondary">
                {barber.specialties.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <BarberDetailsModal
        barber={barber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 