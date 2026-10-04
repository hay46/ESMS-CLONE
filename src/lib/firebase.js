import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || undefined,
};

/**
 * The app runs without any backend: when the VITE_FIREBASE_* variables are
 * missing we fall back to a localStorage backed mock so the portal is fully
 * explorable offline (see src/lib/backend/mockBackend.js).
 */
export const isCloudEnabled = Boolean(config.apiKey && config.projectId && config.appId);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isCloudEnabled) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

export { app, auth, db, googleProvider };