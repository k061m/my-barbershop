interface LocationConfig {
  coordinates: [number, number]; // [latitude, longitude]
  address: string;
  shopName: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: string;
  };
}

export const locationConfig: LocationConfig = {
  coordinates: [40.7128, -74.0060], // Replace with your actual coordinates
  address: "123 Barber Street, Downtown",
  shopName: "My Barbershop",
  phone: "+1 (555) 123-4567",
  email: "contact@barbershop.com",
  openingHours: {
    "Monday - Friday": "9:00 AM - 8:00 PM",
    "Saturday": "10:00 AM - 6:00 PM",
    "Sunday": "Closed"
  }
}; 