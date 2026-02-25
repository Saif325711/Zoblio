import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hover = true, onClick }) => {
    return (
        <div
            className={`card glass-card ${hover ? 'card--hover' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
