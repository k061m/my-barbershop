import { useTheme } from '../../contexts/ThemeContext';
import { Barber } from '../../types/data.types';
import BarberCard from './BarberCard';

interface BarbersSectionProps {
  barbers: Barber[];
  onBarberClick?: (barber: Barber) => void;
}

export default function BarbersSection({ barbers, onBarberClick }: BarbersSectionProps) {
  const { theme } = useTheme();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8" style={{ color: theme.colors.text.primary }}>
          Our Barbers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((barber) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              onClick={() => onBarberClick?.(barber)}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 