import { useNavigate } from 'react-router-dom';
import { Barber, Language } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import StarRating from '../common/StarRating';

interface BarberCardProps {
  barber: Barber;
  showActions?: boolean;
  onClick?: () => void;
}

export default function BarberCard({ barber, showActions = true, onClick }: BarberCardProps) {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { theme } = useTheme();

  const formatWorkingDays = (days: number[]) => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => dayNames[day - 1]).join(', ');
  };

  const getServicesList = (services: Barber['services']) => {
    return services.map(service => `${service.duration}min - $${service.price}`).join(', ');
  };

  const getTranslation = (language: Language) => {
    return barber.translations[language];
  };

  const translation = getTranslation(currentLanguage);

  return (
    <div 
      className="rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
      style={{ backgroundColor: theme.colors.background.card }}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={barber.image} 
          alt={`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
          className="w-full h-48 object-cover"
        />
        <div 
          className="absolute bottom-0 left-0 right-0 p-2"
          style={{ backgroundColor: `${theme.colors.background.card}80` }}
        >
          <StarRating rating={barber.professionalInfo.rating} size="sm" />
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
            {`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
          </h3>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {translation.title}
          </p>
        </div>

        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
          {translation.bio}
        </p>

        <div className="space-y-2">
          <div>
            <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
              Employee ID:
            </span>
            <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
              {barber.personalInfo.employeeId}
            </span>
          </div>

          <div>
            <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
              Languages:
            </span>
            <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
              {barber.professionalInfo.languages.join(', ').toUpperCase()}
            </span>
          </div>

          <div>
            <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
              Working Days:
            </span>
            <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
              {formatWorkingDays(barber.availability.workingDays)}
            </span>
          </div>

          <div>
            <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
              Services:
            </span>
            <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
              {getServicesList(barber.services)}
            </span>
          </div>

          <div>
            <span className="text-sm font-semibold" style={{ color: theme.colors.text.primary }}>
              Specialties:
            </span>
            <span className="text-sm ml-2" style={{ color: theme.colors.text.secondary }}>
              {barber.professionalInfo.specialties.join(', ')}
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
  );
} 