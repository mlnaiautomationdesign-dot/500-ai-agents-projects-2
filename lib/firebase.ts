// Firebase client configuration
// TODO: Add your Firebase project configuration to .env.local

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Firebase configuration
// TODO: Replace with your Firebase project config from Firebase Console
// Go to: Project Settings > General > Your apps > SDK setup and configuration
// Copy the config object and paste it into .env.local as:
// NEXT_PUBLIC_FIREBASE_CONFIG='{"apiKey":"...","authDomain":"...","projectId":"...",...}'

let firebaseConfig;

try {
  const configString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (configString) {
    firebaseConfig = JSON.parse(configString);
  } else {
    // Placeholder config for development
    firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef123456",
    };
    console.warn(
      "⚠️ Firebase config not found in environment variables. Using placeholder config."
    );
    console.warn(
      "Please add NEXT_PUBLIC_FIREBASE_CONFIG to your .env.local file."
    );
  }
} catch (error) {
  console.error("Error parsing Firebase config:", error);
  firebaseConfig = {};
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (typeof window !== "undefined") {
  // Only initialize on client side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
}

export { auth };

// Instructions for setting up Firebase:
// 
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Enable Authentication in Firebase Console (Authentication > Sign-in method)
// 3. Enable Email/Password authentication
// 4. Get your Firebase config from Project Settings
// 5. Add the config to .env.local:
//
//    NEXT_PUBLIC_FIREBASE_CONFIG='{"apiKey":"AIza...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}'
//
// 6. Optional: Set up Firebase Admin SDK for server-side operations:
//    - Generate a service account key from Firebase Console
//    - Download the JSON file
//    - Add to .env.local: FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
//
// For more info: https://firebase.google.com/docs/web/setup
