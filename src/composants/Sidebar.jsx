import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { projectService, modificationService } from '../db/database';
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


const Sidebar = () => {
    const location = useLocation();
    const [userFirstName, setUserFirstName] = useState('UTILISATEUR');
    const [recentProjects, setRecentProjects] = useState([]);
    const [unseenNotificationsCount, setUnseenNotificationsCount] = useState(0);

    // Fonction pour tronquer les noms trop longs
    const truncateProjectName = (name, maxLength = 20) => {
        if (!name) return '';
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength - 3) + '...';
    };

    // Fonction pour charger les projets récents
    const loadRecentProjects = async () => {
        try {
            // Récupérer l'ID de l'utilisateur connecté
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                const userId = userData.id_utilisateur || userData.id;
                
                if (userId) {
                    // Récupérer uniquement les projets récents de l'utilisateur connecté
                    const projects = await projectService.getRecentProjects(2, userId);
                    setRecentProjects(projects);
                } else {
                    console.warn('ID utilisateur non trouvé');
                    setRecentProjects([]);
                }
            } else {
                console.warn('Informations utilisateur non trouvées');
                setRecentProjects([]);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des projets récents:', error);
            setRecentProjects([]);
        }
    };

    // Fonction pour charger le nombre de notifications non vues
    const loadUnseenNotificationsCount = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                const userId = userData.id_utilisateur || userData.id;
                
                if (userId) {
                    const count = await modificationService.getUnseenNotificationsCount(userId);
                    setUnseenNotificationsCount(count);
                } else {
                    setUnseenNotificationsCount(0);
                }
            } else {
                setUnseenNotificationsCount(0);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du nombre de notifications:', error);
            setUnseenNotificationsCount(0);
        }
    };

    useEffect(() => {
        // Récupérer les informations de l'utilisateur depuis localStorage
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsedUserInfo = JSON.parse(userInfo);
                if (parsedUserInfo.prenom) {
                    setUserFirstName(parsedUserInfo.prenom.toUpperCase());
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
            }
        }

        // Charger les projets récents et les notifications au montage du composant
        loadRecentProjects();
        loadUnseenNotificationsCount();
    }, []);

    // Écouter les changements dans les projets pour mise à jour automatique
    useEffect(() => {
        const handleProjectUpdate = () => {
            loadRecentProjects();
        };

        // Écouter les événements personnalisés de mise à jour de projet
        window.addEventListener('projectUpdated', handleProjectUpdate);
        window.addEventListener('projectCreated', handleProjectUpdate);
        window.addEventListener('projectDeleted', handleProjectUpdate);

        return () => {
            window.removeEventListener('projectUpdated', handleProjectUpdate);
            window.removeEventListener('projectCreated', handleProjectUpdate);
            window.removeEventListener('projectDeleted', handleProjectUpdate);
        };
    }, []);

    return (
        <div className="sidebar-container">
            <div className="profile-section">
                <div className="avatar-placeholder"></div>
                <div className="username">{userFirstName}</div>
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
                            {item.label === 'Notification' && unseenNotificationsCount > 0 && (
                                <span className="notification-badge">{unseenNotificationsCount}</span>
                            )}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="recent-section">
                <div className="recent-header">RÉCENT</div>
                <div className="recent-list">
                    {recentProjects.map((project) => (
                        <div key={project.id} className="recent-item">
                            <span className="icon">
                                <img src={ProjetIcon} alt="Projet" />
                            </span>
                            {truncateProjectName(project.nom)}
                        </div>
                    ))}
                </div>
            </div>

            <div className="cta-section">
                <div className="cta-text">Let's start!</div>
                <div className="cta-subtext">Créer un nouveau projet de manière simple et efficace</div>
                <Link to="/creation-projet" className="cta-button">
                    <span className="icon">+</span>Créer un projet
                </Link>
            </div>

            <div className="toggle-button">
                <span className="arrow">?</span>
            </div>
        </div>
    );
};

export default Sidebar;
