import React from 'react';
import { useBarbers } from '../hooks/useBarbers';

export default function BarbersPage() {
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
      <h1 className="text-3xl font-bold mb-8 text-center">Meet Our Expert Barbers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {barbers.map((barber) => (
          <div key={barber.id} className="card bg-base-100 shadow-xl">
            <figure className="px-4 pt-4">
              <img
                src={barber.image}
                alt={barber.translations.en.name}
                className="rounded-xl h-64 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                {barber.translations.en.name}
                {barber.available && (
                  <div className="badge badge-success">Available</div>
                )}
              </h2>
              <p className="text-base-content/70">{barber.translations.en.description}</p>
              <div className="mt-2">
                <p className="text-sm"><strong>Bio:</strong> {barber.translations.en.bio}</p>
                <p className="text-sm mt-1"><strong>Specialties:</strong> {barber.translations.en.specialties}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-warning text-lg">⭐ {(barber.rating || 0).toFixed(1)}</div>
                <div className="text-sm">
                  {barber.workingDays.map(day => 
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day - 1]
                  ).join(', ')}
                </div>
              </div>
              <div className="text-sm text-center mt-2">
                {barber.workingHours.start} - {barber.workingHours.end}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 