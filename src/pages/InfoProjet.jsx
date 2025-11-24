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

    if (loading) {
        return (
            <div className="info-projet-page">
                <Sidebar />
                <div className="info-projet-content page-padding">
                    <div className="loading-message">Chargement du projet...</div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="info-projet-page">
                <Sidebar />
                <div className="info-projet-content page-padding">
                    <div className="error-message">{error || 'Projet non trouvé'}</div>
                    <button onClick={() => navigate('/dashboard')} className="back-button">
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="info-projet-page">
            <Sidebar />
            <div className="info-projet-content page-padding">
                <div className="info-projet-header">
                    <h1 className="page-title">{project.nom}</h1>
                    <div className="project-subtitle">
                        <span className="collaborateurs-icon">👥</span>
                        <span>Collaborateurs</span>
                        <span className="bibliotheques-text">Toutes les bibliothèques (6 articles)</span>
                        <button className="add-button">+</button>
                    </div>
                </div>
                
                <div className="info-projet-components">
                    <HistoriquePlan projectId={projectId} />
                    <div className="bottom-components">
                        <AutreDoc projectId={projectId} />
                        <HistoriqueExport projectId={projectId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoProjet;