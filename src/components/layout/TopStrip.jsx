import React from 'react';
import { Link } from 'react-router-dom';
import './TopStrip.css';

const TopStrip = () => {
    return (
        <div className="topstrip">
            <div className="container topstrip__inner">
                <div className="topstrip__left">
                    <svg className="topstrip__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="topstrip__phone">+91 6003359534</span>
                    <span className="topstrip__divider">|</span>
                    <svg className="topstrip__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="topstrip__email">careers@zoblio.com</span>
                </div>
                <div className="topstrip__right">
                    <Link to="/post-job" className="topstrip__btn topstrip__btn--primary">Post a Job</Link>
                    <Link to="/login" className="topstrip__btn topstrip__btn--dark">Employer Login</Link>
                </div>
            </div>
        </div>
    );
};

export default TopStrip;
