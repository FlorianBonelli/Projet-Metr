import React from 'react';
import './Sidebar.css';
// Utilisez des icônes React. Par exemple, si vous utilisez 'react-icons' :
// import { MdDashboard, MdOutlineStorage, MdOutlineNotifications, MdOutlineAccountCircle, MdOutlineFolderOpen } from 'react-icons/md';
// Pour la simplicité de l'exemple, nous allons utiliser de simples divs pour les icônes.

const Sidebar = () => {
    // Données pour les liens de navigation
    const navLinks = [
        { icon: '::', label: 'Tableau de bord', link: '/dashboard' },
        { icon: '📦', label: 'Projet', link: '/projet' },
        { icon: '📚', label: 'Bibliothèque', link: '/bibliotheque' },
        { icon: '🔔', label: 'Notification', link: '/notifications' },
        { icon: '👤', label: 'Profil', link: '/profil' },
    ];

    // Données pour les projets récents
    const recentProjects = [
        { icon: '📑', label: 'Rénovation Paris' },
        { icon: '📑', label: 'Costa Architectes' },
        { icon: '📑', label: 'Groupe Carrefour' },
    ];

    return (
        <div className="sidebar-container">
            {/* 1. Section Profil */}
            <div className="profile-section">
                <div className="avatar-placeholder">
                    {/*  */}
                </div>
                <div className="username">ANTOINE</div>
            </div>

            {/* 2. Section Liens de Navigation Principaux */}
            <nav className="nav-links">
                {navLinks.map((item) => (
                    <a key={item.label} href={item.link} className="nav-item">
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </a>
                ))}
            </nav>

            {/* 3. Section Récent */}
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

            {/* 4. Section Call-to-Action (CTA) */}
            <div className="cta-section">
                <div className="cta-text">Let's start!</div>
                <div className="cta-subtext">Créer un nouveau projet de</div>
                <button className="cta-button">
                    <span className="icon">⏱</span> Créer un projet
                </button>
            </div>
            
            {/* Bouton de bascule (flèche orange) */}
            <div className="toggle-button">
                <span className="arrow">{'<'}</span>
            </div>

        </div>
    );
};

export default Sidebar;