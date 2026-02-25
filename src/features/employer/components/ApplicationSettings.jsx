import React from 'react';
import Input from '../../../components/ui/Input';
import './FormSection.css';

const WORK_MODES = [
    { value: 'onsite', label: '🏢 Onsite', desc: 'Full office presence' },
    { value: 'hybrid', label: '🔀 Hybrid', desc: 'Mix of office & home' },
    { value: 'remote', label: '🏠 Remote', desc: 'Fully work from home' },
];

const ApplicationSettings = ({ data, onChange, errors }) => {
    return (
        <div className="form-section">
            <div className="form-section__header">
                <div className="form-section__icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                    </svg>
                </div>
                <div>
                    <h2 className="form-section__title">Application Settings</h2>
                    <p className="form-section__subtitle">Configure application preferences</p>
                </div>
            </div>

            <div className="form-section__body">
                <div className="form-row form-row--half">
                    <Input
                        label="Application Deadline"
                        name="deadline"
                        type="date"
                        value={data.deadline}
                        onChange={onChange}
                        error={errors.deadline}
                        required
                    />
                    <Input
                        label="Number of Openings"
                        name="openings"
                        type="number"
                        placeholder="e.g. 3"
                        value={data.openings}
                        onChange={onChange}
                        error={errors.openings}
                        required
                    />
                </div>

                {/* Work Mode Toggle */}
                <div className="form-row form-row--full">
                    <div className="workmode-group">
                        <label className="workmode-label">Work Mode</label>
                        <div className="workmode-options">
                            {WORK_MODES.map((mode) => (
                                <button
                                    key={mode.value}
                                    type="button"
                                    className={`workmode-btn ${data.workMode === mode.value ? 'workmode-btn--active' : ''}`}
                                    onClick={() => onChange({ target: { name: 'workMode', value: mode.value } })}
                                >
                                    <span className="workmode-btn__label">{mode.label}</span>
                                    <span className="workmode-btn__desc">{mode.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationSettings;
