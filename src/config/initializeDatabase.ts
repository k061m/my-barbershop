import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { auth } from './firebase';
import { barberService } from '../services/barber.service';
import { initialBarbers } from '../services/barber.service';
import { ensureUserIsAdmin } from '../services/auth.service';

// Admin credentials
const ADMIN_EMAIL = 'admin@admin.admin';
const ADMIN_PASSWORD = 'adminpassword';

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

// Function to ensure admin user exists
async function ensureAdminExists() {
  try {
    // Check if admin user document exists
    const adminDoc = await getDoc(doc(db, 'users', 'admin'));
    if (!adminDoc.exists()) {
      // Create admin user in Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      
      // Create admin user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: ADMIN_EMAIL,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    return true;
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
    return false;
  }
}

// Function to clear the database
async function clearDatabase() {
  console.log('Clearing database...');
  try {
    // Clear services
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    for (const doc of servicesSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Clear barbers
    const barbersSnapshot = await getDocs(collection(db, 'barbers'));
    for (const doc of barbersSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

// Function to initialize the database
export async function initializeDatabase() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.log('No user logged in, skipping database initialization');
    return false;
  }

  try {
    console.log('Starting database initialization...');
    console.log('Current user:', user.email);
    
    // First ensure the current user has admin privileges
    await ensureUserIsAdmin();
    console.log('Confirmed user has admin privileges');

    // Initialize barbers
    console.log('Initializing barbers...');
    const barbersRef = collection(db, 'barbers');
    
    // First, delete all existing barbers
    const existingBarbers = await getDocs(barbersRef);
    console.log(`Found ${existingBarbers.size} existing barbers to delete`);
    
    for (const doc of existingBarbers.docs) {
      await deleteDoc(doc.ref);
      console.log(`Deleted barber: ${doc.id}`);
    }
    
    // Add new barbers
    console.log('Adding new barbers...');
    for (const [index, barber] of initialBarbers.entries()) {
      const barberId = `barber${index + 1}`;
      console.log(`Creating barber: ${barber.name} with ID: ${barberId}`);
      
      await setDoc(doc(barbersRef, barberId), {
        ...barber,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });
      console.log(`Successfully created barber: ${barberId}`);
    }
    
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error in database initialization:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw error;
  }
}

// Function to check if database is initialized
export async function isDatabaseInitialized() {
  try {
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    const barbersSnapshot = await getDocs(collection(db, 'barbers'));
    const adminDoc = await getDoc(doc(db, 'users', 'admin'));
    
    // Check if collections are empty or admin doesn't exist
    if (servicesSnapshot.empty || barbersSnapshot.empty || !adminDoc.exists()) {
      console.log('Database needs initialization');
      return false;
    }
    
    // Check if we have all services
    if (servicesSnapshot.docs.length < services.length) {
      console.log('Database needs reinitialization');
      return false;
    }

    console.log('Database is already initialized');
    return true;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
} 
