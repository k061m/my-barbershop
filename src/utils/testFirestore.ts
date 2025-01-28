import { collection, addDoc, getDocs, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';

export async function testFirestoreConnection() {
  const auth = getAuth();
  const user = auth.currentUser;
  
  console.log('Testing Firestore connection...');
  console.log('Current auth state:', {
    isAuthenticated: !!user,
    userId: user?.uid,
    email: user?.email
  });
  
  if (!user) {
    throw new Error('No user is currently logged in');
  }
  
  try {
    // First, ensure user document exists
    console.log('Ensuring user document exists...');
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('Creating user document...');
      await setDoc(userRef, {
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('User document created successfully');
    } else {
      console.log('User document exists:', userDoc.data());
    }
    
    // Test reading from barbers collection
    console.log('Testing read from barbers collection...');
    const barbersRef = collection(db, 'barbers');
    const barbersSnapshot = await getDocs(barbersRef);
    console.log('Successfully read barbers:', barbersSnapshot.size);
    
    // Test writing to a test collection
    console.log('Testing write to test collection...');
    const testRef = collection(db, 'test');
    const testDoc = await addDoc(testRef, {
      message: 'Test document',
      createdAt: serverTimestamp(),
      userId: user.uid
    });
    console.log('Successfully wrote test document:', testDoc.id);
    
    return true;
  } catch (error) {
    console.error('Error testing Firestore:', error);
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