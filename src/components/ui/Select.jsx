import React from 'react';
import './Select.css';

const Select = ({ label, name, value, onChange, options = [], placeholder = 'Select...', error, required }) => {
    return (
        <div className="select-group">
            {label && (
                <label className="select-label" htmlFor={name}>
                    {label} {required && <span className="select-required">*</span>}
                </label>
            )}
            <div className="select-wrapper">
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`select-field ${error ? 'select-field--error' : ''}`}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
            {error && <p className="select-error">{error}</p>}
        </div>
    );
};

export default Select;
