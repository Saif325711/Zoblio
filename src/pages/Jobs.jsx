import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import './Jobs.css';

const sampleJobs = [
    {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'TechCorp Industries',
        location: 'New York, NY',
        type: 'Full-Time',
        salary: '$120K - $180K',
        posted: '2 days ago',
        tags: ['React', 'Node.js', 'AWS'],
    },
    {
        id: 2,
        title: 'Production Manager',
        company: 'GlobalManufacture Co.',
        location: 'Detroit, MI',
        type: 'Full-Time',
        salary: '$95K - $130K',
        posted: '1 day ago',
        tags: ['Manufacturing', 'Lean', 'Leadership'],
    },
    {
        id: 3,
        title: 'Data Scientist',
        company: 'AnalyticsPro',
        location: 'San Francisco, CA',
        type: 'Remote',
        salary: '$140K - $200K',
        posted: '3 days ago',
        tags: ['Python', 'ML', 'TensorFlow'],
    },
    {
        id: 4,
        title: 'Financial Analyst',
        company: 'Capital Dynamics',
        location: 'Chicago, IL',
        type: 'Full-Time',
        salary: '$85K - $110K',
        posted: '5 hours ago',
        tags: ['Excel', 'SQL', 'Finance'],
    },
    {
        id: 5,
        title: 'Civil Engineer',
        company: 'BuildRight Construction',
        location: 'Houston, TX',
        type: 'Full-Time',
        salary: '$90K - $125K',
        posted: '4 days ago',
        tags: ['AutoCAD', 'Project Mgmt', 'Civil'],
    },
    {
        id: 6,
        title: 'Healthcare Administrator',
        company: 'MedGroup Health',
        location: 'Boston, MA',
        type: 'Full-Time',
        salary: '$75K - $100K',
        posted: '1 week ago',
        tags: ['Healthcare', 'Admin', 'HIPAA'],
    },
];

const Jobs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    return (
        <main className="jobs-page section">
            <div className="container">
                {/* Header */}
                <div className="jobs-page__header">
                    <h1 className="section-heading">Find Your Next Opportunity</h1>
                    <p className="jobs-page__subtitle">Browse thousands of positions from top employers worldwide</p>
                </div>

                {/* Search Bar */}
                <div className="jobs-page__search glass-card">
                    <div className="jobs-page__search-field">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                        <input
                            type="text"
                            placeholder="Job title, keyword, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            className="jobs-page__input"
                        />
                    </div>
                    <Button variant="primary" size="md">Search Jobs</Button>
                </div>

                {/* Job Listings */}
                <div className="jobs-page__results">
                    <p className="jobs-page__count"><strong>{sampleJobs.length}</strong> jobs found</p>
                    <div className="jobs-page__grid">
                        {sampleJobs.map((job) => (
                            <Link to={`/jobs/${job.id}`} key={job.id} className="job-card glass-card">
                                <div className="job-card__header">
                                    <div className="job-card__company-avatar">{job.company[0]}</div>
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
                                <p className="job-card__salary">{job.salary}</p>
                                <div className="job-card__tags">
                                    {job.tags.map((tag) => (
                                        <span key={tag} className="job-card__tag">{tag}</span>
                                    ))}
                                </div>
                                <span className="job-card__posted">{job.posted}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Jobs;
