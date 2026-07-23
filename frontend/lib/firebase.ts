import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigValid = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim().length > 0
);

if (typeof window !== 'undefined' && !isFirebaseConfigValid) {
  console.warn(
    'Firebase is not initialized because required environment variables are missing or invalid. Please set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, and NEXT_PUBLIC_FIREBASE_APP_ID.'
  );
}

const createFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined' || !isFirebaseConfigValid) {
    return null;
  }

  return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};

const app = createFirebaseApp();
export const auth: Auth | null = app ? getAuth(app) : null;
export const googleProvider = typeof window !== 'undefined' && isFirebaseConfigValid ? new GoogleAuthProvider() : null;
