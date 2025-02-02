import { Barber, Service, Branch } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface BookingSummaryProps {
  branch: Branch;
  barber: Barber;
  service: Service;
  date: Date;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export default function BookingSummary({
  branch,
  barber,
  service,
  date,
  onSubmit,
  loading
}: BookingSummaryProps) {
  const { theme } = useTheme();

  return (
    <div className="rounded-lg shadow-lg p-6 mt-8" style={{ backgroundColor: theme.colors.background.card }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Booking Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Branch</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {branch.name}
          </p>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {branch.address.street}, {branch.address.city}, {branch.address.state}, {branch.address.zipCode}, {branch.address.country}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Barber</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {`${barber.firstName} ${barber.lastName}`}
          </p>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {barber.title.en}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Service</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {service.name.en}
          </p>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {service.description.en}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Date & Time</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {date.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Duration</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {service.baseDuration} {service.durationUnit}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Price</p>
          <p className="font-medium" style={{ color: theme.colors.accent.primary }}>
            ${service.basePrice.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
        style={{ 
          backgroundColor: theme.colors.accent.primary,
          color: theme.colors.background.primary
        }}
      >
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </div>
  );
} 