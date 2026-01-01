import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

/*
 * Firebase Client SDK Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create a Firebase project: https://console.firebase.google.com/
 * 
 * 2. Add a Web app to your Firebase project:
 *    - Click "Add app" > Web (</>) icon
 *    - Register your app
 *    - Copy the firebaseConfig object
 * 
 * 3. Enable Authentication:
 *    - Go to Authentication > Sign-in method
 *    - Enable Email/Password provider
 *    - Enable Google provider (optional)
 * 
 * 4. Add Firebase config to .env.local:
 *    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
 *    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
 *    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
 *    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
 *    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
 *    NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
 * 
 * 5. Update firebaseConfig below with your values OR use environment variables
 * 
 * TODO: Add your Firebase configuration
 * TODO: Configure authorized domains in Firebase Console
 */

// Firebase configuration
// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIza-PLACEHOLDER-KEY',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'your-app.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'your-app.appspot.com',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:123456789:web:abc123def456',
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined') {
  // Only initialize on client side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
}

export { auth };
export default app;
