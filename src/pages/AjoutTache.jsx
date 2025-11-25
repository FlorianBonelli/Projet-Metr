import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tacheService, projectService } from '../db/database';
import './AjoutTache.css';

const AjoutTache = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        projet_id: '',
        priorite: 'Moyenne',
        etat: 'À faire',
        date_echeance: ''
    });
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Charger la liste des projets
    useEffect(() => {
        const loadProjets = async () => {
            try {
                const allProjets = await projectService.getAllProjects();
                setProjets(allProjets);
            } catch (error) {
                console.error('Erreur lors du chargement des projets:', error);
                setError('Erreur lors du chargement des projets');
            }
        };
        loadProjets();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Récupérer l'utilisateur connecté
            const userInfo = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfo) {
                const parsedUserInfo = JSON.parse(userInfo);
                userId = parsedUserInfo.id_utilisateur;
            }

            await tacheService.createTache({
                ...formData,
                user_id: userId
            });

            // Rediriger vers la page des tâches
            navigate('/taches');
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            setError('Erreur lors de la création de la tâche');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1); // Retour à la page précédente
    };

    return (
        <div className="ajout-tache-page">
            <div className="ajout-tache-container">
                <div className="ajout-tache-header">
                    <h1 className="page-title">Créer une nouvelle tâche</h1>
                    <p className="page-subtitle">Ajoutez une tâche à votre projet</p>
                </div>

                <form onSubmit={handleSubmit} className="ajout-tache-form">
                    <div className="form-grid">
                        {/* Titre de la tâche */}
                        <div className="form-group full-width">
                            <label htmlFor="titre" className="form-label">
                                Titre de la tâche *
                            </label>
                            <input
                                type="text"
                                id="titre"
                                name="titre"
                                value={formData.titre}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Entrez le titre de la tâche"
                                required
                            />
                        </div>

                        {/* Projet */}
                        <div className="form-group">
                            <label htmlFor="projet_id" className="form-label">
                                Projet *
                            </label>
                            <select
                                id="projet_id"
                                name="projet_id"
                                value={formData.projet_id}
                                onChange={handleInputChange}
                                className="form-select"
                                required
                            >
                                <option value="">Sélectionner un projet</option>
                                {projets.map((projet) => (
                                    <option key={projet.id} value={projet.id}>
                                        {projet.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priorité */}
                        <div className="form-group">
                            <label htmlFor="priorite" className="form-label">
                                Priorité
                            </label>
                            <select
                                id="priorite"
                                name="priorite"
                                value={formData.priorite}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="Faible">Faible</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="Élevée">Élevée</option>
                                <option value="Critique">Critique</option>
                            </select>
                        </div>

                        {/* État */}
                        <div className="form-group">
                            <label htmlFor="etat" className="form-label">
                                État
                            </label>
                            <select
                                id="etat"
                                name="etat"
                                value={formData.etat}
                                onChange={handleInputChange}
                                className="form-select"
                            >
                                <option value="À faire">À faire</option>
                                <option value="En cours">En cours</option>
                                <option value="En attente">En attente</option>
                                <option value="Terminé">Terminé</option>
                            </select>
                        </div>

                        {/* Date d'échéance */}
                        <div className="form-group">
                            <label htmlFor="date_echeance" className="form-label">
                                Date d'échéance
                            </label>
                            <input
                                type="date"
                                id="date_echeance"
                                name="date_echeance"
                                value={formData.date_echeance}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group full-width">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="form-textarea"
                                placeholder="Décrivez la tâche en détail..."
                                rows="4"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading || !formData.titre || !formData.projet_id}
                        >
                            {loading ? 'Création...' : 'Créer la tâche'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AjoutTache;
