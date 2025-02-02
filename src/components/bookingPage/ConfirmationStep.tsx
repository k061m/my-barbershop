import { useTheme } from '../../contexts/ThemeContext';
import { Branch, Service, Barber } from '../../types';
import { format } from 'date-fns';

interface ConfirmationStepProps {
  branch: Branch;
  service: Service;
  barber: Barber;
  date: string;
  time: string;
}

export default function ConfirmationStep({
  branch,
  service,
  barber,
  date,
  time
}: ConfirmationStepProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
        Confirm Your Booking
      </h2>

      <div className="space-y-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background.card }}>
          <h3 className="font-medium mb-2" style={{ color: theme.colors.text.primary }}>
            Appointment Details
          </h3>
          <div className="space-y-2" style={{ color: theme.colors.text.secondary }}>
            <p>Date: {format(new Date(date), 'EEEE, MMMM d, yyyy')}</p>
            <p>Time: {time}</p>
            <p>Service: {service.name.en}</p>
            <p>Duration: {service.baseDuration} {service.durationUnit}</p>
            <p>Price: ${service.basePrice}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background.card }}>
          <h3 className="font-medium mb-2" style={{ color: theme.colors.text.primary }}>
            Location & Barber
          </h3>
          <div className="space-y-2" style={{ color: theme.colors.text.secondary }}>
            <p>Branch: {branch.name}</p>
            <p>Address: {`${branch.address.street}, ${branch.address.city}, ${branch.address.state}, ${branch.address.zipCode}, ${branch.address.country}`}</p>
            <p>Barber: {barber.firstName} {barber.lastName}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 