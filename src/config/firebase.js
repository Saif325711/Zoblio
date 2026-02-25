import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsbI7Nr0BEAswQkPh0Y0lUxFcdFP5JMIo",
    authDomain: "zoblio-74750.firebaseapp.com",
    projectId: "zoblio-74750",
    storageBucket: "zoblio-74750.firebasestorage.app",
    messagingSenderId: "414210289295",
    appId: "1:414210289295:web:9ecd90277933c11bcb4afa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
