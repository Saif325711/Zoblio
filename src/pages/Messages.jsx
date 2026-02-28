import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    collection, query, where, getDocs, addDoc, doc, updateDoc,
    orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import './Messages.css';

const Messages = () => {
    const { conversationId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msgText, setMsgText] = useState('');
    const [sending, setSending] = useState(false);
    const [mobileShowChat, setMobileShowChat] = useState(false);

    /* Fetch conversations */
    useEffect(() => {
        if (!user) return;
        const fetchConvs = async () => {
            try {
                const q = query(
                    collection(db, 'messages'),
                    where('participants', 'array-contains', user.uid)
                );
                const snap = await getDocs(q);
                const rawConvs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                // Sort client-side: latest first
                rawConvs.sort((a, b) => {
                    const ta = a.lastMessageAt?.toDate?.() ? a.lastMessageAt.toDate().getTime() : new Date(a.lastMessageAt || 0).getTime();
                    const tb = b.lastMessageAt?.toDate?.() ? b.lastMessageAt.toDate().getTime() : new Date(b.lastMessageAt || 0).getTime();
                    return tb - ta;
                });
                setConversations(rawConvs);
                const convs = rawConvs;

                // Auto-select from URL param or first conversation
                if (conversationId) {
                    const found = convs.find((c) => c.id === conversationId);
                    if (found) {
                        setActiveConv(found);
                        setMobileShowChat(true);
                    }
                } else if (convs.length > 0) {
                    setActiveConv(convs[0]);
                }
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConvs();
    }, [user, conversationId]);

    /* Listen for messages in active conversation */
    useEffect(() => {
        if (!activeConv) {
            setMessages([]);
            return;
        }

        const q = query(
            collection(db, 'messages', activeConv.id, 'chats'),
            orderBy('sentAt', 'asc')
        );

        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        return () => unsub();
    }, [activeConv]);

    /* Send message */
    const handleSend = async (e) => {
        e.preventDefault();
        if (!msgText.trim() || !activeConv || sending) return;

        setSending(true);
        try {
            // Add chat message
            await addDoc(collection(db, 'messages', activeConv.id, 'chats'), {
                senderId: user.uid,
                senderName: user.displayName || user.name || user.email || '',
                text: msgText.trim(),
                sentAt: serverTimestamp(),
            });

            // Update conversation's last message
            await updateDoc(doc(db, 'messages', activeConv.id), {
                lastMessage: msgText.trim(),
                lastMessageAt: serverTimestamp(),
            });

            // Notify recipient
            const recipientId = activeConv.participants?.find((p) => p !== user.uid);
            if (recipientId) {
                try {
                    await addDoc(collection(db, 'notifications'), {
                        recipientId,
                        type: 'new_message',
                        fromName: user.displayName || user.name || user.email || '',
                        conversationId: activeConv.id,
                        jobTitle: activeConv.jobTitle || '',
                        messagePreview: msgText.trim().substring(0, 100),
                        read: false,
                        createdAt: serverTimestamp(),
                    });
                } catch (_) { /* silent */ }
            }

            setMsgText('');
        } catch (err) {
            console.error('Send error:', err);
        } finally {
            setSending(false);
        }
    };

    /* Format time */
    const formatTime = (ts) => {
        if (!ts) return '';
        const d = ts?.toDate ? ts.toDate() : new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' ' +
            d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const getOtherName = (conv) => {
        if (!user) return 'Unknown';
        return conv.employerId === user.uid ? (conv.seekerName || 'Job Seeker') : (conv.employerName || 'Employer');
    };

    const selectConversation = (conv) => {
        setActiveConv(conv);
        setMobileShowChat(true);
        navigate(`/messages/${conv.id}`, { replace: true });
    };

    if (loading) {
        return (
            <main className="messages-page section">
                <div className="container">
                    <div className="messages-page__loading">Loading messages...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="messages-page section">
            <div className="container">
                <div className="messages-page__layout">
                    {/* ── Conversation List ── */}
                    <div className={`messages-page__sidebar ${mobileShowChat ? 'messages-page__sidebar--hidden-mobile' : ''}`}>
                        <div className="messages-page__sidebar-header">
                            <h2>💬 Messages</h2>
                        </div>
                        {conversations.length === 0 ? (
                            <div className="messages-page__no-convs">
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            <div className="messages-page__conv-list">
                                {conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        className={`messages-page__conv-item ${activeConv?.id === conv.id ? 'messages-page__conv-item--active' : ''}`}
                                        onClick={() => selectConversation(conv)}
                                    >
                                        <div className="messages-page__conv-avatar">
                                            {getOtherName(conv)[0].toUpperCase()}
                                        </div>
                                        <div className="messages-page__conv-info">
                                            <h4 className="messages-page__conv-name">{getOtherName(conv)}</h4>
                                            {conv.jobTitle && <span className="messages-page__conv-job">Re: {conv.jobTitle}</span>}
                                            <p className="messages-page__conv-last">{conv.lastMessage || 'No messages yet'}</p>
                                        </div>
                                        <span className="messages-page__conv-time">{formatTime(conv.lastMessageAt)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Chat Window ── */}
                    <div className={`messages-page__chat ${mobileShowChat ? 'messages-page__chat--show-mobile' : ''}`}>
                        {activeConv ? (
                            <>
                                <div className="messages-page__chat-header">
                                    <button className="messages-page__back-btn" onClick={() => setMobileShowChat(false)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                                    </button>
                                    <div className="messages-page__chat-avatar">
                                        {getOtherName(activeConv)[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="messages-page__chat-name">{getOtherName(activeConv)}</h3>
                                        {activeConv.jobTitle && (
                                            <span className="messages-page__chat-job">Re: {activeConv.jobTitle}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="messages-page__chat-body">
                                    {messages.length === 0 ? (
                                        <div className="messages-page__chat-empty">
                                            <p>Start the conversation...</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`messages-page__bubble ${msg.senderId === user?.uid ? 'messages-page__bubble--mine' : 'messages-page__bubble--theirs'}`}
                                            >
                                                <p className="messages-page__bubble-text">{msg.text}</p>
                                                <span className="messages-page__bubble-time">{formatTime(msg.sentAt)}</span>
                                            </div>
                                        ))
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <form className="messages-page__chat-input" onSubmit={handleSend}>
                                    <input
                                        type="text"
                                        value={msgText}
                                        onChange={(e) => setMsgText(e.target.value)}
                                        placeholder="Type a message..."
                                        autoFocus
                                    />
                                    <button type="submit" disabled={sending || !msgText.trim()}>
                                        {sending ? '...' : '📨'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="messages-page__no-chat">
                                <span>💬</span>
                                <h3>Select a conversation</h3>
                                <p>Choose a conversation from the left to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Messages;
