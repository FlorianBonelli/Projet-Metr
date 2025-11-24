import React, { useState } from 'react';
import { Star, FileText } from 'lucide-react';
import './HistoriquePlan.css';

const HistoriquePlan = ({ projectId }) => {
    const [plans] = useState([
        {
            id: 1,
            nom: 'BatiMat 2023',
            dateModification: '03/11/2025',
            isDefault: false
        },
        {
            id: 2,
            nom: 'BatiMat 2025',
            dateModification: '26/11/2025',
            isDefault: true
        },
        {
            id: 3,
            nom: 'BatiMat 2023',
            dateModification: '01/11/2025',
            isDefault: false
        },
        {
            id: 4,
            nom: 'Plan test',
            dateModification: '03/07/2024',
            isDefault: false
        },
        {
            id: 5,
            nom: 'BatiMat 2022',
            dateModification: '03/11/2022',
            isDefault: false
        }
    ]);

    return (
        <div className="historique-plan-container">
            <h2 className="historique-plan-title">Historique des plans</h2>
            
            <div className="historique-plan-table">
                <div className="table-header">
                    <div className="header-cell">Sélection</div>
                    <div className="header-cell">Nom</div>
                    <div className="header-cell">Date de modification</div>
                    <div className="header-cell"></div>
                </div>
                
                <div className="table-body">
                    {plans.map((plan) => (
                        <div key={plan.id} className="table-row">
                            <div className="cell cell-selection">
                                {plan.isDefault ? (
                                    <Star size={18} fill="#fbbf24" color="#fbbf24" />
                                ) : (
                                    <Star size={18} color="#d1d5db" className="star-empty" />
                                )}
                            </div>
                            <div className="cell cell-nom">
                                <span className="plan-name">{plan.nom}</span>
                                {plan.isDefault && (
                                    <span className="default-label">(Par défaut)</span>
                                )}
                            </div>
                            <div className="cell cell-date">
                                {plan.dateModification}
                            </div>
                            <div className="cell cell-action">
                                <button className="voir-plus-btn">
                                    Voir plus
                                    <FileText size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="voir-plus-container">
                <button className="voir-plus-link">+ Voir plus</button>
            </div>
        </div>
    );
};

export default HistoriquePlan;