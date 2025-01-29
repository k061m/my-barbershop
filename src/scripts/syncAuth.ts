import { initializeApp, cert, getApps, deleteApp, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

async function syncAuth() {
  try {
    // Clean up any existing apps
    console.log('Cleaning up existing Firebase apps...');
    getApps().forEach((app: App) => {
      deleteApp(app);
    });

    console.log('Initializing Firebase Admin with credentials...');
    
    // Initialize production app with credentials
    const prodApp = initializeApp({
      credential: cert({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.VITE_FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    }, 'production');

    // Get production auth instance
    console.log('Getting production Auth instance...');
    const prodAuth = getAuth(prodApp);
    
    console.log('Fetching users from production...');
    try {
      // List all users from production
      const listUsersResult = await prodAuth.listUsers();
      const users = listUsersResult.users;
      
      console.log(`Found ${users.length} users in production`);
      if (users.length > 0) {
        console.log('Sample user data:', {
          uid: users[0].uid,
          email: users[0].email,
          displayName: users[0].displayName
        });
      }

      // Initialize emulator app
      console.log('Initializing emulator app...');
      const emulatorApp = initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      }, 'emulator');

      // Set up emulator connection
      process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
      
      // Get emulator auth instance
      const emulatorAuth = getAuth(emulatorApp);

      // Create users in emulator
      console.log('Starting user creation in emulator...');
      for (const user of users) {
        try {
          await emulatorAuth.createUser({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            photoURL: user.photoURL,
            disabled: user.disabled,
            password: 'tempPassword123!' // Temporary password for emulator
          });
          console.log(`Created user ${user.uid} in emulator`);
        } catch (error) {
          console.error(`Error creating user ${user.uid}:`, error);
        }
      }

      console.log(`Successfully synced ${users.length} users to emulator`);
    } catch (listError) {
      console.error('Error listing users from production:', listError);
      throw listError;
    }

    // Clean up
    console.log('Cleaning up Firebase apps...');
    await deleteApp(prodApp);
    console.log('Auth sync completed successfully!');
  } catch (error) {
    console.error('Error syncing Auth:', error);
    throw error;
  }
}

export { syncAuth }; 
