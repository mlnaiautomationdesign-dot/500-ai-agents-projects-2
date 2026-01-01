import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase Client Configuration
 * 
 * This file initializes Firebase for client-side use in the browser.
 * 
 * TODO: Configuration Steps
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Click "Add app" and select "Web" (</> icon)
 * 3. Register your app and copy the Firebase configuration object
 * 4. Add the configuration values to .env.local:
 *    - NEXT_PUBLIC_FIREBASE_API_KEY
 *    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *    - NEXT_PUBLIC_FIREBASE_APP_ID
 * 
 * 5. Enable Authentication:
 *    - Go to Authentication > Sign-in method
 *    - Enable "Email/Password"
 *    - Enable "Google" (recommended)
 *    - Configure authorized domains
 * 
 * 6. (Optional) Set up Firestore for user data:
 *    - Go to Firestore Database
 *    - Create database in production or test mode
 *    - Configure security rules
 * 
 * SECURITY NOTES:
 * - Environment variables starting with NEXT_PUBLIC_ are exposed to the browser
 * - This is safe for Firebase client config (designed to be public)
 * - Never expose server-side secrets (like Firebase Admin private keys)
 */

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isConfigured = Object.values(firebaseConfig).every(
  (value) => value && !value.includes('your_')
);

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (isConfigured) {
  // Prevent multiple initializations
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn(
    'Firebase is not configured. Please set Firebase environment variables in .env.local'
  );
}

export { app, auth, db, isConfigured };

/**
 * Example usage in components:
 * 
 * import { auth } from '@/lib/firebase';
 * import { signInWithEmailAndPassword } from 'firebase/auth';
 * 
 * const login = async (email: string, password: string) => {
 *   if (!auth) {
 *     throw new Error('Firebase not configured');
 *   }
 *   const userCredential = await signInWithEmailAndPassword(auth, email, password);
 *   return userCredential.user;
 * };
 */
