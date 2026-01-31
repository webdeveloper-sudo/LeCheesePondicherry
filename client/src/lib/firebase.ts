// Firebase configuration - Currently disabled as we're using custom backend
// To re-enable Firebase, set the VITE_FIREBASE_* environment variables

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isFirebaseConfigured = missingKeys.length === 0;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Firebase is not configured - using custom backend instead
  console.info(
    "[Firebase] Not configured. Using custom backend API for authentication.",
  );
}

// Export mock objects that won't break imports but indicate Firebase is not available
export { auth, db };
export const isFirebaseEnabled = isFirebaseConfigured;
