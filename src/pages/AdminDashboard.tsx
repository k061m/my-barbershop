import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { appointmentService } from '../services/appointment.service';
import { barberService } from '../services/barber.service';
import { serviceService } from '../services/service.service';
import { galleryService } from '../services/gallery.service';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { appointments, loading } = useAppointments();
  const { barbers } = useBarbers();
  const { services } = useServices();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [initializingGallery, setInitializingGallery] = useState(false);
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Appointments Filter */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Appointments</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setIsAddingBarber(true)}
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Add New Barber
            </button>
            <button
              onClick={() => setIsAddingService(true)}
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Add New Service
            </button>
            <button
              onClick={handleInitializeGallery}
              disabled={initializingGallery}
              className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
            >
              {initializingGallery ? 'Initializing Gallery...' : 'Initialize Gallery'}
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Barber</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{appointment.userId}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{getServiceName(appointment.serviceId)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{getBarberName(appointment.barberId)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(appointment.date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {appointment.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
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

        {/* Barbers Grid */}
        <div>
          <h2 className="text-xl font-bold mb-3">Manage Barbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbers.map((barber) => (
              <div key={barber.id} className="bg-white rounded-lg shadow p-4">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-bold">{barber.name}</h3>
                <p className="text-gray-600">{barber.speciality}</p>
                <p className="text-sm text-gray-500 mt-2">{barber.bio}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-primary">⭐ {barber.rating}</span>
                  <button
                    onClick={() => handleDeleteBarber(barber.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className="text-xl font-bold mb-3">Manage Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow p-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-bold">{service.name}</h3>
                <p className="text-gray-600">{service.duration}</p>
                <p className="text-primary font-bold mt-1">${service.price}</p>
                <p className="text-sm text-gray-500 mt-2">{service.description}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Barber Modal */}
        {isAddingBarber && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add New Barber</h2>
              <form onSubmit={handleAddBarber} className="space-y-4">
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
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingBarber(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    Add Barber
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Service Modal */}
        {isAddingService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add New Service</h2>
              <form onSubmit={handleAddService} className="space-y-4">
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
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingService(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 