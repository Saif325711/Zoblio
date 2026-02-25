import React, { useState } from 'react';
import TextArea from '../../../components/ui/TextArea';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import './FormSection.css';

const EXPERIENCE_LEVELS = [
    { value: 'entry', label: 'Entry Level (0–1 yr)' },
    { value: 'junior', label: 'Junior (1–3 yrs)' },
    { value: 'mid', label: 'Mid Level (3–5 yrs)' },
    { value: 'senior', label: 'Senior (5–8 yrs)' },
    { value: 'lead', label: 'Lead / Principal (8+ yrs)' },
];

const EDUCATION_LEVELS = [
    { value: 'high_school', label: 'High School' },
    { value: 'diploma', label: 'Diploma / ITI' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD / Doctorate' },
    { value: 'any', label: 'Any / Not Required' },
];

const JobDetailsSection = ({ data, onChange, errors }) => {
    const [skillInput, setSkillInput] = useState('');

    const addSkill = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault();
            const newSkill = skillInput.trim().replace(/,$/, '');
            if (newSkill && !data.skills.includes(newSkill)) {
                onChange({ target: { name: 'skills', value: [...data.skills, newSkill] } });
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        onChange({ target: { name: 'skills', value: data.skills.filter((s) => s !== skill) } });
    };

    return (
        <div className="form-section">
            <div className="form-section__header">
                <div className="form-section__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                </div>
                <div>
                    <h2 className="form-section__title">Job Details</h2>
                    <p className="form-section__subtitle">Describe the role and requirements</p>
                </div>
            </div>

            <div className="form-section__body">
                <div className="form-row form-row--full">
                    <TextArea
                        label="Job Description"
                        name="description"
                        placeholder="Describe the role clearly — responsibilities, daily tasks, team structure, growth opportunities..."
                        value={data.description}
                        onChange={onChange}
                        rows={8}
                        error={errors.description}
                        required
                        hint="Minimum 100 characters. Write clearly to attract quality candidates."
                    />
                </div>

                {/* Skills Tag Input */}
                <div className="form-row form-row--full">
                    <div className="skills-group">
                        <label className="skills-label">Required Skills</label>
                        <p className="skills-hint">Type a skill and press Enter or comma to add</p>
                        <div className="skills-input-wrapper">
                            {data.skills.map((skill) => (
                                <span key={skill} className="skill-tag">
                                    {skill}
                                    <button type="button" className="skill-tag__remove" onClick={() => removeSkill(skill)}>
                                        ×
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                className="skills-input"
                                placeholder={data.skills.length === 0 ? 'e.g. React, Python, AWS...' : 'Add more...'}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={addSkill}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-row form-row--half">
                    <Select
                        label="Experience Level"
                        name="experienceLevel"
                        value={data.experienceLevel}
                        onChange={onChange}
                        options={EXPERIENCE_LEVELS}
                        placeholder="Select level..."
                        error={errors.experienceLevel}
                        required
                    />
                    <Select
                        label="Education Required"
                        name="education"
                        value={data.education}
                        onChange={onChange}
                        options={EDUCATION_LEVELS}
                        placeholder="Select education..."
                    />
                </div>
            </div>
        </div>
    );
};

export default JobDetailsSection;
