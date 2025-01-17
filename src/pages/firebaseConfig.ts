// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyDeXQ-rJq0APNjkhlsMkIqkvhUIPqHKP2k",

  authDomain: "boobablip.firebaseapp.com",

  projectId: "boobablip",

  storageBucket: "boobablip.firebasestorage.app",

  messagingSenderId: "530338294039",

  appId: "1:530338294039:web:acce07f216cd76f519af52",

  measurementId: "G-Y1XNC6GPD7"

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, firebaseConfig, app };
