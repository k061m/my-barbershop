import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { appointments: allAppointments, loading } = useAppointments();
  const { barbers } = useBarbers();
  const { services } = useServices();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Filter appointments for current user
  const appointments = allAppointments.filter(appointment => appointment.userId === currentUser?.uid);

  // Calculate user statistics based on filtered appointments
  const stats = {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
    cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
    totalSpent: appointments
      .filter(a => a.status === 'confirmed')
      .reduce((total, appointment) => {
        const service = services.find(s => s.id === appointment.serviceId);
        return total + (service?.price || 0);
      }, 0),
    favoriteBarber: (() => {
      const barberCounts = appointments.reduce((acc, app) => {
        acc[app.barberId] = (acc[app.barberId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostFrequentBarberId = Object.entries(barberCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0];
      return barbers.find(b => b.id === mostFrequentBarberId)?.name || 'None yet';
    })()
  };

  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber?.name || 'Unknown Barber';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No date set';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
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

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="loading loading-spinner loading-lg" style={{ color: theme.colors.accent.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] p-4 sm:p-6" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                My Dashboard
              </h1>
              <p style={{ color: theme.colors.text.secondary }}>
                Welcome back, {currentUser?.email}
              </p>
            </div>
            <button
              onClick={() => navigate('/booking')}
              className="btn transition-colors hover:opacity-90 w-full sm:w-auto"
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary,
                transition: 'all 0.3s ease'
              }}
            >
              Book New Appointment
            </button>
          </div>

          {/* Profile Overview - Moved up for mobile */}
          <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: theme.colors.background.card }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary }}>
              Profile Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background.primary }}>
                <div className="text-xs" style={{ color: theme.colors.text.secondary }}>Email</div>
                <div className="font-medium text-sm truncate" style={{ color: theme.colors.text.primary }}>
                  {currentUser?.email}
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background.primary }}>
                <div className="text-xs" style={{ color: theme.colors.text.secondary }}>Favorite Barber</div>
                <div className="font-medium text-sm truncate" style={{ color: theme.colors.text.primary }}>
                  {stats.favoriteBarber}
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background.primary }}>
                <div className="text-xs" style={{ color: theme.colors.text.secondary }}>Member Since</div>
                <div className="font-medium text-sm" style={{ color: theme.colors.text.primary }}>
                  {currentUser?.metadata.creationTime
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                    : 'Unknown'}
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.background.primary }}>
                <div className="text-xs" style={{ color: theme.colors.text.secondary }}>Last Sign In</div>
                <div className="font-medium text-sm" style={{ color: theme.colors.text.primary }}>
                  {currentUser?.metadata.lastSignInTime
                    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                    : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.accent.primary }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Total Visits</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.accent.primary }}>{stats.totalAppointments}</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.status.warning }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Upcoming</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.status.warning }}>{stats.pendingAppointments}</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.status.success }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Completed</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.status.success }}>{stats.confirmedAppointments}</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.accent.secondary }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Total Spent</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.accent.secondary }}>${stats.totalSpent}</div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: theme.colors.background.card }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold" style={{ color: theme.colors.text.primary }}>
              My Appointments
            </h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="select w-full sm:w-auto transition-colors"
              style={{ 
                backgroundColor: theme.colors.background.primary,
                color: theme.colors.text.primary
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full text-sm" style={{ color: theme.colors.text.primary }}>
                <thead>
                  <tr style={{ backgroundColor: theme.colors.background.hover }}>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Barber</th>
                    <th className="p-3 text-left hidden sm:table-cell">Date</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments
                    .filter(appointment => filter === 'all' ? true : appointment.status === filter)
                    .map((appointment) => (
                      <tr key={appointment.id} className="border-t border-opacity-10" style={{ borderColor: theme.colors.text.secondary }}>
                        <td className="p-3">{getServiceName(appointment.serviceId)}</td>
                        <td className="p-3">{getBarberName(appointment.barberId)}</td>
                        <td className="p-3 hidden sm:table-cell">{formatDate(appointment.date)}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold" style={{ 
                            backgroundColor: appointment.status === 'pending' ? theme.colors.status.warning :
                                          appointment.status === 'confirmed' ? theme.colors.status.success :
                                          theme.colors.status.error,
                            color: theme.colors.text.primary
                          }}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="btn btn-sm transition-colors hover:opacity-90"
                              style={{ 
                                backgroundColor: theme.colors.status.error,
                                color: theme.colors.text.primary
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 