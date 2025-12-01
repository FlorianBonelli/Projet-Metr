import React, { useState, useEffect } from 'react';
import { projectService } from '../db/database';
import './HistoriquePlan.css';

const reorderPlans = (list, defaultId) => {
    const selected = list.find((plan) => plan.id === defaultId) ?? list[0];
    if (!selected) return [];
    const rest = list
        .filter((plan) => plan.id !== selected.id)
        .map((plan) => ({ ...plan, isDefault: false }));
    return [{ ...selected, isDefault: true }, ...rest];
};

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
    const [defaultPlanId, setDefaultPlanId] = useState(null);
    const [plans, setPlans] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [showAllPlans, setShowAllPlans] = useState(false);

    // Fonction pour filtrer les fichiers de type plan
    const isPlanFile = (file) => {
        const fileName = file.name.toLowerCase();
        
        // Extensions typiques des plans (incluant PDF)
        const planExtensions = ['.dwg', '.dxf', '.pdf'];
        
        // Mots-clés indiquant un plan (optionnel pour PDF)
        const planKeywords = ['plan', 'schema', 'blueprint', 'drawing', 'architecture'];
        
        // Vérifier l'extension (DWG/DXF/PDF sont acceptés comme plans)
        const hasPlanExtension = planExtensions.some(ext => fileName.endsWith(ext));
        
        // Vérifier les mots-clés dans le nom pour autres extensions
        const hasPlanKeyword = planKeywords.some(keyword => fileName.includes(keyword));
        
        return hasPlanExtension || hasPlanKeyword;
    };

    // Charger les plans du projet
    useEffect(() => {
        const loadPlans = async () => {
            if (!projectId) return;
            
            try {
                setLoading(true);
                const project = await projectService.getProjectById(parseInt(projectId, 10));
                
                if (project && project.fichier) {
                    // Filtrer les fichiers pour ne garder que les plans
                    const projectPlans = project.fichier
                        .filter(isPlanFile)
                        .map((file, index) => ({
                            id: index + 1,
                            nom: file.name,
                            dateModification: new Date().toLocaleDateString('fr-FR'),
                            isDefault: index === 0, // Le premier plan est par défaut
                            size: file.size,
                            type: file.type
                        }));
                    
                    setAllPlans(projectPlans);
                    // Afficher seulement les 5 premiers plans par défaut
                    setPlans(showAllPlans ? projectPlans : projectPlans.slice(0, 5));
                    if (projectPlans.length > 0) {
                        setDefaultPlanId(projectPlans[0].id);
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement des plans:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPlans();
    }, [projectId]);

    const handleSelectDefault = (planId) => {
        setDefaultPlanId(planId);
        setPlans((prev) => reorderPlans(prev, planId));
    };

    const handleDeletePlan = async (planToDelete) => {
        // Empêcher la suppression du plan par défaut
        if (planToDelete.id === defaultPlanId) {
            alert('Impossible de supprimer le plan par défaut. Veuillez d\'abord définir un autre plan comme défaut.');
            return;
        }

        if (!confirm(`Êtes-vous sûr de vouloir supprimer le plan "${planToDelete.nom}" ?`)) {
            return;
        }

        try {
            console.log('Début suppression plan:', planToDelete.nom);
            
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

            // Filtrer les fichiers pour supprimer le plan sélectionné
            const updatedFiles = (project.fichier || []).filter(file => file.name !== planToDelete.nom);

            // Récupérer l'ID utilisateur pour les notifications
            const userInfo = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfo) {
                const userData = JSON.parse(userInfo);
                userId = userData.id_utilisateur || userData.id;
            }

            // Mettre à jour le projet sans le fichier supprimé
            await projectService.updateProject(numericProjectId, { fichier: updatedFiles }, userId);

            console.log('Plan supprimé avec succès');

            // Recharger les plans
            const projectPlans = updatedFiles
                .filter(isPlanFile)
                .map((file, index) => ({
                    id: index + 1,
                    nom: file.name,
                    dateModification: new Date().toLocaleDateString('fr-FR'),
                    isDefault: index === 0,
                    size: file.size,
                    type: file.type
                }));
            
            setAllPlans(projectPlans);
            setPlans(showAllPlans ? projectPlans : projectPlans.slice(0, 5));
            
            // Si on a supprimé tous les plans, réinitialiser le plan par défaut
            if (projectPlans.length === 0) {
                setDefaultPlanId(null);
            } else if (projectPlans.length > 0) {
                setDefaultPlanId(projectPlans[0].id);
            }
            
        } catch (error) {
            console.error('Erreur lors de la suppression du plan:', error);
            alert(`Erreur lors de la suppression du plan: ${error.message}`);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            console.log('Début upload plans, projectId:', projectId);
            
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

            // Recharger les plans directement depuis les fichiers mis à jour
            const projectPlans = updatedFiles
                .filter(isPlanFile)
                .map((file, index) => ({
                    id: index + 1,
                    nom: file.name,
                    dateModification: new Date().toLocaleDateString('fr-FR'),
                    isDefault: index === 0,
                    size: file.size,
                    type: file.type
                }));
            
            setAllPlans(projectPlans);
            setPlans(showAllPlans ? projectPlans : projectPlans.slice(0, 5));
            if (projectPlans.length > 0 && !defaultPlanId) {
                setDefaultPlanId(projectPlans[0].id);
            }

            // Fermer l'interface d'upload
            setShowUpload(false);
            
            console.log('Upload terminé avec succès');
        } catch (error) {
            console.error('Erreur détaillée lors de l\'ajout des plans:', error);
            alert(`Erreur lors de l'ajout des plans: ${error.message}`);
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
                        onClick={() => setShowUpload(!showUpload)}
                    >
                        + Ajouter
                    </button>
                )}
            </div>

            <div className="plan-table">
                <div className="plan-row plan-row-head">
                    <span className="plan-cell plan-cell-selection">Sélection</span>
                    <span className="plan-cell">Nom</span>
                    <span className="plan-cell plan-cell-date">Date de modification</span>
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
                        const isDefault = plan.id === defaultPlanId;
                        return (
                            <div
                                key={plan.id}
                                className={`plan-row ${isDefault ? 'plan-row-default' : ''}`}
                            >
                                <span className="plan-cell plan-cell-selection">
                                    <button
                                        type="button"
                                        className="plan-star-button"
                                        aria-label={
                                            isDefault
                                                ? `${plan.nom} est déjà le plan par défaut`
                                                : `Définir ${plan.nom} comme plan par défaut`
                                        }
                                        onClick={() => handleSelectDefault(plan.id)}
                                    >
                                        <StarIcon filled={isDefault} />
                                    </button>
                                </span>
                                <span className="plan-cell plan-name-cell">
                                    <span className="plan-name">{plan.nom}</span>
                                    {isDefault && <span className="plan-badge">Par défaut</span>}
                                </span>
                                <span className="plan-cell plan-cell-date">{plan.dateModification}</span>
                                <span className="plan-cell plan-cell-action">
                                    <button className="plan-row-btn">
                                        Voir plus
                                        <NoteIcon />
                                    </button>
                                    {canEdit && !isDefault && (
                                        <button 
                                            className="plan-delete-btn"
                                            onClick={() => handleDeletePlan(plan)}
                                            aria-label={`Supprimer ${plan.nom}`}
                                        >
                                            <TrashIcon />
                                        </button>
                                    )}
                                </span>
                            </div>
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
                        <p style={{ margin: '10px 0', color: '#666' }}>Sélectionnez les plans à ajouter (PDF, DWG, DXF)</p>
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

            {allPlans.length > 5 && (
                <button 
                    className="plan-more-btn"
                    onClick={() => {
                        setShowAllPlans(!showAllPlans);
                        setPlans(showAllPlans ? allPlans.slice(0, 5) : allPlans);
                    }}
                >
                    {showAllPlans ? 'Voir moins' : '+ Voir plus'}
                </button>
            )}
        </section>
    );
};

export default HistoriquePlan;