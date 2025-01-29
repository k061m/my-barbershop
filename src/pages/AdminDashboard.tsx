import { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';

export default function AdminDashboard() {
  const { appointments, loading } = useAppointments();
  const { barbers } = useBarbers();
  const { services } = useServices();
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
        return total + (service?.price || 0);
      }, 0)
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

  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: newStatus });
      window.location.reload();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-base-content/60">Manage your barbershop operations</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat bg-base-200 rounded-box shadow-lg">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div className="stat-title">Total Appointments</div>
            <div className="stat-value text-primary">{stats.totalAppointments}</div>
            <div className="stat-desc">All time</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box shadow-lg">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{stats.pendingAppointments}</div>
            <div className="stat-desc">Require attention</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box shadow-lg">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div className="stat-title">Confirmed</div>
            <div className="stat-value text-success">{stats.confirmedAppointments}</div>
            <div className="stat-desc">Ready to serve</div>
          </div>
          
          <div className="stat bg-base-200 rounded-box shadow-lg">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <div className="stat-title">Revenue</div>
            <div className="stat-value text-secondary">${stats.revenue}</div>
            <div className="stat-desc">From confirmed appointments</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 rounded-box shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Appointments</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="select select-bordered select-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Barber</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter(appointment => filter === 'all' ? true : appointment.status === filter)
                      .slice(0, 5)
                      .map((appointment) => (
                        <tr key={appointment.id}>
                          <td>{getServiceName(appointment.serviceId)}</td>
                          <td>{getBarberName(appointment.barberId)}</td>
                          <td>{formatDate(appointment.date)}</td>
                          <td>
                            <div className={`badge ${
                              appointment.status === 'pending' ? 'badge-warning' :
                              appointment.status === 'confirmed' ? 'badge-success' :
                              'badge-error'
                            }`}>
                              {appointment.status}
                            </div>
                          </td>
                          <td>
                            {appointment.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                  className="btn btn-xs btn-success"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                  className="btn btn-xs btn-error"
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
          <div className="bg-base-200 rounded-box shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Team Overview</h2>
            <div className="space-y-6">
              {barbers.map((barber) => (
                <div key={barber.id} className="bg-base-100 rounded-lg p-4 shadow">
                  <div className="flex items-start gap-4">
                    <img
                      src={barber.image}
                      alt={barber.translations.en.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{barber.translations.en.name}</h3>
                          <p className="text-sm text-base-content/60">{barber.translations.en.description}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-warning text-lg">⭐ {(barber.rating || 0).toFixed(1)}</div>
                          <div className="badge badge-success">{barber.available ? 'Available' : 'Unavailable'}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm"><strong>Bio:</strong> {barber.translations.en.bio}</p>
                        <p className="text-sm mt-1"><strong>Specialties:</strong> {barber.translations.en.specialties}</p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="text-sm">
                          <strong>Working Days:</strong>{' '}
                          {barber.workingDays.map(day => 
                            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1]
                          ).join(', ')}
                        </div>
                        <div className="text-sm">
                          <strong>Hours:</strong> {barber.workingHours.start} - {barber.workingHours.end}
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
        <div className="bg-base-200 rounded-box shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="card bg-base-100 shadow-lg">
                <figure className="px-4 pt-4">
                  <img
                    src={service.image}
                    alt={service.translations.en.name}
                    className="rounded-xl h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{service.translations.en.name}</h3>
                  <p className="text-base-content/60">{service.translations.en.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-primary font-bold">${service.price}</span>
                    <span className="text-base-content/60">{service.translations.en.duration}</span>
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