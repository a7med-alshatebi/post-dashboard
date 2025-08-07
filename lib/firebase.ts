import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

// Check for required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value || value === 'your_api_key_here' || value === 'your_project_id' || value === 'your_sender_id' || value === 'your_app_id')
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.warn('⚠️  Firebase configuration incomplete. Missing or invalid environment variables:', missingVars.join(', '));
  console.warn('📋 Please check your .env.local file and follow the setup guide in FIREBASE_SETUP.md');
}

const firebaseConfig = {
  ...requiredEnvVars,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if configuration is valid
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
  if (missingVars.length === 0) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    // Create placeholder objects for development
    console.warn('🔧 Using placeholder Firebase configuration for development');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

// Initialize Firebase Authentication and get a reference to the service
export { auth, googleProvider };
export default app;
