import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navLinks = [
        { icon: '::', label: 'Tableau de bord', link: '/dashboard' },
        { icon: '📦', label: 'Projet', link: '/projet' },
        { icon: '📚', label: 'Bibliothèque', link: '/bibliotheque' },
        { icon: '🔔', label: 'Notification', link: '/notifications' },
        { icon: '👤', label: 'Profil', link: '/profil' },
    ];

    const recentProjects = [
        { icon: '📑', label: 'Rénovation Paris' },
        { icon: '📑', label: 'Costa Architectes' },
        { icon: '📑', label: 'Groupe Carrefour' },
    ];

    return (
        <div className="sidebar-container">
            <div className="profile-section">
                <div className="avatar-placeholder"></div>
                <div className="username">ANTOINE</div>
            </div>

            <nav className="nav-links">
                {navLinks.map((item) => (
                    <Link key={item.label} to={item.link} className="nav-item">
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="recent-section">
                <div className="recent-header">RÉCENT</div>
                <div className="recent-list">
                    {recentProjects.map((item) => (
                        <div key={item.label} className="recent-item">
                            <span className="icon">{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="cta-section">
                <div className="cta-text">Let's start!</div>
                <div className="cta-subtext">Créer un nouveau projet de</div>
                <button className="cta-button">
                    <span className="icon">⏱</span> Créer un projet
                </button>
            </div>
            
            <div className="toggle-button">
                <span className="arrow">{'<'}</span>
            </div>
        </div>
    );
};
 
export default Sidebar;