import { Barber } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useEffect } from 'react';

interface BarberSelectionModalProps {
  isOpen: boolean;
  barbers: Barber[];
  onSelect: (barberId: string) => void;
  onClose: () => void;
  selectedBarberId: string;
}

export default function BarberSelectionModal({ 
  isOpen,
  barbers, 
  onSelect, 
  onClose,
  selectedBarberId 
}: BarberSelectionModalProps) {
  const { theme } = useTheme();

  useEffect(() => {
    console.log('BarberSelectionModal:', {
      isOpen,
      barberCount: barbers?.length,
      barbers: barbers?.map(b => ({
        id: b.id,
        name: `${b.firstName} ${b.lastName}`,
        branch: b.branches
      }))
    });
  }, [isOpen, barbers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg shadow-lg p-6" 
        style={{ backgroundColor: theme.colors.background.card }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
            Select Barber
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-black"
            style={{ color: theme.colors.text.primary }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {barbers && barbers.length > 0 ? (
            barbers.map(barber => (
              <div
                key={barber.id}
                onClick={() => barber.id && onSelect(barber.id)}
                className={`rounded-lg p-4 cursor-pointer transition-all ${
                  selectedBarberId === barber.id ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: theme.colors.background.primary,
                  borderColor: selectedBarberId === barber.id ? theme.colors.accent.primary : 'transparent'
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={barber.image}
                    alt={`${barber.firstName} ${barber.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                      {`${barber.firstName} ${barber.lastName}`}
                    </p>
                    <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                      {barber.title.en}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div 
              className="col-span-2 text-center py-4"
              style={{ color: theme.colors.text.secondary }}
            >
              No barbers available for this branch. Please try another branch or contact support.
            </div>
          )}
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