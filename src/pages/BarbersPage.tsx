import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useBarbers } from '../hooks/useBarbers';

export default function BarbersPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { barbers, loading } = useBarbers();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ color: theme.colors.text.primary }}>
        Our Expert Barbers
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers?.map(barber => (
          <Card
            key={barber.id}
            image={barber.image}
            onClick={() => navigate(`/booking?barber=${barber.id}`)}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                  {barber.translations?.en.name || barber.name}
                </h3>
                <div className="flex gap-2">
                  {barber.available && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: theme.colors.status.success,
                        color: theme.colors.text.primary
                      }}
                    >
                      Available
                    </span>
                  )}
                  {barber.isPro && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: theme.colors.accent.primary,
                        color: theme.colors.background.primary
                      }}
                    >
                      PRO
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">★</span>
                <span style={{ color: theme.colors.text.secondary }}>
                  {barber.rating} ({barber.reviewCount} reviews)
                </span>
              </div>

              <div style={{ color: theme.colors.text.secondary }}>
                {barber.translations?.en.description && (
                  <p className="text-sm mb-2">{barber.translations.en.description}</p>
                )}
                {barber.experience && (
                  <p className="text-sm">Experience: {barber.experience}</p>
                )}
                <p className="text-sm mt-1">
                  Specialties: {barber.translations?.en.specialties || barber.specialties?.join(', ')}
                </p>
              </div>

              {(barber.workingDays || barber.workingHours) && (
                <div style={{ color: theme.colors.text.secondary }}>
                  {barber.workingDays && (
                    <p className="text-sm">
                      Days: {barber.workingDays.map(day => 
                        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1]
                      ).join(', ')}
                    </p>
                  )}
                  {barber.workingHours && (
                    <p className="text-sm">
                      Hours: {barber.workingHours.start} - {barber.workingHours.end}
                    </p>
                  )}
                </div>
              )}

              <button 
                className="w-full mt-4 py-2 rounded-md transition-colors duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.primary
                }}
              >
                Book Appointment
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
