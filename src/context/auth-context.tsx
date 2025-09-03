"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from "firebase/auth";
import { app, setupAdmin } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Call setupAdmin once when the app loads.
setupAdmin();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                sessionStorage.setItem('glamora-admin-loggedin', 'true');
            } else {
                sessionStorage.removeItem('glamora-admin-loggedin');
            }
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, [auth]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setLoading(false); // Ensure loading is turned off on failure
            throw error; // Re-throw error to be caught by the login form
        }
        // setLoading will be set to false by onAuthStateChanged
    };

    const logout = async () => {
        setLoading(true);
        await signOut(auth);
        // setLoading will be set to false by onAuthStateChanged
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
