import { Barber, Service } from '../../types/data.types';
import { useTheme } from '../../contexts/ThemeContext';

interface BookingSummaryProps {
  barber: Barber;
  service: Service;
  date: string;
  time: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export default function BookingSummary({
  barber,
  service,
  date,
  time,
  onSubmit,
  loading
}: BookingSummaryProps) {
  const { theme } = useTheme();

  return (
    <div className="rounded-lg shadow-lg p-6 mt-8" style={{ backgroundColor: theme.colors.background.card }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>Booking Summary</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Barber</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {barber.translations.en.name}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Service</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {service.translations.en.name}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Date & Time</p>
          <p className="font-medium" style={{ color: theme.colors.text.primary }}>
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })} at {time}
          </p>
        </div>
        <div>
          <p style={{ color: theme.colors.text.secondary }}>Price</p>
          <p className="font-medium" style={{ color: theme.colors.accent.primary }}>
            ${service.price}
          </p>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-90"
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