import { getAuth } from 'firebase/auth';
import { ensureUserIsAdmin } from '../services/auth.service';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const serviceNames = [
  'Classic Haircut',
  'Beard Trim & Shape',
  'Hot Towel Shave',
  'Hair & Beard Combo',
  'Kids Haircut',
  'Hair Coloring',
  'Facial Treatment',
  'Head Massage & Styling'
];

const descriptions = [
  'A traditional haircut service including consultation, wash, cut, and style.',
  'Professional beard grooming service with precise trimming and shaping.',
  'Luxurious traditional hot towel shave with premium products.',
  'Complete grooming package including haircut and beard styling.',
  'Specialized haircut service for children in a friendly environment.',
  'Professional hair coloring service with modern techniques.',
  'Rejuvenating facial treatment for healthy skin and relaxation.',
  'Relaxing scalp massage followed by professional hair styling.'
];

const durations = [30, 45, 60]; // in minutes
const priceRanges = {
  min: 25,
  max: 80
};

function getRandomPrice(): number {
  const price = Math.floor(Math.random() * (priceRanges.max - priceRanges.min + 1)) + priceRanges.min;
  return Math.round(price / 5) * 5; // Round to nearest $5
}

function generateRandomService(imageNumber: number) {
  return {
    name: serviceNames[imageNumber - 1],
    description: descriptions[imageNumber - 1],
    duration: durations[Math.floor(Math.random() * durations.length)],
    price: getRandomPrice(),
    image: `/images/services/service${imageNumber}.jpeg`,
    isActive: true
  };
}

export async function addRandomServices() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    console.log('Current auth state:', {
      isAuthenticated: !!user,
      userId: user?.uid,
      email: user?.email
    });

    if (!user) {
      throw new Error('User must be authenticated to add services');
    }

    // Ensure user has admin privileges
    await ensureUserIsAdmin();
    console.log('Confirmed user has admin privileges');

    console.log('Starting to add random services...');
    const servicesRef = collection(db, 'services');
    
    // Create a service for each image (1-8)
    for (let i = 1; i <= 8; i++) {
      const serviceData = generateRandomService(i);
      console.log(`Attempting to add service ${i}:`, serviceData);
      try {
        const newServiceDoc = await addDoc(servicesRef, {
          ...serviceData,
          createdAt: serverTimestamp()
        });
        console.log(`Successfully added service ${i} with ID:`, newServiceDoc.id);
      } catch (error) {
        console.error(`Failed to add service ${i}:`, error);
        throw error;
      }
    }
    
    console.log('Successfully added all random services!');
  } catch (error) {
    console.error('Error in addRandomServices:', error);
    throw error;
  }
} 