import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { useBranches } from '../hooks/useBranches';
import ServiceCard from '../components/servicesPage/ServiceCard';
import BarberCard from '../components/barbers/BarberCard';
import BranchCard from '../components/branchesPage/BranchCard';
import { componentStyles } from '../config/theme';

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

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { barbers, isLoading: loadingBarbers } = useBarbers();
  const { services, isLoading: loadingServices } = useServices();
  const { branches, isLoading: loadingBranches } = useBranches();

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

  if (loadingBarbers || loadingServices || loadingBranches || !content) {
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
    <div 
      className="min-h-screen"
      style={{ backgroundColor: theme.colors.background.primary }}
    >      
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center justify-center text-center px-4"
        style={{ 
          backgroundColor: theme.colors.background.secondary,
          boxShadow: theme.shadows.lg
        }}
      >
        <div className="relative space-y-8 max-w-4xl w-full py-16">
          <img 
            src="/images/stock/logo.png" 
            alt="Professional Barber Services Logo" 
            className="h-40 md:h-64 lg:h-80 mx-auto object-contain" 
          />
          <h1 
            className="text-4xl md:text-6xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            {content.homePage.title}
          </h1>
          <p 
            className="text-xl md:text-2xl"
            style={{ color: theme.colors.text.secondary }}
          >
            {content.homePage.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/booking')}
              className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
            >
              Book Now
            </button>
            <button
              onClick={() => navigate('/services')}
              className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Barbers */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 
              className="text-3xl font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              Our Barbers
            </h2>
            <button
              onClick={() => navigate('/barbers')}
              className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
            >
              View All Barbers
            </button>
          </div>
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {barbers?.slice(0, 8).map(barber => (
                  <div 
                    key={barber.id}
                    className="flex-none w-[280px]"
                  >
                    <BarberCard
                      barber={barber}
                      onClick={() => navigate(`/booking?barber=${barber.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 
              className="text-3xl font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              Our Services
            </h2>
            <button
              onClick={() => navigate('/services')}
              className={`${componentStyles.button.base} ${componentStyles.button.primary}`}
            >
              View All Services
            </button>
          </div>
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {services?.slice(0, 8).map(service => (
                  <div 
                    key={service.id}
                    className="flex-none w-[280px]"
                  >
                    <ServiceCard
                      key={service.id}
                      service={service}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Branches Section */}
        <section>
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
              <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {branches?.slice(0, 8).map(branch => (
                  <div 
                    key={branch.id}
                    className="flex-none w-[400px]"
                  >
                    <BranchCard
                      branch={branch}
                      showActions={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Buttons */}
        <section className="flex flex-wrap justify-center gap-4">
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
        </section>
      </main>

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
    </div>
  );
} 