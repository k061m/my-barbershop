import { useTheme } from '../../contexts/ThemeContext';
import { Branch } from '../../types/branch.types';
import { memo } from 'react';

// Separate component for branch details
const BranchDetails = memo(({ branch, isSelected, onSelect, onClose }: { 
  branch: Branch; 
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
}) => {
  const { theme } = useTheme();
  
  const handleViewOnMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address.street)}, ${encodeURIComponent(branch.address.city)}, ${encodeURIComponent(branch.address.state)}, ${encodeURIComponent(branch.address.zipCode)}, ${encodeURIComponent(branch.address.country)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={() => {
        console.log('Selected branch:', branch);
        onSelect(branch.id);
        onClose();
      }}
      className={`w-full p-4 rounded-lg transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-accent' : ''
      }`}
      style={{ 
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.background.secondary
      }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Branch Image */}
        <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden">
          <img 
            src={branch.image} 
            alt={branch.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Branch Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              {branch.name}
            </h3>
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              {branch.description}
            </p>
            <p 
              className="text-sm mt-2"
              style={{ color: theme.colors.text.secondary }}
            >
              {branch.address.street}, {branch.address.city}, {branch.address.state}, {branch.address.zipCode}, {branch.address.country}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-1">
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              <strong>Phone:</strong> {branch.phoneNumber}
            </p>
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              <strong>Email:</strong> {branch.email}
            </p>
          </div>

          {/* Opening Hours */}
          <div>
            <p 
              className="text-sm font-semibold mb-1"
              style={{ color: theme.colors.text.primary }}
            >
              Opening Hours:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: theme.colors.text.secondary }}>
              <p>Monday: {branch.workingHours.monday.open} - {branch.workingHours.monday.close}</p>
              <p>Tuesday: {branch.workingHours.tuesday.open} - {branch.workingHours.tuesday.close}</p>
              <p>Wednesday: {branch.workingHours.wednesday.open} - {branch.workingHours.wednesday.close}</p>
              <p>Thursday: {branch.workingHours.thursday.open} - {branch.workingHours.thursday.close}</p>
              <p>Friday: {branch.workingHours.friday.open} - {branch.workingHours.friday.close}</p>
              <p>Saturday: {branch.workingHours.saturday.open} - {branch.workingHours.saturday.close}</p>
              <p>Sunday: {branch.workingHours.sunday.open} - {branch.workingHours.sunday.close}</p>
            </div>
          </div>

          {/* View on Map Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from closing
              handleViewOnMap();
            }}
            className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View on Google Maps
          </button>
        </div>
      </div>
    </div>
  );
});

interface BranchSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: Branch[];
  selectedBranchId: string;
  onSelect: (branchId: string) => void;
}

export default function BranchSelectionModal({
  isOpen,
  onClose,
  branches,
  selectedBranchId,
  onSelect
}: BranchSelectionModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg"
        style={{ backgroundColor: theme.colors.background.card }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: theme.colors.background.secondary }}>
          <div className="flex justify-between items-center">
            <h2 
              className="text-xl font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              Select a Branch
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:opacity-80"
              style={{ color: theme.colors.text.primary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Branch List */}
        <div className="p-4 space-y-4">
          {branches.map(branch => (
            <BranchDetails
              key={branch.id}
              branch={branch}
              isSelected={selectedBranchId === branch.id}
              onSelect={onSelect}
              onClose={onClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
