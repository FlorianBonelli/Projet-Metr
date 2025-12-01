import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../composants/Sidebar';
import HistoriquePlan from '../composants/HistoriquePlan';
import AutreDoc from '../composants/AutreDoc';
import HistoriqueExport from '../composants/HistoriqueExport';
import CollaborateursModal from '../composants/CollaborateursModal';
import { projectService } from '../db/database';
import './InfoProjet.css';

const InfoProjet = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCollaborateursModal, setShowCollaborateursModal] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'owner', 'edition', 'lecture'
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        // Récupérer l'utilisateur connecté
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                setCurrentUserId(userData.id_utilisateur || userData.id);
            }
        } catch (e) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', e);
        }
    }, []);

    useEffect(() => {
        const loadProject = async () => {
            try {
                if (projectId && currentUserId) {
                    const projectData = await projectService.getProjectById(parseInt(projectId, 10));
                    setProject(projectData);

                    // Déterminer le rôle de l'utilisateur sur ce projet
                    if (projectData.user_id === currentUserId) {
                        setIsOwner(true);
                        setUserRole('owner');
                    } else {
                        // Vérifier si l'utilisateur est collaborateur
                        const collaborators = await projectService.getProjectCollaborators(parseInt(projectId, 10));
                        const userCollab = collaborators.find(c => (c.id_utilisateur || c.id) === currentUserId);
                        if (userCollab) {
                            setUserRole(userCollab.role);
                            setIsOwner(false);
                        } else {
                            setUserRole(null);
                            setIsOwner(false);
                        }
                    }
                } else if (projectId && !currentUserId) {
                    // Attendre que currentUserId soit chargé
                    return;
                } else {
                    setError('ID de projet manquant');
                }
            } catch (err) {
                console.error('Erreur lors du chargement du projet:', err);
                setError('Erreur lors du chargement du projet');
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [projectId, currentUserId]);

    // Fonction pour vérifier si l'utilisateur peut éditer
    const canEdit = () => {
        return userRole === 'owner' || userRole === 'edition';
    };

    const renderState = (content) => (
        <div className="info-projet-page">
            <Sidebar />
            <div className="info-projet-content">
                <div className="info-projet-inner">
                    {content}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return renderState(<div className="loading-message">Chargement du projet...</div>);
    }

    if (error || !project) {
        return renderState(
            <div className="error-card">
                <div className="error-message">{error || 'Projet non trouvé'}</div>
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    Retour au tableau de bord
                </button>
            </div>
        );
    }

    return (
        <div className="info-projet-page">
            <Sidebar />
            <div className="info-projet-content">
                <div className="info-projet-container">
                    <header className="info-projet-header">
                        <div className="header-left">
                            <h1 className="project-title">{project.nom}</h1>
                        </div>
                        <div className="header-right">
                            <div className="metr-logo">Metr.</div>
                        </div>
                    </header>

                    <div className="collaborateurs-section">
                        <button 
                            className="collaborateurs-dropdown"
                            onClick={() => setShowCollaborateursModal(true)}
                        >
                            <span className="collaborateurs-icon">👥</span>
                            <span>Collaborateurs</span>
                        </button>
                        <div className="bibliotheques-dropdown">
                            <span>Toutes les bibliothèques (6 articles)</span>
                            <span className="dropdown-arrow">▼</span>
                        </div>
                        {canEdit() && (
                            <button className="add-button" onClick={() => setShowCollaborateursModal(true)}>+</button>
                        )}
                        {userRole === 'lecture' && (
                            <span className="readonly-badge">Lecture seule</span>
                        )}
                    </div>

                    <main className="content-sections">
                        <HistoriquePlan projectId={projectId} canEdit={canEdit()} />
                        <div className="bottom-sections">
                            <AutreDoc projectId={projectId} canEdit={canEdit()} />
                            <HistoriqueExport projectId={projectId} canEdit={canEdit()} />
                        </div>
                    </main>
                </div>
            </div>

            <CollaborateursModal
                isOpen={showCollaborateursModal}
                onClose={() => setShowCollaborateursModal(false)}
                projectId={parseInt(projectId, 10)}
                currentUserId={currentUserId}
                isOwner={isOwner}
            />
        </div>
    );
};

export default InfoProjet;