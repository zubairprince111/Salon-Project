
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBz2qm42GzlCSmGxBorpS9mNF8FgvW5fmc",
    authDomain: "glamora-express.firebaseapp.com",
    projectId: "glamora-express",
    storageBucket: "glamora-express.firebasestorage.app",
    messagingSenderId: "875576601697",
    appId: "1:875576601697:web:d4c7032ebf8ad7c49ece20"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use a function to initialize auth to ensure it's only done once and on the client.
const getClientAuth = () => {
    if (typeof window !== 'undefined') {
        return initializeAuth(app, {
            persistence: browserLocalPersistence
        });
    }
    return getAuth(app);
}

const auth = getClientAuth();
const db = getFirestore(app);

export { app, auth, db };
