import { Barber } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface BarberSelectionModalProps {
  barbers: Barber[];
  onSelect: (barberId: string) => void;
  onClose: () => void;
}

export default function BarberSelectionModal({ barbers, onSelect, onClose }: BarberSelectionModalProps) {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg shadow-lg p-6" 
        style={{ backgroundColor: theme.colors.background.card }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>
          Select Barber
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {barbers.map(barber => (
            <div
              key={barber.id}
              onClick={() => barber.id && onSelect(barber.id)}
              className="rounded-lg p-4 cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: theme.colors.background.primary }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={barber.image}
                  alt={barber.translations.en.title}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                    {barber.translations.en.title}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    {barber.translations.en.bio}
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