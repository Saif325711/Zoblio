import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    );
};

export default Navbar;
