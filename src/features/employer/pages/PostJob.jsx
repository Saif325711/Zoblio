import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { employerService } from '../services/employerService';
import useAuth from '../../../hooks/useAuth';
import './PostJob.css';

const PostJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null);  // 'publish' | 'draft' | null
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handlePublish = async (formData) => {
        setLoading('publish');
        try {
            await employerService.postJob(formData, user.uid);
            showToast('🎉 Job published successfully! Candidates can now apply.', 'success');
            setTimeout(() => navigate('/dashboard/employer'), 2000);
        } catch (err) {
            console.error(err);
            showToast('Failed to publish job. Please try again.', 'error');
        } finally {
            setLoading(null);
        }
    };

    const handleDraft = async (formData) => {
        setLoading('draft');
        try {
            await employerService.saveDraft(formData, user.uid);
            showToast('Draft saved! You can publish it anytime.', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to save draft. Please try again.', 'error');
        } finally {
            setLoading(null);
        }
    };

    return (
        <main className="postjob">
            {/* Toast notification */}
            {toast && (
                <div className={`postjob__toast postjob__toast--${toast.type}`}>
                    {toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="postjob__hero">
                <div className="container">
                    <div className="postjob__hero-inner">
                        <div>
                            <div className="postjob__breadcrumb">
                                <span onClick={() => navigate('/dashboard/employer')} className="postjob__breadcrumb-link">Dashboard</span>
                                <span className="postjob__breadcrumb-sep">/</span>
                                <span>Post a Job</span>
                            </div>
                            <h1 className="postjob__title">Post a New Job</h1>
                            <p className="postjob__subtitle">
                                Reach thousands of qualified candidates across Assam & Northeast India
                            </p>
                        </div>
                        <div className="postjob__hero-stats">
                            <div className="postjob__stat">
                                <span className="postjob__stat-value">12K+</span>
                                <span className="postjob__stat-label">Active Seekers</span>
                            </div>
                            <div className="postjob__stat">
                                <span className="postjob__stat-value">48hr</span>
                                <span className="postjob__stat-label">Avg. First Apply</span>
                            </div>
                            <div className="postjob__stat">
                                <span className="postjob__stat-value">Free</span>
                                <span className="postjob__stat-label">To Post</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="container">
                <div className="postjob__form-wrapper">
                    <JobForm onPublish={handlePublish} onDraft={handleDraft} loading={loading} />
                </div>
            </div>
        </main>
    );
};

export default PostJob;
