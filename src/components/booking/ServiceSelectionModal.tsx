import { Service } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface ServiceSelectionModalProps {
  isOpen: boolean;
  services: Service[];
  onSelect: (serviceId: string) => void;
  onClose: () => void;
  selectedServiceId: string;
}

export default function ServiceSelectionModal({ 
  isOpen,
  services, 
  onSelect, 
  onClose,
}: ServiceSelectionModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg shadow-lg p-6" 
        style={{ backgroundColor: theme.colors.background.card }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>
          Select Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {services.map(service => (
            <div
              key={service.id}
              onClick={() => service.id && onSelect(service.id)}
              className="rounded-lg p-4 cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: theme.colors.background.primary }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={service.image}
                  alt={service.name.en}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                    {service.name.en}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.accent.primary }}>
                    ${service.basePrice}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    {service.baseDuration} {service.durationUnit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-lg transition-colors hover:opacity-90"
          style={{ 
            backgroundColor: theme.colors.background.primary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.text.secondary}`
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 