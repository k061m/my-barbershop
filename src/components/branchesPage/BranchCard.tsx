import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Branch } from '../../types';
import { FaStar, FaParking, FaWheelchair, FaPhone, FaEnvelope, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from 'react-icons/fa';
import Card from '../common/Card';
import { componentStyles } from '../../config/theme';

interface BranchCardProps {
  branch: Branch;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/booking?branch=${branch.id}`);
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address.street)}, ${encodeURIComponent(branch.address.city)}, ${encodeURIComponent(branch.address.state)}, ${encodeURIComponent(branch.address.zipCode)}, ${encodeURIComponent(branch.address.country)}`;
    window.open(url, '_blank');
  };

  const header = (
    <div className="relative">
      <img 
        src={branch.image} 
        alt={branch.name}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full flex items-center gap-1 bg-background-card">
        <FaStar className="text-yellow-400" />
        <span className="text-text-primary">
          {branch.rating.toFixed(1)}
        </span>
        <span className="text-sm text-text-secondary">
          ({branch.numberOfRatings})
        </span>
      </div>
    </div>
  );

  const footer = (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${componentStyles.button.secondary}`}
      >
        {isExpanded ? (
          <>
            <span>Show Less</span>
            <FaChevronUp />
          </>
        ) : (
          <>
            <span>Show More</span>
            <FaChevronDown />
          </>
        )}
      </button>

      <button
        onClick={handleBook}
        className={`w-full ${componentStyles.button.primary}`}
      >
        Book at This Branch
      </button>
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      hover
    >
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-text-primary">
            {branch.name}
          </h3>
          <p className="mb-4 line-clamp-2 text-text-secondary">
            {branch.description}
          </p>
        </div>

        {/* Quick Info */}
        <div className="flex gap-4">
          {branch.parkingAvailable && (
            <div className="flex items-center gap-1 text-text-secondary">
              <FaParking />
              <span className="text-sm">Parking</span>
            </div>
          )}
          {branch.wheelchairAccessible && (
            <div className="flex items-center gap-1 text-text-secondary">
              <FaWheelchair />
              <span className="text-sm">Accessible</span>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        <div className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[1000px]' : 'max-h-0'
        }`}>
          {/* Location */}
          <div className="mb-4">
            <button
              onClick={handleViewOnMap}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${componentStyles.button.secondary}`}
            >
              <FaMapMarkerAlt />
              <span>{branch.address.street}, {branch.address.city}</span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <a 
              href={`tel:${branch.phoneNumber}`}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
            >
              <FaPhone />
              <span>{branch.phoneNumber}</span>
            </a>
            <a 
              href={`mailto:${branch.email}`}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
            >
              <FaEnvelope />
              <span>{branch.email}</span>
            </a>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-medium mb-2 text-text-primary">
              Opening Hours
            </h4>
            <div className="space-y-1">
              {Object.entries(branch.workingHours).map(([day, hours]) => (
                <div 
                  key={day}
                  className="flex justify-between text-sm text-text-secondary"
                >
                  <span className="capitalize">{day}</span>
                  <span>{`${hours.open} - ${hours.close}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 
