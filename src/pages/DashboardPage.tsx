import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { appointments: allAppointments, loading } = useAppointments();
  const { barbers } = useBarbers();
  const { services } = useServices();
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
      <div className="min-h-[100dvh] flex items-center justify-center p-4">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-base-100 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Dashboard</h1>
            <p className="text-base-content/60 text-sm sm:text-base">Welcome back, {currentUser?.email}</p>
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="btn btn-primary w-full sm:w-auto"
          >
            Book New Appointment
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat bg-base-200 rounded-box shadow-lg p-4">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">Total Visits</div>
            <div className="stat-value text-primary">{stats.totalAppointments}</div>
            <div className="stat-desc">Your appointments</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box shadow-lg p-4">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <div className="stat-title">Upcoming</div>
            <div className="stat-value text-warning">{stats.pendingAppointments}</div>
            <div className="stat-desc">Pending appointments</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box shadow-lg p-4">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">{stats.confirmedAppointments}</div>
            <div className="stat-desc">Successful visits</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box shadow-lg p-4">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-secondary">${stats.totalSpent}</div>
            <div className="stat-desc">On confirmed appointments</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 rounded-box shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-bold">My Appointments</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="select select-bordered w-full sm:w-auto"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-sm">Service</th>
                        <th className="text-sm">Barber</th>
                        <th className="text-sm">Date</th>
                        <th className="text-sm">Status</th>
                        <th className="text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {appointments
                        .filter(appointment => filter === 'all' ? true : appointment.status === filter)
                        .map((appointment) => (
                          <tr key={appointment.id}>
                            <td>{getServiceName(appointment.serviceId)}</td>
                            <td>{getBarberName(appointment.barberId)}</td>
                            <td className="whitespace-normal">{formatDate(appointment.date)}</td>
                            <td>
                              <div className={`badge badge-sm sm:badge-md ${
                                appointment.status === 'pending' ? 'badge-warning' :
                                appointment.status === 'confirmed' ? 'badge-success' :
                                'badge-error'
                              }`}>
                                {appointment.status}
                              </div>
                            </td>
                            <td>
                              {appointment.status === 'pending' && (
                                <button
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className="btn btn-error btn-sm w-full sm:w-auto"
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

          {/* Profile Overview */}
          <div className="bg-base-200 rounded-box shadow-lg p-4 sm:p-6 h-fit">
            <h2 className="text-lg sm:text-xl font-bold mb-6">Profile Overview</h2>
            <div className="space-y-4">
              <div className="p-3 bg-base-100 rounded-lg">
                <div className="text-xs sm:text-sm text-base-content/60">Email</div>
                <div className="font-medium text-sm sm:text-base">{currentUser?.email}</div>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                <div className="text-xs sm:text-sm text-base-content/60">Favorite Barber</div>
                <div className="font-medium text-sm sm:text-base">{stats.favoriteBarber}</div>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                <div className="text-xs sm:text-sm text-base-content/60">Member Since</div>
                <div className="font-medium text-sm sm:text-base">
                  {currentUser?.metadata.creationTime
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                    : 'Unknown'}
                </div>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                <div className="text-xs sm:text-sm text-base-content/60">Last Sign In</div>
                <div className="font-medium text-sm sm:text-base">
                  {currentUser?.metadata.lastSignInTime
                    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                    : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 