import { useTheme } from '../../contexts/ThemeContext';
import { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  const { theme } = useTheme();

  return (
    <div 
      className="p-4 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
      style={{ backgroundColor: theme.colors.background.card }}
    >
      <img 
        src={service.image} 
        alt={service.translations.en.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
        {service.translations.en.name}
      </h3>
      <p className="text-sm mb-4" style={{ color: theme.colors.text.secondary }}>
        {service.translations.en.description}
      </p>
      <div className="flex justify-between items-center">
        <span className="font-bold" style={{ color: theme.colors.accent.primary }}>
          ${service.basePrice}
        </span>
        <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
          {service.baseDuration} {service.durationUnit}
        </span>
      </div>
    </div>
  );
} 