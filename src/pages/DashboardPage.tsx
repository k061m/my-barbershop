import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { useBarbers } from '../hooks/useBarbers';
import { appointmentService } from '../services/appointment.service';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { FaStar, FaChevronLeft, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

type FirestoreDate = Date | Timestamp | { _seconds: number; _nanoseconds: number } | string;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { appointments: allAppointments, loading } = useAppointments();
  const { barbers } = useBarbers();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Filter appointments for current user
  const appointments = allAppointments.filter(appointment => appointment.userId === currentUser?.uid);
  
  const getBarberName = (barberId: string) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber ? `${barber.firstName} ${barber.lastName}` : 'Unknown Barber';
  };

  const formatDateTime = (date: FirestoreDate) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), "MMMM d, yyyy 'at' h:mm a");
    } else if (date instanceof Date) {
      return format(date, "MMMM d, yyyy 'at' h:mm a");
    } else if (typeof date === 'string') {
      return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
    } else if (date && typeof date === 'object' && '_seconds' in date) {
      const timestamp = new Timestamp(date._seconds, date._nanoseconds);
      return format(timestamp.toDate(), "MMMM d, yyyy 'at' h:mm a");
    }
    return 'Invalid date';
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.updateAppointment(appointmentId, { status: 'cancelled' });
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  // Filter appointments
  const upcomingAppointments = appointments?.filter(appointment => {
    let appointmentDate: Timestamp;
    const date = appointment.date as FirestoreDate;

    if (date instanceof Timestamp) {
      appointmentDate = date;
    } else if (date instanceof Date) {
      appointmentDate = Timestamp.fromDate(date);
    } else if (date && typeof date === 'object' && '_seconds' in date) {
      // Handle Firestore Timestamp-like objects
      appointmentDate = new Timestamp(date._seconds, date._nanoseconds);
    } else if (typeof date === 'string') {
      // Handle ISO date strings
      appointmentDate = Timestamp.fromDate(new Date(date));
    } else {
      console.error('Invalid date format:', date);
      return false;
    }

    const now = Timestamp.fromDate(new Date());
    // Only show upcoming appointments that are not cancelled
    return appointmentDate.toMillis() > now.toMillis() && appointment.status !== 'cancelled';
  }) || [];

  const pastAppointments = appointments?.filter(appointment => {
    let appointmentDate: Timestamp;
    const date = appointment.date as FirestoreDate;

    if (date instanceof Timestamp) {
      appointmentDate = date;
    } else if (date instanceof Date) {
      appointmentDate = Timestamp.fromDate(date);
    } else if (date && typeof date === 'object' && '_seconds' in date) {
      // Handle Firestore Timestamp-like objects
      appointmentDate = new Timestamp(date._seconds, date._nanoseconds);
    } else if (typeof date === 'string') {
      // Handle ISO date strings
      appointmentDate = Timestamp.fromDate(new Date(date));
    } else {
      console.error('Invalid date format:', date);
      return false;
    }

    const now = Timestamp.fromDate(new Date());
    // Show appointments that are either in the past OR cancelled
    return appointmentDate.toMillis() <= now.toMillis() || appointment.status === 'cancelled';
  }) || [];

  // Sort appointments by date
  upcomingAppointments?.sort((a, b) => {
    let dateA: Timestamp, dateB: Timestamp;
    const aDate = a.date as FirestoreDate;
    const bDate = b.date as FirestoreDate;
    
    if (aDate instanceof Timestamp) {
      dateA = aDate;
    } else if (aDate instanceof Date) {
      dateA = Timestamp.fromDate(aDate);
    } else if (aDate && typeof aDate === 'object' && '_seconds' in aDate) {
      dateA = new Timestamp(aDate._seconds, aDate._nanoseconds);
    } else if (typeof aDate === 'string') {
      dateA = Timestamp.fromDate(new Date(aDate));
    } else {
      dateA = Timestamp.fromDate(new Date()); // Fallback
    }

    if (bDate instanceof Timestamp) {
      dateB = bDate;
    } else if (bDate instanceof Date) {
      dateB = Timestamp.fromDate(bDate);
    } else if (bDate && typeof bDate === 'object' && '_seconds' in bDate) {
      dateB = new Timestamp(bDate._seconds, bDate._nanoseconds);
    } else if (typeof bDate === 'string') {
      dateB = Timestamp.fromDate(new Date(bDate));
    } else {
      dateB = Timestamp.fromDate(new Date()); // Fallback
    }

    return dateA.toMillis() - dateB.toMillis();
  });

  pastAppointments?.sort((a, b) => {
    let dateA: Timestamp, dateB: Timestamp;
    const aDate = a.date as FirestoreDate;
    const bDate = b.date as FirestoreDate;
    
    if (aDate instanceof Timestamp) {
      dateA = aDate;
    } else if (aDate instanceof Date) {
      dateA = Timestamp.fromDate(aDate);
    } else if (aDate && typeof aDate === 'object' && '_seconds' in aDate) {
      dateA = new Timestamp(aDate._seconds, aDate._nanoseconds);
    } else if (typeof aDate === 'string') {
      dateA = Timestamp.fromDate(new Date(aDate));
    } else {
      dateA = Timestamp.fromDate(new Date()); // Fallback
    }

    if (bDate instanceof Timestamp) {
      dateB = bDate;
    } else if (bDate instanceof Date) {
      dateB = Timestamp.fromDate(bDate);
    } else if (bDate && typeof bDate === 'object' && '_seconds' in bDate) {
      dateB = new Timestamp(bDate._seconds, bDate._nanoseconds);
    } else if (typeof bDate === 'string') {
      dateB = Timestamp.fromDate(new Date(bDate));
    } else {
      dateB = Timestamp.fromDate(new Date()); // Fallback
    }

    return dateB.toMillis() - dateA.toMillis(); // Reverse order for past appointments
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background.primary }}>
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:opacity-80"
          style={{ color: theme.colors.text.primary }}
        >
          <FaChevronLeft />
        </button>
        <h1 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
          My Profile
        </h1>
      </div>

      {/* User Profile Section */}
      <motion.div 
        className="px-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div 
          className="p-6 rounded-2xl"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <div className="flex items-start gap-6">
            {/* User Avatar */}
            <div 
              className="w-24 h-24 rounded-2xl bg-center bg-cover"
              style={{ 
                backgroundImage: currentUser?.photoURL ? 
                  `url(${currentUser.photoURL})` : 
                  `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email})`,
                backgroundColor: theme.colors.background.hover
              }}
            />
            
            {/* User Info */}
            <div className="flex-1">
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: theme.colors.text.primary }}
              >
                {currentUser?.displayName || 'User'}
              </h2>
              
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaEnvelope style={{ color: theme.colors.text.secondary }} />
                  <span style={{ color: theme.colors.text.secondary }}>
                    {currentUser?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone style={{ color: theme.colors.text.secondary }} />
                  <span style={{ color: theme.colors.text.secondary }}>
                    {currentUser?.phoneNumber || 'No phone number added'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt style={{ color: theme.colors.text.secondary }} />
                  <span style={{ color: theme.colors.text.secondary }}>
                    6391 Elgin St. Celina, Delaware 10299
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="px-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: theme.colors.background.card }}
          >
            <div 
              className="text-3xl font-bold mb-1"
              style={{ color: theme.colors.accent.primary }}
            >
              {appointments.length}
            </div>
            <div style={{ color: theme.colors.text.secondary }}>
              Total Bookings
            </div>
          </div>
          <div 
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: theme.colors.background.card }}
          >
            <div 
              className="text-3xl font-bold mb-1"
              style={{ color: theme.colors.accent.primary }}
            >
              {upcomingAppointments.length}
            </div>
            <div style={{ color: theme.colors.text.secondary }}>
              Upcoming
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appointments Section */}
      <div className="px-4">
        <h2 
          className="text-xl font-bold mb-4"
          style={{ color: theme.colors.text.primary }}
        >
          My Appointments
        </h2>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'upcoming' ? 'font-semibold' : ''
            }`}
            style={{ 
              backgroundColor: activeTab === 'upcoming' ? theme.colors.background.card : 'transparent',
              color: theme.colors.text.primary
            }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-4 rounded-lg transition-colors ${
              activeTab === 'past' ? 'font-semibold' : ''
            }`}
            style={{ 
              backgroundColor: activeTab === 'past' ? theme.colors.background.card : 'transparent',
              color: theme.colors.text.primary
            }}
          >
            Past
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map(appointment => (
            <div 
              key={appointment.id}
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.colors.background.card }}
            >
              <div className="mb-2">
                <div className="text-sm opacity-60" style={{ color: theme.colors.text.primary }}>
                  Order ID: {appointment.id}
                </div>
                <div className="text-sm opacity-60" style={{ color: theme.colors.text.primary }}>
                  Order Date: {formatDateTime(appointment.date)}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={barbers.find(b => b.id === appointment.barberId)?.image || '/default-avatar.png'}
                  alt={getBarberName(appointment.barberId)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium" style={{ color: theme.colors.text.primary }}>
                    {getBarberName(appointment.barberId)}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm" style={{ color: theme.colors.text.secondary }}>4.8</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {appointment.status === 'pending' && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="flex-1 py-2 px-4 rounded-lg border transition-colors hover:opacity-80"
                    style={{ 
                      borderColor: theme.colors.text.secondary,
                      color: theme.colors.text.primary
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => navigate(`/booking/${appointment.id}`)}
                  className="flex-1 py-2 px-4 rounded-lg transition-colors hover:opacity-80"
                  style={{ 
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.primary
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 