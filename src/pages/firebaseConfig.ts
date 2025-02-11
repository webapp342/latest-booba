// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug logging
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Not Set',
  authDomain: firebaseConfig.authDomain ? 'Set' : 'Not Set',
  projectId: firebaseConfig.projectId ? 'Set' : 'Not Set',
  storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Not Set',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Not Set',
  appId: firebaseConfig.appId ? 'Set' : 'Not Set',
  measurementId: firebaseConfig.measurementId ? 'Set' : 'Not Set'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase Initialized:', !!app);
console.log('Firestore Initialized:', !!db);

export { db, firebaseConfig, app };
