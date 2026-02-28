import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const jobService = {
    // Get all jobs
    getAll: async (filters = {}) => {
        let q = collection(db, 'jobs');
        const constraints = [];

        if (filters.industry) {
            constraints.push(where('industry', '==', filters.industry));
        }
        if (filters.type) {
            constraints.push(where('type', '==', filters.type));
        }

        q = query(q, ...constraints);
        const snapshot = await getDocs(q);
        const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort client-side: newest first
        jobs.sort((a, b) => {
            const ta = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
            const tb = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
            return tb - ta;
        });
        return jobs;
    },

    // Get job by ID
    getById: async (id) => {
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    },

    // Create new job
    create: async (data) => {
        const docRef = await addDoc(collection(db, 'jobs'), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Update job
    update: async (id, data) => {
        const docRef = doc(db, 'jobs', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    // Delete job
    delete: async (id) => {
        await deleteDoc(doc(db, 'jobs', id));
    },

    // Apply to job
    apply: async (jobId, applicationData) => {
        const docRef = await addDoc(collection(db, 'applications'), {
            jobId,
            ...applicationData,
            appliedAt: serverTimestamp(),
            status: 'pending',
        });
        return docRef.id;
    },
};

export default jobService;
