import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { useBranches } from '../hooks/useBranches';
import ServicesMenu from '../components/servicesPage/ServicesMenu';
import BarbersMenu from '../components/barbers/BarbersMenu';
import ReviewsMenu from '../components/reviewsPage/ReviewsMenu';
import BranchCard from '../components/branchesPage/BranchCard';
import { componentStyles } from '../config/theme';
import { motion } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';
import { useAppointments } from '../hooks/useAppointments';
import { format } from 'date-fns';
import { 
  pageVariants, 
  sectionVariants, 
  listContainerVariants,
  slideUpVariants,
  fadeInVariants,
  transitions,
  withStagger
} from '../config/transitions';

interface Content {
  homePage: {
    title: string;
    subtitle: string;
    buttons: {
      bookNow: string;
      viewServices: string;
      viewAll: string;
    };
    sections: {
      barbers: { title: string };
      services: { title: string };
    };
    navigation: {
      login: string;
      dashboard: string;
      adminPanel: string;
      aboutUs: string;
    };
  };
}

type FirestoreDate = Date | Timestamp | { _seconds: number; _nanoseconds: number } | string;

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { isLoading: loadingBarbers } = useBarbers();
  const { isLoading: loadingServices } = useServices();
  const { branches, isLoading: loadingBranches } = useBranches();
  const { appointments, loading: loadingAppointments } = useAppointments();

  // Add debug logging
  useEffect(() => {
    console.log('Branches data:', branches);
    console.log('Loading branches:', loadingBranches);
  }, [branches, loadingBranches]);

  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/content.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load content');
        }
        return response.json();
      })
      .then(data => setContent(data))
      .catch(error => {
        console.error('Error loading content:', error);
        setError('Failed to load page content');
      });
  }, []);

  // Get the next appointment
  const nextAppointment = useMemo(() => {
    if (!currentUser || !appointments) return null;
    
    const now = Timestamp.fromDate(new Date());
    const userAppointments = appointments
      .filter(appointment => {
        // Ensure we're working with Firestore Timestamps
        let appointmentDate: Timestamp;
        const date = appointment.date as FirestoreDate;

        if (date instanceof Timestamp) {
          appointmentDate = date;
        } else if (date instanceof Date) {
          appointmentDate = Timestamp.fromDate(date);
        } else if (typeof date === 'string') {
          // Handle ISO date strings
          appointmentDate = Timestamp.fromDate(new Date(date));
        } else if (date && typeof date === 'object' && '_seconds' in date) {
          // Handle Firestore Timestamp-like objects
          appointmentDate = new Timestamp(date._seconds, date._nanoseconds);
        } else {
          console.error('Invalid date format:', date);
          return false;
        }

        return (
          appointment.userId === currentUser.uid &&
          appointment.status !== 'cancelled' &&
          appointmentDate.toMillis() > now.toMillis()
        );
      })
      .sort((a, b) => {
        let dateA: Timestamp, dateB: Timestamp;
        const aDate = a.date as FirestoreDate;
        const bDate = b.date as FirestoreDate;
        
        if (aDate instanceof Timestamp) {
          dateA = aDate;
        } else if (aDate instanceof Date) {
          dateA = Timestamp.fromDate(aDate);
        } else if (typeof aDate === 'string') {
          dateA = Timestamp.fromDate(new Date(aDate));
        } else if (aDate && typeof aDate === 'object' && '_seconds' in aDate) {
          dateA = new Timestamp(aDate._seconds, aDate._nanoseconds);
        } else {
          dateA = now; // Fallback
        }

        if (bDate instanceof Timestamp) {
          dateB = bDate;
        } else if (bDate instanceof Date) {
          dateB = Timestamp.fromDate(bDate);
        } else if (typeof bDate === 'string') {
          dateB = Timestamp.fromDate(new Date(bDate));
        } else if (bDate && typeof bDate === 'object' && '_seconds' in bDate) {
          dateB = new Timestamp(bDate._seconds, bDate._nanoseconds);
        } else {
          dateB = now; // Fallback
        }

        return dateA.toMillis() - dateB.toMillis();
      });

    return userAppointments[0] || null;
  }, [currentUser, appointments]);

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

  const getBranchName = (branchId: string) => {
    const branch = branches?.find(b => b.id === branchId);
    return branch ? branch.name : 'At The Galleria Hair Salon';
  };

  if (loadingBarbers || loadingServices || loadingBranches || loadingAppointments || !content) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        <div 
          className="loading loading-spinner loading-lg"
          style={{ color: theme.colors.accent.primary }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        <div 
          className="text-center p-8 rounded-lg"
          style={{ 
            backgroundColor: theme.colors.background.card,
            boxShadow: theme.shadows.lg
          }}
        >
          <div 
            className="text-xl mb-4"
            style={{ color: theme.colors.status.error }}
          >
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ backgroundColor: theme.colors.background.primary }}
    >      
      {/* Top Section */}
      <motion.section 
        className="relative px-6 py-8"
        variants={sectionVariants}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        style={{ 
          backgroundColor: theme.colors.background.secondary,
          boxShadow: theme.shadows.lg
        }}
      >
        <div className="container mx-auto">
          {/* Header Icons */}
          <motion.div 
            className="flex justify-end gap-4 mb-8"
            variants={slideUpVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <button
              className="p-3 rounded-full"
              style={{ backgroundColor: theme.colors.background.card }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button
              className="p-3 rounded-full"
              style={{ backgroundColor: theme.colors.background.card }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </motion.div>

          {/* User Profile */}
          <motion.div 
            className="flex items-start gap-6 mb-8"
            variants={slideUpVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div 
              className="w-16 h-16 rounded-2xl bg-center bg-cover"
              style={{ 
                backgroundImage: currentUser?.photoURL ? 
                  `url(${currentUser.photoURL})` : 
                  `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email})`,
                backgroundColor: theme.colors.background.card
              }}
            />
            <div>
              <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: theme.colors.text.primary }}
              >
                Hi, {currentUser?.displayName || 'Guest'}
              </h1>
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: theme.colors.text.secondary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span 
                    className="text-lg"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    6391 Elgin St. Celina, Delaware 10299
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
            >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">Sign In</span>
            </button>
              )}
          </div>
          </motion.div>

          {/* Appointment Card */}
          {currentUser && nextAppointment && (
            <motion.div 
              className="mb-4"
              variants={slideUpVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h2 
                className="text-2xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
                Next Appointment
          </h2>
              <div 
                className="p-4 rounded-2xl"
                style={{ backgroundColor: theme.colors.accent.primary }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">
                      {getBranchName(nextAppointment.branchId)}
                    </h3>
                    <p className="text-white text-opacity-80">
                      {formatDateTime(nextAppointment.date)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
            </div>
      </motion.section>

      <motion.main 
        className="container mx-auto px-4 py-12 space-y-16"
        variants={fadeInVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {/* Featured Barbers */}
        <motion.section
          variants={sectionVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 
              className="text-3xl font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              Featured Barbers
            </h2>
          </div>
          <motion.div 
            className="overflow-x-auto hide-scrollbar"
            variants={withStagger(listContainerVariants, transitions.staggerChildren)}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <BarbersMenu />
          </motion.div>
        </motion.section>

        {/* Featured Services */}
        <motion.section
          variants={sectionVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 
              className="text-3xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            Our Services
          </h2>
          </div>
          <motion.div 
            className="overflow-x-auto hide-scrollbar"
            variants={withStagger(listContainerVariants, transitions.staggerChildren)}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <ServicesMenu />
          </motion.div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section
          variants={sectionVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 
              className="text-3xl font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              Customer Reviews
            </h2>
          </div>
          <motion.div 
            className="overflow-x-auto hide-scrollbar"
            variants={withStagger(listContainerVariants, transitions.staggerChildren)}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <ReviewsMenu />
          </motion.div>
        </motion.section>

        {/* Branches Section */}
        <motion.section
          variants={sectionVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 
              className="text-3xl font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              Our Locations
            </h2>
            <button
              onClick={() => navigate('/branches')}
              className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
            >
              View All Locations
            </button>
          </div>
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar">
              <motion.div 
                className="flex gap-6 pb-4" 
                style={{ scrollBehavior: 'smooth' }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {branches?.slice(0, 8).map((branch, index) => (
                  <motion.div 
                    key={branch.id}
                    className="flex-none w-[400px]"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <BranchCard
                      branch={branch}
                      showActions={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Navigation Buttons */}
        <motion.section 
          variants={slideUpVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {!currentUser ? (
            <button
              onClick={() => navigate('/login')}
              className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
            >
              {content.homePage.navigation.login}
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
              >
                {content.homePage.navigation.dashboard}
              </button>
              {currentUser.email === 'admin@admin.admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
                >
                  {content.homePage.navigation.adminPanel}
                </button>
              )}
            </>
          )}
          <button
            onClick={() => navigate('/about')}
            className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
          >
            {content.homePage.navigation.aboutUs}
          </button>
        </motion.section>
      </motion.main>

      {/* Add this CSS to hide scrollbar */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </motion.div>
  );
} 