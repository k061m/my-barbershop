import { useState } from 'react';
import { Branch } from '../../types';
import Card from '../common/Card';
import BranchBookButton from './BranchBookButton';
import BranchDetailsModal from './BranchDetailsModal';

interface BranchCardProps {
  branch: Branch;
  showActions?: boolean;
}

export default function BranchCard({ branch, showActions = true }: BranchCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const header = (
    <div className="relative h-48">
      <img
        src={branch.image}
        alt={branch.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full flex items-center gap-1 bg-background-card">
        <span className="text-yellow-400">★</span>
        <span className="text-text-primary">{branch.rating}</span>
        <span className="text-text-secondary">({branch.reviews})</span>
      </div>
    </div>
  );

  const footer = showActions && (
    <BranchBookButton branchId={branch.id} />
  );

  return (
    <>
      <Card
        header={header}
        footer={footer}
        hover
        onClick={handleCardClick}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">
              {branch.name}
            </h3>
            <div className="space-y-3 mt-2 text-text-secondary">
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-1">
                  {branch.address.street}, {branch.address.city}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {`${branch.workingHours.monday.open} - ${branch.workingHours.monday.close}`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {branch.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-xs bg-background-hover text-text-secondary"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <BranchDetailsModal
        branch={branch}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 
