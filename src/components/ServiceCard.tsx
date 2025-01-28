import { type Service } from '../data/siteData';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <img src={service.image} alt={service.name} className="rounded-xl h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title justify-between">
          {service.name}
          <span className="text-primary text-xl">{service.price}</span>
        </h2>
        <p className="text-gray-600">{service.description}</p>
        <div className="flex items-center gap-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{service.duration}</span>
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary">Book Now</button>
        </div>
      </div>
    </div>
  );
} 