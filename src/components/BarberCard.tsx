import { type Barber } from '../data/siteData';

interface BarberCardProps {
  barber: Barber;
}

export default function BarberCard({ barber }: BarberCardProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <img src={barber.image} alt={barber.name} className="rounded-xl h-64 w-48 object-cover" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl font-bold">{barber.name}</h2>
        <p className="text-lg text-primary">{barber.role}</p>
        <p className="text-gray-600">{barber.experience} Experience</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {barber.specialties.map((specialty, index) => (
            <span key={index} className="badge badge-primary">{specialty}</span>
          ))}
        </div>
      </div>
    </div>
  );
} 