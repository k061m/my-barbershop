import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { appointments: allAppointments, loading } = useAppointments();
  const { barbers } = useBarbers();
  const { services } = useServices();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [showNotifications, setShowNotifications] = useState(true);

  // Filter appointments for current user
  const appointments = allAppointments.filter(appointment => appointment.userId === currentUser?.uid);
  
  // Debug log
  console.log('First appointment:', appointments[0]);

  // Calculate user statistics
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
      return barbers.find(b => b.id === mostFrequentBarberId)?.translations?.en?.name || 'None yet';
    })()
  };

  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber?.translations?.en?.name || 'Unknown Barber';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.translations?.en?.name || 'Unknown Service';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) {
      return 'No date set';
    }

    try {
      // For Firestore Timestamp
      if (timestamp && typeof timestamp === 'object') {
        // If it's a Firestore timestamp with toDate method
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
          const date = timestamp.toDate();
          return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Europe/London'
          }).format(date);
        }
        
        // If it's a Firestore timestamp without toDate method
        if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
          const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
          return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Europe/London'
          }).format(date);
        }
      }
      return 'Invalid date format';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error formatting date';
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';

    try {
      let date;
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
        date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        return '';
      }

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return '';
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';

    try {
      let date;
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
        date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      } else {
        return '';
      }

      return date.toLocaleTimeString('en-US', { 
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
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

  const sortAppointments = (appointments: any[]) => {
    return [...appointments].sort((a, b) => {
      if (sortBy === 'date') {
        return b.date.toDate() - a.date.toDate();
      } else if (sortBy === 'price') {
        const serviceA = services.find(s => s.id === a.serviceId);
        const serviceB = services.find(s => s.id === b.serviceId);
        return (serviceB?.price || 0) - (serviceA?.price || 0);
      } else {
        return a.status.localeCompare(b.status);
      }
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-[100dvh] p-4 sm:p-6" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
              My Dashboard
            </h1>
            <p style={{ color: theme.colors.text.secondary }}>
              Welcome back, {currentUser?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg transition-colors hover:opacity-90"
              style={{ 
                backgroundColor: theme.colors.background.card,
                color: showNotifications ? theme.colors.accent.primary : theme.colors.text.secondary
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/booking')}
              className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
            >
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Total Visits</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.accent.primary }}>{stats.totalAppointments}</div>
          </div>
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Upcoming</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.status.warning }}>{stats.pendingAppointments}</div>
          </div>
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Total Spent</div>
            <div className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.accent.secondary }}>${stats.totalSpent}</div>
          </div>
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div className="text-xs sm:text-sm" style={{ color: theme.colors.text.secondary }}>Favorite Barber</div>
            <div className="text-lg font-bold truncate" style={{ color: theme.colors.text.primary }}>{stats.favoriteBarber}</div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: theme.colors.background.card }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary }}>
            Dashboard Preferences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                View Style
              </label>
              <select
                value={view}
                onChange={(e) => setView(e.target.value as 'grid' | 'list')}
                className="w-full p-2 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.background.primary,
                  color: theme.colors.text.primary
                }}
              >
                <option value="list">List View</option>
                <option value="grid">Grid View</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'status')}
                className="w-full p-2 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.background.primary,
                  color: theme.colors.text.primary
                }}
              >
                <option value="date">Date</option>
                <option value="price">Price</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                Filter Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full p-2 rounded-lg"
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
          </div>
        </div>

        {/* Appointments Section */}
        <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: theme.colors.background.card }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary }}>
            My Appointments
          </h2>
          
          {view === 'list' ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm" style={{ color: theme.colors.text.primary }}>
                <thead>
                  <tr style={{ backgroundColor: theme.colors.background.hover }}>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Barber</th>
                    <th className="p-3 text-left">Appointment Date</th>
                    <th className="p-3 text-left">Booked On</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortAppointments(appointments)
                    .filter(appointment => filter === 'all' ? true : appointment.status === filter)
                    .map((appointment) => {
                      const service = services.find(s => s.id === appointment.serviceId);
                      return (
                        <tr key={appointment.id} className="border-t border-opacity-10" 
                          style={{ borderColor: theme.colors.text.secondary }}>
                          <td className="p-3">
                            <div>
                              <span className="font-medium">{getServiceName(appointment.serviceId)}</span>
                              <span className="text-xs block" style={{ color: theme.colors.text.secondary }}>
                                ID: {appointment.serviceId}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <span className="font-medium">{getBarberName(appointment.barberId)}</span>
                              <span className="text-xs block" style={{ color: theme.colors.text.secondary }}>
                                ID: {appointment.barberId}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <span className="font-medium">{formatDate(appointment.date)}</span>
                              <span className="text-xs block" style={{ color: theme.colors.text.secondary }}>
                                {formatTime(appointment.date)} GMT+1
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <span className="font-medium">{formatDate(appointment.createdAt)}</span>
                              <span className="text-xs block" style={{ color: theme.colors.text.secondary }}>
                                {formatTimeAgo(appointment.createdAt)}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium">${service?.price || 0}</span>
                          </td>
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
                            <div className="flex gap-2">
                              {appointment.status === 'pending' && (
                                <button
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className="text-sm px-2 py-1 rounded transition-colors hover:opacity-90"
                                  style={{ 
                                    backgroundColor: theme.colors.status.error,
                                    color: theme.colors.text.primary
                                  }}
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={() => navigate('/booking', { 
                                  state: { 
                                    from: 'dashboard',
                                    selectedBarberId: appointment.barberId,
                                    selectedServiceId: appointment.serviceId
                                  }
                                })}
                                className="text-sm px-2 py-1 rounded transition-colors hover:opacity-90"
                                style={{ 
                                  backgroundColor: theme.colors.accent.primary,
                                  color: theme.colors.background.primary
                                }}
                              >
                                Rebook
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortAppointments(appointments)
                .filter(appointment => filter === 'all' ? true : appointment.status === filter)
                .map((appointment) => {
                  const service = services.find(s => s.id === appointment.serviceId);
                  return (
                    <div key={appointment.id} className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background.primary }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold" style={{ color: theme.colors.text.primary }}>
                            {getServiceName(appointment.serviceId)}
                            <span className="text-xs block" style={{ color: theme.colors.text.secondary }}>
                              Service ID: {appointment.serviceId}
                            </span>
                          </h3>
                          <p className="text-sm mt-1" style={{ color: theme.colors.text.secondary }}>
                            with {getBarberName(appointment.barberId)}
                            <span className="text-xs block">
                              Barber ID: {appointment.barberId}
                            </span>
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-semibold" style={{ 
                          backgroundColor: appointment.status === 'pending' ? theme.colors.status.warning :
                                        appointment.status === 'confirmed' ? theme.colors.status.success :
                                        theme.colors.status.error,
                          color: theme.colors.text.primary
                        }}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="text-sm space-y-1" style={{ color: theme.colors.text.secondary }}>
                        <p>
                          <strong>Appointment:</strong> {formatDate(appointment.date)}
                          <span className="text-xs block">
                            {formatTime(appointment.date)} GMT+1
                          </span>
                        </p>
                        <p>
                          <strong>Booked:</strong> {formatDate(appointment.createdAt)}
                          <span className="text-xs block">
                            {formatTimeAgo(appointment.createdAt)}
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="font-bold" style={{ color: theme.colors.accent.primary }}>
                          ${service?.price || 0}
                        </span>
                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-sm px-2 py-1 rounded transition-colors hover:opacity-90"
                              style={{ 
                                backgroundColor: theme.colors.status.error,
                                color: theme.colors.text.primary
                              }}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => navigate('/booking', { 
                              state: { 
                                from: 'dashboard',
                                selectedBarberId: appointment.barberId,
                                selectedServiceId: appointment.serviceId
                              }
                            })}
                            className="text-sm px-2 py-1 rounded transition-colors hover:opacity-90"
                            style={{ 
                              backgroundColor: theme.colors.accent.primary,
                              color: theme.colors.background.primary
                            }}
                          >
                            Rebook
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {showNotifications && (
          <div className="rounded-lg shadow-lg p-4" style={{ backgroundColor: theme.colors.background.card }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary }}>
              Notifications
            </h2>
            <div className="space-y-2">
              {stats.pendingAppointments > 0 && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.status.warning, color: theme.colors.text.primary }}>
                  You have {stats.pendingAppointments} upcoming appointment{stats.pendingAppointments > 1 ? 's' : ''}
                </div>
              )}
              {stats.confirmedAppointments > 0 && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: theme.colors.status.success, color: theme.colors.text.primary }}>
                  {stats.confirmedAppointments} appointment{stats.confirmedAppointments > 1 ? 's' : ''} completed successfully
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 