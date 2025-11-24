import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Import des icônes SVG
import AccueilIcon from '../assets/images/accueil.svg';
import ProjetIcon from '../assets/images/projet.svg';
import BibliothequeIcon from '../assets/images/bibliothèque.svg';
import NotificationIcon from '../assets/images/notification.svg';
import ProfilIcon from '../assets/images/profil.svg';

const navLinks = [
    { icon: AccueilIcon, label: 'Tableau de bord', link: '/dashboard' },
    { icon: ProjetIcon, label: 'Projet', link: '/projet' },
    { icon: BibliothequeIcon, label: 'Bibliothèque', link: '/bibliotheques' },
    { icon: NotificationIcon, label: 'Notification', link: '/notif' },
    { icon: ProfilIcon, label: 'Profil', link: '/profil' },
];

const recentProjects = [
    { icon: ProjetIcon, label: 'Rénovation Paris' },
    { icon: ProjetIcon, label: 'Costa Architectes' },
    { icon: ProjetIcon, label: 'Groupe Carrefour' },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar-container">
            <div className="profile-section">
                <div className="avatar-placeholder"></div>
                <div className="username">ANTOINE</div>
            </div>

            <nav className="nav-links">
                {navLinks.map((item) => (
                    <Link
                        key={item.label}
                        to={item.link}
                        className={`nav-item${location.pathname === item.link ? ' active' : ''}`}
                    >
                        <span className="icon">
                            <img src={item.icon} alt={item.label} />
                        </span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="recent-section">
                <div className="recent-header">RÉCENT</div>
                <div className="recent-list">
                    {recentProjects.map((item) => (
                        <div key={item.label} className="recent-item">
                            <span className="icon">
                                <img src={item.icon} alt="Projet" />
                            </span>
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="cta-section">
                <div className="cta-text">Let's start!</div>
                <div className="cta-subtext">Créer un nouveau projet de</div>
                <Link to="/creation-projet" className="cta-button">
                    <span className="icon">⏱</span> Créer un projet
                </Link>
            </div>

            <div className="toggle-button">
                <span className="arrow">{'<'}</span>
            </div>
        </div>
    );
};

export default Sidebar;
