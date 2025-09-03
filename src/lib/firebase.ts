// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

// One-time setup: Create admin user (run this once)
const setupAdmin = async () => {
    try {
        const auth = getAuth(app);
        // IMPORTANT: Change this password in your Firebase Console after creation
        await createUserWithEmailAndPassword(auth, 'admin@glamora.com', 'adminpassword');
        console.log('Admin user created successfully. Please change the password in the Firebase Authentication console.');
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            // This is expected if the user already exists, so we can ignore it.
            console.log('Admin user already exists.');
        } else {
            console.error('Error creating admin user:', error);
        }
    }
}


export { app, db, setupAdmin };
