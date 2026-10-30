import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDocFromServer,
  setLogLevel,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Configure log level to error to avoid noisy internal connection retry warnings
setLogLevel('error');

// CRITICAL: Initialize Firestore with long-polling to prevent proxy/streaming dropouts in iframe environments
let firestoreDb;
const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId.trim() !== ''
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

try {
  firestoreDb = dbId
    ? initializeFirestore(app, { experimentalForceLongPolling: true }, dbId)
    : initializeFirestore(app, { experimentalForceLongPolling: true });
} catch {
  // If Firestore has already been initialized, retrieve the existing instance
  firestoreDb = dbId ? getFirestore(app, dbId) : getFirestore(app);
}

export const db = firestoreDb;
export const auth = getAuth(app);
export const storage = getStorage(app);
export const ADMIN_AUTH_UID = (firebaseConfig as any).adminUid || 'uVBdzOT6EDcHgE9OxeCz9EWAeEB2';
export const CLOUDINARY_CLOUD_NAME = (firebaseConfig as any).cloudinaryCloudName || 'kxbonqcr';

// Connection check with graceful offline fallback as mandated by Firebase specification
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error.message.includes('the client is offline') ||
        error.message.includes('unavailable') ||
        (error as any).code === 'unavailable')
    ) {
      console.warn('Firebase Firestore: operating with local cache while establishing connection.');
    }
  }
}

// Run connection validation
if (typeof window !== 'undefined') {
  testConnection();
}

export default app;
