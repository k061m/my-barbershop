import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { FaChevronLeft, FaStar, FaMapMarkerAlt, FaClock, FaCut } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';

type FirestoreDate = Date | Timestamp | { _seconds: number; _nanoseconds: number } | string;

interface Appointment {
  id: string;
  userId: string;
  barberId: string;
  serviceId: string;
  branchId: string;
  date: FirestoreDate;
  status: 'pending' | 'confirmed' | 'cancelled';
  price: number;
}

export default function AppointmentDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { barbers } = useBarbers();
  const { services } = useServices();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id || !currentUser) return;
      try {
        const appointmentData = await appointmentService.getAppointment(id);
        if (!appointmentData) {
          navigate('/dashboard');
          return;
        }
        if (appointmentData.userId !== currentUser.uid) {
          navigate('/dashboard');
          return;
        }
        setAppointment(appointmentData as Appointment);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, currentUser, navigate]);

  const formatDateTime = (date: FirestoreDate) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), "MMMM d, yyyy 'at' h:mm a");
    } else if (date instanceof Date) {
      return format(date, "MMMM d, yyyy 'at' h:mm a");
    } else if (typeof date === 'string') {
      return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
    } else if (date && typeof date === 'object' && '_seconds' in date) {
      const timestamp = new Timestamp(date._seconds, date._nanoseconds);
      return format(timestamp.toDate(), "MMMM d, yyyy 'at' h:mm a");
    }
    return 'Invalid date';
  };

  const getBarber = () => {
    return barbers.find(b => b.id === appointment?.barberId);
  };

  const getService = () => {
    return services.find(s => s.id === appointment?.serviceId);
  };

  const getStatusColor = () => {
    switch (appointment?.status) {
      case 'pending':
        return theme.colors.status.warning;
      case 'confirmed':
        return theme.colors.status.success;
      case 'cancelled':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointment || appointment.status !== 'pending') return;
    
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.updateAppointment(appointment.id, { status: 'cancelled' });
        setAppointment({ ...appointment, status: 'cancelled' });
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!appointment) {
    return null;
  }

  const barber = getBarber();
  const service = getService();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:opacity-80"
          style={{ color: theme.colors.text.primary }}
        >
          <FaChevronLeft />
        </button>
        <h1 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
          Appointment Details
        </h1>
      </div>

      <div className="px-4 space-y-6">
        {/* Status Badge */}
        <div className="flex justify-center">
          <span 
            className="px-4 py-2 rounded-full text-sm font-medium capitalize"
            style={{ 
              backgroundColor: getStatusColor(),
              color: theme.colors.background.primary
            }}
          >
            {appointment.status}
          </span>
        </div>

        {/* Order Info */}
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <div className="space-y-2">
            <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
              Order ID
            </div>
            <div style={{ color: theme.colors.text.primary }}>
              {appointment.id}
            </div>
          </div>
        </div>

        {/* Barber Info */}
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <div className="flex items-center gap-4">
            <img
              src={barber?.image || '/default-avatar.png'}
              alt={barber?.firstName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="font-medium" style={{ color: theme.colors.text.primary }}>
                {barber?.firstName} {barber?.lastName}
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                  4.8
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div 
          className="p-4 rounded-lg space-y-4"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <div className="flex items-center gap-3">
            <FaClock style={{ color: theme.colors.accent.primary }} />
            <div>
              <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
                Date & Time
              </div>
              <div style={{ color: theme.colors.text.primary }}>
                {formatDateTime(appointment.date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCut style={{ color: theme.colors.accent.primary }} />
            <div>
              <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
                Service
              </div>
              <div style={{ color: theme.colors.text.primary }}>
                {service?.name.en}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt style={{ color: theme.colors.accent.primary }} />
            <div>
              <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
                Location
              </div>
              <div style={{ color: theme.colors.text.primary }}>
                Branch {appointment.branchId}
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <div className="flex justify-between items-center">
            <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
              Total Amount
            </div>
            <div className="text-xl font-semibold" style={{ color: theme.colors.accent.primary }}>
              ${appointment.price}
            </div>
          </div>
        </div>

        {/* Actions */}
        {appointment.status === 'pending' && (
          <div className="pt-4">
            <button
              onClick={handleCancelAppointment}
              className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-80"
              style={{ 
                backgroundColor: theme.colors.status.error,
                color: theme.colors.background.primary
              }}
            >
              Cancel Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
