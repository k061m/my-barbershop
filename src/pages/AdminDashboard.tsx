import { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminDashboard() {
  const { appointments } = useAppointments();
  const { barbers } = useBarbers();
  const { services } = useServices();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Calculate statistics
  const stats = {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
    cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
    totalBarbers: barbers.length,
    totalServices: services.length,
    revenue: appointments
      .filter(a => a.status === 'confirmed')
      .reduce((total, appointment) => {
        const service = services.find(s => s.id === appointment.serviceId);
        return total + (service?.basePrice || 0);
      }, 0)
  };

  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber?.firstName && barber?.lastName ? `${barber?.firstName} ${barber?.lastName}` : 'Unknown Barber';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name.en || 'Unknown Service';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No date set';
    
    // Handle Firestore Timestamp
    if (timestamp.toDate) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(timestamp.toDate());
    }
    
    // Handle regular Date object or string
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: newStatus });
      window.location.reload();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
              Admin Dashboard
            </h1>
            <p style={{ color: theme.colors.text.secondary }}>
              Manage your barbershop operations
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.accent.primary }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div style={{ color: theme.colors.text.secondary }}>Total Appointments</div>
            <div className="text-2xl font-bold" style={{ color: theme.colors.accent.primary }}>{stats.totalAppointments}</div>
            <div style={{ color: theme.colors.text.secondary }}>All time</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.status.warning }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div style={{ color: theme.colors.text.secondary }}>Pending</div>
            <div className="text-2xl font-bold" style={{ color: theme.colors.status.warning }}>{stats.pendingAppointments}</div>
            <div style={{ color: theme.colors.text.secondary }}>Require attention</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.status.success }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div style={{ color: theme.colors.text.secondary }}>Confirmed</div>
            <div className="text-2xl font-bold" style={{ color: theme.colors.status.success }}>{stats.confirmedAppointments}</div>
            <div style={{ color: theme.colors.text.secondary }}>Ready to serve</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors.background.card }}>
            <div style={{ color: theme.colors.accent.secondary }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div style={{ color: theme.colors.text.secondary }}>Revenue</div>
            <div className="text-2xl font-bold" style={{ color: theme.colors.accent.secondary }}>${stats.revenue}</div>
            <div style={{ color: theme.colors.text.secondary }}>From confirmed appointments</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: theme.colors.background.card }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>Recent Appointments</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="select transition-colors"
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
              
              <div className="overflow-x-auto">
                <table className="w-full" style={{ color: theme.colors.text.primary }}>
                  <thead>
                    <tr style={{ backgroundColor: theme.colors.background.hover }}>
                      <th className="text-sm p-3 text-left">Service</th>
                      <th className="text-sm p-3 text-left">Barber</th>
                      <th className="text-sm p-3 text-left">Date</th>
                      <th className="text-sm p-3 text-left">Status</th>
                      <th className="text-sm p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {appointments
                      .filter(appointment => filter === 'all' ? true : appointment.status === filter)
                      .slice(0, 5)
                      .map((appointment) => (
                        <tr key={appointment.id} className="border-t border-opacity-10" style={{ borderColor: theme.colors.text.secondary }}>
                          <td className="p-3">{getServiceName(appointment.serviceId)}</td>
                          <td className="p-3">{getBarberName(appointment.barberId)}</td>
                          <td className="p-3">{formatDate(appointment.date)}</td>
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
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                  className="btn btn-xs transition-colors hover:opacity-90"
                                  style={{ 
                                    backgroundColor: theme.colors.status.success,
                                    color: theme.colors.text.primary
                                  }}
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                  className="btn btn-xs transition-colors hover:opacity-90"
                                  style={{ 
                                    backgroundColor: theme.colors.status.error,
                                    color: theme.colors.text.primary
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Team Overview */}
          <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: theme.colors.background.card }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>Team Overview</h2>
            <div className="space-y-6">
              {barbers.map((barber) => (
                <div key={barber.id} className="rounded-lg p-4 shadow" style={{ backgroundColor: theme.colors.background.primary }}>
                  <div className="flex items-start gap-4">
                    <img
                      src={barber.image}
                      alt={barber.firstName && barber.lastName ? `${barber.firstName} ${barber.lastName}` : 'Unknown Barber'}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                            {barber.firstName && barber.lastName ? `${barber.firstName} ${barber.lastName}` : 'Unknown Barber'}
                          </h3>
                          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                            {barber.bio.en}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div style={{ color: theme.colors.status.warning }} className="text-lg">
                            ⭐ {(barber.rating || 0).toFixed(1)}
                          </div>
                          <span className="px-2 py-1 rounded text-xs font-semibold" style={{ 
                            backgroundColor: barber.isActive ? theme.colors.status.success : theme.colors.status.error,
                            color: theme.colors.text.primary
                          }}>
                            {barber.isActive ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3" style={{ color: theme.colors.text.primary }}>
                        <p className="text-sm"><strong>Bio:</strong> {barber.bio.en}</p>
                        <p className="text-sm mt-1"><strong>Specialties:</strong> {barber.specialties.join(', ')}</p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2" style={{ color: theme.colors.text.primary }}>
                        <div className="text-sm">
                          <strong>Working Days:</strong>{' '}
                          {barber.workingDays.map(day => 
                            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1]
                          ).join(', ')}
                        </div>
                        <div className="text-sm">
                          <strong>Hours:</strong> {barber.workingHours.map(hour => `${hour.start} - ${hour.end}`).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: theme.colors.background.card }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="rounded-lg shadow-lg transition-transform hover:scale-105" 
                style={{ backgroundColor: theme.colors.background.primary }}>
                <div className="px-4 pt-4">
                  <img
                    src={service.image}
                    alt={service.name.en}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                    {service.name.en}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: theme.colors.text.secondary }}>
                    {service.description.en}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold" style={{ color: theme.colors.accent.primary }}>
                      ${service.basePrice}
                    </span>
                    <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                      {service.baseDuration} {service.durationUnit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 