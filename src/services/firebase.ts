import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Firebase application instance initialized with environment-specific configuration.
 */
const app: FirebaseApp | null = typeof window !== 'undefined' && firebaseConfig.apiKey ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)) : null;

/**
 * Firebase Authentication service instance.
 */
const auth: Auth | null = app ? getAuth(app) : null;

/**
 * Firestore Database service instance.
 */
const db: Firestore | null = app ? getFirestore(app) : null;

export { app, auth, db };
