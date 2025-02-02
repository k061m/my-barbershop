import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { appointmentService } from '../services/appointment.service';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { FaStar, FaChevronLeft } from 'react-icons/fa';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { appointments: allAppointments, loading } = useAppointments();
  const { barbers } = useBarbers();
   const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Filter appointments for current user
  const appointments = allAppointments.filter(appointment => appointment.userId === currentUser?.uid);
  
  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? `${barber.firstName} ${barber.lastName}` : 'Unknown Barber';
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return format(date, "MMMM d, yyyy, h:mm a");
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.updateAppointment(appointmentId, { status: 'cancelled' });
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  // Filter appointments based on date
  const now = new Date();
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = appointment.date instanceof Timestamp ? 
      appointment.date.toDate() : new Date(appointment.date);
    return appointmentDate >= now && appointment.status !== 'cancelled';
  });

  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = appointment.date instanceof Timestamp ? 
      appointment.date.toDate() : new Date(appointment.date);
    return appointmentDate < now || appointment.status === 'cancelled';
  });

  if (loading) {
    return <LoadingSpinner />;
  }

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
          My Bookings
        </h1>
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'upcoming' ? 'font-semibold' : ''
          }`}
          style={{ 
            backgroundColor: activeTab === 'upcoming' ? theme.colors.background.card : 'transparent',
            color: theme.colors.text.primary
          }}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'past' ? 'font-semibold' : ''
          }`}
          style={{ 
            backgroundColor: activeTab === 'past' ? theme.colors.background.card : 'transparent',
            color: theme.colors.text.primary
          }}
        >
          Past
        </button>
      </div>

      {/* Appointments List */}
      <div className="px-4 space-y-4">
        {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map(appointment => (
          <div 
            key={appointment.id}
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.colors.background.card }}
          >
            <div className="mb-2">
              <div className="text-sm opacity-60" style={{ color: theme.colors.text.primary }}>
                Order ID: {appointment.id}
              </div>
              <div className="text-sm opacity-60" style={{ color: theme.colors.text.primary }}>
                Order Date: {formatDateTime(appointment.date)}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={barbers.find(b => b.id === appointment.barberId)?.image || '/default-avatar.png'}
                alt={getBarberName(appointment.barberId)}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium" style={{ color: theme.colors.text.primary }}>
                  {getBarberName(appointment.barberId)}
                </div>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm" style={{ color: theme.colors.text.secondary }}>4.8</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {appointment.status === 'pending' && (
                <button
                  onClick={() => handleCancelAppointment(appointment.id)}
                  className="flex-1 py-2 px-4 rounded-lg border transition-colors hover:opacity-80"
                  style={{ 
                    borderColor: theme.colors.text.secondary,
                    color: theme.colors.text.primary
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => navigate(`/booking/${appointment.id}`)}
                className="flex-1 py-2 px-4 rounded-lg transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.primary
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 