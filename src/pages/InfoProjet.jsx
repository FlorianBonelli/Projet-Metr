import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../composants/Sidebar';
import HistoriquePlan from '../composants/HistoriquePlan';
import AutreDoc from '../composants/AutreDoc';
import HistoriqueExport from '../composants/HistoriqueExport';
import { projectService } from '../db/database';
import './InfoProjet.css';

const InfoProjet = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                if (projectId) {
                    const projectData = await projectService.getProjectById(parseInt(projectId, 10));
                    setProject(projectData);
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
    }, [projectId]);

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
                        <div className="collaborateurs-dropdown">
                            <span className="collaborateurs-icon">👥</span>
                            <span>Collaborateurs</span>
                        </div>
                        <div className="bibliotheques-dropdown">
                            <span>Toutes les bibliothèques (6 articles)</span>
                            <span className="dropdown-arrow">▼</span>
                        </div>
                        <button className="add-button">+</button>
                    </div>

                    <main className="content-sections">
                        <HistoriquePlan projectId={projectId} />
                        <div className="bottom-sections">
                            <AutreDoc projectId={projectId} />
                            <HistoriqueExport projectId={projectId} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default InfoProjet;