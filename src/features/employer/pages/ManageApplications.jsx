import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import useAuth from '../../../hooks/useAuth';
import employerService from '../services/employerService';
import './ManageApplications.css';

const ManageApplications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterJob, setFilterJob] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedApp, setExpandedApp] = useState(null);
    const [toast, setToast] = useState('');
    const [msgModal, setMsgModal] = useState(null);
    const [msgText, setMsgText] = useState('');
    const [sending, setSending] = useState(false);

    /* Fetch employer's jobs + their applications */
    useEffect(() => {
        if (!user) return;
        const fetchAll = async () => {
            try {
                // 1. Get employer's jobs
                const myJobs = await employerService.getEmployerJobs(user.uid);
                setJobs(myJobs);

                if (myJobs.length === 0) {
                    setLoading(false);
                    return;
                }

                // 2. Get all applications for these jobs
                const jobIds = myJobs.map((j) => j.id);
                // Firestore "in" supports max 30, chunk if needed
                const chunks = [];
                for (let i = 0; i < jobIds.length; i += 30) {
                    chunks.push(jobIds.slice(i, i + 30));
                }

                let allApps = [];
                for (const chunk of chunks) {
                    const q = query(
                        collection(db, 'applications'),
                        where('jobId', 'in', chunk),
                        orderBy('appliedAt', 'desc')
                    );
                    const snap = await getDocs(q);
                    allApps = [...allApps, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))];
                }
                setApplications(allApps);
            } catch (err) {
                console.error('Error fetching applications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [user]);

    /* Filtered applications */
    const filtered = useMemo(() => {
        return applications.filter((app) => {
            if (filterJob !== 'all' && app.jobId !== filterJob) return false;
            if (filterStatus !== 'all' && app.status !== filterStatus) return false;
            return true;
        });
    }, [applications, filterJob, filterStatus]);

    /* Stats */
    const stats = useMemo(() => ({
        total: applications.length,
        pending: applications.filter((a) => a.status === 'pending').length,
        reviewed: applications.filter((a) => a.status === 'reviewed').length,
        shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
        rejected: applications.filter((a) => a.status === 'rejected').length,
    }), [applications]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    /* Update application status */
    const updateStatus = async (appId, newStatus) => {
        try {
            await updateDoc(doc(db, 'applications', appId), {
                status: newStatus,
                reviewedAt: serverTimestamp(),
            });
            setApplications((prev) =>
                prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
            );
            showToast(`✅ Status updated to "${newStatus}"`);
        } catch (err) {
            console.error('Status update error:', err);
            showToast('❌ Failed to update status');
        }
    };

    /* Start conversation */
    const handleSendMessage = async () => {
        if (!msgText.trim() || !msgModal) return;
        setSending(true);
        try {
            // Create conversation
            const convRef = await addDoc(collection(db, 'messages'), {
                participants: [user.uid, msgModal.userId],
                employerId: user.uid,
                seekerId: msgModal.userId,
                employerName: user.displayName || user.name || user.email || '',
                seekerName: msgModal.fullName || msgModal.email || '',
                jobId: msgModal.jobId || '',
                jobTitle: msgModal.jobTitle || '',
                lastMessage: msgText.trim(),
                lastMessageAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            });

            // Add first message
            await addDoc(collection(db, 'messages', convRef.id, 'chats'), {
                senderId: user.uid,
                senderName: user.displayName || user.name || user.email || '',
                text: msgText.trim(),
                sentAt: serverTimestamp(),
            });

            // Notify the job seeker
            await addDoc(collection(db, 'notifications'), {
                recipientId: msgModal.userId,
                type: 'new_message',
                fromName: user.displayName || user.name || user.email || '',
                conversationId: convRef.id,
                jobTitle: msgModal.jobTitle || '',
                messagePreview: msgText.trim().substring(0, 100),
                read: false,
                createdAt: serverTimestamp(),
            });

            showToast('✅ Message sent!');
            setMsgModal(null);
            setMsgText('');
        } catch (err) {
            console.error('Send message error:', err);
            showToast('❌ Failed to send message');
        } finally {
            setSending(false);
        }
    };

    /* Time formatting */
    const formatDate = (ts) => {
        if (!ts) return '—';
        const d = ts?.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const statusColors = {
        pending: '#f5b400',
        reviewed: '#3498db',
        shortlisted: '#2ecc71',
        rejected: '#e74c3c',
    };

    if (loading) {
        return (
            <main className="manage-apps section">
                <div className="container">
                    <div className="manage-apps__loading">Loading applications...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="manage-apps section">
            <div className="container">
                {toast && <div className="manage-apps__toast">{toast}</div>}

                {/* Header */}
                <div className="manage-apps__header">
                    <div>
                        <div className="manage-apps__breadcrumb">
                            <Link to="/dashboard/employer" className="manage-apps__breadcrumb-link">Dashboard</Link>
                            <span className="manage-apps__breadcrumb-sep">/</span>
                            <span>Applications</span>
                        </div>
                        <h1 className="manage-apps__title">Manage Applications</h1>
                        <p className="manage-apps__subtitle">Review and manage all job applications</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="manage-apps__stats">
                    <div className="manage-apps__stat-card">
                        <span className="manage-apps__stat-value">{stats.total}</span>
                        <span className="manage-apps__stat-label">Total</span>
                    </div>
                    <div className="manage-apps__stat-card manage-apps__stat-card--pending">
                        <span className="manage-apps__stat-value">{stats.pending}</span>
                        <span className="manage-apps__stat-label">Pending</span>
                    </div>
                    <div className="manage-apps__stat-card manage-apps__stat-card--reviewed">
                        <span className="manage-apps__stat-value">{stats.reviewed}</span>
                        <span className="manage-apps__stat-label">Reviewed</span>
                    </div>
                    <div className="manage-apps__stat-card manage-apps__stat-card--shortlisted">
                        <span className="manage-apps__stat-value">{stats.shortlisted}</span>
                        <span className="manage-apps__stat-label">Shortlisted</span>
                    </div>
                    <div className="manage-apps__stat-card manage-apps__stat-card--rejected">
                        <span className="manage-apps__stat-value">{stats.rejected}</span>
                        <span className="manage-apps__stat-label">Rejected</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="manage-apps__filters glass-card">
                    <div className="manage-apps__filter">
                        <label>Filter by Job</label>
                        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}>
                            <option value="all">All Jobs</option>
                            {jobs.map((j) => (
                                <option key={j.id} value={j.id}>{j.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="manage-apps__filter">
                        <label>Status</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="manage-apps__filter-count">
                        Showing <strong>{filtered.length}</strong> of {applications.length}
                    </div>
                </div>

                {/* Applications List */}
                {filtered.length === 0 ? (
                    <div className="manage-apps__empty">
                        <span className="manage-apps__empty-icon">📭</span>
                        <h3>No applications found</h3>
                        <p>{applications.length === 0 ? "You haven't received any applications yet." : 'No applications match your filters.'}</p>
                    </div>
                ) : (
                    <div className="manage-apps__list">
                        {filtered.map((app) => (
                            <div key={app.id} className={`manage-apps__card glass-card ${expandedApp === app.id ? 'manage-apps__card--expanded' : ''}`}>
                                {/* Card Header */}
                                <div className="manage-apps__card-header" onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}>
                                    <div className="manage-apps__card-avatar">
                                        {(app.fullName || app.email || '?')[0].toUpperCase()}
                                    </div>
                                    <div className="manage-apps__card-info">
                                        <h3 className="manage-apps__card-name">{app.fullName || 'Unknown'}</h3>
                                        <p className="manage-apps__card-meta">
                                            {app.email} • Applied for <strong>{app.jobTitle || 'Job'}</strong>
                                        </p>
                                    </div>
                                    <div className="manage-apps__card-right">
                                        <span className="manage-apps__card-date">{formatDate(app.appliedAt)}</span>
                                        <span className="manage-apps__card-status" style={{ color: statusColors[app.status] || '#aaa', borderColor: statusColors[app.status] || '#aaa' }}>
                                            {app.status}
                                        </span>
                                        <span className={`manage-apps__chevron ${expandedApp === app.id ? 'manage-apps__chevron--open' : ''}`}>▾</span>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {expandedApp === app.id && (
                                    <div className="manage-apps__card-detail">
                                        <div className="manage-apps__detail-grid">
                                            <div className="manage-apps__detail-item">
                                                <span className="manage-apps__detail-label">📧 Email</span>
                                                <span className="manage-apps__detail-value">{app.email || '—'}</span>
                                            </div>
                                            <div className="manage-apps__detail-item">
                                                <span className="manage-apps__detail-label">📱 Phone</span>
                                                <span className="manage-apps__detail-value">{app.phone || '—'}</span>
                                            </div>
                                            <div className="manage-apps__detail-item">
                                                <span className="manage-apps__detail-label">💼 Current Role</span>
                                                <span className="manage-apps__detail-value">{app.currentRole || '—'}</span>
                                            </div>
                                            <div className="manage-apps__detail-item">
                                                <span className="manage-apps__detail-label">📊 Experience</span>
                                                <span className="manage-apps__detail-value">{app.experience || '—'}</span>
                                            </div>
                                            <div className="manage-apps__detail-item">
                                                <span className="manage-apps__detail-label">🎓 Education</span>
                                                <span className="manage-apps__detail-value">{app.education || '—'}</span>
                                            </div>
                                            <div className="manage-apps__detail-item">
                                                <span className="manage-apps__detail-label">🔗 Portfolio</span>
                                                <span className="manage-apps__detail-value">
                                                    {app.portfolio ? (
                                                        <a href={app.portfolio} target="_blank" rel="noopener noreferrer">{app.portfolio}</a>
                                                    ) : '—'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Resume */}
                                        {app.resumeURL && (
                                            <div className="manage-apps__resume">
                                                <span>📄 Resume:</span>
                                                <a href={app.resumeURL} target="_blank" rel="noopener noreferrer" className="manage-apps__resume-link">
                                                    {app.resumeFileName || 'Download Resume'}
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                                                </a>
                                            </div>
                                        )}

                                        {/* Cover Letter */}
                                        {app.coverLetter && (
                                            <div className="manage-apps__cover">
                                                <h4>✉️ Cover Letter</h4>
                                                <p>{app.coverLetter}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="manage-apps__actions">
                                            <div className="manage-apps__status-btns">
                                                {['pending', 'reviewed', 'shortlisted', 'rejected'].map((s) => (
                                                    <button
                                                        key={s}
                                                        className={`manage-apps__status-btn ${app.status === s ? 'manage-apps__status-btn--active' : ''}`}
                                                        style={app.status === s ? { borderColor: statusColors[s], color: statusColors[s] } : {}}
                                                        onClick={() => updateStatus(app.id, s)}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                            <button className="manage-apps__msg-btn" onClick={() => setMsgModal(app)}>
                                                💬 Send Message
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ═══ Message Modal ═══ */}
                {msgModal && (
                    <div className="msg-modal-overlay" onClick={() => !sending && setMsgModal(null)}>
                        <div className="msg-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="msg-modal__header">
                                <h3>Send Message to {msgModal.fullName || msgModal.email}</h3>
                                <button className="msg-modal__close" onClick={() => !sending && setMsgModal(null)}>✕</button>
                            </div>
                            <div className="msg-modal__body">
                                <p className="msg-modal__context">Re: Application for <strong>{msgModal.jobTitle}</strong></p>
                                <textarea
                                    className="msg-modal__input"
                                    rows={5}
                                    value={msgText}
                                    onChange={(e) => setMsgText(e.target.value)}
                                    placeholder="Write your message here..."
                                    autoFocus
                                />
                            </div>
                            <div className="msg-modal__actions">
                                <button className="msg-modal__cancel" onClick={() => !sending && setMsgModal(null)} disabled={sending}>Cancel</button>
                                <button className="msg-modal__send" onClick={handleSendMessage} disabled={sending || !msgText.trim()}>
                                    {sending ? 'Sending...' : '📨 Send Message'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ManageApplications;
