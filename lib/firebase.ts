import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// TODO: Replace this with your Firebase configuration
// Get this from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
// Then set NEXT_PUBLIC_FIREBASE_CONFIG in .env.local as a JSON string
const getFirebaseConfig = () => {
  const configString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  
  if (!configString) {
    console.warn('NEXT_PUBLIC_FIREBASE_CONFIG is not set. Using placeholder config.');
    // Placeholder config for development - replace with actual Firebase config
    return {
      apiKey: 'YOUR_API_KEY',
      authDomain: 'your-project.firebaseapp.com',
      projectId: 'your-project-id',
      storageBucket: 'your-project.appspot.com',
      messagingSenderId: 'YOUR_SENDER_ID',
      appId: 'YOUR_APP_ID',
    };
  }

  try {
    return JSON.parse(configString);
  } catch (error) {
    console.error('Failed to parse Firebase config:', error);
    throw new Error('Invalid NEXT_PUBLIC_FIREBASE_CONFIG format');
  }
};

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export default app;
