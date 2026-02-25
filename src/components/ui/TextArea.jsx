import React from 'react';
import './TextArea.css';

const TextArea = ({ label, name, value, onChange, placeholder, rows = 6, error, required, hint }) => {
    return (
        <div className="textarea-group">
            {label && (
                <label className="textarea-label" htmlFor={name}>
                    {label} {required && <span className="textarea-required">*</span>}
                </label>
            )}
            {hint && <p className="textarea-hint">{hint}</p>}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`textarea-field ${error ? 'textarea-field--error' : ''}`}
            />
            {error && <p className="textarea-error">{error}</p>}
        </div>
    );
};

export default TextArea;
