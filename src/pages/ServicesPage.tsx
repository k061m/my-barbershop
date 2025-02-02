import { useTheme } from '../contexts/ThemeContext';
import { useServices } from '../hooks/useServices';
import ServiceCard from '../components/services/ServiceCard';

export default function ServicesPage() {
  const { theme } = useTheme();
  const { services } = useServices();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ color: theme.colors.text.primary }}>
        Our Services
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
      </div>
    </div>
  );
} 
