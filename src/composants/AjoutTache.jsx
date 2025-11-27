import React, { useState, useEffect } from 'react';
import { tacheService, projectService } from '../db/database';
import './AjoutTache.css';

const AjoutTache = ({ isOpen, onClose, onTacheAdded }) => {
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

    // Charger la liste des projets de l'utilisateur connecté
    useEffect(() => {
        if (isOpen) {
            const loadProjets = async () => {
                try {
                    // Récupérer l'ID de l'utilisateur connecté
                    const userInfo = localStorage.getItem('userInfo');
                    if (userInfo) {
                        const userData = JSON.parse(userInfo);
                        const userId = userData.id_utilisateur || userData.id;
                        
                        if (userId) {
                            // Récupérer uniquement les projets de l'utilisateur connecté
                            const userProjets = await projectService.getProjectsByUser(userId);
                            setProjets(userProjets);
                        } else {
                            setProjets([]);
                            setError('Utilisateur non connecté');
                        }
                    } else {
                        setProjets([]);
                        setError('Utilisateur non connecté');
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement des projets:', error);
                    setError('Erreur lors du chargement des projets');
                }
            };
            loadProjets();
        }
    }, [isOpen]);

    // Réinitialiser le formulaire quand la modal s'ouvre
    useEffect(() => {
        if (isOpen) {
            setFormData({
                titre: '',
                description: '',
                projet_id: '',
                priorite: 'Moyenne',
                etat: 'À faire',
                date_echeance: ''
            });
            setError('');
        }
    }, [isOpen]);

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

            // Notifier le parent que la tâche a été ajoutée
            if (onTacheAdded) {
                onTacheAdded();
            }

            // Fermer la modal
            onClose();
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            setError('Erreur lors de la création de la tâche');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">Créer une nouvelle tâche</h2>
                    <button 
                        className="modal-close-btn"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                rows="3"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleClose}
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