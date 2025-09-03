
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

// Function to create the admin user if it doesn't exist
const setupAdminUser = async () => {
    try {
        // We try to sign in first to see if the user exists.
        await signInWithEmailAndPassword(auth, 'admin@glamora.com', 'prince23103113');
    } catch (error: any) {
        // If the user does not exist (auth/user-not-found), create it.
        // Other errors will be caught here too but we primarily care about creating the user.
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                await createUserWithEmailAndPassword(auth, 'admin@glamora.com', 'prince23103113');
                console.log("Admin user created successfully.");
                await signOut(auth); // Sign out after creation to allow for clean login.
            } catch (creationError) {
                console.error("Error creating admin user:", creationError);
            }
        }
    }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setupAdminUser(); // Ensure admin user exists on initial load
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
