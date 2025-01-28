import { useState, useEffect } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { barberService } from '../services/barber.service';
import { serviceService } from '../services/service.service';
import { galleryService } from '../services/gallery.service';

export default function AdminDashboard() {
  const { appointments, loading } = useAppointments();
  const { barbers } = useBarbers();
  const { services } = useServices();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [initializingGallery, setInitializingGallery] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('week');
  const [newBarber, setNewBarber] = useState({
    name: '',
    speciality: '',
    bio: '',
    image: '',
    rating: 5.0,
    experience: 0
  });
  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: 0,
    description: '',
    image: ''
  });

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
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await barberService.addNewBarber(newBarber);
      setIsAddingBarber(false);
      setNewBarber({
        name: '',
        speciality: '',
        bio: '',
        image: '',
        rating: 5.0,
        experience: 0
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding barber:', error);
      alert('Failed to add barber. Please try again.');
    }
  };

  const handleDeleteBarber = async (barberId: string | undefined) => {
    if (!barberId) return;
    if (window.confirm('Are you sure you want to delete this barber?')) {
      try {
        await barberService.deleteBarber(barberId);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting barber:', error);
        alert('Failed to delete barber. Please try again.');
      }
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await serviceService.addService(newService);
      setIsAddingService(false);
      setNewService({
        name: '',
        duration: '',
        price: 0,
        description: '',
        image: ''
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId: string | undefined) => {
    if (!serviceId) return;
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.deleteService(serviceId);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service. Please try again.');
      }
    }
  };

  const handleInitializeGallery = async () => {
    if (window.confirm('Are you sure you want to initialize the gallery? This will only add images if the gallery is empty.')) {
      setInitializingGallery(true);
      try {
        await galleryService.initializeGallery();
        alert('Gallery initialized successfully!');
      } catch (error) {
        console.error('Error initializing gallery:', error);
        alert('Failed to initialize gallery. Check console for details.');
      } finally {
        setInitializingGallery(false);
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    filter === 'all' ? true : appointment.status === filter
  );

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
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddingBarber(true)}
              className="btn btn-primary"
            >
              Add Barber
            </button>
            <button
              onClick={() => setIsAddingService(true)}
              className="btn btn-primary"
            >
              Add Service
            </button>
            <button
              onClick={handleInitializeGallery}
              disabled={initializingGallery}
              className="btn btn-secondary"
            >
              {initializingGallery ? 'Initializing...' : 'Init Gallery'}
            </button>
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
            <div className="space-y-4">
              {barbers.map((barber) => (
                <div key={barber.id} className="flex items-center gap-4 p-3 bg-base-100 rounded-lg">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{barber.name}</h3>
                    <p className="text-sm text-base-content/60">{barber.speciality}</p>
                  </div>
                  <div className="text-warning">⭐ {barber.rating}</div>
                  <button
                    onClick={() => handleDeleteBarber(barber.id)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    Delete
                  </button>
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
                    alt={service.name}
                    className="rounded-xl h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{service.name}</h3>
                  <p className="text-base-content/60">{service.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-primary font-bold">${service.price}</span>
                    <span className="text-base-content/60">{service.duration} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Barber Modal */}
        {isAddingBarber && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Add New Barber</h3>
              <form onSubmit={handleAddBarber} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newBarber.name}
                    onChange={(e) => setNewBarber({...newBarber, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Speciality</label>
                  <input
                    type="text"
                    value={newBarber.speciality}
                    onChange={(e) => setNewBarber({...newBarber, speciality: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={newBarber.bio}
                    onChange={(e) => setNewBarber({...newBarber, bio: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={newBarber.image}
                    onChange={(e) => setNewBarber({...newBarber, image: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newBarber.rating}
                    onChange={(e) => setNewBarber({...newBarber, rating: parseFloat(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    value={newBarber.experience}
                    onChange={(e) => setNewBarber({...newBarber, experience: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </form>
              <div className="modal-action">
                <button onClick={() => setIsAddingBarber(false)} className="btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Service Modal */}
        {isAddingService && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Add New Service</h3>
              <form onSubmit={handleAddService} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <input
                    type="text"
                    value={newService.duration}
                    onChange={(e) => setNewService({...newService, duration: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                    placeholder="e.g., 30 min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={newService.image}
                    onChange={(e) => setNewService({...newService, image: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </form>
              <div className="modal-action">
                <button onClick={() => setIsAddingService(false)} className="btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 