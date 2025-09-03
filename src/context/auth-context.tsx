
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, setupAdmin } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';


interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password:string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Call setupAdmin once when the app loads to ensure the admin user exists.
// This is a self-invoking async function.
(async () => {
  await setupAdmin();
})();


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
       setLoading(true);
       try {
           await signInWithEmailAndPassword(auth, email, password);
           // onAuthStateChanged will handle the user state update
       } catch (error) {
           console.error("Login failed:", error);
           setLoading(false);
           throw error; // Re-throw to be caught in the component
       }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        router.push('/admin/login');
    };
    
    // This effect handles route protection
    useEffect(() => {
        if (!loading && !user && pathname === '/admin/dashboard') {
            router.push('/admin/login');
        }
    }, [user, loading, pathname, router]);

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
