import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import jobService from '../services/jobService';
import Button from '../components/ui/Button';
import './JobDetails.css';

/* Helper: format salary */
const formatSalary = (job) => {
    if (job.salary && typeof job.salary === 'string') return job.salary;
    if (job.salaryMin && job.salaryMax) {
        const fmt = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);
        return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
    }
    return 'Competitive';
};

/* Helper: relative time */
const timeAgo = (ts) => {
    if (!ts) return '';
    const now = Date.now();
    const date = ts?.toDate ? ts.toDate().getTime() : new Date(ts).getTime();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 604800)} weeks ago`;
};

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const resumeRef = useRef(null);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applied, setApplied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [toast, setToast] = useState('');

    /* Application form state */
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        currentRole: '',
        experience: '',
        education: '',
        portfolio: '',
        coverLetter: '',
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    /* Fetch job details */
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await jobService.getById(id);
                if (data) {
                    setJob(data);
                } else {
                    setError('Job not found');
                }
            } catch (err) {
                console.error('Error fetching job:', err);
                setError('Could not load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    /* Check if already applied / saved */
    useEffect(() => {
        if (!user || !id) return;
        const checkStatus = async () => {
            try {
                const appRef = doc(db, 'applications', `${user.uid}_${id}`);
                const appSnap = await getDoc(appRef);
                if (appSnap.exists()) setApplied(true);

                const saveRef = doc(db, 'savedJobs', `${user.uid}_${id}`);
                const saveSnap = await getDoc(saveRef);
                if (saveSnap.exists()) setSaved(true);
            } catch (err) { /* silent */ }
        };
        checkStatus();
    }, [user, id]);

    /* Pre-fill form with user data */
    useEffect(() => {
        if (user && showApplyForm) {
            setFormData((prev) => ({
                ...prev,
                fullName: prev.fullName || user.displayName || user.name || '',
                email: prev.email || user.email || '',
            }));
        }
    }, [user, showApplyForm]);

    /* Show toast */
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 4000);
    };

    /* Open Application Form */
    const handleApplyClick = () => {
        if (!user) {
            navigate('/login', { state: { from: `/jobs/${id}` } });
            return;
        }
        if (applied) return;
        setShowApplyForm(true);
    };

    /* Handle form input */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    /* Handle resume file */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.type)) {
            setFormErrors((prev) => ({ ...prev, resume: 'Only PDF, DOC, DOCX files allowed' }));
            return;
        }
        if (file.size > maxSize) {
            setFormErrors((prev) => ({ ...prev, resume: 'File size must be under 5MB' }));
            return;
        }
        setResumeFile(file);
        setFormErrors((prev) => ({ ...prev, resume: '' }));
    };

    /* Validate form */
    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        if (!resumeFile) errors.resume = 'Resume/CV is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /* Submit Application */
    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            // 1. Upload resume to Firebase Storage
            let resumeURL = '';
            if (resumeFile) {
                const ts = Date.now();
                const storageRef = ref(storage, `resumes/${user.uid}/${ts}_${resumeFile.name}`);
                await uploadBytes(storageRef, resumeFile);
                resumeURL = await getDownloadURL(storageRef);
            }

            // 2. Save application to Firestore
            const appRef = doc(db, 'applications', `${user.uid}_${id}`);
            await setDoc(appRef, {
                userId: user.uid,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                currentRole: formData.currentRole.trim(),
                experience: formData.experience.trim(),
                education: formData.education.trim(),
                portfolio: formData.portfolio.trim(),
                coverLetter: formData.coverLetter.trim(),
                resumeURL,
                resumeFileName: resumeFile?.name || '',
                jobId: id,
                jobTitle: job?.title || '',
                company: job?.company || '',
                status: 'pending',
                appliedAt: serverTimestamp(),
            });

            // 3. Notify the employer
            if (job?.employerId) {
                try {
                    await addDoc(collection(db, 'notifications'), {
                        recipientId: job.employerId,
                        type: 'new_application',
                        jobId: id,
                        jobTitle: job?.title || '',
                        applicantName: formData.fullName.trim(),
                        applicantEmail: formData.email.trim(),
                        applicantId: user.uid,
                        read: false,
                        createdAt: serverTimestamp(),
                    });
                } catch (notifErr) {
                    console.error('Notification error (non-blocking):', notifErr);
                }
            }

            setApplied(true);
            setShowApplyForm(false);
            showToast('✅ Application submitted successfully!');
        } catch (err) {
            console.error('Submit error:', err);
            showToast('❌ Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    /* Save / Unsave Job */
    const handleSave = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/jobs/${id}` } });
            return;
        }
        setSaveLoading(true);
        try {
            const saveRef = doc(db, 'savedJobs', `${user.uid}_${id}`);
            if (saved) {
                await deleteDoc(saveRef);
                setSaved(false);
                showToast('Removed from saved jobs');
            } else {
                await setDoc(saveRef, {
                    userId: user.uid,
                    jobId: id,
                    jobTitle: job?.title || '',
                    company: job?.company || '',
                    location: job?.location || '',
                    type: job?.type || '',
                    savedAt: serverTimestamp(),
                });
                setSaved(true);
                showToast('⭐ Job saved!');
            }
        } catch (err) {
            console.error('Save error:', err);
            showToast('❌ Failed. Try again.');
        } finally {
            setSaveLoading(false);
        }
    };

    /* Loading state */
    if (loading) {
        return (
            <main className="job-details section">
                <div className="container">
                    <div className="job-details__loading">Loading job details...</div>
                </div>
            </main>
        );
    }

    /* Error state */
    if (error || !job) {
        return (
            <main className="job-details section">
                <div className="container">
                    <Link to="/jobs" className="job-details__back">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back to Jobs
                    </Link>
                    <div className="job-details__error">
                        <span className="job-details__error-icon">😕</span>
                        <h2>{error || 'Job not found'}</h2>
                        <p>This job listing may have been removed or the link is invalid.</p>
                        <Link to="/jobs"><Button variant="primary" size="md">Browse All Jobs</Button></Link>
                    </div>
                </div>
            </main>
        );
    }

    const skills = job.skills || job.tags || [];
    const postedTime = job.posted || timeAgo(job.createdAt);

    return (
        <main className="job-details section">
            <div className="container">
                {/* Toast */}
                {toast && <div className="job-details__toast">{toast}</div>}

                <Link to="/jobs" className="job-details__back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back to Jobs
                </Link>

                <div className="job-details__grid">
                    {/* ── Main Content ── */}
                    <div className="job-details__main glass-card">
                        <div className="job-details__header">
                            <div className="job-details__avatar">{(job.company || '?')[0]}</div>
                            <div>
                                <h1 className="job-details__title">{job.title}</h1>
                                <p className="job-details__company">{job.company}</p>
                            </div>
                        </div>

                        <div className="job-details__tags">
                            {job.type && <span className="job-details__tag">{job.type}</span>}
                            {job.workMode && <span className="job-details__tag">{job.workMode}</span>}
                            {job.industry && <span className="job-details__tag">{job.industry}</span>}
                        </div>

                        {job.description && (
                            <div className="job-details__section">
                                <h3>Job Description</h3>
                                <div className="job-details__desc-content">
                                    {job.description.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {job.requirements && (
                            <div className="job-details__section">
                                <h3>Requirements</h3>
                                <div className="job-details__desc-content">
                                    {job.requirements.split('\n').map((line, i) => (
                                        line.trim() ? <li key={i}>{line.replace(/^[-•*]\s*/, '')}</li> : null
                                    ))}
                                </div>
                            </div>
                        )}

                        {skills.length > 0 && (
                            <div className="job-details__section">
                                <h3>Required Skills</h3>
                                <div className="job-details__skills">
                                    {skills.map((s, i) => (
                                        <span key={i} className="job-details__skill-tag">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {job.benefits && (
                            <div className="job-details__section">
                                <h3>Benefits</h3>
                                <div className="job-details__desc-content">
                                    {job.benefits.split('\n').map((line, i) => (
                                        line.trim() ? <li key={i}>{line.replace(/^[-•*]\s*/, '')}</li> : null
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar ── */}
                    <div className="job-details__sidebar">
                        <div className="job-details__apply-card glass-card">
                            <h3 className="job-details__apply-title">Apply for this position</h3>
                            <p className="job-details__salary">{formatSalary(job)} / year</p>

                            <div className="job-details__info">
                                <div className="job-details__info-item">
                                    <span className="job-details__info-label">Location</span>
                                    <span className="job-details__info-value">{job.location || 'Not specified'}</span>
                                </div>
                                <div className="job-details__info-item">
                                    <span className="job-details__info-label">Job Type</span>
                                    <span className="job-details__info-value">{job.type || 'Full-Time'}</span>
                                </div>
                                {job.workMode && (
                                    <div className="job-details__info-item">
                                        <span className="job-details__info-label">Work Mode</span>
                                        <span className="job-details__info-value">{job.workMode}</span>
                                    </div>
                                )}
                                {job.experience && (
                                    <div className="job-details__info-item">
                                        <span className="job-details__info-label">Experience</span>
                                        <span className="job-details__info-value">{job.experience}</span>
                                    </div>
                                )}
                                <div className="job-details__info-item">
                                    <span className="job-details__info-label">Posted</span>
                                    <span className="job-details__info-value">{postedTime}</span>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <Button
                                variant="primary"
                                size="lg"
                                className={`job-details__apply-btn ${applied ? 'job-details__apply-btn--applied' : ''}`}
                                onClick={handleApplyClick}
                                disabled={applied}
                            >
                                {applied ? '✓ Applied' : 'Apply Now'}
                            </Button>

                            {/* Save Button */}
                            <Button
                                variant="outline"
                                size="md"
                                className={`job-details__save-btn ${saved ? 'job-details__save-btn--saved' : ''}`}
                                onClick={handleSave}
                                disabled={saveLoading}
                            >
                                {saveLoading ? 'Saving...' : saved ? '⭐ Saved' : '☆ Save Job'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ═══════════ APPLICATION FORM MODAL ═══════════ */}
                {showApplyForm && (
                    <div className="apply-modal-overlay" onClick={() => !submitting && setShowApplyForm(false)}>
                        <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
                            {/* Header */}
                            <div className="apply-modal__header">
                                <div>
                                    <h2 className="apply-modal__title">Apply for {job.title}</h2>
                                    <p className="apply-modal__subtitle">{job.company || 'Company'} • {job.location || 'Remote'}</p>
                                </div>
                                <button className="apply-modal__close" onClick={() => !submitting && setShowApplyForm(false)}>✕</button>
                            </div>

                            {/* Form */}
                            <form className="apply-modal__form" onSubmit={handleSubmitApplication}>
                                {/* Personal Info */}
                                <div className="apply-modal__section">
                                    <h4 className="apply-modal__section-title">👤 Personal Information</h4>
                                    <div className="apply-modal__row">
                                        <div className="apply-modal__field">
                                            <label>Full Name <span className="required">*</span></label>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
                                            {formErrors.fullName && <span className="apply-modal__error">{formErrors.fullName}</span>}
                                        </div>
                                        <div className="apply-modal__field">
                                            <label>Email Address <span className="required">*</span></label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                                            {formErrors.email && <span className="apply-modal__error">{formErrors.email}</span>}
                                        </div>
                                    </div>
                                    <div className="apply-modal__row">
                                        <div className="apply-modal__field">
                                            <label>Phone Number <span className="required">*</span></label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                                            {formErrors.phone && <span className="apply-modal__error">{formErrors.phone}</span>}
                                        </div>
                                        <div className="apply-modal__field">
                                            <label>Current Role / Designation</label>
                                            <input type="text" name="currentRole" value={formData.currentRole} onChange={handleChange} placeholder="e.g. Software Developer" />
                                        </div>
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="apply-modal__section">
                                    <h4 className="apply-modal__section-title">🎓 Qualifications</h4>
                                    <div className="apply-modal__row">
                                        <div className="apply-modal__field">
                                            <label>Years of Experience</label>
                                            <select name="experience" value={formData.experience} onChange={handleChange}>
                                                <option value="">Select experience</option>
                                                <option value="fresher">Fresher (0-1 year)</option>
                                                <option value="1-3">1-3 years</option>
                                                <option value="3-5">3-5 years</option>
                                                <option value="5-10">5-10 years</option>
                                                <option value="10+">10+ years</option>
                                            </select>
                                        </div>
                                        <div className="apply-modal__field">
                                            <label>Education</label>
                                            <select name="education" value={formData.education} onChange={handleChange}>
                                                <option value="">Select education</option>
                                                <option value="high-school">High School</option>
                                                <option value="diploma">Diploma</option>
                                                <option value="bachelors">Bachelor's Degree</option>
                                                <option value="masters">Master's Degree</option>
                                                <option value="phd">Ph.D.</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="apply-modal__field">
                                        <label>Portfolio / LinkedIn URL</label>
                                        <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" />
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div className="apply-modal__section">
                                    <h4 className="apply-modal__section-title">📄 Resume / CV <span className="required">*</span></h4>
                                    <div
                                        className={`apply-modal__upload ${resumeFile ? 'apply-modal__upload--has-file' : ''} ${formErrors.resume ? 'apply-modal__upload--error' : ''}`}
                                        onClick={() => resumeRef.current?.click()}
                                    >
                                        <input
                                            ref={resumeRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        {resumeFile ? (
                                            <div className="apply-modal__file-info">
                                                <span className="apply-modal__file-icon">📎</span>
                                                <div>
                                                    <p className="apply-modal__file-name">{resumeFile.name}</p>
                                                    <p className="apply-modal__file-size">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                                <button type="button" className="apply-modal__file-remove" onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}>✕</button>
                                            </div>
                                        ) : (
                                            <div className="apply-modal__upload-placeholder">
                                                <span className="apply-modal__upload-icon">⬆️</span>
                                                <p>Click to upload your Resume/CV</p>
                                                <span className="apply-modal__upload-hint">PDF, DOC, DOCX • Max 5MB</span>
                                            </div>
                                        )}
                                    </div>
                                    {formErrors.resume && <span className="apply-modal__error">{formErrors.resume}</span>}
                                </div>

                                {/* Cover Letter */}
                                <div className="apply-modal__section">
                                    <h4 className="apply-modal__section-title">✉️ Cover Letter</h4>
                                    <div className="apply-modal__field">
                                        <textarea
                                            name="coverLetter"
                                            value={formData.coverLetter}
                                            onChange={handleChange}
                                            placeholder="Write a brief cover letter explaining why you're a great fit for this role..."
                                            rows={5}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="apply-modal__actions">
                                    <button type="button" className="apply-modal__cancel" onClick={() => !submitting && setShowApplyForm(false)} disabled={submitting}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="apply-modal__submit" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <span className="apply-modal__spinner"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default JobDetails;
