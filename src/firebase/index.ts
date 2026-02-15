'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { useUser } from './auth/use-user';

function initializeFirebase() {
  let firebaseApp: FirebaseApp;
  
  if (getApps().length === 0) {
    if (!firebaseConfig.apiKey) {
      // This is a developer-facing error, so a console error is appropriate.
      console.error("Firebase apiKey is missing. Please check your Firebase configuration in src/firebase/config.ts");
    }
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}

export { initializeFirebase, useUser };
export * from './provider';
