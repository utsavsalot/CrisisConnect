import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
console.log("🔥 FIREBASE ENV CHECK");
console.log("USE_FIREBASE:", import.meta.env.VITE_USE_FIREBASE);
console.log("PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_USE_FIREBASE === 'true'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.info('🔥 Firebase initialized successfully for CrisisConnect.');
  } catch (error) {
    console.warn('Firebase initialization error, switching to Mock Mode:', error);
  }
} else {
  console.info('⚡ Running in MOCK MODE: Complete local reactive emergency network active.');
}

export { app, auth, db };
