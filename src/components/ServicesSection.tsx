import React from 'react';
import { services } from '../data/siteData';
import ServiceCard from './ServiceCard';

export default function ServicesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
} 