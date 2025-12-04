import React, { useState, useEffect } from 'react';
import { exportService } from '../db/database';
import './HistoriqueExport.css';

const ExternalLinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#0f172a" strokeWidth="1.6">
        <path d="M7.5 5H5a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2V13" strokeLinecap="round" />
        <path d="M11.5 3.5h5v5" strokeLinecap="round" />
        <path d="M16.5 3.5 8 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HistoriqueExport = ({ projectId }) => {
    const [exports, setExports] = useState([]);
    const [allExports, setAllExports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllExports, setShowAllExports] = useState(false);

    // Charger l'historique des exports du projet
    useEffect(() => {
        const loadExports = async () => {
            if (!projectId) return;
            
            try {
                setLoading(true);
                const projectExports = await exportService.getExportsByProject(parseInt(projectId, 10));
                
                // Formater les données pour l'affichage
                const formattedExports = projectExports.map(exp => ({
                    id: exp.id,
                    nom: exp.file_name,
                    date: new Date(exp.date_export).toLocaleDateString('fr-FR'),
                    user_name: exp.user_name,
                    file_type: exp.file_type,
                    file_size: exp.file_size,
                    file_data: exp.file_data
                }));
                
                setAllExports(formattedExports);
                // Afficher seulement les 5 premiers exports par défaut
                setExports(showAllExports ? formattedExports : formattedExports.slice(0, 5));
            } catch (error) {
                console.error('Erreur lors du chargement des exports:', error);
            } finally {
                setLoading(false);
            }
        };

        loadExports();
    }, [projectId]);

    // Fonction pour retélécharger un fichier depuis l'historique
    const handleRedownload = async (exportItem) => {
        try {
            // Créer un lien de téléchargement
            const blob = exportItem.file_data 
                ? new Blob([exportItem.file_data], { type: exportItem.file_type })
                : new Blob([`Contenu du fichier: ${exportItem.nom}`], { type: 'text/plain' });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = exportItem.nom;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('Fichier retéléchargé:', exportItem.nom);
        } catch (error) {
            console.error('Erreur lors du retéléchargement:', error);
            alert('Erreur lors du téléchargement du fichier');
        }
    };

    return (
        <section className="historique-export-card">
            <div className="export-card-header">
                <p className="export-label">Exports</p>
                <h2 className="export-title">Historique des Exports</h2>
            </div>

            <div className="export-table">
                <div className="export-row export-row-head">
                    <span className="export-cell">Nom</span>
                    <span className="export-cell export-cell-user">Exporté par</span>
                    <span className="export-cell export-cell-date">Date</span>
                </div>
                
                {loading ? (
                    <div className="export-row">
                        <span className="export-cell" style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>
                            Chargement des exports...
                        </span>
                    </div>
                ) : exports.length === 0 ? (
                    <div className="export-row">
                        <span className="export-cell" style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1', color: '#666' }}>
                            Aucun export pour ce projet
                        </span>
                    </div>
                ) : (
                    exports.map((item) => (
                        <div key={item.id} className="export-row">
                            <span className="export-cell export-name-wrapper">
                                <span className="export-badge">⟳</span>
                                <span className="export-name">{item.nom}</span>
                                <button 
                                    className="export-open" 
                                    aria-label={`Retélécharger ${item.nom}`}
                                    onClick={() => handleRedownload(item)}
                                    title={`Retélécharger ${item.nom}`}
                                >
                                    <ExternalLinkIcon />
                                </button>
                            </span>
                            <span className="export-cell export-cell-user">{item.user_name}</span>
                            <span className="export-cell export-cell-date">{item.date}</span>
                        </div>
                    ))
                )}
            </div>

            {allExports.length > 5 && (
                <button 
                    className="export-more-btn"
                    onClick={() => {
                        setShowAllExports(!showAllExports);
                        setExports(showAllExports ? allExports.slice(0, 5) : allExports);
                    }}
                >
                    {showAllExports ? 'Voir moins' : '+ Voir plus'}
                </button>
            )}
        </section>
    );
};

export default HistoriqueExport;