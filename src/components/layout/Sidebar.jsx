import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ items = [], title = 'Dashboard' }) => {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <h3 className="sidebar__title">{title}</h3>
            </div>
            <nav className="sidebar__nav">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar__link ${location.pathname === item.path ? 'sidebar__link--active' : ''}`}
                    >
                        {item.icon && <span className="sidebar__icon">{item.icon}</span>}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
