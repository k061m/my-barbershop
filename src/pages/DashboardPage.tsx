import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">My Appointments</h2>
              <p>View and manage your upcoming appointments</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Appointments</button>
              </div>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Book New Appointment</h2>
              <p>Schedule a new appointment with your favorite barber</p>
              <div className="card-actions justify-end">
                <button onClick={() => navigate('/booking')} className="btn btn-primary">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 