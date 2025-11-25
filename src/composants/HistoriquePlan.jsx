import React, { useState } from 'react';
import './HistoriquePlan.css';

const mockPlans = [
    { id: 1, nom: 'BatiMat 2023', dateModification: '03/11/2025', isDefault: false },
    { id: 2, nom: 'BatiMat 2025', dateModification: '26/11/2025', isDefault: true },
    { id: 3, nom: 'BatiMat 2023', dateModification: '01/11/2025', isDefault: false },
    { id: 4, nom: 'Plan test', dateModification: '03/07/2024', isDefault: false },
    { id: 5, nom: 'BatiMat 2022', dateModification: '03/11/2022', isDefault: false }
];

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

const HistoriquePlan = () => {
    const [defaultPlanId, setDefaultPlanId] = useState(
        () => mockPlans.find((plan) => plan.isDefault)?.id ?? mockPlans[0]?.id
    );
    const [plans, setPlans] = useState(() => reorderPlans(mockPlans, defaultPlanId));

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

                {plans.map((plan) => {
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
                })}
            </div>

            <button className="plan-more-btn">+ Voir plus</button>
        </section>
    );
};

export default HistoriquePlan;