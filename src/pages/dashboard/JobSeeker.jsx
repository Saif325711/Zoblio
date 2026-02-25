import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const JobSeeker = () => {
    const { user } = useAuth();

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="dashboard">
            <div className="container">
                {/* Profile Banner */}
                <div className="dashboard__profile">
                    <div className="dashboard__profile-left">
                        <div className="dashboard__avatar">
                            {getInitials(user?.displayName || user?.name)}
                        </div>
                        <div className="dashboard__profile-info">
                            <h1 className="dashboard__greeting">
                                Welcome back, <span className="dashboard__name">{user?.displayName || user?.name || 'User'}</span>
                            </h1>
                            <p className="dashboard__email">{user?.email}</p>
                            <span className="dashboard__role-badge">🎯 Job Seeker</span>
                        </div>
                    </div>
                    <div className="dashboard__profile-actions">
                        <Link to="/jobs" className="dashboard__action-btn dashboard__action-btn--primary">Browse Jobs</Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="dashboard__grid">
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">📋</div>
                        <div className="dashboard__card-value">12</div>
                        <div className="dashboard__card-label">Applications Sent</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">👁️</div>
                        <div className="dashboard__card-value">48</div>
                        <div className="dashboard__card-label">Profile Views</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">💬</div>
                        <div className="dashboard__card-value">5</div>
                        <div className="dashboard__card-label">Interview Invites</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">⭐</div>
                        <div className="dashboard__card-value">8</div>
                        <div className="dashboard__card-label">Saved Jobs</div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="dashboard__section-title">Quick Actions</div>
                <div className="dashboard__actions-grid">
                    <Link to="/jobs" className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">🔍</span>
                        <span className="dashboard__quick-label">Search Jobs</span>
                    </Link>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">📄</span>
                        <span className="dashboard__quick-label">My Resume</span>
                    </div>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">📊</span>
                        <span className="dashboard__quick-label">Application Status</span>
                    </div>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">⚙️</span>
                        <span className="dashboard__quick-label">Settings</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeeker;
