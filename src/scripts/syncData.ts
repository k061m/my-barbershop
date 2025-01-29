import 'dotenv/config';
import { syncFirestore } from './syncFirestore';
import { syncAuth } from './syncAuth';

async function syncData() {
  try {
    // First sync auth data
    console.log('Starting Auth sync...');
    await syncAuth();
    
    // Then sync Firestore data
    console.log('\nStarting Firestore sync...');
    await syncFirestore();
    
    console.log('\nData sync completed successfully!');
  } catch (error) {
    console.error('Error during data sync:', error);
    process.exit(1);
  }
}

syncData(); 