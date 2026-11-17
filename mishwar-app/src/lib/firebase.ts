/**
 * Firebase Web SDK Initialization (Cloud Firestore, Firebase Auth & Google Analytics)
 * Connected to project: mishwar-sa
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  type Firestore,
} from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDc1n0X4iKdUcExeW48_yfxR9baue2JLaE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mishwar-sa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mishwar-sa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mishwar-sa.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "714003086912",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:714003086912:web:7679e64805fd91e1ce69a5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YYX4SPMBF1",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let firebaseAnalytics: Analytics | null = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp);
  if (typeof window !== "undefined") {
    firebaseAuth = getAuth(firebaseApp);
    isAnalyticsSupported()
      .then((yes) => {
        if (yes && firebaseApp) {
          firebaseAnalytics = getAnalytics(firebaseApp);
        }
      })
      .catch(() => null);
  }
}

export {
  firebaseApp,
  firestoreDb,
  firebaseAuth,
  firebaseAnalytics,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
};
