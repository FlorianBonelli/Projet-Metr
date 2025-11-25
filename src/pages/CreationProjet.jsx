import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../composants/Sidebar';
import InfoProjet from '../composants/InfoProjet';
import DocumentProjet from '../composants/DocumentProjet';
import { projectService } from '../db/database';
import './CreationProjet.css';

const CreationProjet = () => {
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState({});
    const [projectFiles, setProjectFiles] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const handleCancel = () => {
        // Optionnel: ajouter une confirmation si des données ont été saisies
        // const confirmCancel = window.confirm('Êtes-vous sûr de vouloir annuler ? Les données non sauvegardées seront perdues.');
        // if (confirmCancel) {
            // Faire défiler vers le haut avant la navigation
            window.scrollTo(0, 0);
            navigate('/dashboard');
        // }
    };

    const handleProjectDataChange = (data) => {
        setProjectData(data);
    };

    const handleProjectFilesChange = (files) => {
        setProjectFiles(files);
    };

    const handleCreateProject = async () => {
        // Vérifier que les champs obligatoires sont remplis
        if (!projectData.nomProjet || !projectData.client || !projectData.typologieProjet) {
            alert('Veuillez remplir tous les champs obligatoires (Nom du projet, Client, Typologie projet)');
            return;
        }

        setIsCreating(true);
        
        try {
            // Préparer les données du projet pour la base de données
            const projectToSave = {
                nom: projectData.nomProjet,
                client: projectData.client,
                referenceInterne: projectData.referenceInterne || '',
                typologieProjet: projectData.typologieProjet,
                adresseProjet: projectData.adresseProjet || '',
                dateLivraison: projectData.dateLivraison || '',
                status: 'En cours',
                membre: [], // Pour l'instant vide, peut être étendu plus tard
                fichier: projectFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            };

            // Sauvegarder le projet en base de données
            const projectId = await projectService.createProject(projectToSave);
            
            console.log('Projet créé avec succès, ID:', projectId);
            
            // Faire défiler vers le haut et rediriger vers le dashboard
            window.scrollTo(0, 0);
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Erreur lors de la création du projet:', error);
            alert('Erreur lors de la création du projet. Veuillez réessayer.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="creation-projet-page">
            <Sidebar />
            <div className="creation-projet-content page-padding">
                <div className="creation-projet-header">
                    <h1 className="page-title">CRÉER UN NOUVEAU PROJET</h1>
                </div>
                
                <div className="creation-projet-container">
                    <InfoProjet onDataChange={handleProjectDataChange} />
                    <DocumentProjet onFilesChange={handleProjectFilesChange} />
                    
                    <div className="action-buttons">
                        <button 
                            className="cancel-button"
                            onClick={handleCancel}
                        >
                            Annuler
                        </button>
                        <button 
                            className="create-button"
                            onClick={handleCreateProject}
                            disabled={isCreating}
                        >
                            {isCreating ? 'Création en cours...' : 'Créer le projet'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationProjet;