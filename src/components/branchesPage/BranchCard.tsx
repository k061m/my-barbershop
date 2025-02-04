import { useState } from 'react';
import { Branch } from '../../types';
import BranchDetailsModal from './BranchDetailsModal';

// Define the props interface for the BranchCard component
interface BranchCardProps {
  branch: Branch;
  showActions?: boolean; // Optional prop, not used in this component
}

// Main BranchCard component
export default function BranchCard({ branch }: BranchCardProps) {
  // State to control the visibility of the details modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Clickable container that opens the modal */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
      >
        {/* Image section */}
        <div className="relative">
          <img 
            src={branch.image} 
            alt={branch.name}
            className="w-full h-48 object-cover"
          />
          {/* Conditional rendering of "Top Rated" badge */}
          {branch.rating >= 4.5 && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-accent-primary text-text-inverse rounded text-xs font-medium">
              Top Rated
            </span>
          )}
        </div>

        {/* Branch information section */}
        <div className="p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {branch.name}
            </h3>
            <p className="text-sm text-text-secondary mt-2">
              {branch.address.street}, {branch.address.city}
            </p>
          </div>

          {/* Rating and working days information */}
          <div className="flex justify-between items-center mt-4">
            {/* Rating display */}
            <div className="flex items-center space-x-1">
              {/* Star icon */}
              <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-accent-primary">{branch.rating.toFixed(1)}</span>
              <span className="text-text-secondary text-sm">({branch.reviews})</span>
            </div>
            {/* Number of open days */}
            <span className="text-sm text-text-secondary">
              {Object.keys(branch.workingHours).length} days open
            </span>
          </div>
        </div>
      </div>

      {/* Modal component for displaying branch details */}
      <BranchDetailsModal
        branch={branch}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
