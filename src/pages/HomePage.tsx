import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useBarbers } from '../hooks/useBarbers';
import { useServices } from '../hooks/useServices';
import { Barber, Service } from '../types';

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
  barbers: Barber[];
  services: Service[];
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
}

interface StyledButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const StyledButton = ({ onClick, variant = 'primary', children }: StyledButtonProps) => {
  const { theme } = useTheme();
  
  return (
    <button 
      onClick={onClick}
      className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:opacity-90 hover:transform hover:scale-[1.02]"
      style={{ 
        backgroundColor: variant === 'primary' ? theme.colors.accent.primary : theme.colors.background.card,
        color: variant === 'primary' ? theme.colors.background.primary : theme.colors.text.primary,
        boxShadow: theme.shadows.md
      }}
    >
      {children}
    </button>
  );
};

interface SectionTitleProps {
  title: string;
  onViewAll?: () => void;
}

const SectionTitle = ({ title, onViewAll }: SectionTitleProps) => {
  const { theme } = useTheme();
  
  return (
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
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: theme.colors.accent.primary }}
        >
          View All →
        </button>
      )}
    </div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { barbers, loading: loadingBarbers } = useBarbers();
  const { services, loading: loadingServices } = useServices();
  const [searchInputValue, setSearchInputValue] = useState('');
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults>({
    barbers: [] as Barber[],
    services: [] as Service[]
  });

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

  useEffect(() => {
    const query = searchInputValue.trim().toLowerCase();
    
    if (query === '') {
      setSearchResults({ barbers: [], services: [] });
      return;
    }

    const filteredBarbers = barbers?.filter(barber => 
      `${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`.toLowerCase().includes(query) ||
      barber.professionalInfo.specialties.some(specialty => specialty.toLowerCase().includes(query))
    ) || [];

    const filteredServices = services?.filter(service => 
      service.translations.en.name.toLowerCase().includes(query) ||
      service.translations.en.description.toLowerCase().includes(query)
    ) || [];

    setSearchResults({ barbers: filteredBarbers, services: filteredServices });
  }, [searchInputValue, barbers, services]);

  const reviews: Review[] = useMemo(() => [
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

  if (loadingBarbers || loadingServices || !content) {
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
            <StyledButton onClick={() => navigate('/booking')} variant="primary">
              {content.homePage.buttons.bookNow}
            </StyledButton>
            <StyledButton onClick={() => navigate('/services')} variant="secondary">
              {content.homePage.buttons.viewServices}
            </StyledButton>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Barbers */}
        <section>
          <SectionTitle 
            title={content.homePage.sections.barbers.title}
            onViewAll={() => navigate('/barbers')}
          />
          <div className="relative group">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-6 pb-4" style={{ scrollBehavior: 'smooth' }}>
                {barbers?.slice(0, 8).map(barber => (
                  <div 
                    key={barber.id}
                    className="flex-none w-[280px]"
                  >
                    <div 
                      onClick={() => navigate(`/booking?barber=${barber.id}`)}
                      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
                      style={{ 
                        backgroundColor: theme.colors.background.card,
                        boxShadow: theme.shadows.md
                      }}
                    >
                      <div className="aspect-square relative">
                        <img 
                          src={barber.image} 
                          alt={`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
                          className="w-full h-full object-cover"
                        />
                        {barber.isActive && (
                          <div 
                            className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold"
                            style={{ 
                              backgroundColor: theme.colors.status.success,
                              color: theme.colors.background.primary
                            }}
                          >
                            Available
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 
                          className="font-bold text-lg truncate"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-lg"
                            style={{ color: theme.colors.status.warning }}
                          >
                            {'★'.repeat(Math.round(barber.professionalInfo.rating))}
                          </span>
                          <span 
                            className="text-sm"
                            style={{ color: theme.colors.text.secondary }}
                          >
                            {barber.professionalInfo.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {barber.professionalInfo.specialties.slice(0, 3).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: theme.colors.accent.primary + '20',
                                color: theme.colors.accent.primary
                              }}
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section>
          <SectionTitle 
            title={content.homePage.sections.services.title}
            onViewAll={() => navigate('/services')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services?.slice(0, 8).map(service => (
              <div 
                key={service.id}
                onClick={() => navigate(`/booking?service=${service.id}`)}
                className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  boxShadow: theme.shadows.md
                }}
              >
                <div className="aspect-video">
                  <img 
                    src={service.image} 
                    alt={service.translations.en.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 
                    className="font-bold text-lg"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {service.translations.en.name}
                  </h3>
                  <p 
                    className="text-sm line-clamp-2"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    {service.translations.en.description}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span 
                      className="font-bold"
                      style={{ color: theme.colors.accent.primary }}
                    >
                      ${service.basePrice}
                    </span>
                    <span 
                      className="text-sm"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      {service.baseDuration} {service.durationUnit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section>
          <SectionTitle 
            title={content.homePage.sections.reviews.title}
            onViewAll={() => navigate('/reviews')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div 
                key={review.id}
                className="rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  boxShadow: theme.shadows.md
                }}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 
                        className="font-bold"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {review.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-lg"
                          style={{ color: theme.colors.status.warning }}
                        >
                          {'★'.repeat(review.rating)}
                        </span>
                        <span 
                          className="text-sm"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <p 
                    className="text-sm"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {review.comment}
                  </p>
                  <div className="flex justify-end">
                    <span 
                      className="text-sm"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Search Section */}
        <section>
          <SectionTitle title="Search" />
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 mb-8">
              <input
                type="text"
                placeholder="Search barbers or services..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg transition-all duration-300"
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary,
                  boxShadow: theme.shadows.sm
                }}
              />
              <button
                onClick={() => setSearchInputValue('')}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.primary,
                  boxShadow: theme.shadows.sm
                }}
              >
                Clear
              </button>
            </div>

            {searchInputValue.trim() !== '' && (
              <div className="space-y-8">
                {searchResults.barbers.length === 0 && searchResults.services.length === 0 ? (
                  <div 
                    className="text-center py-12 rounded-lg"
                    style={{ 
                      backgroundColor: theme.colors.background.card,
                      color: theme.colors.text.secondary
                    }}
                  >
                    No matches found for "{searchInputValue}"
                  </div>
                ) : (
                  <>
                    {searchResults.barbers.length > 0 && (
                      <div>
                        <h3 
                          className="text-xl font-bold mb-4"
                          style={{ color: theme.colors.text.primary }}
                        >
                          Barbers
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {searchResults.barbers.map(barber => (
                            <div 
                              key={barber.id}
                              onClick={() => navigate(`/booking?barber=${barber.id}`)}
                              className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
                              style={{ 
                                backgroundColor: theme.colors.background.card,
                                boxShadow: theme.shadows.sm
                              }}
                            >
                              <img 
                                src={barber.image} 
                                alt={`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div>
                                <h4 
                                  className="font-bold"
                                  style={{ color: theme.colors.text.primary }}
                                >
                                  {`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
                                </h4>
                                <p 
                                  className="text-sm"
                                  style={{ color: theme.colors.text.secondary }}
                                >
                                  {barber.translations.en.title}
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
                          className="text-xl font-bold mb-4"
                          style={{ color: theme.colors.text.primary }}
                        >
                          Services
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {searchResults.services.map(service => (
                            <div 
                              key={service.id}
                              onClick={() => navigate(`/booking?service=${service.id}`)}
                              className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
                              style={{ 
                                backgroundColor: theme.colors.background.card,
                                boxShadow: theme.shadows.sm
                              }}
                            >
                              <img 
                                src={service.image} 
                                alt={service.translations.en.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 
                                  className="font-bold"
                                  style={{ color: theme.colors.text.primary }}
                                >
                                  {service.translations.en.name}
                                </h4>
                                <div className="flex justify-between items-center">
                                  <span 
                                    className="font-medium"
                                    style={{ color: theme.colors.accent.primary }}
                                  >
                                    ${service.basePrice}
                                  </span>
                                  <span 
                                    className="text-sm"
                                    style={{ color: theme.colors.text.secondary }}
                                  >
                                    {service.baseDuration} {service.durationUnit}
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
            <StyledButton onClick={() => navigate('/login')} variant="primary">
              {content.homePage.navigation.login}
            </StyledButton>
          ) : (
            <>
              <StyledButton onClick={() => navigate('/dashboard')} variant="secondary">
                {content.homePage.navigation.dashboard}
              </StyledButton>
              {currentUser.email === 'admin@admin.admin' && (
                <StyledButton onClick={() => navigate('/admin')} variant="secondary">
                  {content.homePage.navigation.adminPanel}
                </StyledButton>
              )}
            </>
          )}
          <StyledButton onClick={() => navigate('/about')} variant="secondary">
            {content.homePage.navigation.aboutUs}
          </StyledButton>
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