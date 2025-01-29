import { useEffect, useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';

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
      reviews: { title: string };
    };
    navigation: {
      login: string;
      dashboard: string;
      adminPanel: string;
      aboutUs: string;
    };
  };
}

interface SearchResults {
  barbers: any[];
  services: any[];
}

// Memoized Button Component
const StyledButton = memo(({ 
  onClick, 
  style, 
  children 
}: { 
  onClick: () => void; 
  style: React.CSSProperties; 
  children: React.ReactNode;
}) => (
  <button 
    onClick={onClick}
    className="px-8 py-3 rounded-lg transition-opacity hover:opacity-90"
    style={style}
  >
    {children}
  </button>
));

// Memoized Section Title Component
const SectionTitle = memo(({ 
  title, 
  onViewAll,
  theme 
}: { 
  title: string; 
  onViewAll?: () => void;
  theme: any;
}) => (
  <div className="flex justify-between items-center mb-6">
    <h2 
      className="text-2xl font-bold"
      style={{ color: theme.colors.text.primary }}
    >
      {title}
    </h2>
    {onViewAll && (
      <button 
        onClick={onViewAll}
        className="text-sm hover:opacity-80 transition-opacity"
        style={{ color: theme.colors.accent.primary }}
      >
        View All →
      </button>
    )}
  </div>
));

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { barbers, loading: loadingBarbers } = useBarbers();
  const { services, loading: loadingServices } = useServices();
  const [searchInputValue, setSearchInputValue] = useState('');
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults>({ barbers: [], services: [] });

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

  // Real-time search effect
  useEffect(() => {
    const query = searchInputValue.trim();
    
    if (query === '') {
      setSearchResults({ barbers: [], services: [] });
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    const filteredBarbers = barbers?.filter(barber => 
      barber.translations?.en.name.toLowerCase().includes(lowerCaseQuery) ||
      (barber.translations?.en.specialties?.toLowerCase().includes(lowerCaseQuery) ?? false)
    ) || [];

    const filteredServices = services?.filter(service => 
      service.translations?.en.name.toLowerCase().includes(lowerCaseQuery) ||
      service.translations?.en.description?.toLowerCase().includes(lowerCaseQuery)
    ) || [];

    setSearchResults({ barbers: filteredBarbers, services: filteredServices });
  }, [searchInputValue, barbers, services]);

  // Memoized reviews data
  const reviews = useMemo(() => [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Best haircut I've ever had!",
      date: "2024-02-20",
      image: "/images/stock/avatar-1.jpg"
    },
    {
      id: 2,
      name: "Jane Smith",
      rating: 4,
      comment: "Great service and atmosphere",
      date: "2024-02-19",
      image: "/images/stock/avatar-2.jpg"
    }
  ], []);

  // Loading state
  if (loadingBarbers || loadingServices || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="loading loading-spinner loading-lg" 
          style={{ color: theme.colors.accent.primary }}></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="text-center p-4" style={{ color: theme.colors.status.error }}>
          {error}
          <button
            onClick={() => window.location.reload()}
            className="block mt-4 underline"
            style={{ color: theme.colors.accent.primary }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-0" style={{ backgroundColor: theme.colors.background.primary }}>      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 z-0">
        <div className="relative space-y-6 max-w-4xl w-full">
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
            <StyledButton 
              onClick={() => navigate('/booking')}
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
            >
              {content.homePage.buttons.bookNow}
            </StyledButton>
            <StyledButton 
              onClick={() => navigate('/services')}
              style={{ 
                backgroundColor: theme.colors.background.card,
                color: theme.colors.text.primary
              }}
            >
              {content.homePage.buttons.viewServices}
            </StyledButton>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-0">
        {/* Featured Barbers */}
        <section>
          <SectionTitle 
            title={content.homePage.sections.barbers.title}
            onViewAll={() => navigate('/barbers')}
            theme={theme}
          />
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-4 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {barbers?.slice(0, 8).map(barber => (
                  <div 
                    key={barber.id}
                    className="flex-none w-[200px]"
                  >
                    <div 
                      onClick={() => navigate(`/booking?barber=${barber.id}`)}
                      className="bg-opacity-40 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
                      style={{ backgroundColor: theme.colors.background.card }}
                    >
                      <div className="aspect-square">
                        <img 
                          src={barber.image} 
                          alt={barber.translations?.en.name || barber.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 space-y-1">
                        <h3 
                          className="font-semibold text-sm truncate"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {barber.translations?.en.name || barber.name}
                        </h3>
                        <p 
                          className="text-xs truncate"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          {barber.translations?.en.specialties || barber.specialties?.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll Buttons */}
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (container) container.scrollLeft -= 200;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (container) container.scrollLeft += 200;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

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

        {/* Featured Services */}
        <section>
          <SectionTitle 
            title={content.homePage.sections.services.title}
            onViewAll={() => navigate('/services')}
            theme={theme}
          />
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-4 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {services?.slice(0, 8).map(service => (
                  <div 
                    key={service.id}
                    className="flex-none w-[200px]"
                  >
                    <div 
                      onClick={() => navigate(`/booking?service=${service.id}`)}
                      className="bg-opacity-40 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300"
                      style={{ backgroundColor: theme.colors.background.card }}
                    >
                      <div className="aspect-square">
                        <img 
                          src={service.image} 
                          alt={service.translations?.en.name || service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 space-y-1">
                        <h3 
                          className="font-semibold text-sm truncate"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {service.translations?.en.name || service.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-xs" style={{ color: theme.colors.accent.primary }}>
                            ${service.price}
                          </span>
                          <span className="text-xs" style={{ color: theme.colors.text.secondary }}>
                            {service.translations?.en.duration || service.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll Buttons */}
            <button
              onClick={() => {
                const container = document.querySelector('section:has(h2:contains("Services")) .overflow-x-auto');
                if (container) container.scrollLeft -= 200;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const container = document.querySelector('section:has(h2:contains("Services")) .overflow-x-auto');
                if (container) container.scrollLeft += 200;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Reviews Section */}
        <section>
          <SectionTitle 
            title={content.homePage.sections.reviews.title}
            onViewAll={() => navigate('/reviews')}
            theme={theme}
          />
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-4 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {reviews.map(review => (
                  <div 
                    key={review.id}
                    className="flex-none w-[300px]"
                  >
                    <div 
                      className="bg-opacity-40 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300 h-full"
                      style={{ backgroundColor: theme.colors.background.card }}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.image} 
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 
                              className="font-semibold text-sm"
                              style={{ color: theme.colors.text.primary }}
                            >
                              {review.name}
                            </h3>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</span>
                              <span className="text-xs" style={{ color: theme.colors.text.secondary }}>
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <p 
                          className="text-sm line-clamp-3"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {review.comment}
                        </p>
                        <div className="flex justify-end">
                          <span className="text-xs" style={{ color: theme.colors.text.secondary }}>
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll Buttons */}
            <button
              onClick={() => {
                const container = document.querySelector('section:has(h2:contains("Reviews")) .overflow-x-auto');
                if (container) container.scrollLeft -= 300;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const container = document.querySelector('section:has(h2:contains("Reviews")) .overflow-x-auto');
                if (container) container.scrollLeft += 300;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black bg-opacity-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: theme.colors.text.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Search Section */}
        <section>
          <SectionTitle 
            title="Search"
            theme={theme}
          />
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Search barbers or services..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.text.secondary}`
                }}
              />
              <button
                onClick={() => setSearchInputValue('')}
                className="px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.primary
                }}
              >
                Clear
              </button>
            </div>

            {searchInputValue.trim() !== '' && (
              <div className="space-y-6">
                {searchResults.barbers.length === 0 && searchResults.services.length === 0 ? (
                  <div className="text-center py-8">
                    <p style={{ color: theme.colors.text.secondary }}>
                      No matches found for "{searchInputValue}"
                    </p>
                  </div>
                ) : (
                  <>
                    {searchResults.barbers.length > 0 && (
                      <div>
                        <h3 
                          className="text-xl font-semibold mb-4"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          Barbers
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {searchResults.barbers.map(barber => (
                            <div 
                              key={barber.id}
                              onClick={() => navigate(`/booking?barber=${barber.id}`)}
                              className="bg-opacity-40 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300 flex items-center gap-3 p-3"
                              style={{ backgroundColor: theme.colors.background.card }}
                            >
                              <img 
                                src={barber.image} 
                                alt={barber.translations?.en.name || barber.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-semibold" style={{ color: theme.colors.text.primary }}>
                                  {barber.translations?.en.name || barber.name}
                                </h4>
                                <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
                                  {barber.translations?.en.specialties || barber.specialties?.join(', ')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.services.length > 0 && (
                      <div>
                        <h3 
                          className="text-xl font-semibold mb-4"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          Services
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {searchResults.services.map(service => (
                            <div 
                              key={service.id}
                              onClick={() => navigate(`/booking?service=${service.id}`)}
                              className="bg-opacity-40 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300 flex items-center gap-3 p-3"
                              style={{ backgroundColor: theme.colors.background.card }}
                            >
                              <img 
                                src={service.image} 
                                alt={service.translations?.en.name || service.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold" style={{ color: theme.colors.text.primary }}>
                                  {service.translations?.en.name || service.name}
                                </h4>
                                <div className="flex justify-between items-center">
                                  <span style={{ color: theme.colors.accent.primary }}>
                                    ${service.price}
                                  </span>
                                  <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                                    {service.translations?.en.duration || service.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Navigation Buttons */}
        <section className="flex flex-wrap justify-center gap-4">
          {!currentUser ? (
            <StyledButton 
              onClick={() => navigate('/login')}
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
            >
              {content.homePage.navigation.login}
            </StyledButton>
          ) : (
            <>
              <StyledButton 
                onClick={() => navigate('/dashboard')}
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary
                }}
              >
                {content.homePage.navigation.dashboard}
              </StyledButton>
              {currentUser.email === 'admin@admin.admin' && (
                <StyledButton 
                  onClick={() => navigate('/admin')}
                  style={{ 
                    backgroundColor: theme.colors.accent.secondary,
                    color: theme.colors.text.primary
                  }}
                >
                  {content.homePage.navigation.adminPanel}
                </StyledButton>
              )}
            </>
          )}
          <StyledButton 
            onClick={() => navigate('/about')}
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary
            }}
          >
            {content.homePage.navigation.aboutUs}
          </StyledButton>
        </section>
      </main>
    </div>
  );
} 