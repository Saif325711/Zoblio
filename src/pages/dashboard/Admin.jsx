import React from 'react';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const Admin = () => {
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
                        <div className="dashboard__avatar dashboard__avatar--admin">
                            {getInitials(user?.displayName || user?.name)}
                        </div>
                        <div className="dashboard__profile-info">
                            <h1 className="dashboard__greeting">
                                Welcome, <span className="dashboard__name">{user?.displayName || user?.name || 'Admin'}</span>
                            </h1>
                            <p className="dashboard__email">{user?.email}</p>
                            <span className="dashboard__role-badge dashboard__role-badge--admin">🛡️ Administrator</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="dashboard__grid">
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">🏢</div>
                        <div className="dashboard__card-value">850</div>
                        <div className="dashboard__card-label">Companies</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">💼</div>
                        <div className="dashboard__card-value">3,200</div>
                        <div className="dashboard__card-label">Total Jobs</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">👤</div>
                        <div className="dashboard__card-value">15,400</div>
                        <div className="dashboard__card-label">Registered Users</div>
                    </div>
                    <div className="dashboard__card glass-card">
                        <div className="dashboard__card-icon">📊</div>
                        <div className="dashboard__card-value">98%</div>
                        <div className="dashboard__card-label">Uptime</div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="dashboard__section-title">Management</div>
                <div className="dashboard__actions-grid">
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">👥</span>
                        <span className="dashboard__quick-label">Manage Users</span>
                    </div>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">💼</span>
                        <span className="dashboard__quick-label">Manage Jobs</span>
                    </div>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">🏢</span>
                        <span className="dashboard__quick-label">Companies</span>
                    </div>
                    <div className="dashboard__quick-card glass-card">
                        <span className="dashboard__quick-icon">⚙️</span>
                        <span className="dashboard__quick-label">Platform Settings</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
