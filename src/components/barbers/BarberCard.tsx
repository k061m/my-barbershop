import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Barber } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import StarRating from '../common/StarRating';
import BarberDetailsModal from './BarberDetailsModal';

interface BarberCardProps {
  barber: Barber;
  showActions?: boolean;
  onClick?: () => void;
}

export default function BarberCard({ barber, showActions = true, onClick }: BarberCardProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatWorkingDays = (days: number[]) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => dayNames[day - 1]).join(', ');
  };

  const handleImageOrNameClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: theme.colors.background.card }}
        onClick={onClick}
      >
        <div className="relative">
          <img 
            src={barber.image} 
            alt={`${barber.firstName} ${barber.lastName}`}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={handleImageOrNameClick}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 p-2"
            style={{ backgroundColor: `${theme.colors.background.card}80` }}
          >
            <StarRating rating={barber.rating} size="sm" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 
              className="text-xl font-bold cursor-pointer hover:opacity-80"
              style={{ color: theme.colors.text.primary }}
              onClick={handleImageOrNameClick}
            >
              {`${barber.firstName} ${barber.lastName}`}
            </h3>
            <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
              {barber.title[currentLanguage]}
            </p>
          </div>

          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {barber.bio[currentLanguage]}
          </p>

          <div className="space-y-2">
            <div>
              <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
                Employee ID:
              </span>
              <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
                {barber.employeeId}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
                Languages:
              </span>
              <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
                {barber.languages.join(', ').toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
                Working Days:
              </span>
              <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
                {formatWorkingDays(barber.workingDays)}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
                Services:
              </span>
              <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
                {barber.services.join(', ')}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
                Specialties:
              </span>
              <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
                {barber.specialties.join(', ')}
              </span>
            </div>
          </div>

          {showActions && (
            <div className="pt-2">
              <button
                onClick={() => navigate('/booking', { state: { selectedBarberId: barber.id } })}
                className="w-full py-2 rounded-lg font-medium transition-colors hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.primary
                }}
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>

      <BarberDetailsModal
        barber={barber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 