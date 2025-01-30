import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useServices } from '../hooks/useServices';


export default function ServicesPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { services } = useServices();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ color: theme.colors.text.primary }}>
        Our Services
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <Card
            key={service.id}
            image={service.image}
            onClick={() => navigate(`/booking?service=${service.id}`)}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                  {service.name}
                </h3>
                {service.popular && (
                  <span 
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{ 
                      backgroundColor: theme.colors.accent.primary,
                      color: theme.colors.background.primary
                    }}
                  >
                    POPULAR
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span 
                  className="text-lg font-semibold"
                  style={{ color: theme.colors.accent.primary }}
                >
                  ${service.price}
                </span>
                <span style={{ color: theme.colors.text.secondary }}>
                  {service.duration}
                </span>
              </div>

              <p 
                className="text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                {service.description}
              </p>

              <button 
                className="w-full mt-4 py-2 rounded-md transition-colors duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.primary
                }}
              >
                Book Now
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
