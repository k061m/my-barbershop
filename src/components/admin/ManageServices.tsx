import { useState, useEffect, FormEvent } from 'react';
import { dbService, Service } from '../../services/database.service';

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: 0,
    image: '',
    description: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await dbService.getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingService?.id) {
        await dbService.updateService(editingService.id, formData);
      } else {
        await dbService.addService(formData);
      }
      await loadServices();
      resetForm();
    } catch (err) {
      setError('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      image: service.image || '',
      description: service.description || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      setLoading(true);
      await dbService.deleteService(id);
      await loadServices();
    } catch (err) {
      setError('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      duration: '',
      price: 0,
      image: '',
      description: ''
    });
  };

  if (loading && services.length === 0) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingService ? 'Edit Service' : 'Add New Service'}
      </h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Duration (e.g., "30 min")</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Price ($)</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Image URL</span>
            </label>
            <input
              type="url"
              className="input input-bordered"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {editingService ? 'Update Service' : 'Add Service'}
          </button>
          {editingService && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="divider"></div>

      <h2 className="text-2xl font-bold mb-4">Services List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="card bg-base-100 shadow-xl">
            {service.image && (
              <figure>
                <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
              </figure>
            )}
            <div className="card-body">
              <h3 className="card-title">{service.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm">{service.duration}</span>
                <span className="text-sm font-semibold">${service.price}</span>
              </div>
              {service.description && (
                <p className="text-sm mt-2">{service.description}</p>
              )}
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEdit(service)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => service.id && handleDelete(service.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 