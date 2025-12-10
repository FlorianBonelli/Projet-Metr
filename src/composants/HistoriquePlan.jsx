import React, { useState, useEffect } from 'react';
import { planVersionService, exportService } from '../db/database';
import './HistoriquePlan.css';

const StarIcon = ({ filled }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={filled ? '#F8C343' : 'none'}
        stroke={filled ? '#F8C343' : '#D5D9E3'}
        strokeWidth="1.6"
    >
        <path
            d="M12 3.5L14.8 9.1L21 9.95L16.5 14.05L17.64 20.5L12 17.45L6.36 20.5L7.5 14.05L3 9.95L9.2 9.1L12 3.5Z"
            strokeLinejoin="round"
            strokeLinecap="round"
        />
    </svg>
);

const NoteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#3B82F6" strokeWidth="1.6">
        <path d="M6 2.5h8l3 3.5V17a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
        <path d="M14 2.5v4h3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 11h5" strokeLinecap="round" />
        <path d="M7.5 14h5" strokeLinecap="round" />
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

const HistoriquePlan = ({ projectId, canEdit = true }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedPlanForUpload, setSelectedPlanForUpload] = useState(null);
    const [expandedPlans, setExpandedPlans] = useState({});

    const handleDownloadVersion = async (version) => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                userId = userData.id_utilisateur || userData.id;
            }

            if (userId) {
                await exportService.createExport({
                    project_id: parseInt(projectId, 10),
                    user_id: userId,
                    file_name: version.file_name,
                    file_type: version.file_type || 'application/octet-stream',
                    file_size: version.file_size || 0,
                    file_data: version.file_data || null
                });
            }

            const blob = version.file_data 
                ? new Blob([version.file_data], { type: version.file_type })
                : new Blob([`Contenu du fichier: ${version.file_name}`], { type: 'text/plain' });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = version.file_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            alert('Erreur lors du téléchargement du fichier');
        }
    };

    const toggleExpandPlan = (planName) => {
        setExpandedPlans(prev => ({
            ...prev,
            [planName]: !prev[planName]
        }));
    };

    useEffect(() => {
        const loadPlans = async () => {
            if (!projectId) return;
            
            try {
                setLoading(true);
                const plansWithVersions = await planVersionService.getAllPlansWithVersions(parseInt(projectId, 10));
                setPlans(plansWithVersions);
            } catch (error) {
                console.error('Erreur lors du chargement des plans:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPlans();
    }, [projectId]);

    const handleSetCurrentVersion = async (planName, versionIndex) => {
        try {
            await planVersionService.setCurrentVersion(parseInt(projectId, 10), planName, versionIndex);
            const plansWithVersions = await planVersionService.getAllPlansWithVersions(parseInt(projectId, 10));
            setPlans(plansWithVersions);
        } catch (error) {
            console.error('Erreur lors de la définition de la version courante:', error);
            alert('Erreur lors de la définition de la version courante');
        }
    };

    const handleDeleteVersion = async (versionId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette version ?')) {
            return;
        }

        try {
            await planVersionService.deletePlanVersion(versionId);
            const plansWithVersions = await planVersionService.getAllPlansWithVersions(parseInt(projectId, 10));
            setPlans(plansWithVersions);
        } catch (error) {
            console.error('Erreur lors de la suppression de la version:', error);
            alert(`Erreur: ${error.message}`);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            const userInfo = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                userId = userData.id_utilisateur || userData.id;
            }

            const numericProjectId = parseInt(projectId, 10);

            for (const file of files) {
                const planName = selectedPlanForUpload || file.name.replace(/\.[^/.]+$/, '');

                await planVersionService.createPlanVersion({
                    project_id: numericProjectId,
                    plan_name: planName,
                    file_name: file.name,
                    file_type: file.type,
                    file_size: file.size,
                    file_data: null,
                    uploaded_by: userId
                });
            }

            const plansWithVersions = await planVersionService.getAllPlansWithVersions(numericProjectId);
            setPlans(plansWithVersions);
            setShowUpload(false);
            setSelectedPlanForUpload(null);
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            alert(`Erreur lors de l'upload: ${error.message}`);
        }
    };

    return (
        <section className="historique-plan-card">
            <div className="plan-card-header">
                <div>
                    <p className="plan-label">Historique</p>
                    <h2 className="plan-title">Historique des plans</h2>
                </div>
                {canEdit && (
                    <button 
                        className="plan-header-btn"
                        onClick={() => {
                            setShowUpload(!showUpload);
                            setSelectedPlanForUpload(null);
                        }}
                    >
                        + Ajouter un nouveau plan
                    </button>
                )}
            </div>

            <div className="plan-table">
                <div className="plan-row plan-row-head">
                    <span className="plan-cell plan-cell-selection"></span>
                    <span className="plan-cell">Nom</span>
                    <span className="plan-cell plan-cell-date">Date de création</span>
                    <span className="plan-cell plan-cell-action" />
                </div>

                {loading ? (
                    <div className="plan-row">
                        <span className="plan-cell" style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>
                            Chargement des plans...
                        </span>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="plan-row">
                        <span className="plan-cell" style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1', color: '#666' }}>
                            Aucun plan trouvé pour ce projet
                        </span>
                    </div>
                ) : (
                    plans.map((plan) => {
                        const isExpanded = expandedPlans[plan.plan_name];
                        const currentVersion = plan.current_version;
                        const versionsToShow = isExpanded ? plan.versions : [currentVersion];
                        
                        return (
                            <React.Fragment key={plan.plan_name}>
                                <div className="plan-row plan-row-header" style={{ backgroundColor: '#f9fafb', fontWeight: '600' }}>
                                    <span className="plan-cell" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                                        <span style={{ fontSize: '14px' }}>{plan.plan_name}</span>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {plan.versions.length > 1 && (
                                                <button 
                                                    onClick={() => toggleExpandPlan(plan.plan_name)}
                                                    style={{ 
                                                        padding: '5px 10px', 
                                                        backgroundColor: '#e5e7eb', 
                                                        border: 'none', 
                                                        borderRadius: '4px', 
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {isExpanded ? '▼ Masquer les versions' : `▶ Voir toutes les versions (${plan.versions.length})`}
                                                </button>
                                            )}
                                            {canEdit && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedPlanForUpload(plan.plan_name);
                                                        setShowUpload(true);
                                                    }}
                                                    style={{ 
                                                        padding: '5px 10px', 
                                                        backgroundColor: '#3B82F6', 
                                                        color: 'white',
                                                        border: 'none', 
                                                        borderRadius: '4px', 
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    + Nouvelle version
                                                </button>
                                            )}
                                        </div>
                                    </span>
                                </div>
                                
                                {versionsToShow.map((version) => {
                                    const isCurrent = version.is_current;
                                    return (
                                        <div
                                            key={version.id}
                                            className={`plan-row ${isCurrent ? 'plan-row-default' : ''}`}
                                            style={{ paddingLeft: '20px' }}
                                        >
                                            <span className="plan-cell plan-cell-selection">
                                                <button
                                                    type="button"
                                                    className="plan-star-button"
                                                    aria-label={
                                                        isCurrent
                                                            ? `Version ${version.version_index} est déjà la version courante`
                                                            : `Définir version ${version.version_index} comme version courante`
                                                    }
                                                    onClick={() => handleSetCurrentVersion(plan.plan_name, version.version_index)}
                                                >
                                                    <StarIcon filled={isCurrent} />
                                                </button>
                                            </span>
                                            <span className="plan-cell plan-name-cell">
                                                <span className="plan-name">
                                                    Indice {version.version_index} - {version.file_name}
                                                </span>
                                                {isCurrent && <span className="plan-badge">Version courante</span>}
                                            </span>
                                            <span className="plan-cell plan-cell-date">
                                                {new Date(version.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                            <span className="plan-cell plan-cell-action">
                                                <button 
                                                    className="plan-row-btn"
                                                    onClick={() => handleDownloadVersion(version)}
                                                    title={`Télécharger ${version.file_name}`}
                                                >
                                                    Télécharger
                                                    <NoteIcon />
                                                </button>
                                                {canEdit && (
                                                    <button 
                                                        className="plan-delete-btn"
                                                        onClick={() => handleDeleteVersion(version.id)}
                                                        aria-label={`Supprimer version ${version.version_index}`}
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })
                )}
            </div>

            {showUpload && (
                <div className="upload-section" style={{ padding: '20px', border: '2px dashed #ccc', margin: '10px 0', borderRadius: '8px' }}>
                    <input
                        type="file"
                        id="plan-upload"
                        multiple
                        accept=".pdf,.dwg,.dxf"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <div style={{ textAlign: 'center' }}>
                        {selectedPlanForUpload ? (
                            <p style={{ margin: '10px 0', color: '#666', fontWeight: '600' }}>
                                Ajouter une nouvelle version pour: {selectedPlanForUpload}
                            </p>
                        ) : (
                            <p style={{ margin: '10px 0', color: '#666' }}>
                                Sélectionnez les plans à ajouter (PDF, DWG, DXF)
                            </p>
                        )}
                        <button 
                            onClick={() => document.getElementById('plan-upload').click()}
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
                            onClick={() => {
                                setShowUpload(false);
                                setSelectedPlanForUpload(null);
                            }}
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
        </section>
    );
};

export default HistoriquePlan;
