import React from 'react';
import Button from '../../../components/ui/Button';
import './JobPreviewModal.css';

const WORK_MODE_LABELS = { onsite: '🏢 Onsite', hybrid: '🔀 Hybrid', remote: '🏠 Remote' };
const TYPE_LABELS = {
    'full-time': 'Full-Time', 'part-time': 'Part-Time',
    contract: 'Contract', remote: 'Remote', internship: 'Internship', freelance: 'Freelance',
};

const JobPreviewModal = ({ data, onClose, onPublish }) => {
    if (!data) return null;

    return (
        <div className="preview-overlay" onClick={onClose}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="preview-modal__header">
                    <div>
                        <h2 className="preview-modal__heading">Job Preview</h2>
                        <p className="preview-modal__subheading">This is how candidates will see your listing</p>
                    </div>
                    <button className="preview-modal__close" onClick={onClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Job Card Preview */}
                <div className="preview-modal__body">
                    {/* Job Title + Badges */}
                    <div className="preview-job__top">
                        <div className="preview-job__avatar">{(data.title || 'J')[0].toUpperCase()}</div>
                        <div>
                            <h1 className="preview-job__title">{data.title || 'Untitled Job'}</h1>
                            <div className="preview-job__meta">
                                {data.location && <span>📍 {data.location}</span>}
                                {data.type && <span className="preview-badge">{TYPE_LABELS[data.type] || data.type}</span>}
                                {data.workMode && <span className="preview-badge preview-badge--mode">{WORK_MODE_LABELS[data.workMode]}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Salary + Deadline + Openings */}
                    <div className="preview-job__stats">
                        {(data.salaryMin || data.salaryMax) && (
                            <div className="preview-stat">
                                <span className="preview-stat__label">Salary</span>
                                <span className="preview-stat__value">
                                    ₹{data.salaryMin || '–'} – ₹{data.salaryMax || '–'} / mo
                                </span>
                            </div>
                        )}
                        {data.experienceLevel && (
                            <div className="preview-stat">
                                <span className="preview-stat__label">Experience</span>
                                <span className="preview-stat__value">{data.experienceLevel}</span>
                            </div>
                        )}
                        {data.openings && (
                            <div className="preview-stat">
                                <span className="preview-stat__label">Openings</span>
                                <span className="preview-stat__value">{data.openings}</span>
                            </div>
                        )}
                        {data.deadline && (
                            <div className="preview-stat">
                                <span className="preview-stat__label">Apply By</span>
                                <span className="preview-stat__value">{new Date(data.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {data.description && (
                        <div className="preview-section">
                            <h3 className="preview-section__title">Job Description</h3>
                            <p className="preview-section__text">{data.description}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {data.skills?.length > 0 && (
                        <div className="preview-section">
                            <h3 className="preview-section__title">Required Skills</h3>
                            <div className="preview-skills">
                                {data.skills.map((s) => (
                                    <span key={s} className="preview-skill-tag">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="preview-modal__footer">
                    <Button variant="outline" onClick={onClose}>Edit Job</Button>
                    <Button variant="primary" onClick={onPublish}>Publish Now</Button>
                </div>
            </div>
        </div>
    );
};

export default JobPreviewModal;
