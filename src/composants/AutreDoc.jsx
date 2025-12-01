import React, { useState, useEffect } from 'react';
import { projectService } from '../db/database';
import './AutreDoc.css';

const ExternalLinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#0f172a" strokeWidth="1.6">
        <path d="M7.5 5H5a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2V13" strokeLinecap="round" />
        <path d="M11.5 3.5h5v5" strokeLinecap="round" />
        <path d="M16.5 3.5 8 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#ef4444" strokeWidth="1.6">
        <path d="M3 6h14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 6l1 10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 10v4" strokeLinecap="round" />
        <path d="M12 10v4" strokeLinecap="round" />
    </svg>
);

const AutreDoc = ({ projectId, canEdit = true }) => {
    const [documents, setDocuments] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [showAllDocuments, setShowAllDocuments] = useState(false);

    // Fonction pour filtrer les fichiers de type document (non-plans)
    const isDocumentFile = (file) => {
        const fileName = file.name.toLowerCase();
        
        // Extensions typiques des plans (incluant PDF maintenant)
        const planExtensions = ['.dwg', '.dxf', '.pdf'];
        
        // Mots-clés indiquant un plan
        const planKeywords = ['plan', 'schema', 'blueprint', 'drawing', 'architecture'];
        
        // Vérifier l'extension des plans
        const hasPlanExtension = planExtensions.some(ext => fileName.endsWith(ext));
        
        // Vérifier les mots-clés dans le nom
        const hasPlanKeyword = planKeywords.some(keyword => fileName.includes(keyword));
        
        // Retourner true si ce n'est PAS un plan
        // Maintenant les PDF vont dans HistoriquePlan, donc on les exclut d'AutreDoc
        return !(hasPlanExtension || hasPlanKeyword);
    };

    // Charger les documents du projet
    useEffect(() => {
        const loadDocuments = async () => {
            if (!projectId) return;
            
            try {
                setLoading(true);
                const project = await projectService.getProjectById(parseInt(projectId, 10));
                
                if (project && project.fichier) {
                    // Filtrer les fichiers pour ne garder que les documents (non-plans)
                    const projectDocuments = project.fichier
                        .filter(isDocumentFile)
                        .map((file, index) => ({
                            id: index + 1,
                            nom: file.name,
                            date: new Date().toLocaleDateString('fr-FR'),
                            size: file.size,
                            type: file.type
                        }));
                    
                    setAllDocuments(projectDocuments);
                    // Afficher seulement les 4 premiers documents par défaut
                    setDocuments(showAllDocuments ? projectDocuments : projectDocuments.slice(0, 4));
                }
            } catch (error) {
                console.error('Erreur lors du chargement des documents:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, [projectId]);

    // Fonction pour supprimer un document
    const handleDeleteDocument = async (documentToDelete) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le document "${documentToDelete.nom}" ?`)) {
            return;
        }

        try {
            console.log('Début suppression document:', documentToDelete.nom);
            
            // Convertir projectId en nombre
            const numericProjectId = parseInt(projectId, 10);
            if (isNaN(numericProjectId)) {
                throw new Error('ID de projet invalide');
            }

            // Récupérer le projet actuel
            const project = await projectService.getProjectById(numericProjectId);
            if (!project) {
                throw new Error('Projet non trouvé');
            }

            // Filtrer les fichiers pour supprimer le document sélectionné
            const updatedFiles = (project.fichier || []).filter(file => file.name !== documentToDelete.nom);

            // Récupérer l'ID utilisateur pour les notifications
            const userInfo = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                userId = userData.id_utilisateur || userData.id;
            }

            // Mettre à jour le projet sans le fichier supprimé
            await projectService.updateProject(numericProjectId, { fichier: updatedFiles }, userId);

            console.log('Document supprimé avec succès');

            // Recharger les documents
            const projectDocuments = updatedFiles
                .filter(isDocumentFile)
                .map((file, index) => ({
                    id: index + 1,
                    nom: file.name,
                    date: new Date().toLocaleDateString('fr-FR'),
                    size: file.size,
                    type: file.type
                }));
            
            setAllDocuments(projectDocuments);
            setDocuments(showAllDocuments ? projectDocuments : projectDocuments.slice(0, 4));
            
        } catch (error) {
            console.error('Erreur lors de la suppression du document:', error);
            alert(`Erreur lors de la suppression du document: ${error.message}`);
        }
    };

    // Fonction pour gérer l'upload de nouveaux documents
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            console.log('Début upload documents, projectId:', projectId);
            
            // Convertir projectId en nombre
            const numericProjectId = parseInt(projectId, 10);
            if (isNaN(numericProjectId)) {
                throw new Error('ID de projet invalide');
            }

            // Récupérer le projet actuel
            const project = await projectService.getProjectById(numericProjectId);
            if (!project) {
                throw new Error('Projet non trouvé');
            }

            console.log('Projet trouvé:', project.nom);

            // Ajouter les nouveaux fichiers aux fichiers existants
            const newFiles = files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));

            console.log('Nouveaux fichiers:', newFiles);

            const updatedFiles = [...(project.fichier || []), ...newFiles];

            // Récupérer l'ID utilisateur pour les notifications
            const userInfo = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                userId = userData.id_utilisateur || userData.id;
            }

            console.log('Mise à jour du projet avec', updatedFiles.length, 'fichiers');

            // Mettre à jour le projet avec les nouveaux fichiers
            await projectService.updateProject(numericProjectId, { fichier: updatedFiles }, userId);

            console.log('Projet mis à jour avec succès');

            // Recharger les documents directement depuis les fichiers mis à jour
            const projectDocuments = updatedFiles
                .filter(isDocumentFile)
                .map((file, index) => ({
                    id: index + 1,
                    nom: file.name,
                    date: new Date().toLocaleDateString('fr-FR'),
                    size: file.size,
                    type: file.type
                }));
            
            setAllDocuments(projectDocuments);
            setDocuments(showAllDocuments ? projectDocuments : projectDocuments.slice(0, 4));

            // Fermer l'interface d'upload
            setShowUpload(false);
            
            console.log('Upload terminé avec succès');
        } catch (error) {
            console.error('Erreur détaillée lors de l\'ajout des documents:', error);
            alert(`Erreur lors de l'ajout des documents: ${error.message}`);
        }
    };

    return (
        <section className="autre-doc-card">
            <div className="doc-card-header">
                <div>
                    <p className="doc-label">Documents</p>
                    <h2 className="doc-title">Autres Documents</h2>
                </div>
                {canEdit && (
                    <button 
                        className="doc-header-btn"
                        onClick={() => setShowUpload(!showUpload)}
                    >
                        + Ajouter
                    </button>
                )}
            </div>

            <div className="doc-table">
                <div className="doc-row doc-row-head">
                    <span className="doc-cell">Nom</span>
                    <span className="doc-cell doc-cell-date">Date</span>
                    <span className="doc-cell doc-cell-action">Actions</span>
                </div>
                
                {loading ? (
                    <div className="doc-row">
                        <span className="doc-cell" style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>
                            Chargement des documents...
                        </span>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="doc-row">
                        <span className="doc-cell" style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1', color: '#666' }}>
                            Aucun document trouvé pour ce projet
                        </span>
                    </div>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.id} className="doc-row">
                            <span className="doc-cell doc-name-wrapper">
                                <span className="doc-dot" />
                                <span className="doc-name">{doc.nom}</span>
                                <button className="doc-open" aria-label={`Ouvrir ${doc.nom}`}>
                                    <ExternalLinkIcon />
                                </button>
                            </span>
                            <span className="doc-cell doc-cell-date">{doc.date}</span>
                            <span className="doc-cell doc-cell-action">
                                {canEdit && (
                                    <button 
                                        className="doc-delete-btn"
                                        onClick={() => handleDeleteDocument(doc)}
                                        aria-label={`Supprimer ${doc.nom}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                )}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {showUpload && (
                <div className="upload-section" style={{ padding: '20px', border: '2px dashed #ccc', margin: '10px 0', borderRadius: '8px' }}>
                    <input
                        type="file"
                        id="doc-upload"
                        multiple
                        accept=".docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png,.txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '10px 0', color: '#666' }}>Sélectionnez les documents à ajouter (Word, Excel, Images, etc.)</p>
                        <button 
                            onClick={() => document.getElementById('doc-upload').click()}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#3B82F6', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            📁 Parcourir les fichiers
                        </button>
                        <button 
                            onClick={() => setShowUpload(false)}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#6B7280', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer'
                            }}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {allDocuments.length > 4 && (
                <button 
                    className="doc-more-btn"
                    onClick={() => {
                        setShowAllDocuments(!showAllDocuments);
                        setDocuments(showAllDocuments ? allDocuments.slice(0, 4) : allDocuments);
                    }}
                >
                    {showAllDocuments ? 'Voir moins' : '+ Voir plus'}
                </button>
            )}
        </section>
    );
};

export default AutreDoc;