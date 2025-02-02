import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Barber } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import StarRating from '../common/StarRating';
import BarberDetailsModal from './BarberDetailsModal';
import Card from '../common/Card';
import Button from '../common/Button';
import { componentStyles } from '../../config/theme';

interface BarberCardProps {
  barber: Barber;
  showActions?: boolean;
  onClick?: () => void;
}

export default function BarberCard({ barber, showActions = true, onClick }: BarberCardProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatWorkingDays = (days: number[]) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => dayNames[day - 1]).join(', ');
  };

  const handleImageOrNameClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    setIsModalOpen(true);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    navigate(`/booking?barber=${barber.id}`);
  };

  const header = (
    <div className="relative">
      <img 
        src={barber.image} 
        alt={`${barber.firstName} ${barber.lastName}`}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={handleImageOrNameClick}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 p-2 bg-background-card bg-opacity-50 backdrop-blur-sm"
      >
        <StarRating rating={barber.rating} size="sm" />
      </div>
    </div>
  );

  const footer = showActions && (
    <Button
      variant="primary"
      fullWidth
      onClick={handleBookNow}
    >
      Book Now
    </Button>
  );

  return (
    <>
      <Card
        header={header}
        footer={footer}
        hover
        onClick={onClick}
      >
        <div className="space-y-3">
          <div>
            <h3 
              className="text-xl font-bold cursor-pointer hover:opacity-80 text-text-primary"
              onClick={handleImageOrNameClick}
            >
              {`${barber.firstName} ${barber.lastName}`}
            </h3>
            <p className="text-sm text-text-secondary">
              {barber.title[currentLanguage]}
            </p>
          </div>

          <p className="text-sm text-text-secondary">
            {barber.bio[currentLanguage]}
          </p>

          <div className="space-y-2">
            <div>
              <span className="text-sm font-semibold text-text-primary">
                Employee ID:
              </span>
              <span className="text-sm ml-2 text-text-secondary">
                {barber.employeeId}
              </span>
            </div>

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
                Working Days:
              </span>
              <span className="text-sm ml-2 text-text-secondary">
                {formatWorkingDays(barber.workingDays)}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold text-text-primary">
                Services:
              </span>
              <span className="text-sm ml-2 text-text-secondary">
                {barber.services.join(', ')}
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