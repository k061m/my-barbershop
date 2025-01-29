import { Card } from './Card';
import { useTheme } from '../contexts/ThemeContext';

interface BarberCardProps {
  id: number;
  name: string;
  image: string;
  role: string;
  experience: string;
  specialties: string[];
}

export function BarberCard({ 
  name,
  image,
  role,
  experience,
  specialties
}: BarberCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      image={image}
      className="h-full"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
            {name}
          </h3>
          <span 
            className="px-2 py-1 rounded text-xs font-semibold"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            {role}
          </span>
        </div>

        <div style={{ color: theme.colors.text.secondary }}>
          <p className="text-sm">Experience: {experience}</p>
          <p className="text-sm mt-1">
            Specialties: {specialties.join(', ')}
          </p>
        </div>
      </div>
    </Card>
  );
} 