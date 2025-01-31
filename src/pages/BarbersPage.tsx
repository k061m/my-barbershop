import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useBarbers } from '../hooks/useBarbers';
import { Language } from '../types';

export default function BarbersPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { barbers, loading } = useBarbers();

  if (loading) {
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

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.colors.background.primary }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            Our Expert Barbers
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.colors.text.secondary }}
          >
            Meet our team of professional barbers dedicated to providing you with the best grooming experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers?.map(barber => (
            <div
              key={barber.id}
              className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]"
              style={{ backgroundColor: theme.colors.background.card }}
            >
              <div className="relative">
                <img
                  src={barber.image}
                  alt={`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
                  className="w-full h-64 object-cover"
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

              <div className="p-6 space-y-4">
                <div>
                  <h3 
                    className="text-xl font-bold mb-1"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {`${barber.personalInfo.firstName} ${barber.personalInfo.lastName}`}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    {barber.translations.en.title}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div 
                    className="text-lg"
                    style={{ color: theme.colors.status.warning }}
                  >
                    {'★'.repeat(Math.round(barber.professionalInfo.rating))}
                  </div>
                  <span 
                    className="text-sm"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    {barber.professionalInfo.rating.toFixed(1)}
                  </span>
                </div>

                <p 
                  className="text-sm line-clamp-3"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {barber.translations.en.bio}
                </p>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {barber.professionalInfo.specialties.map((specialty: string, index: number) => (
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
                  
                  <div className="flex flex-wrap gap-2">
                    {barber.professionalInfo.languages.map((language: Language, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{ 
                          backgroundColor: theme.colors.accent.secondary + '20',
                          color: theme.colors.accent.secondary
                        }}
                      >
                        {language.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/booking?barber=${barber.id}`)}
                  className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-90 mt-4"
                  style={{ 
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.primary
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
