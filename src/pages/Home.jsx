import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './Home.css';

const industries = [
    {
        title: 'Technology & IT',
        desc: 'Software, Cloud, AI & Data',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
        jobs: '2,400+'
    },
    {
        title: 'Manufacturing',
        desc: 'Production, Quality & Engineering',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
        jobs: '1,850+'
    },
    {
        title: 'Healthcare',
        desc: 'Medical, Pharma & Biotech',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
        jobs: '1,600+'
    },
    {
        title: 'Finance & Banking',
        desc: 'Investment, Insurance & Fintech',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
        jobs: '1,200+'
    },
    {
        title: 'Construction',
        desc: 'Civil, Mechanical & Architecture',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        jobs: '980+'
    },
    {
        title: 'Logistics',
        desc: 'Supply Chain, Transport & Warehousing',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
        jobs: '750+'
    },
];

const stats = [
    { value: '12K+', label: 'Active Jobs' },
    { value: '8K+', label: 'Companies' },
    { value: '50K+', label: 'Candidates' },
    { value: '95%', label: 'Success Rate' },
];

const Home = () => {
    const heroRef = useRef(null);
    const industriesRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const animElements = document.querySelectorAll('.animate-on-scroll');
        animElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <main className="home">
            {/* ===== HERO SECTION ===== */}
            <section className="hero" ref={heroRef}>
                <div className="hero__bg-pattern"></div>
                <div className="container hero__inner">
                    <div className="hero__content animate-fade-in-up">
                        <div className="hero__badge">
                            <span className="hero__badge-dot"></span>
                            #1 Enterprise Hiring Platform
                        </div>
                        <h1 className="hero__title">
                            SMARTER<br />
                            HIRING<br />
                            <span className="hero__title-accent">STARTS HERE</span>
                        </h1>
                        <p className="hero__text">
                            Zoblio connects top-tier talent with industry-leading employers.
                            Our AI-powered platform streamlines recruitment across manufacturing,
                            technology, healthcare, and more — delivering faster, smarter hires.
                        </p>
                        <div className="hero__actions">
                            <Link to="/jobs">
                                <Button variant="primary" size="lg">Find Jobs</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="lg">For Employers</Button>
                            </Link>
                        </div>
                        <div className="hero__stats">
                            {stats.map((stat) => (
                                <div key={stat.label} className="hero__stat">
                                    <span className="hero__stat-value">{stat.value}</span>
                                    <span className="hero__stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hero__visual animate-slide-right">
                        <div className="hero__image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                                alt="Modern corporate workplace"
                                className="hero__image"
                            />
                            <div className="hero__image-overlay"></div>
                            <div className="hero__image-accent"></div>
                        </div>
                        <div className="hero__float-card hero__float-card--1 glass-card">
                            <div className="hero__float-icon">🚀</div>
                            <div>
                                <strong>2,400+</strong>
                                <span>New jobs this week</span>
                            </div>
                        </div>
                        <div className="hero__float-card hero__float-card--2 glass-card">
                            <div className="hero__float-icon">💼</div>
                            <div>
                                <strong>Fortune 500</strong>
                                <span>Companies hiring</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== STATS STRIP ===== */}
            <section className="stats-strip">
                <div className="container stats-strip__inner">
                    <div className="stats-strip__item animate-on-scroll">
                        <span className="stats-strip__number">12,000+</span>
                        <span className="stats-strip__label">Active Positions</span>
                    </div>
                    <div className="stats-strip__divider"></div>
                    <div className="stats-strip__item animate-on-scroll">
                        <span className="stats-strip__number">8,500+</span>
                        <span className="stats-strip__label">Partner Companies</span>
                    </div>
                    <div className="stats-strip__divider"></div>
                    <div className="stats-strip__item animate-on-scroll">
                        <span className="stats-strip__number">50,000+</span>
                        <span className="stats-strip__label">Placed Candidates</span>
                    </div>
                    <div className="stats-strip__divider"></div>
                    <div className="stats-strip__item animate-on-scroll">
                        <span className="stats-strip__number">95%</span>
                        <span className="stats-strip__label">Client Satisfaction</span>
                    </div>
                </div>
            </section>

            {/* ===== INDUSTRIES SECTION ===== */}
            <section className="industries section" id="industries" ref={industriesRef}>
                <div className="container">
                    <div className="industries__header animate-on-scroll">
                        <h2 className="section-heading">INDUSTRIES WE SERVE</h2>
                        <p className="industries__subtitle">
                            Specialized recruitment solutions across key sectors powering the global economy.
                        </p>
                    </div>
                    <div className="industries__grid">
                        {industries.map((industry, i) => (
                            <div key={industry.title} className="industry-card animate-on-scroll" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="industry-card__image-wrapper">
                                    <img src={industry.image} alt={industry.title} className="industry-card__image" />
                                    <div className="industry-card__image-overlay"></div>
                                </div>
                                <div className="industry-card__content">
                                    <h3 className="industry-card__title">{industry.title}</h3>
                                    <p className="industry-card__desc">{industry.desc}</p>
                                    <div className="industry-card__meta">
                                        <span className="industry-card__jobs">{industry.jobs} Jobs</span>
                                        <Link to="/jobs" className="industry-card__link">
                                            Explore
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA STRIP ===== */}
            <section className="cta-strip">
                <div className="cta-strip__bg"></div>
                <div className="container cta-strip__inner">
                    <div className="cta-strip__content animate-on-scroll">
                        <h2 className="cta-strip__title">READY TO BUILD YOUR DREAM TEAM?</h2>
                        <p className="cta-strip__text">
                            Join thousands of companies already hiring smarter with Zoblio.
                        </p>
                    </div>
                    <div className="cta-strip__action animate-on-scroll">
                        <Link to="/register">
                            <Button variant="primary" size="lg">Start Hiring Now</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== WHY ZOBLIO ===== */}
            <section className="why section">
                <div className="container">
                    <h2 className="section-heading animate-on-scroll">WHY CHOOSE ZOBLIO</h2>
                    <div className="why__grid">
                        <div className="why__card glass-card animate-on-scroll">
                            <div className="why__card-icon">⚡</div>
                            <h3 className="why__card-title">Lightning Fast</h3>
                            <p className="why__card-desc">AI-powered matching fills positions 3x faster than traditional recruiting methods.</p>
                        </div>
                        <div className="why__card glass-card animate-on-scroll">
                            <div className="why__card-icon">🎯</div>
                            <h3 className="why__card-title">Precision Matching</h3>
                            <p className="why__card-desc">Our algorithms analyze 50+ data points to find the perfect candidate-role fit.</p>
                        </div>
                        <div className="why__card glass-card animate-on-scroll">
                            <div className="why__card-icon">🌐</div>
                            <h3 className="why__card-title">Global Reach</h3>
                            <p className="why__card-desc">Access talent pools across 40+ countries with localized compliance built in.</p>
                        </div>
                        <div className="why__card glass-card animate-on-scroll">
                            <div className="why__card-icon">🔒</div>
                            <h3 className="why__card-title">Enterprise Security</h3>
                            <p className="why__card-desc">SOC 2 compliant platform with end-to-end encryption for all candidate data.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
