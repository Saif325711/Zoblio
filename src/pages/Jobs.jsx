import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import jobService from '../services/jobService';
import './Jobs.css';

/* Fallback sample jobs (shown if Firestore is empty or offline) */
const sampleJobs = [
    {
        id: 'sample-1',
        title: 'Senior Software Engineer',
        company: 'TechCorp Industries',
        location: 'New York, NY',
        type: 'Full-Time',
        salaryMin: 120000,
        salaryMax: 180000,
        posted: '2 days ago',
        tags: ['React', 'Node.js', 'AWS'],
    },
    {
        id: 'sample-2',
        title: 'Production Manager',
        company: 'GlobalManufacture Co.',
        location: 'Detroit, MI',
        type: 'Full-Time',
        salaryMin: 95000,
        salaryMax: 130000,
        posted: '1 day ago',
        tags: ['Manufacturing', 'Lean', 'Leadership'],
    },
    {
        id: 'sample-3',
        title: 'Data Scientist',
        company: 'AnalyticsPro',
        location: 'San Francisco, CA',
        type: 'Remote',
        salaryMin: 140000,
        salaryMax: 200000,
        posted: '3 days ago',
        tags: ['Python', 'ML', 'TensorFlow'],
    },
    {
        id: 'sample-4',
        title: 'Financial Analyst',
        company: 'Capital Dynamics',
        location: 'Chicago, IL',
        type: 'Full-Time',
        salaryMin: 85000,
        salaryMax: 110000,
        posted: '5 hours ago',
        tags: ['Excel', 'SQL', 'Finance'],
    },
    {
        id: 'sample-5',
        title: 'Civil Engineer',
        company: 'BuildRight Construction',
        location: 'Houston, TX',
        type: 'Full-Time',
        salaryMin: 90000,
        salaryMax: 125000,
        posted: '4 days ago',
        tags: ['AutoCAD', 'Project Mgmt', 'Civil'],
    },
    {
        id: 'sample-6',
        title: 'Healthcare Administrator',
        company: 'MedGroup Health',
        location: 'Boston, MA',
        type: 'Full-Time',
        salaryMin: 75000,
        salaryMax: 100000,
        posted: '1 week ago',
        tags: ['Healthcare', 'Admin', 'HIPAA'],
    },
];

/* Helper: format salary display */
const formatSalary = (job) => {
    if (job.salary && typeof job.salary === 'string') return job.salary;
    if (job.salaryMin && job.salaryMax) {
        const fmt = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);
        return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
    }
    return 'Competitive';
};

/* Helper: relative time */
const timeAgo = (ts) => {
    if (!ts) return '';
    const now = Date.now();
    const date = ts?.toDate ? ts.toDate().getTime() : new Date(ts).getTime();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 604800)}w ago`;
};

const Jobs = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [activeLocation, setActiveLocation] = useState('');
    const [loading, setLoading] = useState(true);

    /* Fetch jobs from Firestore on mount */
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const firestoreJobs = await jobService.getAll();
                setAllJobs(firestoreJobs.length > 0 ? firestoreJobs : sampleJobs);
            } catch (err) {
                console.warn('Could not fetch jobs from Firestore:', err.message);
                setAllJobs(sampleJobs);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    /* Filter jobs based on active search */
    const filteredJobs = useMemo(() => {
        const term = activeSearch.toLowerCase().trim();
        const loc = activeLocation.toLowerCase().trim();

        return allJobs.filter((job) => {
            // Search by title, company, tags, type
            const matchesSearch = !term || [
                job.title,
                job.company,
                job.type,
                ...(job.tags || []),
                ...(job.skills || []),
                job.industry || '',
            ].some((field) => (field || '').toLowerCase().includes(term));

            // Search by location
            const matchesLocation = !loc ||
                (job.location || '').toLowerCase().includes(loc) ||
                (job.workMode || '').toLowerCase().includes(loc);

            return matchesSearch && matchesLocation;
        });
    }, [allJobs, activeSearch, activeLocation]);

    /* Trigger search */
    const handleSearch = (e) => {
        e?.preventDefault();
        setActiveSearch(searchTerm);
        setActiveLocation(locationFilter);
    };

    /* Clear search */
    const handleClear = () => {
        setSearchTerm('');
        setLocationFilter('');
        setActiveSearch('');
        setActiveLocation('');
    };

    /* Enter key triggers search */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const isFiltered = activeSearch || activeLocation;

    return (
        <main className="jobs-page section">
            <div className="container">
                {/* Header */}
                <div className="jobs-page__header">
                    <h1 className="section-heading">Find Your Next Opportunity</h1>
                    <p className="jobs-page__subtitle">Browse thousands of positions from top employers worldwide</p>
                </div>

                {/* Search Bar */}
                <form className="jobs-page__search glass-card" onSubmit={handleSearch}>
                    <div className="jobs-page__search-field">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input
                            type="text"
                            placeholder="Job title, keyword, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="jobs-page__input"
                        />
                    </div>
                    <div className="jobs-page__search-field">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        <input
                            type="text"
                            placeholder="City or state..."
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="jobs-page__input"
                        />
                    </div>
                    <Button variant="primary" size="md" type="submit">Search Jobs</Button>
                </form>

                {/* Active filters */}
                {isFiltered && (
                    <div className="jobs-page__filters">
                        <span className="jobs-page__filter-label">Showing results for:</span>
                        {activeSearch && <span className="jobs-page__filter-tag">"{activeSearch}"</span>}
                        {activeLocation && <span className="jobs-page__filter-tag">📍 {activeLocation}</span>}
                        <button className="jobs-page__filter-clear" onClick={handleClear}>Clear all ✕</button>
                    </div>
                )}

                {/* Job Listings */}
                <div className="jobs-page__results">
                    {loading ? (
                        <p className="jobs-page__count">Loading jobs...</p>
                    ) : (
                        <>
                            <p className="jobs-page__count">
                                <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                                {isFiltered && allJobs.length !== filteredJobs.length && (
                                    <span> out of {allJobs.length} total</span>
                                )}
                            </p>

                            {filteredJobs.length === 0 ? (
                                <div className="jobs-page__empty">
                                    <span className="jobs-page__empty-icon">🔍</span>
                                    <h3>No jobs found</h3>
                                    <p>Try adjusting your search terms or location</p>
                                    <button className="jobs-page__empty-btn" onClick={handleClear}>Clear Search</button>
                                </div>
                            ) : (
                                <div className="jobs-page__grid">
                                    {filteredJobs.map((job) => (
                                        <Link to={`/jobs/${job.id}`} key={job.id} className="job-card glass-card">
                                            <div className="job-card__header">
                                                <div className="job-card__company-avatar">{(job.company || '?')[0]}</div>
                                                <div>
                                                    <h3 className="job-card__title">{job.title}</h3>
                                                    <p className="job-card__company">{job.company}</p>
                                                </div>
                                            </div>
                                            <div className="job-card__meta">
                                                <span className="job-card__location">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                    {job.location}
                                                </span>
                                                <span className="job-card__type">{job.type}</span>
                                            </div>
                                            <p className="job-card__salary">{formatSalary(job)}</p>
                                            <div className="job-card__tags">
                                                {(job.tags || job.skills || []).slice(0, 4).map((tag) => (
                                                    <span key={tag} className="job-card__tag">{tag}</span>
                                                ))}
                                            </div>
                                            <span className="job-card__posted">
                                                {job.posted || timeAgo(job.createdAt)}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Jobs;
