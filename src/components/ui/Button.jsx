import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '', type = 'button', ...props }) => {
    return (
        <button
            type={type}
            className={`btn btn--${variant} btn--${size} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
