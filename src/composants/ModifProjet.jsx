import React, { useState, useEffect } from 'react';
import { projectService } from '../db/database';
import './ModifProjet.css';

const ModifProjet = ({ isOpen, onClose, projectId, onProjectUpdated }) => {
    const [formData, setFormData] = useState({
        nom: '',
        client: '',
        referenceInterne: '',
        typologieProjet: '',
        adresseProjet: '',
        dateLivraison: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Charger les données du projet quand le composant s'ouvre
    useEffect(() => {
        if (isOpen && projectId) {
            loadProjectData();
        }
    }, [isOpen, projectId]);

    const loadProjectData = async () => {
        try {
            setLoading(true);
            const project = await projectService.getProjectById(projectId);
            if (project) {
                setFormData({
                    nom: project.nom || '',
                    client: project.client || '',
                    referenceInterne: project.referenceInterne || '',
                    typologieProjet: project.typologieProjet || '',
                    adresseProjet: project.adresseProjet || '',
                    dateLivraison: project.dateLivraison || ''
                });
                setUploadedFiles(project.fichier || []);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du projet:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nom || !formData.client || !formData.typologieProjet) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            setLoading(true);
            
            const updatedProject = {
                nom: formData.nom,
                client: formData.client,
                referenceInterne: formData.referenceInterne,
                typologieProjet: formData.typologieProjet,
                adresseProjet: formData.adresseProjet,
                dateLivraison: formData.dateLivraison,
                fichier: uploadedFiles
            };

            // Récupérer l'ID utilisateur pour les notifications
            const userInfo = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                userId = userData.id_utilisateur || userData.id;
            }

            await projectService.updateProject(projectId, updatedProject, userId);
            
            if (onProjectUpdated) {
                onProjectUpdated(projectId, updatedProject);
            }
            
            onClose();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du projet:', error);
            alert('Erreur lors de la mise à jour du projet');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modif-projet-overlay">
            <div className="modif-projet-modal">
                <div className="modif-projet-header">
                    <h2>Informations du projet</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                
                <p className="modif-projet-subtitle">
                    Modifiez les informations principales de votre projet
                </p>

                {loading ? (
                    <div className="loading-spinner">Chargement...</div>
                ) : (
                    <form className="modif-projet-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="nom">🏠 Nom du projet</label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="client">👤 Client</label>
                                <input
                                    type="text"
                                    id="client"
                                    name="client"
                                    value={formData.client}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="referenceInterne">📋 Référence interne</label>
                                <input
                                    type="text"
                                    id="referenceInterne"
                                    name="referenceInterne"
                                    value={formData.referenceInterne}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="typologieProjet">🏗️ Typologie projet</label>
                                <select
                                    id="typologieProjet"
                                    name="typologieProjet"
                                    value={formData.typologieProjet}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Sélectionnez une typologie</option>
                                    <option value="residentiel">Résidentiel</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="industriel">Industriel</option>
                                    <option value="public">Public</option>
                                    <option value="renovation">Rénovation</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="adresseProjet">📍 Adresse du projet</label>
                                <input
                                    type="text"
                                    id="adresseProjet"
                                    name="adresseProjet"
                                    value={formData.adresseProjet}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateLivraison">🗓️ Date prévisionnelle de livraison</label>
                                <input
                                    type="date"
                                    id="dateLivraison"
                                    name="dateLivraison"
                                    value={formData.dateLivraison}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="upload-section">
                            <div className="upload-area">
                                <div className="upload-icon">📤</div>
                                <h3>Déposer vos plans ici</h3>
                                <p>Formats recommandés: DWG, PDF</p>
                                
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept=".pdf,.dwg,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                
                                <button
                                    type="button"
                                    className="upload-button"
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    📁 Parcourir les plans
                                </button>
                                
                                <button type="button" className="add-plan-button">
                                    + Ajouter un autre plan
                                </button>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={handleCancel}
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Modification...' : 'Modifier le projet'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ModifProjet;