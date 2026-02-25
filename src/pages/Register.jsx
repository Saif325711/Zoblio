import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import './Register.css';

const FEATURES = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        title: '12,000+ Active Job Seekers',
        desc: 'Connect with qualified talent across Assam & Northeast India',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
        ),
        title: '500+ Companies Hiring',
        desc: 'From startups to enterprise — find your next opportunity',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
        title: '48hr Average First Response',
        desc: 'Fast hiring pipeline — get noticed by employers quickly',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: 'Verified Employers Only',
        desc: 'Every company is reviewed before posting — no scams',
    },
];

const TESTIMONIALS = [
    { name: 'Priya Deka', role: 'Software Engineer', text: 'Got hired in 3 days! Zoblio made the process seamless.' },
    { name: 'Rahul Bora', role: 'Employer, TechNE', text: 'Found 5 great candidates within a week of posting.' },
];

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/');
        } catch (err) {
            setError(
                err.code === 'auth/email-already-in-use' ? 'An account with this email already exists'
                    : err.code === 'auth/weak-password' ? 'Password should be at least 6 characters'
                        : 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reg-page">
            {/* ── LEFT: Sticky Form ── */}
            <div className="reg-left">
                <div className="reg-form-wrap">
                    {/* Logo */}
                    <Link to="/" className="reg-logo">
                        <span className="reg-logo-icon">Z</span>
                        <span className="reg-logo-text">ZOBLIO</span>
                    </Link>

                    <h1 className="reg-title">Create your account</h1>
                    <p className="reg-subtitle">Join thousands of professionals finding jobs daily</p>

                    {error && <div className="reg-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="reg-form">
                        <Input label="Full Name" type="text" name="name" placeholder="John Doe"
                            value={formData.name} onChange={handleChange} required />
                        <Input label="Email Address" type="email" name="email" placeholder="you@company.com"
                            value={formData.email} onChange={handleChange} required />
                        <Input label="Password" type="password" name="password" placeholder="Min 6 characters"
                            value={formData.password} onChange={handleChange} required />

                        {/* Role Toggle */}
                        <div className="reg-role">
                            <label className="reg-role-label">I am a</label>
                            <div className="reg-role-btns">
                                {[
                                    { val: 'jobseeker', icon: '🎯', text: 'Job Seeker' },
                                    { val: 'employer', icon: '🏢', text: 'Employer' },
                                ].map(({ val, icon, text }) => (
                                    <button key={val} type="button"
                                        className={`reg-role-btn ${formData.role === val ? 'reg-role-btn--active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: val })}>
                                        <span className="reg-role-btn-icon">{icon}</span>
                                        <span>{text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button variant="primary" size="lg" type="submit" className="reg-submit">
                            {loading ? 'Creating Account...' : 'Create Free Account →'}
                        </Button>
                    </form>

                    <p className="reg-footer-text">
                        Already have an account? <Link to="/login" className="reg-link">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* ── RIGHT: Brand Info Panel ── */}
            <div className="reg-right">
                <div className="reg-right-content">
                    {/* Header */}
                    <div className="reg-brand-header">
                        <div className="reg-brand-badge">🚀 Northeast India's #1 Job Portal</div>
                        <h2 className="reg-brand-title">
                            Smarter Hiring<br />
                            <span className="reg-brand-accent">Starts Here.</span>
                        </h2>
                        <p className="reg-brand-desc">
                            Zoblio connects top talent with industry-leading employers across
                            Assam, Meghalaya, Manipur, and beyond — completely free.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div className="reg-features">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="reg-feature">
                                <div className="reg-feature-icon">{f.icon}</div>
                                <div>
                                    <p className="reg-feature-title">{f.title}</p>
                                    <p className="reg-feature-desc">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonials */}
                    <div className="reg-testimonials">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="reg-testimonial">
                                <p className="reg-testimonial-text">"{t.text}"</p>
                                <div className="reg-testimonial-author">
                                    <span className="reg-testimonial-avatar">{t.name[0]}</span>
                                    <div>
                                        <p className="reg-testimonial-name">{t.name}</p>
                                        <p className="reg-testimonial-role">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats bar */}
                    <div className="reg-stats">
                        {[['12K+', 'Job Seekers'], ['500+', 'Companies'], ['95%', 'Success Rate']].map(([v, l]) => (
                            <div key={l} className="reg-stat">
                                <span className="reg-stat-val">{v}</span>
                                <span className="reg-stat-label">{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
