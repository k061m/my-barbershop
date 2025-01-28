import { useState, useEffect } from 'react';
import { dbService, Appointment, Barber, Service } from '../../services/database.service';
import { Timestamp } from 'firebase/firestore';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, barbersData, servicesData] = await Promise.all([
        dbService.getAppointments(),
        dbService.getBarbers(),
        dbService.getServices()
      ]);
      setAppointments(appointmentsData);
      setBarbers(barbersData);
      setServices(servicesData);
    } catch (err) {
      setError('Failed to load appointments data');
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

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      setLoading(true);
      await dbService.updateAppointment(appointmentId, { status: newStatus });
      await loadData();
    } catch (err) {
      setError('Failed to update appointment status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Appointments</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Client</th>
              <th>Barber</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{formatDate(appointment.date)}</td>
                <td>{appointment.userId}</td>
                <td>{getBarberName(appointment.barberId)}</td>
                <td>{getServiceName(appointment.serviceId)}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-sm m-1">
                      Update Status
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button 
                          onClick={() => appointment.id && handleStatusChange(appointment.id, 'confirmed')}
                          disabled={appointment.status === 'confirmed'}
                        >
                          Confirm
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => appointment.id && handleStatusChange(appointment.id, 'completed')}
                          disabled={appointment.status === 'completed'}
                        >
                          Complete
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => appointment.id && handleStatusChange(appointment.id, 'cancelled')}
                          disabled={appointment.status === 'cancelled'}
                        >
                          Cancel
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-8 text-neutral">
          No appointments found
        </div>
      )}
    </div>
  );
} 