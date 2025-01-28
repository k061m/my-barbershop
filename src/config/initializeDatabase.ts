import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Sample data
const services = [
  {
    id: 'haircut',
    name: 'Classic Haircut',
    duration: '30 min',
    price: 25,
    description: 'Professional haircut including wash and style',
    image: '/images/services/haircut.jpg'
  },
  {
    id: 'shave',
    name: 'Traditional Shave',
    duration: '30 min',
    price: 20,
    description: 'Classic straight razor shave with hot towel treatment',
    image: '/images/services/shave.jpg'
  },
  {
    id: 'beard-trim',
    name: 'Beard Trim',
    duration: '20 min',
    price: 15,
    description: 'Professional beard trimming and shaping',
    image: '/images/services/beard.jpg'
  },
  {
    id: 'hair-color',
    name: 'Hair Color',
    duration: '60 min',
    price: 50,
    description: 'Full hair coloring service',
    image: '/images/services/color.jpg'
  }
];

const barbers = [
  {
    id: 'john-doe',
    name: 'John Doe',
    speciality: 'Classic Cuts',
    bio: '10 years of experience in traditional barbering',
    image: '/images/barbers/john.jpg',
    rating: 4.8
  },
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    speciality: 'Modern Styles',
    bio: 'Specialist in contemporary and trendy hairstyles',
    image: '/images/barbers/jane.jpg',
    rating: 4.9
  },
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    speciality: 'Beard Grooming',
    bio: 'Expert in beard styling and maintenance',
    image: '/images/barbers/mike.jpg',
    rating: 4.7
  }
];

// Function to initialize the database
export async function initializeDatabase() {
  try {
    // Initialize Services
    const servicesCollection = collection(db, 'services');
    for (const service of services) {
      await setDoc(doc(servicesCollection, service.id), {
        name: service.name,
        duration: service.duration,
        price: service.price,
        description: service.description,
        image: service.image
      });
    }
    console.log('Services initialized successfully');

    // Initialize Barbers
    const barbersCollection = collection(db, 'barbers');
    for (const barber of barbers) {
      await setDoc(doc(barbersCollection, barber.id), {
        name: barber.name,
        speciality: barber.speciality,
        bio: barber.bio,
        image: barber.image,
        rating: barber.rating
      });
    }
    console.log('Barbers initialized successfully');

    // Initialize Admin User
    const adminUser = {
      email: 'admin@barbershop.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', 'admin'), adminUser);
    console.log('Admin user initialized successfully');

    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Function to check if database is initialized
export async function isDatabaseInitialized() {
  try {
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    return !servicesSnapshot.empty;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
} 
