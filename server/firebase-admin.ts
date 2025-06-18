import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only if not already initialized
if (!getApps().length) {
  // For now, we'll use the client config - in production you'd use a service account
  initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

export const adminDb = getFirestore();