import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
    // Login
    login: async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    },

    // Register
    register: async (name, email, password, role = 'jobseeker') => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });

        await setDoc(doc(db, 'users', result.user.uid), {
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
        });

        return result.user;
    },

    // Google Sign In
    googleSignIn: async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                role: 'jobseeker',
                createdAt: new Date().toISOString(),
            });
        }

        return result.user;
    },

    // Logout
    logout: async () => {
        await signOut(auth);
    },

    // Reset Password
    resetPassword: async (email) => {
        await sendPasswordResetEmail(auth, email);
    },

    // Get user profile from Firestore
    getProfile: async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
    },
};

export default authService;
