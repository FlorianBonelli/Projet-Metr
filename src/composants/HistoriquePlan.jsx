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

const HistoriquePlan = ({ projectId }) => {
    const [defaultPlanId, setDefaultPlanId] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fonction pour filtrer les fichiers de type plan
    const isPlanFile = (file) => {
        const fileName = file.name.toLowerCase();
        
        // Extensions typiques des plans
        const planExtensions = ['.dwg', '.dxf', '.pdf', '.csv', 'dwg'];
        
        // Mots-clés indiquant un plan
        const planKeywords = ['plan', 'schema', 'blueprint', 'drawing', 'architecture'];
        
        // Vérifier l'extension
        const hasPlanExtension = planExtensions.some(ext => fileName.endsWith(ext));
        
        // Vérifier les mots-clés dans le nom
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
                    
                    setPlans(projectPlans);
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

    return (
        <section className="historique-plan-card">
            <div className="plan-card-header">
                <div>
                    <p className="plan-label">Historique</p>
                    <h2 className="plan-title">Historique des plans</h2>
                </div>
                <button className="plan-header-btn">
                    Voir plus
                    <NoteIcon />
                </button>
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
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            <button className="plan-more-btn">+ Voir plus</button>
        </section>
    );
};

export default HistoriquePlan;