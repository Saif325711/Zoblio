import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
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
            where('employerId', '==', employerId)
        );
        const snapshot = await getDocs(q);
        const jobs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort client-side: newest first
        jobs.sort((a, b) => {
            const ta = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
            const tb = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
            return tb - ta;
        });
        return jobs;
    },
};

export default employerService;
