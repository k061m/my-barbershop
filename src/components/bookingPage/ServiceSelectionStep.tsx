// Import necessary types and components
import { Service, Branch } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { FaClock, FaDollarSign } from 'react-icons/fa';

// Define the props interface for the component
interface ServiceSelectionStepProps {
  services: Service[];
  selectedServiceId: string;
  selectedBranchId: string;
  onSelect: (serviceId: string) => void;
  branches: Branch[];
}

// Define the main component
export default function ServiceSelectionStep({
  services,
  selectedServiceId,
  selectedBranchId,
  onSelect,
  branches
}: ServiceSelectionStepProps) {
  // Get the current theme from the ThemeContext
  const { theme } = useTheme();

  // Find the selected branch from the branches array
  const selectedBranch = branches.find(branch => branch.id === selectedBranchId);

  // Filter services based on the selected branch's available services
  const availableServices = services.filter(service => 
    selectedBranch?.services.includes(service.id)
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
        Select Your Service
      </h2>
      
      {/* Grid layout for service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableServices.length > 0 ? (
          // Map through available services and create a card for each
          availableServices.map(service => (
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
              {/* Service card content */}
              <div className="flex items-center gap-4">
                {/* Service image */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: theme.colors.background.secondary }}>
                  <img
                    src={service.image}
                    alt={service.name.en}
                    className="w-16 h-16 object-cover"
                  />
                </div>
                {/* Service details */}
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                    {service.name.en}
                  </p>
                  <div className="flex items-center gap-3 text-sm" style={{ color: theme.colors.text.secondary }}>
                    {/* Duration */}
                    <span className="flex items-center gap-1">
                      <FaClock className="text-xs" />
                      {service.baseDuration} {service.durationUnit}
                    </span>
                    {/* Price */}
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
          // Display message when no services are available
          <div 
            className="col-span-2 text-center py-4 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.secondary 
            }}
          >
            No services available for this branch. Please try another branch or contact support.
          </div>
        )}
      </div>
    </div>
  );
}
