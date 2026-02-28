import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import './Notifications.css';

const Notifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchNotifs = async () => {
            try {
                const q = query(
                    collection(db, 'notifications'),
                    where('recipientId', '==', user.uid)
                );
                const snap = await getDocs(q);
                const notifs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                // Sort client-side: newest first
                notifs.sort((a, b) => {
                    const ta = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
                    const tb = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
                    return tb - ta;
                });
                setNotifications(notifs);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifs();
    }, [user]);

    const markAsRead = async (notifId) => {
        try {
            await updateDoc(doc(db, 'notifications', notifId), { read: true });
            setNotifications((prev) =>
                prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error('Mark read error:', err);
        }
    };

    const markAllRead = async () => {
        try {
            const unread = notifications.filter((n) => !n.read);
            await Promise.all(
                unread.map((n) => updateDoc(doc(db, 'notifications', n.id), { read: true }))
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error('Mark all read error:', err);
        }
    };

    const handleClick = (notif) => {
        if (!notif.read) markAsRead(notif.id);

        if (notif.type === 'new_application') {
            const params = new URLSearchParams();
            if (notif.applicantId) params.set('applicant', notif.applicantId);
            if (notif.jobId) params.set('job', notif.jobId);
            navigate(`/dashboard/employer/applications?${params.toString()}`);
        } else if (notif.type === 'new_message') {
            navigate(`/messages/${notif.conversationId || ''}`);
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        const date = ts?.toDate ? ts.toDate() : new Date(ts);
        const now = Date.now();
        const diff = Math.floor((now - date.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'new_application': return '📩';
            case 'new_message': return '💬';
            default: return '🔔';
        }
    };

    const getMessage = (notif) => {
        switch (notif.type) {
            case 'new_application':
                return <><strong>{notif.applicantName || 'Someone'}</strong> applied for <strong>{notif.jobTitle || 'your job'}</strong></>;
            case 'new_message':
                return <><strong>{notif.fromName || 'Someone'}</strong> sent you a message about <strong>{notif.jobTitle || 'a job'}</strong></>;
            default:
                return 'You have a new notification';
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (loading) {
        return (
            <main className="notifs-page section">
                <div className="container">
                    <div className="notifs-page__loading">Loading notifications...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="notifs-page section">
            <div className="container">
                <div className="notifs-page__header">
                    <div>
                        <h1 className="notifs-page__title">🔔 Notifications</h1>
                        <p className="notifs-page__subtitle">
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button className="notifs-page__mark-all" onClick={markAllRead}>
                            ✓ Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="notifs-page__empty">
                        <span className="notifs-page__empty-icon">🔕</span>
                        <h3>No notifications yet</h3>
                        <p>You'll be notified when someone applies to your jobs or sends you a message.</p>
                    </div>
                ) : (
                    <div className="notifs-page__list">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`notifs-page__item ${!notif.read ? 'notifs-page__item--unread' : ''}`}
                                onClick={() => handleClick(notif)}
                            >
                                <span className="notifs-page__item-icon">{getIcon(notif.type)}</span>
                                <div className="notifs-page__item-content">
                                    <p className="notifs-page__item-msg">{getMessage(notif)}</p>
                                    {notif.type === 'new_message' && notif.messagePreview && (
                                        <p className="notifs-page__item-preview">"{notif.messagePreview}"</p>
                                    )}
                                    <span className="notifs-page__item-time">{formatTime(notif.createdAt)}</span>
                                </div>
                                {!notif.read && <span className="notifs-page__item-dot"></span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Notifications;
