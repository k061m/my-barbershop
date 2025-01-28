import React from 'react';
import { barbers } from '../data/siteData';
import BarberCard from './BarberCard';

export default function BarbersSection() {
  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Expert Barbers</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {barbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      </div>
    </section>
  );
} 