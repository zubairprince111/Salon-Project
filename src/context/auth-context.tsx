
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, Auth } from "firebase/auth";
import { auth, setupAdmin } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A self-invoking function to ensure admin setup is triggered only once.
const setupPromise = setupAdmin();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We wait for the admin setup to complete before we start listening to auth state changes.
        // This prevents race conditions on initial load.
        setupPromise.then(() => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });
            
            // Cleanup subscription on unmount
            return () => unsubscribe();
        }).catch(err => {
            console.error("Error during admin setup, auth might not work correctly", err);
            setLoading(false); // Stop loading even if setup fails
        });
    }, []);

    const login = async (email: string, password: string) => {
       await signInWithEmailAndPassword(auth, email, password);
       // onAuthStateChanged will handle setting the user and loading state
    };

    const logout = async () => {
        await signOut(auth);
        // onAuthStateChanged will handle setting the user to null
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
