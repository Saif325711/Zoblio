import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    {/* Brand */}
                    <div className="footer__col footer__col--brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-icon">Z</span>
                            <span className="footer__logo-text">ZOBLIO</span>
                        </Link>
                        <p className="footer__desc">
                            Connecting top talent with industry-leading employers. Smarter hiring, faster results.
                        </p>
                        <div className="footer__social">
                            <a href="#" className="footer__social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="#" className="footer__social-link" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            <a href="#" className="footer__social-link" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer__col">
                        <h4 className="footer__heading">Quick Links</h4>
                        <ul className="footer__links">
                            <li><Link to="/jobs" className="footer__link">Browse Jobs</Link></li>
                            <li><Link to="/register" className="footer__link">Create Account</Link></li>
                            <li><Link to="/login" className="footer__link">Employer Login</Link></li>
                            <li><Link to="/about" className="footer__link">About Us</Link></li>
                            <li><Link to="/contact" className="footer__link">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Industries */}
                    <div className="footer__col">
                        <h4 className="footer__heading">Industries</h4>
                        <ul className="footer__links">
                            <li><Link to="/jobs" className="footer__link">Technology & IT</Link></li>
                            <li><Link to="/jobs" className="footer__link">Manufacturing</Link></li>
                            <li><Link to="/jobs" className="footer__link">Healthcare</Link></li>
                            <li><Link to="/jobs" className="footer__link">Finance & Banking</Link></li>
                            <li><Link to="/jobs" className="footer__link">Construction</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer__col">
                        <h4 className="footer__heading">Contact Us</h4>
                        <ul className="footer__contact">
                            <li className="footer__contact-item">
                                <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>Birkuchi, Guwahati,<br />Assam 781026</span>
                            </li>
                            <li className="footer__contact-item">
                                <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>+91 6003359534</span>
                            </li>
                            <li className="footer__contact-item">
                                <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>careers@zoblio.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="footer__bottom">
                    <p className="footer__copy">&copy; 2026 Zoblio. All rights reserved.</p>
                    <div className="footer__bottom-links">
                        <a href="#" className="footer__bottom-link">Privacy Policy</a>
                        <a href="#" className="footer__bottom-link">Terms of Service</a>
                        <a href="#" className="footer__bottom-link">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
