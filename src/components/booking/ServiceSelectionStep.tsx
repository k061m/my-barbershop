import { Service } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { FaClock, FaDollarSign } from 'react-icons/fa';

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServiceId: string;
  onSelect: (serviceId: string) => void;
}

export default function ServiceSelectionStep({
  services,
  selectedServiceId,
  onSelect
}: ServiceSelectionStepProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
        Select Your Service
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.length > 0 ? (
          services.map(service => (
            <div
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={`rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-[1.02] ${
                selectedServiceId === service.id ? 'ring-2' : ''
              }`}
              style={{ 
                backgroundColor: theme.colors.background.card,
                borderColor: selectedServiceId === service.id ? theme.colors.accent.primary : 'transparent'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: theme.colors.background.secondary }}>
                  <img
                    src={service.image}
                    alt={service.name.en}
                    className="w-16 h-16 object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                    {service.name.en}
                  </p>
                  <div className="flex items-center gap-3 text-sm" style={{ color: theme.colors.text.secondary }}>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-xs" />
                      {service.baseDuration} {service.durationUnit}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaDollarSign className="text-xs" />
                      {service.basePrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div 
            className="col-span-2 text-center py-4 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.secondary 
            }}
          >
            No services available. Please try again later or contact support.
          </div>
        )}
      </div>
    </div>
  );
} 
