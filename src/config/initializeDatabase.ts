import { collection, doc, setDoc, getDocs, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { ensureUserIsAdmin } from '../services/auth.service';

// Admin credentials
export const ADMIN_EMAIL = 'admin@admin.admin';
export const ADMIN_PASSWORD = 'adminpassword';

// Sample data
const sampleBarbers = [
  {
    id: 'barber1',
    available: true,
    workingDays: [1, 2, 3, 4, 5], // 1=Monday, 2=Tuesday, etc.
    workingHours: { start: '09:00', end: '17:00' },
    image: '/images/barbers/barber1.jpg',
    rating: 4.8,
    translations: {
      en: {
        name: 'John Smith',
        bio: 'Over 10 years of experience in classic and modern barbering',
        description: 'Master Barber specializing in precision cuts',
        specialties: 'Classic cuts, fades, and beard styling'
      },
      de: {
        name: 'John Smith',
        bio: 'Über 10 Jahre Erfahrung in klassischem und modernem Barbering',
        description: 'Meister-Barbier, spezialisiert auf Präzisionsschnitte',
        specialties: 'Klassische Schnitte, Fades und Bart-Styling'
      },
      ar: {
        name: 'جون سميث',
        bio: 'أكثر من 10 سنوات من الخبرة في الحلاقة الكلاسيكية والحديثة',
        description: 'حلاق محترف متخصص في القصات الدقيقة',
        specialties: 'قصات كلاسيكية، فيد، وتصفيف اللحية'
      }
    }
  },
  {
    id: 'barber2',
    available: true,
    workingDays: [2, 3, 4, 5, 6], // 2=Tuesday through 6=Saturday
    workingHours: { start: '10:00', end: '18:00' },
    image: '/images/barbers/barber2.jpg',
    rating: 4.9,
    translations: {
      en: {
        name: 'Michael Chen',
        bio: 'Expert in Asian hair textures and modern styles',
        description: 'Contemporary stylist with international training',
        specialties: 'Asian hair textures, modern cuts, and styling'
      },
      de: {
        name: 'Michael Chen',
        bio: 'Experte für asiatische Haarstrukturen und moderne Stile',
        description: 'Zeitgenössischer Stylist mit internationaler Ausbildung',
        specialties: 'Asiatische Haarstrukturen, moderne Schnitte und Styling'
      },
      ar: {
        name: 'مايكل تشن',
        bio: 'خبير في تركيبات الشعر الآسيوي والأساليب الحديثة',
        description: 'مصفف عصري مع تدريب دولي',
        specialties: 'تركيبات الشعر الآسيوي، القصات العصرية والتصفيف'
      }
    }
  }
];

export const services = [
  {
    id: 'mensCut',
    price: 25,
    image: '/images/services/mens-cut.jpg',
    duration: '30min',
    translations: {
      en: {
        name: "Men's Haircut",
        description: 'Professional haircut including wash and style',
        duration: '30 minutes'
      },
      de: {
        name: 'Herrenhaarschnitt',
        description: 'Professioneller Haarschnitt mit Waschen und Styling',
        duration: '30 Minuten'
      },
      ar: {
        name: 'قص شعر رجالي',
        description: 'قص شعر احترافي يشمل الغسيل والتصفيف',
        duration: '30 دقيقة'
      }
    }
  },
  {
    id: 'beardTrim',
    price: 15,
    image: '/images/services/beard.jpg',
    duration: '20min',
    translations: {
      en: {
        name: 'Beard Trim',
        description: 'Professional beard trimming and shaping',
        duration: '20 minutes'
      },
      de: {
        name: 'Bartschnitt',
        description: 'Professionelles Barttrimmen und Formen',
        duration: '20 Minuten'
      },
      ar: {
        name: 'تشذيب اللحية',
        description: 'تشذيب وتشكيل اللحية باحترافية',
        duration: '20 دقيقة'
      }
    }
  },
  {
    id: 'hairColoring',
    price: 50,
    image: '/images/services/color.jpg',
    duration: '60min',
    translations: {
      en: {
        name: 'Hair Coloring',
        description: 'Full hair coloring service',
        duration: '60 minutes'
      },
      de: {
        name: 'Haarfärbung',
        description: 'Kompletter Haarfärbeservice',
        duration: '60 Minuten'
      },
      ar: {
        name: 'صبغ الشعر',
        description: 'خدمة صبغ الشعر الكاملة',
        duration: '60 دقيقة'
      }
    }
  }
];

// Function to initialize the database
export async function initializeDatabase() {
  const user = auth.currentUser;

  if (!user) {
    console.log('No user logged in, skipping database initialization');
    return false;
  }

  try {
    console.log('Starting database initialization...');
    console.log('Current user:', user.email);
    
    await ensureUserIsAdmin();
    console.log('Confirmed user has admin privileges');

    // Initialize barbers
    console.log('Initializing barbers...');
    const barbersRef = collection(db, 'barbers');
    
    const existingBarbers = await getDocs(barbersRef);
    console.log(`Found ${existingBarbers.size} existing barbers to delete`);
    
    for (const doc of existingBarbers.docs) {
      await deleteDoc(doc.ref);
      console.log(`Deleted barber: ${doc.id}`);
    }
    
    // Add new barbers
    console.log('Adding new barbers...');
    for (const [index, barber] of sampleBarbers.entries()) {
      const barberId = `barber${index + 1}`;
      console.log(`Creating barber: ${barber.translations.en.name} with ID: ${barberId}`);
      
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
    
    if (servicesSnapshot.empty || barbersSnapshot.empty || !adminDoc.exists()) {
      console.log('Database needs initialization');
      return false;
    }
    
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
