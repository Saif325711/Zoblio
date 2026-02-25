import React, { createContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                let userData = {};
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    userData = userDoc.exists() ? userDoc.data() : {};
                } catch (err) {
                    console.warn('Could not fetch user profile from Firestore:', err.message);
                }

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    role: userData.role || 'jobseeker',
                    ...userData,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Login with email and password
    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    // Register new user
    const register = async (name, email, password, role = 'jobseeker') => {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name
        await updateProfile(result.user, { displayName: name });

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
        });

        return result.user;
    };

    // Logout
    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
