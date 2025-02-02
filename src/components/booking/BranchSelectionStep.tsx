import { Branch } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { FaStar } from 'react-icons/fa';

interface BranchSelectionStepProps {
  branches: Branch[];
  selectedBranchId: string;
  onSelect: (branchId: string) => void;
}

export default function BranchSelectionStep({
  branches,
  selectedBranchId,
  onSelect
}: BranchSelectionStepProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
        Select Your Branch
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {branches.length > 0 ? (
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
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div 
                    className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs"
                    style={{ backgroundColor: theme.colors.background.card }}
                  >
                    <FaStar className="text-yellow-400" />
                    <span>{branch.rating.toFixed(1)}</span>
                  </div>
                </div>
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