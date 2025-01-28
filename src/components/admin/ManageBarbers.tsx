import { useState, useEffect, FormEvent } from 'react';
import { dbService, Barber } from '../../services/database.service';

export default function ManageBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    image: '',
    bio: ''
  });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await dbService.getBarbers();
      setBarbers(data);
    } catch (err) {
      setError('Failed to load barbers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingBarber?.id) {
        await dbService.updateBarber(editingBarber.id, formData);
      } else {
        await dbService.addBarber(formData);
      }
      await loadBarbers();
      resetForm();
    } catch (err) {
      setError('Failed to save barber');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (barber: Barber) => {
    setEditingBarber(barber);
    setFormData({
      name: barber.name,
      speciality: barber.speciality,
      image: barber.image || '',
      bio: barber.bio || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this barber?')) return;
    try {
      setLoading(true);
      await dbService.deleteBarber(id);
      await loadBarbers();
    } catch (err) {
      setError('Failed to delete barber');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingBarber(null);
    setFormData({
      name: '',
      speciality: '',
      image: '',
      bio: ''
    });
  };

  if (loading && barbers.length === 0) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {editingBarber ? 'Edit Barber' : 'Add New Barber'}
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
              <span className="label-text">Speciality</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.speciality}
              onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
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

          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {editingBarber ? 'Update Barber' : 'Add Barber'}
          </button>
          {editingBarber && (
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

      <h2 className="text-2xl font-bold mb-4">Barbers List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbers.map((barber) => (
          <div key={barber.id} className="card bg-base-100 shadow-xl">
            {barber.image && (
              <figure>
                <img src={barber.image} alt={barber.name} className="w-full h-48 object-cover" />
              </figure>
            )}
            <div className="card-body">
              <h3 className="card-title">{barber.name}</h3>
              <p className="text-sm">{barber.speciality}</p>
              {barber.bio && <p className="text-sm mt-2">{barber.bio}</p>}
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEdit(barber)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => barber.id && handleDelete(barber.id)}
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