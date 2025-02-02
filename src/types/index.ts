export * from './common.types';
export * from './service.types';
export * from './user.types';
export * from './barber.types';
export * from './appointment.types';
export * from './review.types';
export * from './gallery.types';
export * from './branch.types';
export * from './theme.types';

export interface Branch {
  id: string;
  name: string;
  image: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  rating: number;
  reviews: number;
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  facilities: string[];
  services: string[];
  phone?: string;
  email?: string;
  accessibility?: string[];
}

