import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export const employerService = {
    // Post a new job
    postJob: async (jobData, employerId) => {
        const docRef = await addDoc(collection(db, 'jobs'), {
            ...jobData,
            employerId,
            status: 'published',
            applicationsCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Save job as draft
    saveDraft: async (jobData, employerId) => {
        const docRef = await addDoc(collection(db, 'jobs'), {
            ...jobData,
            employerId,
            status: 'draft',
            applicationsCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Update existing job
    updateJob: async (jobId, jobData) => {
        const docRef = doc(db, 'jobs', jobId);
        await updateDoc(docRef, {
            ...jobData,
            updatedAt: serverTimestamp(),
        });
    },

    // Get employer's posted jobs
    getEmployerJobs: async (employerId) => {
        const q = query(
            collection(db, 'jobs'),
            where('employerId', '==', employerId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
};

export default employerService;
