
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This function will run once to ensure the admin user exists.
const setupAdminUser = async () => {
    // This is a simplified check. A more robust solution in a real app might involve a secure server-side check.
    if (localStorage.getItem('adminSetupComplete')) {
        return;
    }
    try {
        // Attempt to create the user. If the user already exists, this will fail gracefully.
        await createUserWithEmailAndPassword(auth, 'admin@glamora.com', 'prince23103113');
        console.log("Admin user created successfully.");
        // Sign out immediately so the user isn't logged in after setup.
        await signOut(auth);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("Admin user already exists.");
        } else {
            console.error("Error during admin user setup:", error);
        }
    } finally {
        // Mark setup as complete to prevent it from running again.
        localStorage.setItem('adminSetupComplete', 'true');
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Run the setup function once when the app loads.
        setupAdminUser();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
       await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };
    
    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
