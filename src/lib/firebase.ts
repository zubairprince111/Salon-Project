
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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

// One-time setup: Create admin user
const setupAdmin = async () => {
    try {
        // Try to sign in to check if admin exists
        // Use a separate auth instance for this check to avoid interfering with the main auth state
        const tempAuth = getAuth(initializeApp(firebaseConfig, 'admin-setup-instance'));
        await signInWithEmailAndPassword(tempAuth, 'admin@glamora.com', 'adminpassword');
        console.log('Admin user already exists.');
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            // If admin does not exist, create it using the main auth instance
            try {
                await createUserWithEmailAndPassword(auth, 'admin@glamora.com', 'adminpassword');
                console.log('Admin user created successfully.');
            } catch (createError: any) {
                // This might happen if another process created the user in the meantime
                if (createError.code === 'auth/email-already-in-use') {
                    console.log('Admin user was created by another process.');
                } else {
                    console.error('Error creating admin user:', createError);
                }
            }
        } else {
             // Other errors are logged but don't stop the app
            console.warn("Could not verify admin user, proceeding. Error:", error.message);
        }
    }
};

export { app, db, auth, setupAdmin };
