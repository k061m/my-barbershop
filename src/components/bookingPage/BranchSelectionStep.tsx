// Import necessary types and components
import { Branch } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { FaStar } from 'react-icons/fa';

// Define the props interface for the component
interface BranchSelectionStepProps {
  branches: Branch[];
  selectedBranchId: string;
  onSelect: (branchId: string) => void;
}

// Define the BranchSelectionStep component
export default function BranchSelectionStep({
  branches,
  selectedBranchId,
  onSelect
}: BranchSelectionStepProps) {
  // Get the current theme from the ThemeContext
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Title of the step */}
      <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
        Select Your Branch
      </h2>
      
      {/* Grid container for branch cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {branches.length > 0 ? (
          // Map through branches and create a card for each
          branches.map(branch => (
            <div
              key={branch.id}
              onClick={() => onSelect(branch.id)}
              className={`rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-[1.02] ${
                selectedBranchId === branch.id ? 'ring-2' : ''
              }`}
              style={{ 
                backgroundColor: theme.colors.background.card,
                borderColor: selectedBranchId === branch.id ? theme.colors.accent.primary : 'transparent'
              }}
            >
              {/* Branch card content */}
              <div className="flex items-center gap-4">
                {/* Branch image and rating */}
                <div className="relative">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {/* Rating badge */}
                  <div 
                    className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs"
                    style={{ backgroundColor: theme.colors.background.card }}
                  >
                    <FaStar className="text-yellow-400" />
                    <span>{branch.rating.toFixed(1)}</span>
                  </div>
                </div>
                {/* Branch name and location */}
                <div>
                  <p className="font-medium" style={{ color: theme.colors.text.primary }}>
                    {branch.name}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                    {branch.address.city}, {branch.address.state}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Display message when no branches are available
          <div 
            className="col-span-2 text-center py-4 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.secondary 
            }}
          >
            No branches available. Please try again later or contact support.
          </div>
        )}
      </div>
    </div>
  );
}
