import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../composants/Sidebar';
import InfoProjet from '../composants/InfoProjet';
import DocumentProjet from '../composants/DocumentProjet';
import './CreationProjet.css';

const CreationProjet = () => {
    const navigate = useNavigate();

    const handleCancel = () => {
        // Optionnel: ajouter une confirmation si des données ont été saisies
        // const confirmCancel = window.confirm('Êtes-vous sûr de vouloir annuler ? Les données non sauvegardées seront perdues.');
        // if (confirmCancel) {
            // Faire défiler vers le haut avant la navigation
            window.scrollTo(0, 0);
            navigate('/dashboard');
        // }
    };

    const handleCreateProject = () => {
        // Ici vous pouvez ajouter la logique pour créer le projet
        // Par exemple, envoyer les données à une API
        console.log('Création du projet...');
        // Rediriger vers le dashboard ou la page du projet créé
        navigate('/dashboard');
    };

    return (
        <div className="creation-projet-page">
            <Sidebar />
            <div className="creation-projet-content">
                <div className="creation-projet-header">
                    <h1 className="page-title">CRÉER UN NOUVEAU PROJET</h1>
                </div>
                
                <div className="creation-projet-container">
                    <InfoProjet />
                    <DocumentProjet />
                    
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
                        >
                            Créer le projet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationProjet;