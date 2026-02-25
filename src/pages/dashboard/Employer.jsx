import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const Employer = () => {
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
                        <div className="dashboard__avatar dashboard__avatar--employer">
                            {getInitials(user?.displayName || user?.name)}
                        </div>
                        <div className="dashboard__profile-info">
                            <h1 className="dashboard__greeting">
                                Welcome back, <span className="dashboard__name">{user?.displayName || user?.name || 'User'}</span>
                            </h1>
                            <p className="dashboard__email">{user?.email}</p>
                            <span className="dashboard__role-badge dashboard__role-badge--employer">🏢 Employer</span>
                        </div>
                    </div>
                    <div className="dashboard__profile-actions">
                        <Link to="/post-job" className="dashboard__action-btn dashboard__action-btn--primary">+ Post a Job</Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="dashboard__grid">
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">📝</div>
                        <div className="dashboard__card-value">6</div>
                        <div className="dashboard__card-label">Active Jobs</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">👥</div>
                        <div className="dashboard__card-value">124</div>
                        <div className="dashboard__card-label">Total Applicants</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">📅</div>
                        <div className="dashboard__card-value">18</div>
                        <div className="dashboard__card-label">Interviews Scheduled</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">✅</div>
                        <div className="dashboard__card-value">7</div>
                        <div className="dashboard__card-label">Positions Filled</div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="dashboard__section-title">Quick Actions</div>
                <div className="dashboard__actions-grid">
                    <Link to="/post-job" className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">📝</span>
                        <span className="dashboard__quick-label">Post New Job</span>
                    </Link>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">👥</span>
                        <span className="dashboard__quick-label">View Applicants</span>
                    </div>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">📊</span>
                        <span className="dashboard__quick-label">Analytics</span>
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

export default Employer;
