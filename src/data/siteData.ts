export interface Barber {
  id: number;
  name: string;
  role: string;
  image: string;
  experience: string;
  specialties: string[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  duration: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image: string;
  date: string;
}