import React, { useState } from 'react';
import BasicInfoSection from './BasicInfoSection';
import JobDetailsSection from './JobDetailsSection';
import ApplicationSettings from './ApplicationSettings';
import JobPreviewModal from './JobPreviewModal';
import Button from '../../../components/ui/Button';
import { validateJobForm } from '../validation/jobSchema';
import './JobForm.css';

const INITIAL_STATE = {
    title: '', category: '', type: '', location: '',
    salaryMin: '', salaryMax: '',
    description: '', skills: [], experienceLevel: '', education: '',
    deadline: '', openings: '', workMode: 'onsite',
};

const JobForm = ({ onPublish, onDraft, loading }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const errs = validateJobForm(formData);
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handlePreview = () => {
        const errs = validateJobForm(formData);
        setErrors(errs);
        if (Object.keys(errs).length === 0) setShowPreview(true);
    };

    const handleDraft = () => onDraft(formData);

    const handlePublish = () => {
        if (validate()) onPublish(formData);
    };

    return (
        <>
            <div className="job-form">
                <BasicInfoSection data={formData} onChange={handleChange} errors={errors} />
                <JobDetailsSection data={formData} onChange={handleChange} errors={errors} />
                <ApplicationSettings data={formData} onChange={handleChange} errors={errors} />

                {/* Sticky Action Bar */}
                <div className="job-form__actions">
                    <div className="job-form__actions-left">
                        <Button variant="outline" onClick={handlePreview} type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.4rem' }}>
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                            Preview Job
                        </Button>
                    </div>
                    <div className="job-form__actions-right">
                        <Button variant="dark" onClick={handleDraft} type="button" disabled={loading}>
                            {loading === 'draft' ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        <Button variant="primary" onClick={handlePublish} type="button" disabled={!!loading}>
                            {loading === 'publish' ? 'Publishing...' : '🚀 Publish Job'}
                        </Button>
                    </div>
                </div>
            </div>

            {showPreview && (
                <JobPreviewModal
                    data={formData}
                    onClose={() => setShowPreview(false)}
                    onPublish={() => { setShowPreview(false); handlePublish(); }}
                />
            )}
        </>
    );
};

export default JobForm;
