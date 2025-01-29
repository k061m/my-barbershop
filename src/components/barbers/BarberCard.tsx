import { useTheme } from '../../contexts/ThemeContext';
import { Barber } from '../../types/data.types';

interface BarberCardProps {
  barber: Barber;
  onClick?: () => void;
}

export default function BarberCard({ barber, onClick }: BarberCardProps) {
  const { theme } = useTheme();

  return (
    <div 
      className="p-4 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
      style={{ backgroundColor: theme.colors.background.card }}
    >
      <img 
        src={barber.image} 
        alt={barber.translations.en.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
        {barber.translations.en.name}
      </h3>
      <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>
        {barber.translations.en.bio}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
          {barber.workingDays.join(', ')}
        </span>
        <span 
          className={`px-2 py-1 rounded text-xs font-semibold`}
          style={{ 
            backgroundColor: barber.available ? theme.colors.status.success : theme.colors.status.error,
            color: theme.colors.text.primary
          }}
        >
          {barber.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
    </div>
  );
} 