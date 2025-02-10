// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyBQwjgfS2FZWZJtGJPFAJNS58YcAdUVDeE",

  authDomain: "telegram-cc828.firebaseapp.com",

  projectId: "telegram-cc828",

  storageBucket: "telegram-cc828.appspot.com",

  messagingSenderId: "541310609374",

  appId: "1:541310609374:web:5c046692c1ee59ba981f4f",

  measurementId: "G-7XGPVD7NY4"

};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, firebaseConfig, app };
