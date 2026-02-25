import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import './FormSection.css';

const JOB_CATEGORIES = [
    { value: 'technology', label: 'Technology & IT' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'construction', label: 'Construction' },
    { value: 'logistics', label: 'Logistics & Supply Chain' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail & Commerce' },
    { value: 'other', label: 'Other' },
];

const JOB_TYPES = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' },
];

const BasicInfoSection = ({ data, onChange, errors }) => {
    return (
        <div className="form-section">
            <div className="form-section__header">
                <div className="form-section__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                </div>
                <div>
                    <h2 className="form-section__title">Basic Information</h2>
                    <p className="form-section__subtitle">Core details about the position</p>
                </div>
            </div>

            <div className="form-section__body">
                <div className="form-row form-row--full">
                    <Input
                        label="Job Title"
                        name="title"
                        placeholder="e.g. Senior React Developer"
                        value={data.title}
                        onChange={onChange}
                        error={errors.title}
                        required
                    />
                </div>

                <div className="form-row form-row--half">
                    <Select
                        label="Job Category"
                        name="category"
                        value={data.category}
                        onChange={onChange}
                        options={JOB_CATEGORIES}
                        placeholder="Select category..."
                        error={errors.category}
                        required
                    />
                    <Select
                        label="Job Type"
                        name="type"
                        value={data.type}
                        onChange={onChange}
                        options={JOB_TYPES}
                        placeholder="Select type..."
                        error={errors.type}
                        required
                    />
                </div>

                <div className="form-row form-row--full">
                    <Input
                        label="Location"
                        name="location"
                        placeholder="e.g. Guwahati, Assam or Remote"
                        value={data.location}
                        onChange={onChange}
                        error={errors.location}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-section__salary">
                        <span className="form-section__salary-label">Salary Range (₹ / Month)</span>
                        <div className="form-section__salary-inputs">
                            <Input
                                name="salaryMin"
                                placeholder="Min (e.g. 30000)"
                                value={data.salaryMin}
                                onChange={onChange}
                                type="number"
                            />
                            <span className="form-section__salary-sep">to</span>
                            <Input
                                name="salaryMax"
                                placeholder="Max (e.g. 60000)"
                                value={data.salaryMax}
                                onChange={onChange}
                                type="number"
                                error={errors.salaryMax}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfoSection;
