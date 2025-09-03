"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from "firebase/auth";
import { app } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
            if(user) {
                sessionStorage.setItem('glamora-admin', 'true');
            } else {
                sessionStorage.removeItem('glamora-admin');
            }
        });

        // Check session storage on initial load
        if (sessionStorage.getItem('glamora-admin')) {
             // This is a simplified check. In a real app, you'd verify the token.
             // For now, we trust the session storage. We will re-validate with onAuthStateChanged.
        } else {
            setLoading(false);
        }


        return () => unsubscribe();
    }, [auth]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        sessionStorage.removeItem('glamora-admin');
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
