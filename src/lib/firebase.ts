
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "glamora-express",
  "appId": "1:875576601697:web:d4c7032ebf8ad7c49ece20",
  "storageBucket": "glamora-express.firebasestorage.app",
  "apiKey": "AIzaSyBz2qm42GzlCSmGxBorpS9mNF8FgvW5fmc",
  "authDomain": "glamora-express.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "875576601697"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


export { app, db, auth };
