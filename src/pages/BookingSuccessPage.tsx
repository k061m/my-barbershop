import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { FaCheckCircle } from 'react-icons/fa';

export default function BookingSuccessPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state;

  if (!booking) {
    navigate('/booking');
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <FaCheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: theme.colors.status.success }} />
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.colors.text.primary }}
          >
            Booking Confirmed!
          </h1>
          <p style={{ color: theme.colors.text.secondary }}>
            Your appointment has been successfully scheduled
          </p>
        </div>

        <div 
          className="p-6 rounded-lg mb-8"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <div className="space-y-4" style={{ color: theme.colors.text.primary }}>
            <div>
              <h2 className="font-bold mb-2">Appointment Details</h2>
              <p>Date: {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}</p>
              <p>Time: {booking.time}</p>
              <p>Service: {booking.service.name.en}</p>
              <p>Duration: {booking.service.baseDuration} {booking.service.durationUnit}</p>
            </div>

            <div>
              <h2 className="font-bold mb-2">Location</h2>
              <p>{booking.branch.name}</p>
              <p>{booking.branch.address.street}</p>
              <p>{booking.branch.address.city}, {booking.branch.address.state} {booking.branch.address.zipCode}</p>
            </div>

            <div>
              <h2 className="font-bold mb-2">Barber</h2>
              <p>{booking.barber.firstName} {booking.barber.lastName}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary
            }}
          >
            Return Home
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
} 