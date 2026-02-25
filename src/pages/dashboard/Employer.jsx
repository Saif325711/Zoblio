import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const Employer = () => {
    const { user, updateRole } = useAuth();
    const navigate = useNavigate();
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [switching, setSwitching] = useState(false);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleRoleSwitch = async (newRole) => {
        if (newRole === user?.role) {
            setShowRoleModal(false);
            return;
        }
        setSwitching(true);
        try {
            await updateRole(newRole);
            setShowRoleModal(false);
            const path = newRole === 'employer' ? '/dashboard/employer' : '/dashboard/seeker';
            navigate(path, { replace: true });
        } catch (err) {
            console.error(err);
        } finally {
            setSwitching(false);
        }
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
                            <div className="dashboard__role-row">
                                <span className="dashboard__role-badge dashboard__role-badge--employer">🏢 Employer</span>
                                <button className="dashboard__role-edit" onClick={() => setShowRoleModal(true)} title="Change role">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard__profile-actions">
                        <Link to="/post-job" className="dashboard__action-btn dashboard__action-btn--primary">+ Post a Job</Link>
                    </div>
                </div>

                {/* Role Switch Modal */}
                {showRoleModal && (
                    <div className="role-modal-overlay" onClick={() => setShowRoleModal(false)}>
                        <div className="role-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="role-modal__header">
                                <h3 className="role-modal__title">Switch Account Type</h3>
                                <button className="role-modal__close" onClick={() => setShowRoleModal(false)}>✕</button>
                            </div>
                            <p className="role-modal__desc">Select your account type. You can change this anytime.</p>
                            <div className="role-modal__options">
                                <button
                                    className={`role-modal__option ${user?.role === 'jobseeker' ? 'role-modal__option--active' : ''}`}
                                    onClick={() => handleRoleSwitch('jobseeker')}
                                    disabled={switching}
                                >
                                    <span className="role-modal__option-icon">🎯</span>
                                    <span className="role-modal__option-title">Job Seeker</span>
                                    <span className="role-modal__option-desc">Search and apply for jobs</span>
                                    {user?.role === 'jobseeker' && <span className="role-modal__option-check">✓</span>}
                                </button>
                                <button
                                    className={`role-modal__option ${user?.role === 'employer' ? 'role-modal__option--active' : ''}`}
                                    onClick={() => handleRoleSwitch('employer')}
                                    disabled={switching}
                                >
                                    <span className="role-modal__option-icon">🏢</span>
                                    <span className="role-modal__option-title">Employer</span>
                                    <span className="role-modal__option-desc">Post jobs and hire talent</span>
                                    {user?.role === 'employer' && <span className="role-modal__option-check">✓</span>}
                                </button>
                            </div>
                            {switching && <p className="role-modal__loading">Switching...</p>}
                        </div>
                    </div>
                )}

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
