import { useTheme } from '../../contexts/ThemeContext';
import { Branch } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import BranchBookButton from './BranchBookButton';

interface BranchDetailsModalProps {
  branch: Branch;
  onClose: () => void;
  isOpen: boolean;
}

export default function BranchDetailsModal({ branch, onClose, isOpen }: BranchDetailsModalProps) {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
            style={{ backgroundColor: theme.colors.background.card }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-10"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-6">
                <img 
                  src={branch.image} 
                  alt={branch.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                    {branch.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span style={{ color: theme.colors.text.primary }}>{branch.rating}</span>
                    <span style={{ color: theme.colors.text.secondary }}>({branch.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Location Information
                  </h3>
                  <div className="space-y-2">
                    <p style={{ color: theme.colors.text.secondary }}>
                      <span className="font-semibold">Address:</span><br />
                      {branch.address.street}<br />
                      {branch.address.city}, {branch.address.state} {branch.address.zipCode}
                    </p>
                    {branch.phone && (
                      <p style={{ color: theme.colors.text.secondary }}>
                        <span className="font-semibold">Phone:</span> {branch.phone}
                      </p>
                    )}
                    {branch.email && (
                      <p style={{ color: theme.colors.text.secondary }}>
                        <span className="font-semibold">Email:</span> {branch.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                    Working Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(branch.workingHours).map(([day, hours]) => (
                      <p key={day} style={{ color: theme.colors.text.secondary }}>
                        <span className="font-semibold capitalize">{day}:</span>{' '}
                        {hours.open} - {hours.close}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                {branch.facilities && branch.facilities.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                      Facilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {branch.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: theme.colors.background.secondary,
                            color: theme.colors.text.secondary
                          }}
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accessibility */}
                {branch.accessibility && branch.accessibility.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                      Accessibility
                    </h3>
                    <div className="space-y-2">
                      {branch.accessibility.map((feature, index) => (
                        <p key={index} style={{ color: theme.colors.text.secondary }}>
                          • {feature}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <div className="flex justify-center pt-4">
                <BranchBookButton 
                  branchId={branch.id} 
                  fullWidth={false} 
                  className="px-8 py-3 text-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 