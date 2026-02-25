import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, error, className = '', ...props }) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label" htmlFor={name}>{label}</label>}
            <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`input-field ${error ? 'input-field--error' : ''}`}
                {...props}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default Input;
