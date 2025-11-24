import React, { useState } from 'react';
import './HistoriqueExport.css';

const HistoriqueExport = ({ projectId }) => {
    const [exports] = useState([
        {
            id: 1,
            nom: 'Compte Rendu',
            date: '02/11/2025'
        },
        {
            id: 2,
            nom: 'Excel_Export',
            date: '27/11/2025'
        },
        {
            id: 3,
            nom: 'Batimat',
            date: '22/09/2025'
        }
    ]);

    return (
        <div className="historique-export-container">
            <h2 className="historique-export-title">Historique des Export</h2>
            
            <div className="historique-export-table">
                <div className="table-header">
                    <div className="header-cell nom">Nom</div>
                    <div className="header-cell date">Date</div>
                </div>
                
                <div className="table-body">
                    {exports.map((exportItem) => (
                        <div key={exportItem.id} className="table-row">
                            <div className="cell nom">
                                <span className="export-icon">📊</span>
                                <span className="export-name">{exportItem.nom}</span>
                            </div>
                            <div className="cell date">{exportItem.date}</div>
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

export default HistoriqueExport;