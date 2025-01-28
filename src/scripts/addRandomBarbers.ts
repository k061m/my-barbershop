import { barberService } from '../services/barber.service';
import { getAuth } from 'firebase/auth';
import { ensureUserIsAdmin } from '../services/auth.service';

const firstNames = [
  'Alexander', 'Benjamin', 'Carlos', 'Daniel', 'Edward', 'Felix', 'George', 'Henry',
  'Isaac', 'Jacob', 'Kevin', 'Lucas', 'Matthew', 'Nathan', 'Oliver', 'Peter'
];

const lastNames = [
  'Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Fisher', 'Garcia', 'Harris',
  'Ingram', 'Johnson', 'King', 'Lewis', 'Miller', 'Nelson', 'Ortiz', 'Parker'
];

const specialities = [
  'Classic Cuts & Styling',
  'Modern Fades & Designs',
  'Beard Grooming Specialist',
  'Precision Haircuts',
  'Traditional Barbering',
  'Contemporary Styles',
  'Hair Design Artist',
  'Color & Style Expert'
];

const bioTemplates = [
  'A master of {speciality} with {experience} years of experience, known for attention to detail.',
  'Bringing {experience} years of expertise in {speciality}, dedicated to client satisfaction.',
  'Specializing in {speciality} for {experience} years, creating unique styles for each client.',
  'With {experience} years mastering {speciality}, committed to excellence in every cut.',
  'An expert in {speciality}, bringing {experience} years of professional experience.',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomBarber(imageNumber: number) {
  const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
  const speciality = getRandomItem(specialities);
  const experience = Math.floor(Math.random() * 15) + 3; // 3-18 years experience
  const rating = (Math.random() * 1.0 + 4.0).toFixed(1); // 4.0-5.0 rating
  const bioTemplate = getRandomItem(bioTemplates);
  const bio = bioTemplate
    .replace('{speciality}', speciality.toLowerCase())
    .replace('{experience}', experience.toString());

  return {
    name,
    speciality,
    bio,
    image: `/images/barbers/barber${imageNumber}.jpg`,
    rating: parseFloat(rating),
    experience
  };
}

export async function addRandomBarbers() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    console.log('Current auth state:', {
      isAuthenticated: !!user,
      userId: user?.uid,
      email: user?.email
    });

    if (!user) {
      throw new Error('User must be authenticated to add barbers');
    }

    // Ensure user has admin privileges
    await ensureUserIsAdmin();
    console.log('Confirmed user has admin privileges');

    console.log('Starting to add random barbers...');
    
    // Create a barber for each image (1-8)
    for (let i = 1; i <= 8; i++) {
      const barberData = generateRandomBarber(i);
      console.log(`Attempting to add barber ${i}:`, barberData);
      try {
        const barberId = await barberService.addNewBarber(barberData);
        console.log(`Successfully added barber ${i} with ID:`, barberId);
      } catch (error) {
        console.error(`Failed to add barber ${i}:`, error);
        throw error;
      }
    }
    
    console.log('Successfully added all random barbers!');
  } catch (error) {
    console.error('Error in addRandomBarbers:', error);
    throw error;
  }
} 