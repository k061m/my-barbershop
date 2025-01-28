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

export const barbers: Barber[] = [
  {
    id: 1,
    name: "John Smith",
    role: "Master Barber",
    image: "/images/barbers/barber1.svg",
    experience: "15+ years",
    specialties: ["Classic Cuts", "Beard Styling", "Hot Towel Shaves"]
  },
  {
    id: 2,
    name: "Mike Johnson",
    role: "Senior Barber",
    image: "/images/barbers/barber2.svg",
    experience: "10+ years",
    specialties: ["Modern Fades", "Hair Design", "Color Treatment"]
  },
  {
    id: 3,
    name: "David Wilson",
    role: "Style Specialist",
    image: "/images/barbers/barber3.svg",
    experience: "8+ years",
    specialties: ["Trendy Styles", "Texture Work", "Kids Cuts"]
  }
];

export const services: Service[] = [
  {
    id: 1,
    name: "Classic Haircut",
    description: "Traditional haircut with attention to detail and style preferences",
    price: "$30",
    image: "/images/services/classic-cut.svg",
    duration: "45 min"
  },
  {
    id: 2,
    name: "Beard Trim & Shape",
    description: "Professional beard grooming including trim, shape, and hot towel treatment",
    price: "$25",
    image: "/images/services/beard-trim.svg",
    duration: "30 min"
  },
  {
    id: 3,
    name: "Premium Package",
    description: "Haircut, beard service, and hot towel shave with premium products",
    price: "$60",
    image: "/images/services/premium-package.svg",
    duration: "75 min"
  }
];

export const reviews: Review[] = [
  {
    id: 1,
    name: "James Brown",
    rating: 5,
    comment: "Best haircut I've ever had! The attention to detail was amazing.",
    image: "/images/reviews/review1.svg",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Robert Davis",
    rating: 5,
    comment: "Great atmosphere and professional service. Will definitely return!",
    image: "/images/reviews/review2.svg",
    date: "2024-01-10"
  },
  {
    id: 3,
    name: "Chris Thompson",
    rating: 4,
    comment: "Excellent beard trim and styling. Very knowledgeable staff.",
    image: "/images/reviews/review3.svg",
    date: "2024-01-05"
  }
]; 