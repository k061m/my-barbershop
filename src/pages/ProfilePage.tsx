import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService, Appointment, Barber, Service } from '../services/database.service';
import { Timestamp } from 'firebase/firestore';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      if (!currentUser) return null;

      const [appointmentsData, barbersData, servicesData] = await Promise.all([
        dbService.getAppointments(currentUser.uid),
        dbService.getBarbers(),
        dbService.getServices()
      ]);
      
      // Sort appointments by date
      const sortedAppointments = appointmentsData.sort((a, b) => 
        b.date.toMillis() - a.date.toMillis()
      );
      
      setAppointments(sortedAppointments);
      setBarbers(barbersData);
      setServices(servicesData);
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? barber.name : 'Unknown Barber';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      case 'completed':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      setLoading(true);
      await dbService.updateAppointment(appointmentId, { status: 'cancelled' });
      await loadData();
    } catch (err) {
      setError('Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Section */}
        <div className="md:w-1/3">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Profile</h2>
              <div className="avatar placeholder my-4">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                  <span className="text-3xl">
                    {currentUser?.email?.[0].toUpperCase() || '?'}
                  </span>
                </div>
              </div>
              <p className="text-lg">{currentUser?.email}</p>
              <div className="mt-4">
                <button className="btn btn-primary w-full">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="card-title">{getServiceName(appointment.serviceId)}</h3>
                      <p className="text-sm">with {getBarberName(appointment.barberId)}</p>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm">
                      <span className="font-semibold">Date & Time:</span>{' '}
                      {formatDate(appointment.date)}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Notes:</span>{' '}
                        {appointment.notes}
                      </p>
                    )}
                  </div>

                  {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                    <div className="card-actions justify-end mt-4">
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => appointment.id && handleCancelAppointment(appointment.id)}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="text-center py-8 text-neutral">
                No appointments found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 