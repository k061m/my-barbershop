import { Barber } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface BarberSelectionStepProps {
  barbers: Barber[];
  selectedBarberId: string;
  selectedBranchId: string;
  selectedServiceId: string;
  onSelect: (barberId: string) => void;
}

export default function BarberSelectionStep({
  barbers,
  selectedBarberId,
  selectedBranchId,
  selectedServiceId,
  onSelect
}: BarberSelectionStepProps) {
  const { theme } = useTheme();

  // Filter barbers based on selected branch and service
  const availableBarbers = barbers.filter(barber => 
    barber.branches?.includes(selectedBranchId) && 
    barber.services?.includes(selectedServiceId) &&
    barber.isActive
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
        Select Your Barber
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableBarbers.length > 0 ? (
          availableBarbers.map(barber => (
            <div
              key={barber.id}
              onClick={() => onSelect(barber.id)}
              className={`rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-[1.02] ${
                selectedBarberId === barber.id ? 'ring-2' : ''
              }`}
              style={{ 
                backgroundColor: theme.colors.background.card,
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
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full" 
                      style={{ 
                        backgroundColor: theme.colors.background.secondary,
                        color: theme.colors.text.secondary 
                      }}>
                      {barber.experienceYears}+ years
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" 
                      style={{ 
                        backgroundColor: theme.colors.background.secondary,
                        color: theme.colors.text.secondary 
                      }}>
                      ⭐ {barber.rating.toFixed(1)}
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
            No barbers available for this service at this branch. Please try another service or branch.
          </div>
        )}
      </div>
    </div>
  );
} 