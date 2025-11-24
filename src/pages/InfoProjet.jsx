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
                <div className="info-projet-background" />
                <div className="info-projet-inner">
                    <header className="info-projet-header">
                        <div>
                            <p className="hero-kicker">Projet · Bibliothèque métrés</p>
                            <h1 className="page-title">{project.nom}</h1>
                            <p className="hero-caption">Dernière modification le 26 novembre 2025</p>
                        </div>
                        <div className="header-actions">
                            <button className="chip-button active">
                                <span className="chip-icon">👥</span>
                                Collaborateurs
                            </button>
                            <button className="chip-button">
                                Toutes les bibliothèques (6 articles)
                            </button>
                            <button className="chip-button icon-only">+</button>
                        </div>
                    </header>

                    <main className="info-projet-sections">
                        <HistoriquePlan projectId={projectId} />
                        <div className="secondary-panels">
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