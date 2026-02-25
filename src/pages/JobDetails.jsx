import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './JobDetails.css';

const JobDetails = () => {
    const { id } = useParams();

    return (
        <main className="job-details section">
            <div className="container">
                <Link to="/jobs" className="job-details__back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back to Jobs
                </Link>

                <div className="job-details__grid">
                    <div className="job-details__main glass-card">
                        <div className="job-details__header">
                            <div className="job-details__avatar">T</div>
                            <div>
                                <h1 className="job-details__title">Senior Software Engineer</h1>
                                <p className="job-details__company">TechCorp Industries</p>
                            </div>
                        </div>

                        <div className="job-details__tags">
                            <span className="job-details__tag">Full-Time</span>
                            <span className="job-details__tag">Remote</span>
                            <span className="job-details__tag">Senior Level</span>
                        </div>

                        <div className="job-details__section">
                            <h3>Job Description</h3>
                            <p>We are looking for a Senior Software Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.</p>
                        </div>

                        <div className="job-details__section">
                            <h3>Requirements</h3>
                            <ul>
                                <li>5+ years of experience in software development</li>
                                <li>Proficiency in React, Node.js, and TypeScript</li>
                                <li>Experience with cloud services (AWS/GCP/Azure)</li>
                                <li>Strong understanding of system design principles</li>
                                <li>Excellent communication and teamwork skills</li>
                            </ul>
                        </div>

                        <div className="job-details__section">
                            <h3>Benefits</h3>
                            <ul>
                                <li>Competitive salary: $120K - $180K</li>
                                <li>Health, dental, and vision insurance</li>
                                <li>401(k) with company match</li>
                                <li>Flexible remote work policy</li>
                                <li>Professional development budget</li>
                            </ul>
                        </div>
                    </div>

                    <div className="job-details__sidebar">
                        <div className="job-details__apply-card glass-card">
                            <h3 className="job-details__apply-title">Apply for this position</h3>
                            <p className="job-details__salary">$120K - $180K / year</p>
                            <div className="job-details__info">
                                <div className="job-details__info-item">
                                    <span className="job-details__info-label">Location</span>
                                    <span className="job-details__info-value">New York, NY</span>
                                </div>
                                <div className="job-details__info-item">
                                    <span className="job-details__info-label">Job Type</span>
                                    <span className="job-details__info-value">Full-Time</span>
                                </div>
                                <div className="job-details__info-item">
                                    <span className="job-details__info-label">Posted</span>
                                    <span className="job-details__info-value">2 days ago</span>
                                </div>
                            </div>
                            <Button variant="primary" size="lg" className="job-details__apply-btn">Apply Now</Button>
                            <Button variant="outline" size="md" className="job-details__save-btn">Save Job</Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default JobDetails;
