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

const AutreDoc = ({ projectId }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fonction pour filtrer les fichiers de type document (non-plans)
    const isDocumentFile = (file) => {
        const fileName = file.name.toLowerCase();
        
        // Extensions typiques des plans
        const planExtensions = ['.dwg', '.dxf', '.pdf'];
        
        // Mots-clés indiquant un plan
        const planKeywords = ['plan', 'schema', 'blueprint', 'drawing', 'architecture'];
        
        // Vérifier l'extension
        const hasPlanExtension = planExtensions.some(ext => fileName.endsWith(ext));
        
        // Vérifier les mots-clés dans le nom
        const hasPlanKeyword = planKeywords.some(keyword => fileName.includes(keyword));
        
        // Retourner true si ce n'est PAS un plan
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
                    
                    setDocuments(projectDocuments);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des documents:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, [projectId]);

    return (
        <section className="autre-doc-card">
            <div className="doc-card-header">
                <p className="doc-label">Documents</p>
                <h2 className="doc-title">Autres Documents</h2>
            </div>

            <div className="doc-table">
                <div className="doc-row doc-row-head">
                    <span className="doc-cell">Nom</span>
                    <span className="doc-cell doc-cell-date">Date</span>
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
                        </div>
                    ))
                )}
            </div>

            <button className="doc-more-btn">+ Voir plus</button>
        </section>
    );
};

export default AutreDoc;