import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import './Login.css';

const HIGHLIGHTS = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        title: 'Smart Job Matching',
        desc: 'AI-powered matching finds roles that fit your skills and experience',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        ),
        title: 'Real-Time Alerts',
        desc: 'Get notified instantly when a matching job is posted near you',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: 'Safe & Verified',
        desc: 'Every employer is manually verified — zero fake listings, ever',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        title: 'Apply from Any Device',
        desc: 'Fully mobile-optimised — apply to jobs on the go, anytime',
    },
];

const RECENT_JOBS = [
    { title: 'React Developer', company: 'TechNE Solutions', location: 'Guwahati', type: 'Full-Time' },
    { title: 'HR Manager', company: 'NE Logistics', location: 'Dibrugarh', type: 'Full-Time' },
    { title: 'Site Engineer', company: 'Brahmaputra Infra', location: 'Jorhat', type: 'Contract' },
];

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || '/';

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(
                err.code === 'auth/invalid-credential' ? 'Invalid email or password'
                    : err.code === 'auth/user-not-found' ? 'No account found with this email'
                        : err.code === 'auth/too-many-requests' ? 'Too many failed attempts. Try again later.'
                            : 'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* ── LEFT: Sticky Form ── */}
            <div className="login-left">
                <div className="login-form-wrap">
                    {/* Logo */}
                    <Link to="/" className="login-logo">
                        <span className="login-logo-icon">Z</span>
                        <span className="login-logo-text">ZOBLIO</span>
                    </Link>

                    <h1 className="login-title">Welcome back</h1>
                    <p className="login-subtitle">Sign in to your account to continue</p>

                    {error && <div className="login-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <Input label="Email Address" type="email" name="email"
                            placeholder="you@company.com" value={formData.email}
                            onChange={handleChange} required />
                        <Input label="Password" type="password" name="password"
                            placeholder="Enter your password" value={formData.password}
                            onChange={handleChange} required />

                        <div className="login-options">
                            <label className="login-checkbox">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="login-forgot">Forgot password?</a>
                        </div>

                        <Button variant="primary" size="lg" type="submit" className="login-submit">
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </Button>
                    </form>

                    <p className="login-footer-text">
                        Don't have an account? <Link to="/register" className="login-link">Create one free</Link>
                    </p>
                </div>
            </div>

            {/* ── RIGHT: Brand Info Panel ── */}
            <div className="login-right">
                <div className="login-right-content">

                    {/* Header */}
                    <div className="login-brand-header">
                        <div className="login-brand-badge">✦ Your Career Starts Here</div>
                        <h2 className="login-brand-title">
                            Find Jobs That<br />
                            <span className="login-brand-accent">Match You.</span>
                        </h2>
                        <p className="login-brand-desc">
                            Thousands of companies across Assam & Northeast India are
                            actively hiring. Log in and pick up where you left off.
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="login-highlights">
                        {HIGHLIGHTS.map((h, i) => (
                            <div key={i} className="login-highlight">
                                <div className="login-highlight-icon">{h.icon}</div>
                                <div>
                                    <p className="login-highlight-title">{h.title}</p>
                                    <p className="login-highlight-desc">{h.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Live Jobs strip */}
                    <div className="login-live-jobs">
                        <p className="login-live-label">
                            <span className="login-live-dot"></span>
                            Live Jobs Right Now
                        </p>
                        <div className="login-job-cards">
                            {RECENT_JOBS.map((j, i) => (
                                <div key={i} className="login-job-card">
                                    <div className="login-job-avatar">{j.company[0]}</div>
                                    <div className="login-job-info">
                                        <p className="login-job-title">{j.title}</p>
                                        <p className="login-job-meta">{j.company} · {j.location}</p>
                                    </div>
                                    <span className="login-job-badge">{j.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="login-stats">
                        {[['12K+', 'Job Seekers'], ['500+', 'Employers'], ['Free', 'To Use']].map(([v, l]) => (
                            <div key={l} className="login-stat">
                                <span className="login-stat-val">{v}</span>
                                <span className="login-stat-label">{l}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
