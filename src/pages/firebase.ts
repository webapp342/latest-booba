// firebase.ts
import { getFirestore } from 'firebase/firestore';
import { app } from './firebaseConfig';

// Use the existing Firebase app instance
export const db = getFirestore(app);
