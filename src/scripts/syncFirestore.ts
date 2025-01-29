import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { services } from '../data/local/services';
import { barbers } from '../data/local/barbers';
import { gallery } from '../data/local/gallery';

// Load environment variables
config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type SyncOptions = {
  dryRun: boolean;
  collections: string[];
  mode: 'merge' | 'replace';
};

const defaultOptions: SyncOptions = {
  dryRun: false,
  collections: ['services', 'barbers', 'gallery'],
  mode: 'merge'
};

async function syncCollection(collectionName: string, data: Record<string, any>, options: SyncOptions) {
  console.log(`\nSyncing ${collectionName}...`);
  const collectionRef = collection(db, collectionName);

  if (options.mode === 'replace') {
    // Delete existing documents if in replace mode
    if (!options.dryRun) {
      const snapshot = await getDocs(collectionRef);
      for (const document of snapshot.docs) {
        await deleteDoc(doc(collectionRef, document.id));
      }
    }
    console.log(`Deleted existing documents in ${collectionName}`);
  }

  // Add/update documents
  for (const [id, item] of Object.entries(data)) {
    if (options.dryRun) {
      console.log(`Would ${options.mode === 'replace' ? 'create' : 'update'} document ${id}`);
    } else {
      await setDoc(doc(collectionRef, id), item, { merge: options.mode === 'merge' });
      console.log(`${options.mode === 'replace' ? 'Created' : 'Updated'} document ${id}`);
    }
  }
}

const args = process.argv.slice(2);
const options: Partial<SyncOptions> = {
  dryRun: args.includes('--dry-run'),
  mode: args.includes('--replace') ? 'replace' : 'merge',
  collections: args.filter(arg => !arg.startsWith('--'))
};

syncFirestore(options)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

export async function syncFirestore(customOptions: Partial<SyncOptions> = {}) {
  const options: SyncOptions = { ...defaultOptions, ...customOptions };
  console.log('Starting Firestore sync with options:', options);

  try {
    if (options.collections.includes('services')) {
      await syncCollection('services', services, options);
    }

    if (options.collections.includes('barbers')) {
      await syncCollection('barbers', barbers, options);
    }

    if (options.collections.includes('gallery')) {
      await syncCollection('gallery', gallery, options);
    }

    console.log('\nSync completed successfully!');
  } catch (error) {
    console.error('\nError during sync:', error);
    throw error;
  }
} 
