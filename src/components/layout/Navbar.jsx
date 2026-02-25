import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useAuth from '../../hooks/useAuth';
import './Navbar.css';

const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'JOBS', path: '/jobs' },
    { label: 'INDUSTRIES', path: '/#industries' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
    }, [location]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    /* Real-time unread notification count */
    useEffect(() => {
        if (!user) { setUnreadCount(0); return; }
        const q = query(
            collection(db, 'notifications'),
            where('recipientId', '==', user.uid),
            where('read', '==', false)
        );
        const unsub = onSnapshot(q, (snap) => setUnreadCount(snap.size), () => { });
        return () => unsub();
    }, [user]);

    const handleNavClick = (path) => {
        if (path.includes('#')) {
            const id = path.split('#')[1];
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
        navigate('/');
    };

    // Get avatar initials
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Role label
    const roleLabel = user?.role === 'employer'
        ? 'Employer'
        : user?.role === 'admin'
            ? 'Admin'
            : 'Job Seeker';

    // Dashboard path by role
    const dashboardPath =
        user?.role === 'employer'
            ? '/dashboard/employer'
            : user?.role === 'admin'
                ? '/dashboard/admin'
                : '/dashboard/seeker';

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className="container navbar__inner">
                    <Link to="/" className="navbar__logo">
                        <span className="navbar__logo-icon">Z</span>
                        <span className="navbar__logo-text">ZOBLIO</span>
                    </Link>

                    <button
                        className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <ul className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
                        {navItems.map((item) => (
                            <li key={item.path} className="navbar__item">
                                <Link
                                    to={item.path}
                                    className={`navbar__link ${location.pathname === item.path ? 'navbar__link--active' : ''}`}
                                    onClick={() => handleNavClick(item.path)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}

                        {/* ===== NOT LOGGED IN ===== */}
                        {!user && (
                            <li className="navbar__item navbar__item--cta">
                                <Link to="/register" className="navbar__cta">Get Started</Link>
                            </li>
                        )}

                        {/* ===== LOGGED IN — USER AVATAR + DROPDOWN ===== */}
                        {user && (
                            <li className="navbar__item navbar__user-actions">
                                <Link to="/messages" className="navbar__icon-btn" title="Messages">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </Link>
                                <Link to="/notifications" className="navbar__icon-btn" title="Notifications">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                    {unreadCount > 0 && <span className="navbar__notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                                </Link>
                            </li>
                        )}
                        {user && (
                            <li className="navbar__item navbar__user-menu" ref={dropdownRef}>
                                <button
                                    className="navbar__user-btn"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    aria-label="User menu"
                                >
                                    <span className="navbar__user-avatar">{getInitials(user.displayName || user.name)}</span>
                                    <div className="navbar__user-info">
                                        <span className="navbar__user-name">{user.displayName || user.name || 'User'}</span>
                                        <span className="navbar__user-role">{roleLabel}</span>
                                    </div>
                                    <svg
                                        className={`navbar__user-chevron ${dropdownOpen ? 'navbar__user-chevron--open' : ''}`}
                                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="navbar__dropdown">
                                        <div className="navbar__dropdown-header">
                                            <span className="navbar__dropdown-avatar">{getInitials(user.displayName || user.name)}</span>
                                            <div>
                                                <p className="navbar__dropdown-name">{user.displayName || user.name || 'User'}</p>
                                                <p className="navbar__dropdown-email">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="navbar__dropdown-divider"></div>
                                        <Link to={dashboardPath} className="navbar__dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                                            Dashboard
                                        </Link>
                                        <Link to="/notifications" className="navbar__dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                            Notifications{unreadCount > 0 && ` (${unreadCount})`}
                                        </Link>
                                        <Link to="/messages" className="navbar__dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            Messages
                                        </Link>
                                        {user?.role === 'employer' && (
                                            <Link to="/dashboard/employer/applications" className="navbar__dropdown-item">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                                Applications
                                            </Link>
                                        )}
                                        <Link to="/jobs" className="navbar__dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
                                            Browse Jobs
                                        </Link>
                                        <div className="navbar__dropdown-divider"></div>
                                        <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

            {/* ═══ MOBILE BOTTOM NAV BAR ═══ */}
            <nav className="mobile-nav">
                <Link to="/" className={`mobile-nav__item ${location.pathname === '/' ? 'mobile-nav__item--active' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    <span>Home</span>
                </Link>
                <Link to="/jobs" className={`mobile-nav__item ${location.pathname === '/jobs' || location.pathname.startsWith('/jobs/') ? 'mobile-nav__item--active' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
                    <span>Jobs</span>
                </Link>
                <Link to="/about" className={`mobile-nav__item ${location.pathname === '/about' ? 'mobile-nav__item--active' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <span>About</span>
                </Link>
                <Link to="/contact" className={`mobile-nav__item ${location.pathname === '/contact' ? 'mobile-nav__item--active' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    <span>Contact</span>
                </Link>
                {user ? (
                    <Link to={dashboardPath} className={`mobile-nav__item ${location.pathname.startsWith('/dashboard') ? 'mobile-nav__item--active' : ''}`}>
                        <span className="mobile-nav__avatar">{getInitials(user.displayName || user.name)}</span>
                        <span>Profile</span>
                    </Link>
                ) : (
                    <Link to="/register" className="mobile-nav__item mobile-nav__item--cta">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                        <span>Start</span>
                    </Link>
                )}
            </nav>
        </>
    );
};

export default Navbar;
