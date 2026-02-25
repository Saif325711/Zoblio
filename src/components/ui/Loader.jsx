import React from 'react';
import './Loader.css';

const Loader = ({ size = 'md' }) => {
    return (
        <div className="loader-wrapper">
            <div className={`loader loader--${size}`}>
                <div className="loader__ring"></div>
                <div className="loader__ring"></div>
                <div className="loader__ring"></div>
            </div>
        </div>
    );
};

export default Loader;
