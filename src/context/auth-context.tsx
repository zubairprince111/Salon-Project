
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

async function setupAdminUser() {
    try {
        // This is a temporary solution for the purpose of this demo.
        // In a real-world application, you would not hardcode credentials like this.
        // You would use a secure method for initial user setup, likely a server-side script or a protected setup UI.
        await createUserWithEmailAndPassword(auth, 'admin@glamora.com', 'prince23103113');
        console.log("Admin user created or already exists.");
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
           // This is expected and fine. It means the admin is already set up.
           console.log("Admin user already exists.");
        } else {
            console.error("Error setting up admin user:", error);
        }
    }
}

let adminSetupPromise: Promise<void> | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!adminSetupPromise) {
            adminSetupPromise = setupAdminUser();
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        
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
