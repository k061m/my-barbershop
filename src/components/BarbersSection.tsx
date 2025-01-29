import { type Barber } from '../data/siteData';
import { BarberCard } from './BarberCard';

interface BarbersSectionProps {
  barbers: Barber[];
}

export default function BarbersSection({ barbers }: BarbersSectionProps) {
  return (
    <div className="py-12 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <BarberCard 
              key={barber.id}
              id={barber.id}
              name={barber.name}
              image={barber.image}
              role={barber.role}
              experience={barber.experience}
              specialties={barber.specialties}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 