// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig'; // Senin firebaseConfig dosyanı kullanıyoruz

// Firebase bağlantısı
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
