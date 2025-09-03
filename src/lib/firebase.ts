// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
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
let adminSetupPromise: Promise<void> | null = null;
const setupAdmin = async () => {
    // Avoid re-running setup
    if (adminSetupPromise) {
        return adminSetupPromise;
    }

    adminSetupPromise = (async () => {
        try {
            // Use a temporary auth instance for setup to avoid conflicts
            const tempAuth = getAuth(app);
            // Sign out any lingering user to ensure clean setup state
            await tempAuth.signOut();
            
            // Try to sign in to check if admin exists
            await signInWithEmailAndPassword(tempAuth, 'admin@glamora.com', 'adminpassword');
            console.log('Admin user already exists.');
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                // If admin does not exist, create it
                try {
                    await createUserWithEmailAndPassword(auth, 'admin@glamora.com', 'adminpassword');
                    console.log('Admin user created successfully.');
                } catch (createError: any) {
                    if (createError.code === 'auth/email-already-in-use') {
                        console.log('Admin user was created by another process.');
                    } else {
                        console.error('Error creating admin user:', createError);
                    }
                }
            } else if (error.code === 'auth/wrong-password') {
                console.warn('Admin user exists but with a different password. Please check Firebase console.');
            } else {
                 // Ignore other errors like network issues during this check
                console.log("Could not verify admin user, proceeding.", error.code);
            }
        }
    })();
    return adminSetupPromise;
};


export { app, db, auth, setupAdmin };