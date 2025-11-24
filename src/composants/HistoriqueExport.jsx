import React from 'react';
import './HistoriqueExport.css';

const exportsData = [
    { id: 1, nom: 'Compte Rendu', date: '02/11/2025' },
    { id: 2, nom: 'Excel_Export', date: '27/11/2025' },
    { id: 3, nom: 'Batimat', date: '22/09/2025' }
];

const ExternalLinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#0f172a" strokeWidth="1.6">
        <path d="M7.5 5H5a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2V13" strokeLinecap="round" />
        <path d="M11.5 3.5h5v5" strokeLinecap="round" />
        <path d="M16.5 3.5 8 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HistoriqueExport = () => (
    <section className="historique-export-card">
        <div className="export-card-header">
            <p className="export-label">Exports</p>
            <h2 className="export-title">Historique des Export</h2>
        </div>

        <div className="export-table">
            <div className="export-row export-row-head">
                <span className="export-cell">Nom</span>
                <span className="export-cell export-cell-date">Date</span>
            </div>
            {exportsData.map((item) => (
                <div key={item.id} className="export-row">
                    <span className="export-cell export-name-wrapper">
                        <span className="export-badge">⟳</span>
                        <span className="export-name">{item.nom}</span>
                        <button className="export-open" aria-label={`Télécharger ${item.nom}`}>
                            <ExternalLinkIcon />
                        </button>
                    </span>
                    <span className="export-cell export-cell-date">{item.date}</span>
                </div>
            ))}
        </div>

        <button className="export-more-btn">+ Voir plus</button>
    </section>
);

export default HistoriqueExport;