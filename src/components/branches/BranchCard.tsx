import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Branch } from '../../types';
import { FaStar, FaParking, FaWheelchair, FaPhone, FaEnvelope, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from 'react-icons/fa';

interface BranchCardProps {
  branch: Branch;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleBook = () => {
    navigate(`/booking?branch=${branch.id}`);
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address.street)}, ${encodeURIComponent(branch.address.city)}, ${encodeURIComponent(branch.address.state)}, ${encodeURIComponent(branch.address.zipCode)}, ${encodeURIComponent(branch.address.country  )}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="rounded-lg overflow-hidden transition-all duration-300"
      style={{ 
        backgroundColor: theme.colors.background.card,
        boxShadow: theme.shadows.md
      }}
    >
      {/* Image and Rating Section */}
      <div className="relative">
        <img 
          src={branch.image} 
          alt={branch.name}
          className="w-full h-48 object-cover"
        />
        <div 
          className="absolute bottom-2 right-2 px-3 py-1 rounded-full flex items-center gap-1"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <FaStar className="text-yellow-400" />
          <span style={{ color: theme.colors.text.primary }}>
            {branch.rating.toFixed(1)}
          </span>
          <span 
            className="text-sm"
            style={{ color: theme.colors.text.secondary }}
          >
            ({branch.numberOfRatings})
          </span>
        </div>
      </div>

      {/* Branch Info Section */}
      <div className="p-4">
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: theme.colors.text.primary }}
        >
          {branch.name}
        </h3>
        <p 
          className="mb-4 line-clamp-2"
          style={{ color: theme.colors.text.secondary }}
        >
          {branch.description}
        </p>

        {/* Quick Info */}
        <div className="flex gap-4 mb-4">
          {branch.parkingAvailable && (
            <div 
              className="flex items-center gap-1"
              style={{ color: theme.colors.text.secondary }}
            >
              <FaParking />
              <span className="text-sm">Parking</span>
            </div>
          )}
          {branch.wheelchairAccessible && (
            <div 
              className="flex items-center gap-1"
              style={{ color: theme.colors.text.secondary }}
            >
              <FaWheelchair />
              <span className="text-sm">Accessible</span>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          style={{ 
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary
          }}
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

        {/* Expanded Content */}
        <div 
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-[1000px] mt-4' : 'max-h-0'
          }`}
        >
          {/* Location */}
          <div className="mb-4">
            <button
              onClick={handleViewOnMap}
              className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              style={{ 
                backgroundColor: theme.colors.accent.secondary,
                color: theme.colors.text.primary
              }}
            >
              <FaMapMarkerAlt />
              <span>{branch.address.street}, {branch.address.city}, {branch.address.state}, {branch.address.zipCode}, {branch.address.country}</span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <a 
              href={`tel:${branch.phoneNumber}`}
              className="flex items-center gap-2"
              style={{ color: theme.colors.text.secondary }}
            >
              <FaPhone />
              <span>{branch.phoneNumber}</span>
            </a>
            <a 
              href={`mailto:${branch.email}`}
              className="flex items-center gap-2"
              style={{ color: theme.colors.text.secondary }}
            >
              <FaEnvelope />
              <span>{branch.email}</span>
            </a>
          </div>

          {/* Opening Hours */}
          <div className="mb-4">
            <h4 
              className="font-medium mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              Opening Hours
            </h4>
            <div className="space-y-1">
              {Object.entries(branch.workingHours).map(([day, hours]) => (
                <div 
                  key={day}
                  className="flex justify-between text-sm"
                  style={{ color: theme.colors.text.secondary }}
                >
                  <span className="capitalize">{day}</span>
                  <span>{`${hours.open} - ${hours.close}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBook}
          className="w-full py-2 rounded-lg font-medium mt-4 transition-colors hover:opacity-90"
          style={{ 
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.primary
          }}
        >
          Book at This Branch
        </button>
      </div>
    </div>
  );
} 
