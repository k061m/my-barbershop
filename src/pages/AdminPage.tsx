import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ManageBarbers from '../components/admin/ManageBarbers';
import ManageServices from '../components/admin/ManageServices';
import ManageAppointments from '../components/admin/ManageAppointments';

export default function AdminPage() {
  const location = useLocation();
  const { currentUser } = useAuth();

  // TODO: Add proper admin role check
  if (!currentUser) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === `/admin${path}` ? 'tab-active' : '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed mb-6">
        <Link to="/admin/barbers" className={`tab ${isActive('/barbers')}`}>
          Manage Barbers
        </Link>
        <Link to="/admin/services" className={`tab ${isActive('/services')}`}>
          Manage Services
        </Link>
        <Link to="/admin/appointments" className={`tab ${isActive('/appointments')}`}>
          Manage Appointments
        </Link>
      </div>

      {/* Tab Content */}
      <div className="bg-base-200 rounded-box p-6">
        <Routes>
          <Route path="/" element={<ManageBarbers />} />
          <Route path="/barbers" element={<ManageBarbers />} />
          <Route path="/services" element={<ManageServices />} />
          <Route path="/appointments" element={<ManageAppointments />} />
        </Routes>
      </div>
    </div>
  );
} 