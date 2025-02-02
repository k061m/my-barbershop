import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useBarbers } from '../hooks/useBarbers';
import BarberCard from '../components/barbers/BarberCard';

export default function BarbersPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { barbers, isLoading } = useBarbers();

  if (isLoading) {
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
            <BarberCard
              key={barber.id}
              barber={barber}
              onClick={() => navigate(`/booking?barber=${barber.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 
